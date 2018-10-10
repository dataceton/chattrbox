const http = require('http');
const fs = require('fs');
const path = require('path');
const extract = require('./extract');
const wss = require('./websocket-server');

var handleError = function (err, res) {
  var filePath = path.resolve(__dirname, 'app', '404.html');
  fs.readFile(filePath, function (err, data) {
    res.writeHead(404);
    res.end(data);
  });
};

var server = http.createServer(function (req, res) {
  console.log('Responding to a request');
  var filePath = extract(req.url);
  fs.readFile(filePath, function (err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    }
  });
});
server.listen(3000);
