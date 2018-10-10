const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const port = 3001;
var ws = new WebSocketServer({
  port: port
});
var secretWord = 'Swordfish';
var messages = [];
console.log('websockets server started');

ws.on('connection', function (socket) {
  console.log('client connection established');
  messages.forEach(function (msg) {
    socket.send(msg);
  });
  socket.on('message', function (data) {
    console.log('message received: ' + data);
    messages.push(data);
    ws.clients.forEach(function (clientSocket) {
      clientSocket.send(data)
    });
  });
});

// ws.on('connection', function (socket) {
//   console.log('client connection established');
//   socket.isCorrectWord = false;
//   socket.send(JSON.stringify({message: 'Enter the secret word'}));
//   // messages.forEach(function (msg) {
//   //   socket.send(msg);
//   // });
//
//   socket.on('message', function (data) {
//     // data = JSON.parse(data);
//     if (socket.isCorrectWord) {
//       messages.push(data);
//       ws.clients.forEach(function (clientSocket) {
//         if (clientSocket.isCorrectWord) {
//           clientSocket.send(data);
//         }
//       });
//     } else if (JSON.parse(data).message === secretWord && !socket.isCorrectWord) {
//       socket.isCorrectWord = true;
//       socket.send(JSON.stringify({message: 'Yep.'}));
//       messages.forEach(function (msg) {
//         socket.send(msg);
//       });
//     } else if (!socket.isCorrectWord) {
//       socket.send(JSON.stringify({message: 'Nope.'}));
//     }
//   });
// });
