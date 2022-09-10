"use strict";

/* ===== Libraries and Node Modules ===== */

const express = require('express');
const filesRouter = express.Router();

const {musicianOrGroupIsLoggedIn} = require('./loginRouter');

const multer = require('multer');   // module that enables transfer of multi-part files like images, videos and audio files

/* ===== Multer Initialization ===== */

// create a local directory to store incoming images
const imagesStorage = multer.diskStorage({
    filename : function (req, file, callback) {
        if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg") {
            return callback("Only .png, .jpg and .jpeg formats allowed");
        }

        let fileName = generateImageFileName(req.user);
        callback(null, fileName);      // TODO execute file re-nomination here??
    },
    
    destination : function(req, file, callback) {
        callback(null, __dirname + '/../public/media/images');   // this directory will be statically served by the server
    }
});

// create a local directory to store incoming demo files
const demosStorage = multer.diskStorage({
    filename : function (req, file, callback) {
        console.log("inside multer, file MIME is:", file.mimetype);
        if (file.mimetype != 'audio/wav' && file.mimetype != 'audio/mp3' && file.mimetype != 'audio/m4a' && file.mimetype != 'audio/mpeg' && file.mimetype != 'audio/mp4') {
            return callback("Only .wav .mp3 .mp4 and .m4a formats allowed");
        }

        let fileName = convertDemoFileName(req.user, file.originalname);
        callback(null, fileName);
    },
    
    destination : function(req, file, callback) {
        callback(null, __dirname + '/../public/media/demos');    // this directory will be statically served by the server
    }
});

// could be used as middleware too, but will be used inside the (req, res) callback
const imagesUpload = multer({"storage" : imagesStorage});
const demosUpload = multer({"storage" : demosStorage});

/* ===== Custom Functions ===== */

// given the type and ID of the user, the generated file path will be "TYPE+ID_profilePict"
function generateImageFileName(user) {
    let newFileName = "";
    if (user.type === "MUSICIAN") newFileName += "M";
    else if (user.type === "GROUP") newFileName += "G";
    newFileName += user.profileID + "_profilePict";
    return newFileName;
}

// given the type and ID of the user, the generated file path will be "TYPE+ID_<file name.extension>"
function convertDemoFileName(user, fileName) {
    let newFileName = "";
    if (user.type === "MUSICIAN") newFileName += "M";
    else if (user.type === "GROUP") newFileName += "G";
    newFileName += user.profileID + "_" + fileName;
    return newFileName;
}

// used to remove the /public/ in front of the path (used only internally in the server)
function convertFilePath(path) {
    return path.split('public')[1];
}

/* ===== Custom Routes ===== */

// upload an image to the /public/media/images folder --> any new image posted by a user will replace the previous one (no need to care about deleting it)
filesRouter.post('/images', musicianOrGroupIsLoggedIn, (req, res) => {    
    
    imagesUpload.single('file')(req, res, function(err) {       // 'file' is just the value of the attribute name of an HTML input tab, or the name of the key in the multpart post request
        if (err) return res.status(415).json({"error" : err});     // HTTP status 415 means Unsupported Media Type
        if (req.file === undefined) return res.status(400).json({"error" : "no file was sent for upload"});     // HTTP status 400 means Bad Request
        return res.status(200).json({"filePath" : convertFilePath(req.file.path)});
    });
    
});

// upload a new demo file to the /public/media/demos
filesRouter.post('/demos', musicianOrGroupIsLoggedIn, (req, res) => {

    demosUpload.single('file')(req, res, function(err) {        // 'file' is just the value of the attribute name of an HTML input tab, or the name of the key in the multpart post request
        if (err) return res.status(415).json({"error" : err});
        if (req.file === undefined) return res.status(400).json({"error" : "no file was sent for upload"});     // HTTP status 400 means Bad Request
        return res.status(200).json({"filePath" : convertFilePath(req.file.path)});
    });
});

module.exports = filesRouter;