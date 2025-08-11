import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Running basic frontend checks...');

// Check critical files exist
const buildDir = path.join(__dirname, '..', 'build');
const criticalFiles = [
  'index.html',
  'hotfix.css', 
  'blog/index.html',
  'blog/how-to-stop-attracting-narcissists-9-proven-strategies/index.html',
  'blog/introvert-networking-tips-without-small-talk-guide/index.html'
];

let allGood = true;

for (const file of criticalFiles) {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.error(`✗ ${file} missing`);
    allGood = false;
  }
}

// Check hotfix CSS is injected
const indexPath = path.join(buildDir, 'index.html');
const blogPath = path.join(buildDir, 'blog/how-to-stop-attracting-narcissists-9-proven-strategies/index.html');

const indexContent = fs.readFileSync(indexPath, 'utf8');
const blogContent = fs.readFileSync(blogPath, 'utf8');

if (indexContent.includes('hotfix.css')) {
  console.log('✓ Hotfix CSS injected in index.html');
} else {
  console.error('✗ Hotfix CSS missing from index.html');
  allGood = false;
}

if (blogContent.includes('hotfix.css')) {
  console.log('✓ Hotfix CSS injected in blog post');
} else {
  console.error('✗ Hotfix CSS missing from blog post');
  allGood = false;
}

// Check canonical URLs
const canonicalMatch = blogContent.match(/rel="canonical" href="([^"]+)"/);
if (canonicalMatch) {
  console.log(`✓ Canonical URL found: ${canonicalMatch[1]}`);
} else {
  console.error('✗ No canonical URL found in blog post');
  allGood = false;
}

// Write basic results
const results = {
  timestamp: new Date().toISOString(),
  criticalFiles: criticalFiles.map(f => ({
    file: f,
    exists: fs.existsSync(path.join(buildDir, f))
  })),
  hotfixInjected: {
    index: indexContent.includes('hotfix.css'),
    blog: blogContent.includes('hotfix.css')
  },
  canonicalFound: !!canonicalMatch
};

fs.writeFileSync(
  path.join(__dirname, '..', 'reports', 'basic-checks.json'), 
  JSON.stringify(results, null, 2)
);

if (allGood) {
  console.log('🎉 All basic checks passed!');
} else {
  console.error('❌ Some checks failed');
  process.exit(1);
}