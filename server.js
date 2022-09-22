"use strict";

/* ===== Libraries and Node Modules ===== */

// express and server libraries and modules
const express = require('express');
const {check, oneOf, validationResult} = require('express-validator');
const morgan = require('morgan');

const {loginRouter} = require('./routes/loginRouter');
const appDataRouter = require('./routes/appDataRouter');
const filesRouter = require('./routes/filesRouter');

/* ===== Libraries and Node Modules' initialization ===== */
const app = express();
app.use(morgan('tiny'));

app.use(express.json());

app.use('/api', loginRouter);       // login router initialization
app.use('/api', appDataRouter);     // application data router initialization
app.use('/api/media', filesRouter); // file upload router initialization

// statically serve the public directory
app.use(express.static(__dirname + '/public'));

/* ===== Constants and Variables ===== */
const PORT = 3000;

/* ===== Express Endpoints' definitions ===== */

app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.get('*', (req, res) => {
    res.redirect('index.html');
})

app.listen(PORT, () => console.log(`magic happening on port ${PORT}`));
