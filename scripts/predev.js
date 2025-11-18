#!/usr/bin/env node
/**
 * Pre-dev script
 * - Ensures deterministic local dev port
 * - Prints helpful debug info
 * - Removes common build caches
 * Note: Service Worker unregister happens in-browser via public/dev-sw-kill.js (localhost only).
 */
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const root = process.cwd();
const removeIfExists = (p) => {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`✔ Cleared ${p}`);
    }
  } catch (e) {
    console.warn(`! Could not clear ${p}: ${e.message}`);
  }
};

console.log(`🔧 Predev starting on port ${PORT}...`);
// Clear common caches that could cause stale behavior
['.cache', '.next', 'dist', 'build'].forEach((d) => removeIfExists(path.join(root, d)));

console.log('ℹ Dev SW cleanup will run in browser on localhost (public/dev-sw-kill.js).');
console.log('🚀 Proceeding to start dev server...');

