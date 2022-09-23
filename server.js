'use strict';

const express = require('express');
const path = require('path');

const PORT = 8080;

//App
const app = express();
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}/`);
});

