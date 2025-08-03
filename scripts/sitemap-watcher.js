#!/usr/bin/env node

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const { generateSitemap } = require('./generate-sitemap-dynamic');

class SitemapWatcher {
  constructor() {
    this.publicDir = path.join(__dirname, '..', 'public');
    this.watchPattern = path.join(this.publicDir, '*.md');
    this.debounceTimeout = null;
    this.isRunning = false;
    
    this.logFile = path.join(__dirname, '..', 'sitemap-watcher.log');
    this.setupLogger();
  }

  setupLogger() {
    // Create log file if it doesn't exist
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    // Log to console
    console.log(`🔍 ${message}`);
    
    // Log to file
    try {
      fs.appendFileSync(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  debounceRegeneration() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.regenerateSitemap();
    }, 2000); // Wait 2 seconds before regenerating
  }

  async regenerateSitemap() {
    if (this.isRunning) {
      this.log('Sitemap regeneration already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    this.log('Starting sitemap regeneration...');

    try {
      const result = generateSitemap();
      
      if (result.success !== false) {
        this.log(`✅ Sitemap regenerated successfully! Total URLs: ${result.totalUrls || 'N/A'}, Articles: ${result.articlesCount || 'N/A'}`);
        
        // Notify about the update
        this.notifyUpdate(result);
      } else {
        this.log(`❌ Sitemap regeneration failed: ${result.error}`, 'ERROR');
      }
    } catch (error) {
      this.log(`❌ Error during sitemap regeneration: ${error.message}`, 'ERROR');
    } finally {
      this.isRunning = false;
    }
  }

  notifyUpdate(result) {
    const timestamp = new Date().toLocaleString();
    const message = `
🔄 SITEMAP UPDATED - ${timestamp}
📊 Total URLs: ${result.totalUrls || 'N/A'}
📝 Articles: ${result.articlesCount || 'N/A'}
📍 Location: public/sitemap.xml
    `.trim();
    
    console.log('\n' + '='.repeat(50));
    console.log(message);
    console.log('='.repeat(50) + '\n');
  }

  startWatching() {
    this.log(`Starting file watcher for: ${this.watchPattern}`);
    
    const watcher = chokidar.watch(this.watchPattern, {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/BLOG_STRUCTURE_REQUIREMENTS.md',
        '**/README.md'
      ],
      persistent: true,
      ignoreInitial: true
    });

    // File added
    watcher.on('add', (filePath) => {
      const fileName = path.basename(filePath);
      this.log(`📄 New markdown file detected: ${fileName}`);
      this.debounceRegeneration();
    });

    // File changed
    watcher.on('change', (filePath) => {
      const fileName = path.basename(filePath);
      this.log(`📝 Markdown file changed: ${fileName}`);
      this.debounceRegeneration();
    });

    // File deleted
    watcher.on('unlink', (filePath) => {
      const fileName = path.basename(filePath);
      this.log(`🗑️ Markdown file deleted: ${fileName}`);
      this.debounceRegeneration();
    });

    // Watcher ready
    watcher.on('ready', () => {
      this.log('✅ File watcher is ready and monitoring for changes');
      this.log('📂 Watching directory: ' + this.publicDir);
      this.log('🔍 Pattern: *.md files');
      this.log('⏱️ Debounce delay: 2 seconds');
      
      // Generate initial sitemap
      this.log('🔄 Generating initial sitemap...');
      this.regenerateSitemap();
    });

    // Error handling
    watcher.on('error', (error) => {
      this.log(`❌ Watcher error: ${error.message}`, 'ERROR');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      this.log('🛑 Received SIGINT, shutting down file watcher...');
      watcher.close().then(() => {
        this.log('✅ File watcher stopped');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      this.log('🛑 Received SIGTERM, shutting down file watcher...');
      watcher.close().then(() => {
        this.log('✅ File watcher stopped');
        process.exit(0);
      });
    });

    return watcher;
  }

  // Method to run once and exit (for manual updates)
  async runOnce() {
    this.log('Running one-time sitemap generation...');
    await this.regenerateSitemap();
    this.log('One-time generation complete');
  }

  // Method to get current status
  getStatus() {
    const sitemapPath = path.join(this.publicDir, 'sitemap.xml');
    const exists = fs.existsSync(sitemapPath);
    
    if (exists) {
      const stats = fs.statSync(sitemapPath);
      const content = fs.readFileSync(sitemapPath, 'utf8');
      const urlCount = (content.match(/<url>/g) || []).length;
      
      return {
        exists: true,
        lastModified: stats.mtime,
        urlCount: urlCount,
        size: stats.size
      };
    }
    
    return { exists: false };
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const watcher = new SitemapWatcher();

  if (args.includes('--help')) {
    console.log(`
🗺️  Sitemap Watcher - Automatic Sitemap Updates

Usage: node scripts/sitemap-watcher.js [options]

Options:
  --watch       Start file watcher (default)
  --once        Run sitemap generation once and exit
  --status      Show current sitemap status
  --help        Show this help message

Features:
  ✅ Automatically detects new markdown files
  ✅ Regenerates sitemap when files are added/changed/deleted
  ✅ Debouncing to prevent excessive regeneration
  ✅ Comprehensive logging
  ✅ Graceful shutdown handling
  ✅ Error handling and recovery

The watcher monitors the public/ directory for:
  - New .md files (triggers regeneration)
  - Changes to existing .md files (triggers regeneration)
  - Deleted .md files (triggers regeneration)

Press Ctrl+C to stop the watcher.
`);
    return;
  }

  if (args.includes('--status')) {
    const status = watcher.getStatus();
    console.log('\n📊 Sitemap Status:');
    console.log(`   Exists: ${status.exists ? '✅' : '❌'}`);
    if (status.exists) {
      console.log(`   Last Modified: ${status.lastModified}`);
      console.log(`   URL Count: ${status.urlCount}`);
      console.log(`   File Size: ${status.size} bytes`);
    }
    console.log('');
    return;
  }

  if (args.includes('--once')) {
    watcher.runOnce().then(() => {
      process.exit(0);
    }).catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
    return;
  }

  // Default: start watching
  watcher.startWatching();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = SitemapWatcher;