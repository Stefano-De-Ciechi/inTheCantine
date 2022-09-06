"use strict";

/* ===== Libraries and Node Modules ===== */

const express = require('express');
const appDataRouter = express.Router();

const {check, oneOf, validationResult} = require('express-validator');

const AppData_DB_Manager = require('../bin/applicationDAO');
const appDataDAO = new AppData_DB_Manager();

const {musicianIsLoggedIn, groupIsLoggedIn, musicianOrGroupIsLoggedIn} = require('./loginRouter');

/* ===== Custom Routes ===== */
appDataRouter.get('/test/router', (req, res) => {
    res.send("login router working");
});

/* ===== Modules Exports ===== */
module.exports = appDataRouter;