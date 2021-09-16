const cors = require('cors')
const express = require('express');
var WebSocketServer = new require('ws');

const port = 3005;

const app = express();

app.use(cors());
app.options('*', cors());
// подключенные клиенты
var clients = {};

// моковые данные
const dirs = [
    {name: 'root', id: 0, parent: null},
    {name: 'dir1', id: 1, parent: 0},
    {name: 'dir2', id: 2, parent: 0},
    {name: 'file1', file: true, id: 3, parent: 0},
    {name: 'file2', file: true, id: 4, parent: 0},
    {name: 'dir2.1', id: 5, parent: 2},
    {name: 'dir2.2', id: 6, parent: 2},
    {name: 'file2.1', file: true, id: 7, parent: 2},
    {name: 'file2.2', file: true, id: 8, parent: 2},
    {name: 'dir2.1.1', id: 9, parent: 6},
    {name: 'dir2.1.2', id: 10, parent: 6},
    {name: 'file2.1.1', file: true, id: 11, parent: 6},
    {name: 'file2.1.2',  file: true, id: 12, parent: 6}
]

let openPath = ['.']

const parseFilePath = (id) => {
    let parent = id;
    let path = [];
    do {
        const elem = dirs.find(el => el.id === Number(parent));
        parent = elem.parent
        path.push(elem.name);
    } while (parent !== 0)

    return "./" + path.reverse().join('/')
}

app.get('/dirs', (request, response) => {
    console.log('Запрос папок');
    response.send({result: 'Ok', data: dirs});
});

app.get('/open/:dir', (request, response) => {
    const dir = request.params.dir;
    openPath.push(dir);
    console.log("Текущий каталог:", openPath.join('/'))
    response.send({result: 'Ok'});
});

app.get('/close', (request, response) => {
    openPath.pop();
    console.log("Текущий каталог:", openPath.join('/'))
    response.send({result: 'Ok'});
});

app.get('/file/:id', (request, response) => {
    console.log('Запрос пути файла');
    const id = request.params.id;
    const filePath = parseFilePath(id);
    response.send({result: 'Ok', data: filePath});
});

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws) {

    var id = Math.random();
    clients[id] = ws;

    ws.on('close', function() {
        delete clients[id];
    });
});

// задача по расскрашиванию файлов
setInterval(() => {
    const files = chooseFiles(Object.keys(clients))

    for (let key in clients) {
        if (key === files[0] || key === files[1]) {
            clients[key].send("red");
            continue
        }
        clients[key].send("#bdbdbd");
    }
}, 5000);

function chooseFiles(files) {
    let first = 0,
        second = 1;

    while ((first = Math.floor(Math.random() * files.length)) ===
          (second = Math.floor(Math.random() * files.length))) {}

    return [files[first], files[second]]
}

app.listen(port);
console.log("Сервер запущен на портах 8080, 8081, 3005");

