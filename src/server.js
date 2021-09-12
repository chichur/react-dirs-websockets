var http = require('http');
var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

// моковые данные
const dirs = [
    {name: 'root', id: 0, parent: null},
    {name: 'dir1', id: 1, parent: 0},
    {name: 'dir2', id: 2, parent: 0},
    {name: 'file1', id: 3, parent: 0},
    {name: 'file2', id: 4, parent: 0},
    {name: 'dir2.1', id: 5, parent: 2},
    {name: 'dir2.2', id: 6, parent: 2},
    {name: 'file2.1', id: 7, parent: 2},
    {name: 'file2.2', id: 8, parent: 2},
]

let path = [];

const setPath = (dir) => {
    let startPath = [];

    const recSearch = (node) => {
        if (node.name === "dir")
            startPath.push(node)

    }
}

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws) {

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    if (message === "req_dirs") {
      ws.send(JSON.stringify(dirs));
    }
    else {
        setPath(message)
    }
  });

});

console.log("Сервер запущен на портах 8080, 8081");

