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
        }
        process.exit(sitemapCode);
    });
});

build.on('error', (err) => {
    console.error('Failed to start build process:', err);
    process.exit(1);
});