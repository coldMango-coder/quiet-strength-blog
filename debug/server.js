const express = require('express');
const path = require('path');

const app = express();
const port = 5300;
const buildDir = path.join(__dirname, '..', 'build');

app.use(express.static(buildDir));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => console.log('debug server on http://localhost:' + port));
