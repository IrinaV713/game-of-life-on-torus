const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('src'));

app.get('/', function(req, res) {
    res.send('Application started.')
});

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`); 
    console.log(`Go to http://localhost:${port}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Application closed.');     
        process.exit(0);
    });
});