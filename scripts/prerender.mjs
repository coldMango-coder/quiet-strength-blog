#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { globby } from 'globby';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStringPromise } from 'xml2js';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  buildDir: path.join(__dirname, '../build'),
  sitemapPath: path.join(__dirname, '../public/sitemap.xml'),
  serverPort: 3456, // Random port for preview server
  baseUrl: 'https://trueallyguide.com',
  outputDir: path.join(__dirname, '../build'),
  timeout: 30000,
  maxConcurrent: 3
};

// Logging utility
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const emoji = level === 'error' ? '❌' : level === 'success' ? '✅' : level === 'warning' ? '⚠️' : '📝';
  console.log(`${emoji} ${timestamp}: ${message}`);
}

// Parse sitemap.xml to get routes
async function parseSitemap() {
  try {
    if (!fs.existsSync(CONFIG.sitemapPath)) {
      throw new Error('Sitemap not found. Please generate sitemap first.');
    }
    
    const sitemapContent = fs.readFileSync(CONFIG.sitemapPath, 'utf8');
    const result = await parseStringPromise(sitemapContent);
    
    const urls = result.urlset.url.map(url => {
      const fullUrl = url.loc[0];
      const path = fullUrl.replace(CONFIG.baseUrl, '') || '/';
      return path;
    });
    
    log(`Found ${urls.length} routes in sitemap`);
    return urls;
  } catch (error) {
    log(`Failed to parse sitemap: ${error.message}`, 'error');
    throw error;
  }
}

// Start static server for built files
async function startStaticServer() {
  try {
    log(`Starting static server on port ${CONFIG.serverPort}...`);
    
    // Use npx serve to serve the build directory
    const serverProcess = exec(`npx serve -s build -p ${CONFIG.serverPort}`, {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Wait for server to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 15000);
      
      let serverOutput = '';
      
      serverProcess.stdout.on('data', (data) => {
        serverOutput += data.toString();
        log(`Server: ${data.toString().trim()}`);
        
        if (data.includes('Accepting connections') || data.includes('Local:')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      
      serverProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        log(`Server error: ${errorOutput.trim()}`, 'warning');
        
        if (errorOutput.includes('EADDRINUSE')) {
          clearTimeout(timeout);
          reject(new Error(`Port ${CONFIG.serverPort} already in use`));
        }
      });
      
      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      
      // Fallback: assume server is ready after delay
      setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, 5000);
    });
    
    log('Static server started successfully', 'success');
    return serverProcess;
  } catch (error) {
    log(`Failed to start static server: ${error.message}`, 'error');
    throw error;
  }
}

// Prerender a single route
async function prerenderRoute(page, route) {
  try {
    const url = `http://localhost:${CONFIG.serverPort}${route}`;
    log(`Prerendering ${route}...`);
    
    // Navigate to the route
    await page.goto(url, { 
      waitUntil: 'networkidle0', 
      timeout: CONFIG.timeout 
    });
    
    // Wait for React to hydrate and SEO component to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get the fully rendered HTML
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    
    // Verify canonical tag is correct
    const canonicalTag = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    const expectedCanonical = route === '/' ? CONFIG.baseUrl + '/' : CONFIG.baseUrl + route;
    
    if (canonicalTag !== expectedCanonical) {
      log(`Warning: Canonical mismatch for ${route}. Expected: ${expectedCanonical}, Got: ${canonicalTag}`, 'warning');
    }
    
    // Determine output path
    const outputPath = route === '/' 
      ? path.join(CONFIG.outputDir, 'index.html')
      : path.join(CONFIG.outputDir, route, 'index.html');
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(outputPath));
    
    // Write prerendered HTML
    await fs.writeFile(outputPath, `<!DOCTYPE html>\n${html}`, 'utf8');
    
    log(`✅ Prerendered ${route} → ${path.relative(path.join(__dirname, '..'), outputPath)}`, 'success');
    
    return {
      route,
      success: true,
      canonicalTag,
      outputPath
    };
  } catch (error) {
    log(`❌ Failed to prerender ${route}: ${error.message}`, 'error');
    return {
      route,
      success: false,
      error: error.message
    };
  }
}

// Process routes in batches to avoid overwhelming the browser
async function prerenderRoutes(routes) {
  log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const results = [];
  const batches = [];
  
  // Split routes into batches
  for (let i = 0; i < routes.length; i += CONFIG.maxConcurrent) {
    batches.push(routes.slice(i, i + CONFIG.maxConcurrent));
  }
  
  try {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      log(`Processing batch ${i + 1}/${batches.length} (${batch.length} routes)...`);
      
      const pages = await Promise.all(
        batch.map(() => browser.newPage())
      );
      
      // Set user agent to avoid detection
      await Promise.all(
        pages.map(page => page.setUserAgent('Mozilla/5.0 (compatible; PrerenderBot/1.0)'))
      );
      
      // Process batch concurrently
      const batchResults = await Promise.all(
        batch.map((route, index) => prerenderRoute(pages[index], route))
      );
      
      results.push(...batchResults);
      
      // Close pages
      await Promise.all(pages.map(page => page.close()));
    }
  } finally {
    await browser.close();
    log('Browser closed');
  }
  
  return results;
}

// Generate prerendered static files
async function prerender() {
  let serverProcess = null;
  
  try {
    log('🚀 Starting prerendering process...');
    
    // Verify build directory exists
    if (!fs.existsSync(CONFIG.buildDir)) {
      throw new Error('Build directory not found. Please run "npm run build" first.');
    }
    
    // Parse sitemap to get routes
    const routes = await parseSitemap();
    
    // Start static server
    serverProcess = await startStaticServer();
    
    // Prerender all routes
    const results = await prerenderRoutes(routes);
    
    // Generate summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    log(`\n📊 Prerendering Summary:`);
    log(`   Total routes: ${results.length}`);
    log(`   Successful: ${successful.length}`);
    log(`   Failed: ${failed.length}`);
    
    if (failed.length > 0) {
      log('\n❌ Failed routes:', 'error');
      failed.forEach(result => {
        log(`   ${result.route}: ${result.error}`, 'error');
      });
    }
    
    // Generate prerender report
    const report = {
      timestamp: new Date().toISOString(),
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      results: results.map(r => ({
        route: r.route,
        success: r.success,
        canonicalTag: r.canonicalTag,
        error: r.error
      }))
    };
    
    const reportPath = path.join(__dirname, '../reports/prerender-report.json');
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    log(`📄 Prerender report saved: ${reportPath}`);
    
    if (failed.length > 0) {
      process.exit(1);
    } else {
      log('🎉 Prerendering completed successfully!', 'success');
      process.exit(0);
    }
    
  } catch (error) {
    log(`💥 Prerendering failed: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    // Kill server process
    if (serverProcess) {
      log('Shutting down static server...');
      serverProcess.kill();
    }
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down...');
  process.exit(0);
});

// Run prerendering if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerender().catch(error => {
    log(`💥 Unhandled error: ${error.message}`, 'error');
    process.exit(1);
  });
}

export default prerender;