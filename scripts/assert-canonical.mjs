import fs from 'fs'; 

const host = process.env.HOST || 'https://trueallyguide.com'; 
const routes = (process.env.ROUTES || '/blog/how-to-stop-attracting-narcissists-9-proven-strategies,/blog/introvert-networking-tips-without-small-talk-guide').split(','); 

const data = JSON.parse(fs.readFileSync('reports/scan-prod.json', 'utf8')); 

const bad = data.filter(x => {
  const expectedCanonical = `https://www.trueallyguide.com${x.route}`;
  return x.canonical !== expectedCanonical;
}); 

if (bad.length) { 
  console.error('Bad canonical:', bad); 
  process.exit(2);
} else {
  console.log('✅ All canonical URLs are correct');
  console.log('Results:');
  data.forEach(item => {
    console.log(`  ${item.route}: ${item.canonical}`);
  });
}