const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization',
}));

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
const connections = [];

function getData(max) {
    return [
        { type: 'Checkout', value: getRandomInt(max), pulse: true },
        { type: 'Dados de pagamentos', value: getRandomInt(max), pulse: false },
        { type: 'Entrega', value: getRandomInt(max), pulse: false },
        { type: 'Pagamento', value: getRandomInt(max), pulse: false },
        { type: 'Comprou', value: getRandomInt(max), pulse: true }
    ]

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max).toString();
}

io.on('connection', (socket) => {
    console.log(`${socket.id} was connected`);

    setInterval(() => {
        const randomData = getData(200);
        connections.forEach((clientSocket) => {
            clientSocket.emit('data', { value: randomData });
        });
    }, 10000);

    connections.push(socket);
    socket.on('disconnect', () => {
        console.log(`${socket.id} was disconnected`);

        const index = connections.indexOf(socket);
        if (index !== -1) {
            connections.splice(index, 1);
        }
    });
});

server.listen(3004, () => {
    console.log('Listening on port 3004');
});

module.exports = { app, server, io };
