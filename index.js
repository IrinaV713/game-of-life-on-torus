const express = require('express');
const app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname })
});

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`); 
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('HTTP server closed.');     
        process.exit(0);
    });
});