// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  if (path === '/comments' && method === 'GET') {
    fs.readFile('comments.json', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end();
        return;
      }
      res.end(data);
    });
  } else if (path === '/comments' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const parsedBody = JSON.parse(body);
      fs.readFile('comments.json', 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end();
          return;
        }
        const comments = JSON.parse(data);
        comments.push(parsedBody);
        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
          if (err) {
            res.statusCode = 500;
            res.end();
            return;
          }
          res.statusCode = 201;
          res.end();
        });
      });
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000);