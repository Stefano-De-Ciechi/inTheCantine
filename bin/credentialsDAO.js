"use strict";

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

class CredentialsDAO {
    constructor() {
        this.DBSOURCE = './data/loginCredentials.db';
        this.db = new sqlite.Database(this.DBSOURCE, (err) => {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log("credentials database opened correctly");
        });
    }

    // used to insert a new musician into the credentials database, to later use for authentication 
    // a musician must be in the form {"user" : 'name or email', "password" : 'clear text password'}
    insertNewMusician(musician) {
        return new Promise(async (resolve, reject) => {
            const sql = "INSERT INTO MusiciansCredentials (User, Password) VALUES (?, ?)";
            const hash = await bcrypt.hash(musician.password, 10);

            this.db.run(sql, [musician.user, hash], function(err) {
                if (err) return reject({"error" : err});
                return resolve(this.lastID);
            });
        });
    }

    // used for Authentication, checks if the touple user, password is present in the database and if the two hashes of the password correspond
    getMusicianCredentials(user, password) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM MusiciansCredentials WHERE User = ?";
            this.db.get(sql, [user], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "user not found"});

                const user = {"profileID" : row.ProfileID, "user" : row.User};
                const check = bcrypt.compareSync(password, row.Password);
                return resolve({user, check});
            });
        });
    }

    // used by passport to deserialize a previously authenticated Musician
    getMusicianCredentialsByID(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM MusiciansCredentials WHERE ProfileID = ?";
            this.db.get(sql, [id], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `no user found with ProfileID (${id})`});
                //return resolve(row);
                return resolve({"profileID" : row.ProfileID, "user" : row.User});   // the hashed password is not sent
            });
        });
    }

    // used to insert a new group into the credentials database, to later use for authentication 
    // a group must be in the form {"user" : 'name or email', "password" : 'clear text password'}
    insertNewGroup(group) {
        return new Promise(async (resolve, reject) => {
            const sql = "INSERT INTO GroupsCredentials (User, Password) VALUES (?, ?)";
            const hash = await bcrypt.hash(group.password, 10);

            this.db.run(sql, [group.user, hash], function(err) {
                if (err) return reject({"error" : err});
                return resolve(this.lastID);
            });
        });
    }

    // used for Authentication, checks if the touple user, password is present in the database and if the two hashes of the password correspond
    getGroupCredentials(user, password) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM GroupsCredentials WHERE User = ?";
            this.db.get(sql, [user], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "user not found"});
                
                const user = {"profileID" : row.ProfileID, "user" : row.User};
                const check = bcrypt.compareSync(password, row.Password);
                return resolve({user, check});
            });
        });
    }

    // used by passport to deserialize a previously authenticated Musician
    getGroupCredentialsByID(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM GroupsCredentials WHERE ProfileID = ?";
            this.db.get(sql, [id], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `no user found with ProfileID (${id})`});
                //return resolve(row);
                return resolve({"profileID" : row.ProfileID, "user" : row.User});   // the hashed password is not sent
            });
        });
    }

}

module.exports = CredentialsDAO;