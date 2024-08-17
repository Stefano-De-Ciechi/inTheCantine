
-- Credenziali Utente

CREATE TABLE "MusiciansCredentials" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"User"	INTEGER NOT NULL UNIQUE,
	"Password"	INTEGER NOT NULL,
	PRIMARY KEY("ProfileID" AUTOINCREMENT)
);

CREATE TABLE "GroupsCredentials" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"User"	TEXT NOT NULL UNIQUE,
	"Password"	INTEGER NOT NULL,
	PRIMARY KEY("ProfileID" AUTOINCREMENT)
);

-- Dati dell'applicazione

CREATE TABLE "Musicians" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"Surname"	TEXT NOT NULL,
	"Age"	INTEGER NOT NULL,
	"City"	TEXT NOT NULL,
	"Province"	TEXT NOT NULL,
	"Contacts"	TEXT NOT NULL,
	"MusicalTastes"	TEXT NOT NULL,
	"Instruments"	TEXT NOT NULL,
	"Description"	TEXT DEFAULT null,
	"AvailableForHire"	NUMERIC DEFAULT 'no',
	"AvailableLocations"	TEXT DEFAULT null,
	"ProfilePicturePath"	TEXT DEFAULT null UNIQUE,
	PRIMARY KEY("ProfileID" AUTOINCREMENT),
	FOREIGN KEY (ProfileID) REFERENCES MusiciansCredentials(ProfileID)
);

CREATE TABLE "Groups" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"City"	TEXT NOT NULL,
	"Province"	TEXT NOT NULL,
	"Contacts"	TEXT NOT NULL,
	"MusicalGenres"	TEXT NOT NULL,
	"MusiciansList"	TEXT,
	"Description"	TEXT DEFAULT null,
	"TimeTable"	TEXT DEFAULT null,
	"AvailableForHire"	TEXT DEFAULT 'no',
	"AvailableLocations"	TEXT DEFAULT null,
	"ProfilePicturePath"	INTEGER DEFAULT null UNIQUE,
	PRIMARY KEY("ProfileID" AUTOINCREMENT),
	FOREIGN KEY (ProfileID) REFERENCES GroupsCredentials (ProfileID)
);

CREATE TABLE "Announcements" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"AuthorID"	INTEGER NOT NULL,
	"AuthorType"	TEXT NOT NULL,
	"AnnouncementType"	TEXT NOT NULL,
	"PublishDate"	TEXT NOT NULL,
	"Title"	TEXT NOT NULL,
	"Description"	TEXT,
	"City"	TEXT NOT NULL,
	"Province"	TEXT NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
);

CREATE TABLE "DemoFiles" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"AuthorID"	INTEGER NOT NULL,
	"AuthorType"	TEXT NOT NULL,
	"PublishDate"	TEXT NOT NULL,
	"Title"	TEXT NOT NULL,
	"Description"	TEXT,
	"FilePath"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("ID" AUTOINCREMENT)
);
