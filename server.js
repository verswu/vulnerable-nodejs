'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

const PORT = 8080;

//App
const app = express();
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use("/static", express.static('./static/'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}/`);
});

