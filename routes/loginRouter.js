"use strict";

/* ===== Libraries and Node Modules ===== */

// TODO basically all imports are the same in both loginRouter and appDataRouter, maybe unify them creating another js file and importing it in both routers
const express = require('express');
const loginRouter = express.Router();

const {check, oneOf, validationResult} = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const Credentials_DB_Manager = require('../bin/credentialsDAO');
const credentialsDAO = new Credentials_DB_Manager();

/* ===== Passport Initialization ===== */
passport.use('musiciansLocalStrategy', new LocalStrategy(async function(username, password, done) {
    credentialsDAO.getMusicianCredentials(username, password).then(({user, check}) => {
        if (!user) return done(null, false, {"message" : "Incorrect username or email"});
        if (!check) return done(null, false, {"message" : "Incorrect password"});
        user.type = "MUSICIAN";     // added a type to use in the passport serialize and deserialize methods
        return done(null, user);
    });
}));

// passport local authentication strategy for a Group
passport.use('groupsLocalStrategy', new LocalStrategy(async function(username, password, done) {
    credentialsDAO.getGroupCredentials(username, password).then(({user, check}) => {
        if (!user) return done(null, false, {"message" : "Incorrect username or email"});
        if (!check) return done(null, false, {"message" : "Incorrect password"});
        user.type = "GROUP";        // added a type to use in the passport serialize and deserialize methods
        return done(null, user);
    });
}));

// function used to "remember the loged-in" user, by saving it's profileID (or anything else)
passport.serializeUser(function(user, done) {
    done(null, {"id" : user.profileID, "type" : user.type});    // instead of serializing only the ID, a type is also used to disinguish a Musician from a Group
});

passport.deserializeUser(async function(user, done) {
    let logOutUser;
    try {
        if (user.type === "MUSICIAN") {
            logOutUser = await credentialsDAO.getMusicianCredentialsByID(user.id);
            delete logOutUser.Password;     // to not send the hashed password stored in the database
            logOutUser.type = "MUSICIAN";   // the type is also added to the deserialized object
        }
        
        if (user.type === "GROUP") {
            logOutUser = await credentialsDAO.getGroupCredentialsByID(user.id);
            delete logOutUser.Password;     // to not send the hashed password stored in the database
            logOutUser.type = "GROUP";      // the type is also added to the deserialized object
        }

        return done(null, logOutUser);
    } catch (err) {
        return done(err, logOutUser);
    }
});

loginRouter.use(session({
    "secret" : "secret sententce that should be saved in a separate file maybe?",   // TODO try and use dotenv?
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

// routes protecting middleware for both a valid Musician or a valid Group
const musicianIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && req.user.type === "MUSICIAN") return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Musician"});
}

const groupIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && req.user.type === "GROUP") return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Group"});
}

const musicianOrGroupIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.type === "GROUP" || req.user.type === "MUSICIAN")) return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Group or a valid Musician"});
}

/* ===== Custom Routes ===== */

loginRouter.get('/test/musicians', musicianIsLoggedIn, (req, res) => {
    //res.json({"message" : "correctly logged in as"});
    res.json({"correct musician login" : req.user});
});

loginRouter.get('/test/groups', groupIsLoggedIn, (req, res) => {
    res.json({"correct group login" : req.user});
});

loginRouter.get('/both/test', musicianOrGroupIsLoggedIn, (req, res) => {
    res.json({"correct login" : req.user});
});

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

loginRouter.delete('/logout/musicians/current', musicianIsLoggedIn, (req, res) => {
    //if (req.user.type !== "GROUP") return res.status(401).send()
    let loggedOut = null;
    if (req.user !== undefined) loggedOut = {"profileID" : req.user.ProfileID, "user" : req.user.User};
    req.logout((err) => {
        if (err) return next(err);
    });
    if (loggedOut != null) res.json({"correctly logged-out musician" : loggedOut});
    //res.redirect('/');
    res.end();
});

// TODO login of groups and musicians is basically identical, the only thing that changes is the parameter in the passport.authenticate --> refactor and maybe transform all into one function
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

loginRouter.delete('/logout/groups/current', groupIsLoggedIn, (req, res) => {
    let loggedOut = null;
    if (req.user !== undefined) loggedOut = {"profileID" : req.user.ProfileID, "user" : req.user.User};
    req.logout((err) => {
        if (err) return next(err);
    });
    if (loggedOut != null) res.json({"correctly logged-out group" : loggedOut});
    //res.redirect('/');
    res.end();
});

/* ===== Modules Exports ===== */

module.exports.loginRouter = loginRouter;
module.exports.musicianIsLoggedIn = musicianIsLoggedIn;
module.exports.groupIsLoggedIn = groupIsLoggedIn;
module.exports.musicianOrGroupIsLoggedIn = musicianOrGroupIsLoggedIn;