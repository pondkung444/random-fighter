const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const routes = { '/': 'index.html', '/combat.js': 'combat.js', '/fighter-art.js': 'fighter-art.js', '/visual-review': 'tests/visual-review.html' };
http.createServer((req, res) => {
  const file = routes[req.url.split('?')[0]];
  if (!file) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.join(__dirname, '..', file)));
}).listen(4174, '127.0.0.1', () => console.log('Game review: http://127.0.0.1:4174'));
