"use strict";

/* ===== Libraries and Node Modules ===== */

const express = require('express');
const loginRouter = express.Router();

const {check, oneOf, validationResult} = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const Credentials_DB_Manager = require('../bin/credentialsDAO');
const credentialsDAO = new Credentials_DB_Manager();

/* ===== Passport Initialization ===== */

// passport local authentication strategy for a Musician
passport.use('musiciansLocalStrategy', new LocalStrategy(async function(username, password, done) {
    credentialsDAO.getMusicianCredentials(username, password).then(({user, check}) => {

        if (!user) return done(null, false, {"error" : {"field" : "username", "message" : "Incorrect username or email"}});
        if (!check) return done(null, false, {"error" : {"field" : "password", "message" : "Incorrect password"}});

        user.type = "MUSICIAN";     // added a type to use in the passport serialize and deserialize methods
        return done(null, user);
    });
}));

// passport local authentication strategy for a Group
passport.use('groupsLocalStrategy', new LocalStrategy(async function(username, password, done) {
    credentialsDAO.getGroupCredentials(username, password).then(({user, check}) => {

        if (!user) return done(null, false, {"error" : {"field" : "username", "message" : "Incorrect username or email"}});
        if (!check) return done(null, false, {"error" : {"field" : "password", "message" : "Incorrect password"}});

        user.type = "GROUP";        // added a type to use in the passport serialize and deserialize methods
        return done(null, user);
    });
}));

// function used to "remember the logged-in" user, by saving it's profileID and type (or anything else)
passport.serializeUser(function(user, done) {
    done(null, {"profileID" : user.profileID, "type" : user.type});    // instead of serializing only the ID, a type is also used to disinguish a Musician from a Group
});

// function used to retrieve a previously saved logged in user
passport.deserializeUser(async function(user, done) {
    let logOutUser;
    try {
        if (user.type === "MUSICIAN") {
            logOutUser = await credentialsDAO.getMusicianCredentialsByID(user.profileID);
            logOutUser.type = "MUSICIAN";   // the type is also added to the deserialized object
        }

        if (user.type === "GROUP") {
            logOutUser = await credentialsDAO.getGroupCredentialsByID(user.profileID);
            logOutUser.type = "GROUP";      // the type is also added to the deserialized object
        }

        return done(null, logOutUser);
    } catch (err) {
        return done(err, logOutUser);
    }
});

loginRouter.use(session({
    "secret" : "secret sententce that should be saved in a separate file!",   // TODO try and use dotenv?
    "resave" : false,
    "saveUninitialized" : false,
    "cookie" : {
        //"secure" : true,
        "httpOnly" : true
    }
}));

// Passport initialization
loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

/* ===== Passport custom Middleware ===== */

// routes protecting middleware a valid Musician
const musicianIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && req.user.type === "MUSICIAN") return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Musician"});
}

// routes protecting middleware a valid Group
const groupIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && req.user.type === "GROUP") return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Group"});
}

// routes protecting middleware for both valid Musicians and Groups
const musicianOrGroupIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.type === "GROUP" || req.user.type === "MUSICIAN")) return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Group or a valid Musician"});
}

/* ===== Custom Routes ===== */

/* ===== Musicians routes ===== */

// Musicians sign-up route
loginRouter.post('/signup/musicians', [
    // express validator statements and checks
    oneOf([
        check("user").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
        check("user").isEmail().withMessage("username must be a valid name or a valid email")
    ]),
    check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")

    ], async (req, res, next) => {
        // express validator errors checking
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        let data;
        try {
            data = await credentialsDAO.insertNewMusician(req.body);
            if (data.err) return res.status(200).json({"error" : data.err});
            return res.status(200).json({"profileID" : data});
        } catch (err) {
            return res.status(500).json({"error" : err});
        }
    }
);

// Musicians log-in route
loginRouter.post('/login/musicians', [
        // express validator statements and checks
        oneOf([
            check("username").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
            check("username").isEmail().withMessage("username must be a valid name or a valid email")
        ]),
        check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")

    ], (req, res, next) => {
        // express validator errors checking
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        // passport authentication and log-in
        passport.authenticate('musiciansLocalStrategy', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json(info);
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json(req.user);
            })
        }) (req, res, next);
    }
);

// Musicians log-out route
loginRouter.delete('/logout/musicians/current', musicianIsLoggedIn, (req, res) => {
    let loggedOut = null;
    if (req.user !== undefined) loggedOut = {"profileID" : req.user.profileID, "user" : req.user.user};
    console.log("received delete from:", loggedOut);
    req.logout((err) => {
        if (err) return next(err);
    });
    if (loggedOut != null) return res.status(200).json({"correctly logged-out musician" : loggedOut});
});

/* ===== Musicians routes ===== */

// Groups sign-up route
loginRouter.post('/signup/groups', [
    // express validator statements and checks
    oneOf([
        check("user").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
        check("user").isEmail().withMessage("username must be a valid name or a valid email")
    ]),
    check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")

    ], async (req, res, next) => {
        // express validator errors checking
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        let data;
        try {
            data = await credentialsDAO.insertNewGroup(req.body);
            if (data.err) return res.status(200).json({"error" : data.err});
            return res.status(200).json({"profileID" : data});
        } catch (err) {
            return res.status(500).json({"error" : err});
        }
    }
);

// Groups log-in route
loginRouter.post('/login/groups', [
    // express validator statements and checks
    oneOf([
        check("username").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
        check("username").isEmail().withMessage("username must be a valid name or a valid email")
    ]),
    check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")

    ], (req, res, next) => {
        // express validator errors checking
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        // passport authentication and log-in
        passport.authenticate('groupsLocalStrategy', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json(info);
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json(req.user);
            })
        }) (req, res, next);
    }
);

// Groups log-out route
loginRouter.delete('/logout/groups/current', groupIsLoggedIn, (req, res) => {
    let loggedOut = null;
    if (req.user !== undefined) loggedOut = {"profileID" : req.user.profileID, "user" : req.user.user};
    req.logout((err) => {
        if (err) return next(err);
    });
    if (loggedOut != null) return res.status(200).json({"correctly logged-out group" : loggedOut});
});

/* ===== Modules Exports ===== */

module.exports.loginRouter = loginRouter;
module.exports.musicianIsLoggedIn = musicianIsLoggedIn;
module.exports.groupIsLoggedIn = groupIsLoggedIn;
module.exports.musicianOrGroupIsLoggedIn = musicianOrGroupIsLoggedIn;
