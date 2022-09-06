"use strict";

/* ===== Libraries and Node Modules ===== */

// express and server stuff
const express = require('express');
const {check, oneOf, validationResult} = require('express-validator');
const morgan = require('morgan');

const {loginRouter} = require('./routes/loginRouter');
const appDataRouter = require('./routes/appDataRouter');

/* ===== Libraries and Node Modules' initialization ===== */
const app = express();
app.use(morgan('tiny'));

app.use(express.json());

app.use('/api', loginRouter);   // login router initialization
app.use('/api', appDataRouter);

/* ===== Constants and Variables ===== */
const PORT = 3000;

/* ===== Express Endpoints' definitions ===== */

app.get('/', (req, res) => {
    res.send("operativi zio pera");
});

app.listen(PORT, () => console.log(`magic happening on port ${PORT}`));