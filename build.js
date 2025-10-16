#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.CI = 'false';
process.env.GENERATE_SOURCEMAP = 'false';

// Get the react-scripts path
const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');

// Run the build command
const build = spawn('node', [
    path.join(__dirname, 'node_modules', 'react-scripts', 'scripts', 'build.js')
], {
    stdio: 'inherit',
    env: process.env
});

build.on('close', (code) => {
    if (code !== 0) {
        console.error(`Build process exited with code ${code}`);
        process.exit(code);
    }
    
    // Run sitemap generation after build
    console.log('Running dynamic sitemap generation...');
    const sitemap = spawn('node', [
        path.join(__dirname, 'scripts', 'generate-sitemap-dynamic.js')
    ], {
        stdio: 'inherit'
    });
    
    sitemap.on('close', (sitemapCode) => {
        if (sitemapCode !== 0) {
            console.error(`Sitemap generation exited with code ${sitemapCode}`);
            process.exit(sitemapCode);
        } else {
            // Copy sitemap from public to build directory to ensure it's in the deployment
            const fs = require('fs');
            const publicSitemap = path.join(__dirname, 'public', 'sitemap.xml');
            const buildSitemap = path.join(__dirname, 'build', 'sitemap.xml');
            
            try {
                if (fs.existsSync(publicSitemap)) {
                    fs.copyFileSync(publicSitemap, buildSitemap);
                    console.log('Sitemap copied to build directory');
                }
            } catch (err) {
                console.error('Error copying sitemap to build:', err);
            }
            
            // Post-process SPA index.html: remove preconnect and apply print-swap CSS
            try {
                const fs2 = require('fs');
                const buildIndex2 = path.join(__dirname, 'build', 'index.html');
                if (fs2.existsSync(buildIndex2)) {
                    let html2 = fs2.readFileSync(buildIndex2, 'utf8');
                    html2 = html2.replace(/<link rel=\"preconnect\"[^>]*>/g, '');
                    html2 = html2.replace(/<link rel=\"dns-prefetch\"[^>]*>/g, '');
                    html2 = html2.replace(
                      /<link href=\"(\\/static\\/css\\/[^\\"]+\\.css)\" rel=\"stylesheet\">/,
                      '<link rel="preload" href="$1" as="style"><link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
                    );
                    fs2.writeFileSync(buildIndex2, html2, 'utf8');
                    console.log('Post-processed build/index.html: removed preconnect and applied print-swap CSS.');
                }
            } catch (err) {
                console.warn('Post-processing build/index.html failed:', err.message);
            }

            // CRITICAL: Run enhanced static page generation for canonical URLs
            console.log('Running enhanced static page generation with canonical URLs...');
            const staticPages = spawn('node', [
                path.join(__dirname, 'scripts', 'generate-static-pages.js')
            ], {
                stdio: 'inherit'
            });
            
            staticPages.on('close', (staticCode) => {
                if (staticCode !== 0) {
                    console.error(`Static page generation exited with code ${staticCode}`);
                } else {
                    console.log('✅ Enhanced SEO static pages generated successfully');
                }
                process.exit(staticCode);
            });
            
            staticPages.on('error', (err) => {
                console.error('Failed to start static page generation:', err);
                process.exit(1);
            });
        }
    });
});

build.on('error', (err) => {
    console.error('Failed to start build process:', err);
    process.exit(1);
});
