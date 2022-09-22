"use strict";

const sqlite = require('sqlite3');

// this class interacts with the Application Data part of the database
class ApplicationDAO {
    constructor() {
        this.DBSOURCE = './data/applicationData.db';
        this.db = new sqlite.Database(this.DBSOURCE, (err) => {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log("application-data database opened succesfully");
        });
    }

    /* ===== Musicians ===== */

    // create a new Musician entry in the database
    insertNewMusician(musician) {
        console.log("received:", musician);
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Musicians VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            this.db.run(sql, [musician.profileID, musician.name, musician.surname, musician.age, musician.city, musician.province, musician.contacts, musician.musicalTastes, musician.instruments, musician.description, musician.availableForHire, musician.availableLocations, musician.profilePicturePath], function (err) {
                if (err) return reject({"error" : err});
                return resolve({"profileID" : this.lastID});
            });
        });
    }

    // modify a Musician's profile given it's profileID
    updateMusician(profileID, musician) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE Musicians SET Name = ?, Surname = ?, Age = ?, City = ?, Province = ?, Contacts = ?, MusicalTastes = ?, Instruments = ?, Description = ?, AvailableForHire = ?, AvailableLocations = ?, ProfilePicturePath = ? WHERE ProfileID = ?";
            this.db.run(sql, [musician.name, musician.surname, musician.age, musician.city, musician.province, musician.contacts, musician.musicalTastes, musician.instruments, musician.description, musician.availableForHire, musician.availableLocations, musician.profilePicturePath, profileID], function (err) {
                if (err) return reject({"error" : err});
                return resolve({"changes" : this.changes});
            });
        });
    }

    // retrieve the list of all Musicians in the database
    getAllMusicians() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Musicians";
            this.db.all(sql, function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "No Musicians found"});
                return resolve(row);
            });
        });
    }

    // retreive one Musician from the database given it's ProfileID
    getMusicianByID(profileID) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Musicians WHERE ProfileID = ?";
            this.db.get(sql, [profileID], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `No Musician with profileID (${profileID}) found`});
                return resolve(row);
            });
        });
    }

    /* ===== Groups ===== */

    // create a new Group entry in the database
    insertNewGroup(group) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Groups VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            this.db.run(sql, [group.profileID, group.name, group.city, group.province, group.contacts, group.musicalGenres, group.musiciansList, group.description, group.timeTable, group.availableForHire, group.availableLocations, group.profilePicturePath], function (err) {
                if (err) return reject({"error" : err});
                return resolve({"profileID" : this.lastID});
            });
        });
    }

    // modify a Group's profile given it's ProfileID
    updateGroup(profileID, group) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE Groups SET Name = ?, City = ?, Province = ?, Contacts = ?, MusicalGenres = ?, MusiciansList = ?, Description = ?, TimeTable = ?, AvailableForHire = ?, AvailableLocations = ?, ProfilePicturePath = ? WHERE ProfileID = ?";
            this.db.run(sql, [group.name, group.city, group.province, group.contacts, group.musicalGenres, group.musiciansList, group.description, group.timeTable, group.availableForHire, group.availableLocations, group.profilePicturePath, profileID], function (err) {
                if (err) return reject({"error" : err});
                return resolve({"changes" : this.changes});
            });
        });
    }

    // retreive the list of all Groups in the database
    getAllGroups() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Groups";
            this.db.all(sql, function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "No Groups found"});
                return resolve(row);
            });
        });
    }

    // retrieve a Group from the database given it's ProfileID
    getGroupByID(profileID) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Groups WHERE ProfileID = ?";
            this.db.get(sql, [profileID], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `No Group with profileID (${profileID}) found`});
                return resolve(row);
            });
        });
    }

    /* ===== Announcements ===== */

    // create a new Announcement entry in the database
    insertNewAnnouncement(announcement) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Announcements (AuthorID, AuthorType, AnnouncementType, PublishDate, Title, Description, City, Province) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            this.db.run(sql, [announcement.authorID, announcement.authorType, announcement.announcementType, announcement.publishDate, announcement.title, announcement.description, announcement.city, announcement.province], function(err) {
                if (err) return reject({"error" : err});
                return resolve({"announcementID" : this.lastID});
            });
        });
    }

    // remove an Announcement from the database given it's ID
    removeAnnouncement(announcementID) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM Announcements WHERE ID = ?";
            this.db.run(sql, [announcementID], function(err) {
                if (err) return reject({"error" : err});
                return resolve({"changes" : this.changes});
            });
        });
    }

    // list all Announcements in the database
    getAllAnnouncements() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Announcements";
            this.db.all(sql, function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "No Announcement found"});
                return resolve(row);
            });
        });
    }

    // list all Announcements published by a profile
    getAllProfileAnnouncements(authorID, authorType) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Announcements WHERE AuthorID = ? AND AuthorType = ?";
            this.db.all(sql, [authorID, authorType], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "No Announcement found"});
                return resolve(row);
            });
        });
    }

    /* ===== Demos ===== */

    // insert a new Demo entry in the database
    insertNewDemo(demo) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO DemoFiles (AuthorID, AuthorType, PublishDate, Title, Description, FilePath) VALUES (?, ?, ?, ?, ?, ?)";
            this.db.run(sql, [demo.authorID, demo.authorType, demo.publishDate, demo.title, demo.description, demo.filePath], function (err) {
                if (err) return reject({"error" : err});
                return resolve({"demoID" : this.lastID});
            });
        });
    }

    // remove a Demo from the database given it's ID
    removeDemo(demoID) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM DemoFiles WHERE ID = ?";
            this.db.run(sql, [demoID], function(err) {
                if (err) return reject({"error" : err});
                return resolve({"changes" : this.changes});
            });
        });
    }

    // list all Demos given the AuthorID and the AuthorType
    getAllProfileDemos(authorID, authorType) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM DemoFiles WHERE AuthorID = ? AND AuthorType = ?";
            this.db.all(sql, [authorID, authorType], function (err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `No Demos found for profile with ID (${authorID}) of type ${authorType}`});
                return resolve(row);
            });
        });
    }
}

module.exports = ApplicationDAO;
