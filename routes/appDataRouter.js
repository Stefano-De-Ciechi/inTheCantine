"use strict";

/* ===== Libraries and Node Modules ===== */

const fs = require('fs');

const express = require('express');
const appDataRouter = express.Router();

const {check, oneOf, validationResult, checkSchema} = require('express-validator');

const AppData_DB_Manager = require('../bin/applicationDAO');
const appDataDAO = new AppData_DB_Manager();

const {musicianIsLoggedIn, groupIsLoggedIn, musicianOrGroupIsLoggedIn} = require('./loginRouter');

appDataRouter.use(express.json());

/* ===== Express-validator custom checks ===== */

// ATTENTION only the longest checks are inserted here, others are inserted in-line directly in the routes definitions

const updateOrInsertMusicianChecks = checkSchema({
    // even non-required values are checked to prevent a non-standardized database (default values can't be set on update queries)
    "name" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'name'"
    },
    "surname" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'surname'"
    },
    "age" : {
        "in" : ["body"],
        "exists" : true,
        "isNumeric" : {
            "errorMessage" : "age must be a numeric value"
        },
        "errorMessage" : "req.body must contain the field 'age'"
    },
    "city" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'city'"
    },
    "province" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'province'"
    },
    "contacts" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'contacts'"
    },
    "musicalTastes" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'musicalTastes'"
    },
    "instruments" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'instruments'"
    },
    "description" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'description'"
    },
    "availableForHire" : {
        "in" : ["body"],
        "exists" : true,
        "isBoolean" : {
            "errorMessage" : "availableForHire must be either true or false"
        },
        "errorMessage" : "req.body must contain the field 'availableForHire'"
    },
    "availableLocations" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'availableLocations'"
    },
    "profilePicturePath" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'profilePicturePath'"
    },
});

const updateOrInsertGroupChecks = checkSchema({
    // even non-required values are checked to prevent a non-standardized database (default values can't be set on update queries)
    "name" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'name'"
    },
    "city" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'city'"
    },
    "province" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'province'"
    },
    "contacts" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'contacts'"
    },
    "musicalGenres" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'musicalTastes'"
    },
    "musiciansList" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'musiciansList'"
    },
    "description" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'description'"
    },
    "timeTable" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'timeTable'"
    },
    "availableForHire" : {
        "in" : ["body"],
        "exists" : true,
        "isBoolean" : {
            "errorMessage" : "availableForHire must be either true or false"
        },
        "errorMessage" : "req.body must contain the field 'availableForHire'"
    },
    "availableLocations" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'availableLocations'"
    },
    "profilePicturePath" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'profilePicturePath'"
    },
});

const insertDemoFileChecks = checkSchema({
    /*"authorID" : {
        "in" : ["body"],
        "exists" : true,
        "isNumeric" : {
            "errorMessage" : "authorID must be a numeric value"
        },
        "errorMessage" : "req.body must contain the field 'authorID'"
    },
    "authorType" : {
        "in" : ["body"],
        "exists" : true,
        "isIn" : {
            "options" : [["GROUP", "MUSICIAN"]],
            "errorMessage" : "authorType must be either GROUP or MUSICIAN"
        },
        "errorMessage" : "req.body must contain the field 'authorType'"
    },
    "publishDate" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'publishDate'"
    },*/
    "title" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'title'"
    },
    "description" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'description'"
    },
    "filePath" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'filePath'"
    },
});

const insertOrUpdateAnnouncementChecks = checkSchema({
    /*"authorID" : {
        "in" : ["body"],
        "exists" : true,
        "isNumeric" : {
            "errorMessage" : "authorID must be a numeric value"
        },
        "errorMessage" : "req.body must contain the field 'authorID'"
    },
    "authorType" : {
        "in" : ["body"],
        "exists" : true,
        "isIn" : {
            "options" : [["GROUP", "MUSICIAN"]],
            "errorMessage" : "authorType must be either GROUP or MUSICIAN"
        },
        "errorMessage" : "req.body must contain the field 'authorType'"
    },*/
    "announcementType" : {
        "in" : ["body"],
        "exists" : true,
        "isIn" : {
            "options" : [["G_SEARCH_M", "G_CREATION", "EVENT"]],
            "errorMessage" : "authorType must be either G_SEARCH_M, G_CREATION or EVENT"
        },
        "errorMessage" : "req.body must contain the field 'announcementType'"
    },
    /*"publishDate" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'publishDate'"
    },*/
    "description" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'description'"
    },
    "city" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'city'"
    },
    "province" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'province'"
    }
});

const insertMembershipRequestChecks = checkSchema({
    "groupID" : {
        "in" : ["body"],
        "exists" : true,
        "isNumeric" : {
            "errorMessage" : "groupID must be a numeric value"
        },
        "errorMessage" : "req.body must contain the field 'groupID'"
    },
    "description" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'description'"
    }/*,
    "publishDate" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'publishDate'"
    }*/
});

/* ===== Custom Functions ===== */
function getCurrentDate() {
    return new Date(Date.now()).toISOString().split('T')[0];
}

/* ===== Custom Routes ===== */
// TODO add filters server-side with parametric queries??

// TODO maybe create a router for every entity? too complicated??

/* ===== Musicians Routes ===== */

// list all Musicians
appDataRouter.get('/musicians', async (req, res) => {
    let data;
    try {
        data = await appDataDAO.getAllMusicians();    // musicians data will not get processed (profileID will be needed by the application)
        if (data.error) return res.status(200).json({"message" : "no musicians found"});     // no content found
        return res.status(200).json({data});
    } catch(err) {
        return res.status(500).json({"error" : err});
    }
});

// retrieve Musician's data given it's profileID
appDataRouter.get('/musicians/:musicianID', [check("musicianID").exists().withMessage("a musicianID is required").isNumeric().withMessage("musicianID must be a number")], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
    
    let data;
    try {
        data = await appDataDAO.getMusicianByID(req.params.musicianID);
        if (data.error) return res.status(200).json({"message" : `no musician with ProfileID (${req.params.musicianID})`});
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
});

// create a new Musician Profile (only doable for those who are already authenticated as a valid Musician Account)
appDataRouter.post('/musicians', musicianIsLoggedIn, [
    updateOrInsertMusicianChecks,
    checkSchema({
        "profileID" : {
            "in" : ["body"],
            "exists" : true,
            "isNumeric" : true,
            "errorMessage" : "req.body must contain the field 'profileID', corresponding to a valid ProfileID of an Authenticated Musician account"
        }
    })
], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.insertNewMusician(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"profileID" : data.profileID});
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
}
);

// update a Musician's Profile given it's ID and the new values in the body (only authenticated Musicians)
appDataRouter.put('/musicians', musicianIsLoggedIn, [updateOrInsertMusicianChecks], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.updateMusician(req.user.ProfileID, req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"total changes" : data.changes});
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
});

/* ===== Groups Routes ===== */

// list all Groups
appDataRouter.get('/groups', async (req, res) => {
    let data;
    try {
        data = await appDataDAO.getAllGroups();    // groups data will not get processed (profileID will be needed by the application)
        if (data.error) return res.status(200).json({"message" : "no musicians found"});     // no content found
        return res.status(200).json({data});
    } catch(err) {
        return res.status(500).json({"error" : err});
    }
});

// retrieve a Group's data given it's profileID
appDataRouter.get('/groups/:groupID', [check("groupID").exists().withMessage("a groupID is required").isNumeric().withMessage("groupID must be a number")], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.getGroupByID(req.params.groupID);
        if (data.error) return res.status(200).json({"message" : `no musician with ProfileID (${req.params.musicianID})`});
        return res.status(200).json(data);
    } catch (err) {
        res.status(500).json({"error" : err});
    }
});

// create a new Group Profile (only doable for those who are already authenticated as a valid Group Account)
appDataRouter.post('/groups', groupIsLoggedIn, [
    updateOrInsertGroupChecks,
    checkSchema({
        "profileID" : {
            "in" : ["body"],
            "exists" : true,
            "isNumeric" : true,
            "errorMessage" : "req.body must contain the field 'profileID', corresponding to a valid ProfileID of an Authenticated Group account"
        }
    })
], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.insertNewGroup(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"profileID" : data.profileID});
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
}
);

// update a Group's Profile given it's ID and the new values in the body (only authenticated Groups)
appDataRouter.put('/groups', groupIsLoggedIn, [updateOrInsertGroupChecks], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.updateGroup(req.user.ProfileID, req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"total changes" : data.changes});
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
});

/* ===== Demo Files Routes ===== */

// retrieve all the demos uploaded by a Musician or a Group given their profileID and type (MUSICIAN or GROUP)
//appDataRouter.get('/demos/:profileType/:profileID', [], async (req, res) => {
appDataRouter.get('/demos', [   // a parametric query is used
        check("authorType").exists().withMessage("an authorType is required").toUpperCase().isIn(["GROUP", "MUSICIAN"]).withMessage("authorType must be either GROUP or MUSICIAN"),
        check("authorID").exists().withMessage("an authorID must be passed").isNumeric().withMessage("authorID must be a number")
    ], async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
        
        let data;
        try {
            data = await appDataDAO.getAllProfileDemos(req.query.authorID, req.query.authorType.toUpperCase());
            if (data.error) return res.status(200).json({"message" : data.error});
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({"error" : err});
        }
    }
);

// upload a new DemoFile (only authenticated users)
appDataRouter.post('/demos', musicianOrGroupIsLoggedIn, [insertDemoFileChecks], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    // author ID and type are automatically set based on the authenticated user who is uploading the demo
    req.body.authorID = req.user.profileID;
    req.body.authorType = req.user.type;

    // generated date in format yyyy-mm-dd
    req.body.publishDate = getCurrentDate();

    let data;
    try {
        data = await appDataDAO.insertNewDemo(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"demoID" : data.demoID});
    } catch (err) {
        if (err.error.errno == 19) return res.status(500).json({"error" : "a demo with the same filePath already exists"});
        return res.status(500).json({"error" : err});
    }
});

// remove a DemoFile given it's ID
appDataRouter.delete('/demos/:demoID', musicianOrGroupIsLoggedIn, [
        check("demoID").exists().withMessage("a demoID is required").isNumeric().withMessage("demoID must be a number")
    ], async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
        
        // a demo file can be deleted only by it's Author, so first retrieve the list of all demos of the authenticated user and check if the demo to be deleted is present or not
        // another way is to create a function in the applicationDataDAO called getDemoByID, and check if it's authorID and authorType correspond to the ones of the authenticated user
        let userDemos;
        try {
            userDemos = await appDataDAO.getAllProfileDemos(req.user.profileID, req.user.type);
            if (userDemos.error) return res.status(500).json({"error" : userDemos.error});
        } catch(err) {
            return res.status(500).json({"error" : err});
        }

        let found = false;
        let demoPath;       // the server-side storage location of the demo file (/media/demos/...)
        for (let demo of userDemos) {
            if (demo.ID == req.params.demoID) {
                found = true;
                demoPath = demo.FilePath;
                break;
            }
        }


        if (!found) return res.status(401).json({"error" : "not authorized to remove the demo of another user"});
        
        let data;
        try {
            fs.unlinkSync(__dirname + '/../public' + demoPath);       // deletes the audio file in the /public/media/demos folder, /../public is added here because __dirname is the /routes folder
            data = await appDataDAO.removeDemo(req.params.demoID);
            if (data.error) return res.status(200).json({"message" : data.error});
            return res.status(200).json({"changes" : data.changes});
        } catch (err) {
            res.status(500).json({"error" : err});
        }
    }
);

/* ===== Announcements Routes ===== */

// list all announcements or only ones published by a specific User (using optional req.query)
appDataRouter.get('/announcements', [
        check("authorID").optional(true).isNumeric().withMessage("authorID must be a number"),
        check("authorType").optional(true).isIn(["GROUP", "MUSICIAN"]).withMessage("authorType must be either GROUP or MUSICIAN")
    ], async (req, res) => {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
    
        let data;
        try {
            // if both optional parameters in the req.query are present and valid use them, otherwise return all announcements
            if (req.query.authorID && req.query.authorType) data = await appDataDAO.getAllProfileAnnouncements(req.query.authorID, req.query.authorType);
            else data = await appDataDAO.getAllAnnouncements();
            if (data.error) return res.status(200).json({"message" : data.error});
            return res.status(200).json(data);
        } catch(err) {
            return res.status(500).json({"error" : err});
        }
    }
);

// publish an Announcement (only authenticated users)
appDataRouter.post('/announcements', musicianOrGroupIsLoggedIn, [insertOrUpdateAnnouncementChecks], async(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
    
    // author ID and type are automatically set based on the authenticated user who is publishing the announcement
    req.body.authorID = req.user.profileID;
    req.body.authorType = req.user.type;

    // generated date in format yyyy-mm-dd
    req.body.publishDate = getCurrentDate();

    let data;
    try {
        data = await appDataDAO.insertNewAnnouncement(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"announcementID" : data.announcementID});
    } catch (err) {
        res.status(500).json({"error" : err});
    }
});

// modify an Announcement given it's ID (only doable by the authenticated user who published it)
appDataRouter.put('/announcements/:announcementID', musicianOrGroupIsLoggedIn, [
        insertOrUpdateAnnouncementChecks,
        check("announcementID").exists().withMessage("an announcementID is required").isNumeric().withMessage("announcementID must be a number")
    ], async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
        
        // an announcement can be modified only by it's Author, so first retrieve the list of all announcements of the authenticated user and check if the demo to be deleted is present or not
        // another way is to create a function in the applicationDataDAO called getAnnouncementByID, and check if it's authorID and authorType correspond to the ones of the authenticated user
        let userAnnouncements;
        try {
            userAnnouncements = await appDataDAO.getAllProfileAnnouncements(req.user.profileID, req.user.type);
            if (userAnnouncements.error) return res.status(500).json({"error" : userAnnouncements.error});
        } catch(err) {
            return res.status(500).json({"error" : err});
        }

        let found = false;
        for (let announcement of userAnnouncements) {
            if (announcement.ID == req.params.announcementID) {
                found = true;
                break;
            }
        }

        if (!found) return res.status(401).json({"error" : "not authorized to modify an announcement published by another user"});
        
        let data;
        
        try {
            data = await appDataDAO.updateAnnouncement(req.params.announcementID, req.body);
            if (data.error) return res.status(200).json({"message" : data.error});
            return res.status(200).json(data);
        } catch(err) {
            return res.status(500).json({"error" : err});
        }
    }
);

appDataRouter.delete('/announcements/:announcementID', musicianOrGroupIsLoggedIn, [
        check("announcementID").exists().withMessage("an announcementID is required").isNumeric().withMessage("announcementID must be a number")
    ], async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
        
        // an announcement can be deleted only by it's Author, so first retrieve the list of all announcements of the authenticated user and check if the announcement to be removed is present or not
        // another way is to create a function in the applicationDataDAO called getAnnouncementByID, and check if it's authorID and authorType correspond to the ones of the authenticated user
        let userAnnouncements;
        try {
            userAnnouncements = await appDataDAO.getAllProfileAnnouncements(req.user.profileID, req.user.type);
            if (userAnnouncements.error) return res.status(500).json({"error" : userAnnouncements.error});
        } catch(err) {
            return res.status(500).json({"error" : err});
        }

        let found = false;
        for (let announcement of userAnnouncements) {
            if (announcement.ID == req.params.announcementID) {
                found = true;
                break;
            }
        }

        if (!found) return res.status(401).json({"error" : "not authorized to remove an announcement published by another user"});
        
        let data;

        try {
            data = await appDataDAO.removeAnnouncement(req.params.announcementID);
            if (data.error) return res.status(200).json({"message" : data.error});
            return res.status(200).json({"changes" : data.changes});
        } catch (err) {
            return res.status(500).json({"error" : err});
        }
        
    }
);

/* ===== Membership Requests Routes ===== */

// list all Membership Requests sent by a Musician
appDataRouter.get('/membershipRequests', musicianOrGroupIsLoggedIn, async (req, res) => {
    let data;
    
    try {
        if (req.user.type === "MUSICIAN") data = await appDataDAO.getAllMembershipRequestsByMusicianID(req.user.profileID);
        else if (req.user.type === "GROUP") data = await appDataDAO.getAllMembershipRequestsByGroupID(req.user.profileID);
        else return res.status(401).json({"error" : "your profile is not authorized to read membership requests"});
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json(data);
    } catch (err) {
        res.status(500).json({"error" : err});
    }
});

// send a new Membership Request (only authenticated Musicians)
appDataRouter.post('/membershipRequests', musicianIsLoggedIn, [insertMembershipRequestChecks], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    // musicianID is set to the one of the current Authorized Musician
    req.body.musicianID = req.user.profileID;

    // generated date in format yyyy-mm-dd
    req.body.publishDate = getCurrentDate();

    let data;
    try {
        data = await appDataDAO.insertNewMembershipRequest(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"membershipRequestID" : data.membershipRequestID});
    } catch (err) {
        if (err.error.errno == 19) return res.status(500).json({"error" : "you can't send multiple requests to the same group"});
        return res.status(500).json({"error" : err});
    }
        
});

appDataRouter.delete('/membershipRequests/:membershipRequestID', musicianIsLoggedIn, [
        check("membershipRequestID").exists().withMessage("a membershipRequestID is required").isNumeric().withMessage("membershipRequestID must be a number")
    ], async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        // a membership request can be deleted only by it's Author, so first retrieve the list of all membership requests of the authenticated user and check if the one to be removed is present or not
        // another way is to create a function in the applicationDataDAO called getMembershpRequesByID, and check if it's musicianID correspond to the the authenticated user
        let userMembershipRequests;
        try {
            userMembershipRequests = await appDataDAO.getAllMembershipRequestsByMusicianID(req.user.profileID);
            if (userMembershipRequests.error) return res.status(500).json({"error" : userMembershipRequests.error});
        } catch(err) {
            return res.status(500).json({"error" : err});
        }

        let found = false;
        for (let membershipRequest of userMembershipRequests) {
            if (membershipRequest.ID == req.params.membershipRequestID) {
                found = true;
                break;
            }
        }

        if (!found) return res.status(401).json({"error" : "not authorized to remove a membership request sent by another user"});

        let data;
        try {
            data = await appDataDAO.removeMembershipRequest(req.params.membershipRequestID);
            if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"changes" : data.changes});
        } catch (err) {
            return res.status(500).json({"error" : err});
        }  
    }
);

/* ===== Modules Exports ===== */
module.exports = appDataRouter;