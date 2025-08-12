const fetch = require('node-fetch');

(async () => {
  const host = process.env.DOM || 'https://trueallyguide.com';
  const links = ['/about', '/themes', '/blog', '/books'];
  
  for (const link of links) {
    try {
      const response = await fetch(host + link, {redirect: 'manual'});
      console.log(`${link}: ${response.status}`);
      
      if (response.status !== 200) {
        console.log(`FAIL: ${link} returned ${response.status}`);
        process.exit(2);
      }
    } catch (error) {
      console.log(`ERROR: ${link} - ${error.message}`);
      process.exit(2);
    }
  }
  
  console.log('SUCCESS: All footer links return 200');
})();