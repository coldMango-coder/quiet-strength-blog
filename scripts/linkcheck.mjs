import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const checkLocalFiles = () => {
  const buildDir = path.join(__dirname, '..', 'build');
  const links = ['/about', '/themes', '/blog', '/books'];
  const results = [];
  
  for (const link of links) {
    const filePath = path.join(buildDir, link.slice(1), 'index.html');
    const altFilePath = path.join(buildDir, `${link.slice(1)}.html`);
    
    let status = 404;
    
    // Check if directory with index.html exists
    if (fs.existsSync(filePath)) {
      status = 200;
    }
    // Check if direct HTML file exists  
    else if (fs.existsSync(altFilePath)) {
      status = 200;
    }
    // Special case for blog - should exist
    else if (link === '/blog' && fs.existsSync(path.join(buildDir, 'blog', 'index.html'))) {
      status = 200;
    }
    
    results.push({ link, status });
    console.log(`${link}: ${status}`);
  }
  
  // Write results
  fs.writeFileSync(
    path.join(__dirname, '..', 'reports', 'links.json'), 
    JSON.stringify(results, null, 2)
  );
  
  // Exit with error if any links are broken
  const broken = results.filter(r => r.status !== 200);
  if (broken.length > 0) {
    console.error('Broken links found:', broken);
    process.exit(2);
  }
  
  console.log('All links check passed!');
};

checkLocalFiles();