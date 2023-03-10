const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('src'));

const server = require('http').createServer(app);

server.listen(port, () => {
    console.log('Application started.')
    console.log(`Listening on port ${port}: http://localhost:${port}`);
});

const io = require('socket.io')(server);
io.on('connection', function(socket) { 
    socket.on('exit', () => {
        server.close();
        console.log('Application closed.');
        process.exit(0);
    });
});
