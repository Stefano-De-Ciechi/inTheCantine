"use strict";

// this class is used to control all the logic in the web page
// client side rendering is used
class App {
    constructor(appContainer, navBtnToolbar) {

        this.appContainer = appContainer;
        this.navBtnToolbar = navBtnToolbar;
        this.userLoggedIn = null;   // an object containing the informations about the currently logged-in user (profileID, profile type and username); it is initialized as a user logs in
        this.userProfile = null;    // an object used as a kind of "cache memory", contains all informations of the currently logged in user

        this.homeListenersDefined = false;    // to not re-define the event listeners multiple times as this would multiply the number of requests sent for each page loaded

        // define event handlers for all the forms in the page
        this.addLoginFormEventListeners();
        this.addSignupFormEventListeners();
        this.addMusicianFormEventListers();
        this.addGroupFormEventListeners();
        this.addDemosFormEventListeners();
        this.addAnnouncementsFormEventListeners();

        /* ===== Page.js Routes ===== */

        // home page
        page('/home', () => {
            this.appContainer.innerHTML = '';
            this.showHomePage();
        });

        // page listing all musicians
        page('/musicians', () => {
            this.appContainer.innerHTML = '';
            this.showMusiciansPage();
        });

        // page listing all groups
        page('/groups', () => {
            this.appContainer.innerHTML = '';
            this.showGroupsPage();
        });

        // page listing all announcements
        page('/announcements', () => {
            this.appContainer.innerHTML = '';
            this.showAnnouncementsPage();
        });

        // page showing the profile of the currently logged in user
        page('/profile', () => {
            this.appContainer.innerHTML = '';
            this.showProfilePage();
        });

        // page showing the profile of another user (not the one who is logged in)
        page('/profiles', () => {
            this.appContainer.innerHTML = '';
            return;   // return to the calling function to continue it's execution
        });

        // other invalid urls will be redirected to the home page
        page('*', () => {
            page('/home');
        });

        // initialize Page.js
        page();
    }

    // create the home page, also adds event listeners to the three buttons to select the next page
    showHomePage() {
        this.appContainer.innerHTML = createHomePage();   // inserts the image

        if (this.homeListenersDefined == true) return;      // to not re-define the event listeners multiple times as this would multiply the number of requests sent for each page loaded

        // musicians page button
        document.getElementById('musicians-page-btn').addEventListener('click', () => {
            page('/musicians');     // redirect to the musicians page
        });

        // groups page button
        document.getElementById('groups-page-btn').addEventListener('click', () => {
            page('/groups');        // redirect to the groups page
        });

        // announcements page button
        document.getElementById('announcements-page-btn').addEventListener('click', () => {
            page('/announcements'); // rediret to the announcements page
        });

        this.homeListenersDefined = true;   // to not re-define event listeners multiple times
    }

    // when loggin-in or logging out, change the buttons appearing in the navbar
    shiwtchNavbarButtons() {
        this.navBtnToolbar.innerHTML = '';

        // if no user is logged in, show the login button
        if (this.userLoggedIn == null) {
            this.navBtnToolbar.innerHTML = createLoginButton();
            return;
        };

        // if a user is logged in, show a logout button and a link to his personal profile page
        this.navBtnToolbar.innerHTML = createProfileAndLogoutButtons();

        // add an event listener to the logout button, to correctly logout the current user and switch the navbar buttons again
        document.getElementById('logout').addEventListener('click', async (event) => {
            event.preventDefault();

            let response;

            if (this.userLoggedIn['type'] === "MUSICIAN") response = await Api.logoutMusician();
            else if (this.userLoggedIn['type'] === "GROUP") response = await Api.logoutGroup();

            this.userLoggedIn = null;
            this.userProfile = null;

            this.shiwtchNavbarButtons();

            // redirect to the home page
            page('/home');
        });

        // redirects to the profile page of the currently logged in user
        document.getElementById('view-profile').addEventListener('click', (event) => {
            event.preventDefault();

            page('/profile');
        });

    }

    // add event listeners to all the dynamic elements in the login form
    addLoginFormEventListeners() {

        const loginForm = document.querySelector('#login-form');

        // used to dynamically switch which user type is going to logging in
        const typeMusician = document.querySelector('#login-form-type-musician');
        const typeGroup = document.querySelector('#login-form-type-group');

        // used to change the active type of user loggin in
        typeMusician.addEventListener('click', event => {
            typeMusician.classList.add('form-type-selected');
            typeGroup.classList.remove('form-type-selected');
            loginForm.elements['login-form-user-type'].value = "MUSICIAN";
        });

        // used to change the active type of user loggin in
        typeGroup.addEventListener('click', event => {
            typeGroup.classList.add('form-type-selected');
            typeMusician.classList.remove('form-type-selected');
            loginForm.elements['login-form-user-type'].value = "GROUP";
        });

        // prevent default behaviour when submitting the form, and send a POST request to the correct API endpoint
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // retrieve the information stored in all the input camps
            let userType = loginForm.elements['login-form-user-type'].value;      // this one is "hidden" from the user, and contains the type (changes automatically)
            let username = loginForm.elements['login-form-username-email'].value;
            let password = loginForm.elements['login-form-password'].value;

            let response;

            // send a login request for a Musician user
            if (userType === 'MUSICIAN') {
                response = await Api.loginMusician(username, password);
            }
            // send a login request for a Group user
            else if (userType === "GROUP") {
                response = await Api.loginGroup(username, password);
            }

            if (response['error']) {

                // reads the error sent by the server
                let error = response['error'];
                let username = loginForm.elements['login-form-username-email'];
                let password = loginForm.elements['login-form-password'];

                // the error contains the field who caused it (username or password)
                // use custom boostrap form validation classes to display an error message

                if (error.field === 'username') {
                    username.classList.add('is-invalid');
                    password.classList.remove('is-invalid');
                    document.getElementById('username-validity').innerText = error.message;
                }

                if (error.field === 'password') {
                    password.classList.add('is-invalid');
                    username.classList.remove('is-invalid');
                    document.getElementById('password-validity').innerText = error.message;
                }

                return;   // blocks the login request until valid credentials are inserted
            }

            // if correctly logged in

            // initialize the oject containing the logged in user info
            this.userLoggedIn = response;

            // switch navbar buttons
            this.shiwtchNavbarButtons();

            // close the modal+form on succesfull submit
            let loginModal = document.getElementById('login-modal');
            bootstrap.Modal.getInstance(loginModal).hide();

            // reset form input
            loginForm.reset();

            // redirect to user's profile page
            page('/profile');
        });
    }

    // add event listeners to all elements in the signup form
    addSignupFormEventListeners() {

        const signupForm = document.querySelector('#signup-form');

        // hidden button used to toggle the modal for the profile creation (I wasn't able to toggle the modal using boostrap's functions)
        const modalsToggleButton = document.getElementById('modals-toggle-button');

        // used to dynamically switch which user type is going to sign-up
        const typeMusician = document.querySelector('#signup-form-type-musician');
        const typeGroup = document.querySelector('#signup-form-type-group');

        // used to switch which type of user is going to sign up
        typeMusician.addEventListener('click', event => {
            typeMusician.classList.add('form-type-selected');
            typeGroup.classList.remove('form-type-selected');
            signupForm.elements['signup-form-user-type'].value = "MUSICIAN"

            modalsToggleButton.setAttribute("data-bs-target", "#musician-modal");
        });

        typeGroup.addEventListener('click', event => {
            typeGroup.classList.add('form-type-selected');
            typeMusician.classList.remove('form-type-selected');
            signupForm.elements['signup-form-user-type'].value = "GROUP"

            modalsToggleButton.setAttribute("data-bs-target", "#group-modal");
        });

        // prevent default behaviour when submitting the form, and send a POST request to the correct API endpoint
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // retrieve the information stored in all the input camps
            let userType = signupForm.elements['signup-form-user-type'].value;      // this one is "hidden" from the user, and contains the type (changes automatically)
            let username = signupForm.elements['signup-form-username-email'].value;
            let password = signupForm.elements['signup-form-password'].value;

            let response;

            // send a signup request for a Musician user
            if (userType === 'MUSICIAN') {
                response = await Api.signupMusician(username, password);
            }
            // send a signup request for a Group user
            else if (userType === "GROUP") {
                response = await Api.signupGroup(username, password);
            }

            // if not correctly signed up show errors and stay in the modal+form
            if (response['validation errors'] || response['error']) {
                return;   // blocks the sign-up process until valid credentials are inserted
            }

            // if the account is correctly created, log-in automatically and then show the profile creation form
            let user;
            if (userType === 'MUSICIAN') user = await Api.loginMusician(username, password);
            else if (userType === 'GROUP') user = await Api.loginGroup(username, password);

            // initialize the object containing informations on the currently logged in user
            this.userLoggedIn = user;

            // switch the buttons in the navbar
            this.shiwtchNavbarButtons();

            // if signup is succesfull open a second modal to create the profile
            let signupModal = document.getElementById('signup-modal');
            bootstrap.Modal.getInstance(signupModal).hide();

            // used to open the modal with the profile registration form
            modalsToggleButton.click();
        });
    }

    // add event listeners to all the elements of the musician profile creation (or update) form
    async addMusicianFormEventListers() {
        const musicianForm = document.querySelector('#musician-form');

        musicianForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formElements = musicianForm.elements;
            // save in an object all informations retrieved from the form
            let musician = {};

            // use the profileID received when logged in / authenticated
            musician.profileID = this.userLoggedIn.profileID;

            musician.name = formElements['musician-name'].value;
            musician.surname = formElements['musician-surname'].value;
            musician.age = formElements['musician-age'].value;
            musician.city = formElements['musician-city'].value;
            musician.province = formElements['musician-province'].value;
            musician.contacts = formElements['musician-contacts'].value;
            musician.musicalTastes = formElements['musician-musical-tastes'].value;
            musician.instruments = formElements['musician-instruments'].value;
            musician.description = formElements['musician-description'].value;
            musician.availableForHire = (formElements['musician-available-for-hire'].checked)? "true" : "false";
            musician.availableLocations = formElements['musician-available-locations'].value;

            // the image will be sent as a separate object (see the Api wrapper to understand why)
            let image = formElements['musician-profile-picture'].files[0];

            // if this is the form to modify a profile, this.userProfile should not be null, so the previous value of profilePicturePath can be used to maintain that image if no new image is given
            if (this.userProfile != null) musician.profilePicturePath = this.userProfile.ProfilePicturePath;

            let response;

            // a custom attribute maintained in the html form tag used to specify if the form is being used to create (post) a new musician or to modify (put) an existing one
            const requestType = musicianForm.getAttribute('request-type');

            if (requestType === 'post') response = await Api.createMusicianProfile(musician, image);
            else if (requestType === 'put') response = await Api.modifyMusicianProfile(musician, image);

            // if invalid informations are passed, remain in the modal+form
            if (response['validation errors'] || response['error'] || response['message']) {
                return;   // blocks the profile creation process until valid values are given
            }

            // if profile creation is succesfull

            // close the modal+form
            let musicianModal = document.getElementById('musician-modal');
            bootstrap.Modal.getInstance(musicianModal).hide();

            // reset elements that could have been changed by the modify profile function
            let formTitle = document.getElementById('musician-profile-creation-title');
            formTitle.innerText = "Creazione profilo Musicista";

            let submitButton = document.getElementById('musician-profile-submit');
            submitButton.innerText = "Registrami";

            musicianForm.setAttribute('request-type', 'post');

            // reset form inputs
            musicianForm.reset();

            // rediret to the profile page created (if modified, this is used to reload and display changes)
            page('/profile');
        });
    }

    // add event listeners to all the elements of the group profile creation (or update) form
    async addGroupFormEventListeners() {
        const groupForm = document.querySelector('#group-form');

        groupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formElements = groupForm.elements;
            // save in an object all informations retrieved from the form
            let group = {};

            // use the profileID received when logged in / authenticated
            group.profileID = this.userLoggedIn.profileID;

            group.name = formElements['group-name'].value;
            group.city = formElements['group-city'].value;
            group.province = formElements['group-province'].value;
            group.contacts = formElements['group-contacts'].value;
            group.musicalGenres = formElements['group-musical-genres'].value;
            group.musiciansList = formElements['group-components'].value;
            group.description = formElements['group-description'].value;
            group.timeTable = formElements['group-time-table'].value;
            group.availableForHire = (formElements['group-available-for-hire'].checked)? "true" : "false";
            group.availableLocations = formElements['group-available-locations'].value;

            // the image will be sent as a separate object (see the Api wrapper to understand why)
            let image = formElements['group-profile-picture'].files[0];

            // if this is the form to modify a profile, this.userProfile should be not null, so the previous value of profilePicturePath can be read and used to maintain that image if no new image is given
            if (this.userProfile != null) group.profilePicturePath = this.userProfile.ProfilePicturePath;

            let response;

            // a custom attribute maintained in the html form tag used to specify if the form is being used to create (post) a new musician or to modify (put) an existing one
            const requestType = groupForm.getAttribute('request-type');

            if (requestType === 'post') response = await Api.createGroupProfile(group, image);
            else if (requestType === 'put') response = await Api.modifyGroupProfile(group, image);

            // if invalid informations are passed, remain in the modal+form
            if (response['validation errors'] || response['error'] || response['message']) {
                return;   // blocks the profile creation process until valid values are given
            }

            // if profile creation is succesfull

            // close the modal+form
            let groupModal = document.getElementById('group-modal');
            bootstrap.Modal.getInstance(groupModal).hide();

            // reset elements that could have been changed by the modify profile function
            let formTitle = document.getElementById('group-profile-creation-title');
            formTitle.innerText = "Creazione profilo Gruppo";

            let submitButton = document.getElementById('group-profile-submit');
            submitButton.innerText = "Registrami";
            groupForm.setAttribute('request-type', 'post');

            // reset form inputs
            groupForm.reset();

            // rediret to the profile page created (if modified, this is used to reload and display changes)
            page('/profile');
        });
    }

    // add event listeners to all the elements of the demo upload form
    async addDemosFormEventListeners() {
        const demosForm = document.querySelector('#demos-form');

        demosForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formElements = demosForm.elements;
            // save in an object all informations retrieved from the form
            let demo = {};

            // use the profileID and type received when logged in / authenticated
            demo.authorID = this.userLoggedIn.profileID;
            demo.authotType = this.userLoggedIn.type;

            demo.title = formElements['demo-title'].value;
            demo.description = formElements['demo-description'].value;

            // the audio will be sent as a separate object (see the Api wrapper to understand why)
            let audio = formElements['demo-file-path'].files[0];

            // insert a new row in the database
            let response = await Api.uploadNewDemo(demo, audio);
            if (response['error']) {
                return;   // block the upload operation until valid informations and file are given
            }

            // close the modal+form
            let demosModal = document.getElementById('demos-modal');
            bootstrap.Modal.getInstance(demosModal).hide();

            // reset form inputs
            demosForm.reset();

            // redirect to profile page to update the content
            page('/profile');
        });
    }

    // add event listeners to all the elements of the announcement upload form
    async addAnnouncementsFormEventListeners() {
        const announcementsForm = document.querySelector('#announcements-form');

        announcementsForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formElements = announcementsForm.elements;
            // save in an object all informations retrieved from the form
            let announcement = {};

            // use the profileID and type received when logged in / authenticated
            announcement.authorID = this.userLoggedIn.profileID;
            announcement.authotType = this.userLoggedIn.type;

            announcement.announcementType = formElements['announcement-type'].value;
            announcement.title = formElements['announcement-title'].value;
            announcement.description = formElements['announcement-description'].value;
            announcement.city = formElements['announcement-city'].value;
            announcement.province = formElements['announcement-province'].value;

            // insert a new row in the database
            let response = await Api.publishNewAnnouncement(announcement);
            if (response['error']) {
                return;   // block the upload operation until valid informations are given
            }

            // close the modal+form
            let announcementsModal = document.getElementById('announcements-modal');
            bootstrap.Modal.getInstance(announcementsModal).hide();

            // reset form inputs
            announcementsForm.reset();

            // redirect tho the profile page to update the page content
            page('/profile');
        });
    }

    // create the musicians page by injecting the template in the app container and by adding all event listeners
    async showMusiciansPage() {

        this.appContainer.innerHTML = createMusiciansPage();
        const musiciansList = document.getElementById("musicians-list");

        // retreive all musicians from the server's database
        let musicians = await Api.getAllMusicians();

        if (musicians.length == 0) {
          musiciansList.innerHTML = "Non ci sono musicisti disponibili";
        }

        // if a Musician user is logged-in, his profile will be hidden from the musicians list
        if (this.userLoggedIn != null && this.userLoggedIn['type'] === "MUSICIAN") {
            for (let i = 0; i < musicians.length; i++) {
                if (musicians[i].ProfileID == this.userLoggedIn['profileID']) {
                    musicians.splice(i, 1);   // removes it from the array
                    break;
                }
            }
        }

        // calls a custom function to generate and insert in the grid layout all musicians' profile cards
        this.showProfileCards(musicians, musiciansList, createMusicianCard);

        const filters = document.forms["musicians-page-filters"];

        // add event listeners to the filter form used to search data
        filters.addEventListener('submit', async (event) => {
            event.preventDefault();

            const city = filters.elements['city-filter'].value;
            const province = filters.elements['province-filter'].value;
            const musicalTastes = filters.elements['musical-tastes-filter'].value;
            const instruments = filters.elements['instruments-filter'].value;
            const availableForHire = filters.elements['available-for-hire-filter'].checked;

            // use a filtering query based on values received from the form to filter data (filtering is done server-side)
            let filteredMusicians = await Api.getAllMusicians(`City=${city}&Province=${province}&MusicalTastes=${musicalTastes}&Instruments=${instruments}${availableForHire ? "&AvailableForHire=true" : ""}`);
            filteredMusicians = filteredMusicians;

            if (filteredMusicians.length == 0) {
                musiciansList.innerHTML = "Nessun musicista trovato con i filtri attualmente selezionati";
                return;
            }

            // reset page's content
            musiciansList.innerHTML = "";

            // calls a custom function to generate and insert in the grid layout all musicians's profile cards
            this.showProfileCards(filteredMusicians, musiciansList, createMusicianCard);
        });
    }

    // create the groups page by injecting the template in the app container and by adding all event listeners
    async showGroupsPage() {

        this.appContainer.innerHTML = createGroupsPage();
        const groupsList = document.getElementById("groups-list");

        // retreive all groups from the server's database
        let groups = await Api.getAllGroups();

        if (groups.length == 0) {
          groupsList.innerHTML = "Non ci sono gruppi disponibili";
        }

        // if a Group user is logged-in, his profile will be hidden from the groups list
        if (this.userLoggedIn != null && this.userLoggedIn['type'] === "GROUP") {
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].ProfileID == this.userLoggedIn['profileID']) {
                    groups.splice(i, 1);    // remove the group from the array
                    break;
                }
            }
        }

        // calls a custom function to generate and insert in the grid layout all groups' profile cards
        this.showProfileCards(groups, groupsList, createGroupCard);

        const filters = document.forms["groups-page-filters"];

        // add event listeners to the filter form used to search data
        filters.addEventListener('submit', async (event) => {
            event.preventDefault();

            const city = filters.elements['city-filter'].value;
            const province = filters.elements['province-filter'].value;
            const musicalGenres = filters.elements['musical-genres-filter'].value;
            const availableForHire = filters.elements['available-for-hire-filter'].checked;

            // use a filtering query based on values received from the form to filter data (filtering is done server-side)
            let filteredGroups = await Api.getAllGroups(`City=${city}&Province=${province}&MusicalGenres=${musicalGenres}${availableForHire ? "&AvailableForHire=true" : ""}`);
            filteredGroups = filteredGroups;

            if (filteredGroups.length == 0) {
                groupsList.innerHTML = "Nessun gruppo trovato con i filtri attualmente selezionati";
                return;
            }

            // reset page's content
            groupsList.innerHTML = "";

            // calls a custom function to generate and insert in the grid layout all groups' profile cards
            this.showProfileCards(filteredGroups, groupsList, createGroupCard);
        });
    }

    // create the announcements page by injecting the template in the app container and by adding all event listeners
    async showAnnouncementsPage() {

        this.appContainer.innerHTML = createAnnouncementsPage();
        const announcementsList = document.getElementById("announcements-list");

        // retreive all announcements from the server's database
        let announcements = await Api.getAllAnnouncements();

        if (announcements.length == 0) {
          announcementsList.innerHTML = "Non ci sono annunci disponibili";
        }

        // if a user is logged-in, all of his announcements will be hidden from the announcements list
        if (this.userLoggedIn != null) {
            for (let i = announcements.length - 1; i >= 0; i--) {
                // the array is visited in reverse, since it is safer to do so when removing elements
                if (announcements[i].AuthorID == this.userLoggedIn['profileID'] && announcements[i].AuthorType == this.userLoggedIn['type']) {
                    announcements.splice(i, 1);   // remove the announcement from the array
                }
            }
        }

        // calls a custom function to generate and insert in the grid layout all announcements cards
        this.showProfileCards(announcements, announcementsList, createAnnouncementCard, 1, "col-class-12");

        const filters = document.forms["announcements-page-filters"];

        // add event listeners to the filter form used to search data
        filters.addEventListener('submit', async (event) => {
            event.preventDefault();

            const filtersElements = filters.elements;

            const city = filtersElements['city-filter'].value;
            const province = filtersElements['province-filter'].value;
            let type = filtersElements['type-filter'].value;

            if (type === "default") type = "";      // do not apply filters on the type as none was selected

            // use a filtering query based on values received from the form to filter data (filtering is done server-side)
            let filteredAnnouncements = await Api.getAllAnnouncements(`City=${city}&Province=${province}&AnnouncementType=${type}`);
            if (filteredAnnouncements.length == 0) {
                announcementsList.innerHTML = "Nessun annuncio trovato con i filtri attualmente selezionati";
                return;
            }

            // reset page's content
            announcementsList.innerHTML = "";

            // calls a custom function to generate and insert in the grid layout all announcements cards
            this.showProfileCards(filteredAnnouncements, announcementsList, createAnnouncementCard, 1, "col-class-12");
        });
    }

    // custom function to generate a grid layout and insert all cards (of announcements or users / groups profiles)
    showProfileCards(users, listContainer, createProfileCard, colsNum, colClass) {

        const numCols = colsNum || 2;      // 2 columns per row is the default value
        const numRows = Math.ceil(users.length / numCols);     // numCols is also the number of profile cards per row

        // create an array of divs (the rows of the grid system)
        let rows = [];
        for (let i = 0; i < numRows; i++) {
            rows[i] = document.createElement('div');
            rows[i].classList = "row list-row";
        }

        let count = 0;
        let rowsIndex = 0;

        for (let user of users) {
            // create the musician profile card
            let profileCard = createProfileCard(user);

            // create a column from the grid system
            let col = document.createElement('div');
            col.classList = colClass || "col-md-5";

            col.innerHTML = profileCard;

            let btn = col.getElementsByClassName('btn')[0];
            btn.addEventListener('click', event => {
                event.preventDefault();
                let profileID = btn.getAttribute('profileid');
                let profileType = btn.getAttribute('profiletype')
                this.showProfile(profileID, profileType);
            });

            // append the columns to the current row
            rows[rowsIndex].appendChild(col);

            // if reached the end of the columns per row
            if (count % numCols == numCols - 1) {
                // insert the row (with his columns) into the grid
                listContainer.appendChild(rows[rowsIndex]);

                rowsIndex += 1;

                if (rowsIndex > rows.length) return;
            }

            // if the number of cards is odd, the last row doesn't have the full number of columns
            else if (count == users.length - 1) {
                listContainer.appendChild(rows[rowsIndex]);
                return;
            }

            // increase the count of inserted profiles
            count += 1;
        }
    }

    // this function is called when pressing on the view profile button in some user card (display the profile page of another user)
    async showProfile(profileID, type) {
        // used to change the current url (and make the history api work as intended)
        page('/profiles');

        // retrieve the profile of the right user and insert the right page template
        if (type === "MUSICIAN") {
            let musician = await Api.getMusicianByID(profileID);
            this.appContainer.innerHTML = createMusicianProfilePage(musician, false);
        }
        else if (type === "GROUP") {
            let group = await Api.getGroupByID(profileID);
            this.appContainer.innerHTML = createGroupProfilePage(group, false);
        }

        // create and fill the demos tab
        this.createProfileDemosTab(profileID, type, false);

        // create and fill the announcements tab
        this.createProfileAnnouncementsTab(profileID, type, false);
    }

    // this function is called when a logged in user clicks on the 'view profile' button in the navbar
    async showProfilePage() {

        // retrieve the profile of the right user and insert the right page template
        if (this.userLoggedIn['type'] === "MUSICIAN") {
            let musician = await Api.getMusicianByID(this.userLoggedIn['profileID']);
            this.appContainer.innerHTML = createMusicianProfilePage(musician, true);
            this.userProfile = musician;
        }
        else if (this.userLoggedIn["type"] === "GROUP") {
            let group = await Api.getGroupByID(this.userLoggedIn['profileID']);
            this.appContainer.innerHTML = createGroupProfilePage(group, true);
            this.userProfile = group;
        }

        // insert event listener for the 'modify profile' button
        const modifyProfileButton = document.getElementById('modify-profile-button');
        modifyProfileButton.addEventListener('click', async (event) => {
            event.preventDefault();

            if (this.userLoggedIn['type'] === "MUSICIAN") {
                // calls a custom function to automatically fill the form with current informations
                this.modifyMusicianProfile();
                return;
            } else if (this.userLoggedIn['type'] === "GROUP") {
                // calls a custom function to automatically fill the form with current informations
                this.modifyGroupProfile();
                return;
            }
        });

        // create and fill the demos tab
        this.createProfileDemosTab(this.userLoggedIn['profileID'], this.userLoggedIn['type'], true);

        // create and fill the announcements tab
        this.createProfileAnnouncementsTab(this.userLoggedIn['profileID'], this.userLoggedIn['type'], true);
    }

    // function to automatically fill the musician profile form with current informations
    async modifyMusicianProfile() {

        // use the 'cache' object stored in memory that contains all informations on the currently logged in musician
        let musician = this.userProfile;

        // use the hidden button to toggle the modal+form
        const modalsToggleButton = document.getElementById('modals-toggle-button');
        modalsToggleButton.setAttribute('data-bs-target', '#musician-modal');
        modalsToggleButton.click();

        const musicianForm = document.forms['musician-form'];
        const formElements = musicianForm.elements;

        // set form elements and attributes to match the "modify existing profile" state
        let formTitle = document.getElementById('musician-profile-creation-title');
        formTitle.innerText = "Modifica profilo Musicista";

        let submitButton = document.getElementById('musician-profile-submit');
        submitButton.innerText = "Applica Modifiche";

        musicianForm.setAttribute('request-type', 'put');

        // pre-compile the form with the current informations
        formElements['musician-name'].value = musician.Name;
        formElements['musician-surname'].value = musician.Surname;
        formElements['musician-age'].value = musician.Age;
        formElements['musician-city'].value = musician.City;
        formElements['musician-province'].value = musician.Province;
        formElements['musician-contacts'].value = musician.Contacts;
        formElements['musician-musical-tastes'].value = musician.MusicalTastes;
        formElements['musician-instruments'].value = musician.Instruments;
        formElements['musician-description'].value = musician.Description;
        formElements['musician-available-for-hire'].checked = (musician.AvailableForHire === "true") ? true : false;
        formElements['musician-available-locations'].value = musician.AvailableLocations;

        // image is not touched as the previous one is going to be used if no other one is inserted

        // the rest of the modify operation is handled by the same handler used for profile creation (see the addMusicianFormEventListers function)
    }

    // function to automatically fill the musician profile form with current informations
    async modifyGroupProfile() {

        // use the 'cache' object stored in memory that contains all informations on the currently logged in group
        let group = this.userProfile;

        // use the hidden button to toggle the modal+form
        const modalsToggleButton = document.getElementById('modals-toggle-button');
        modalsToggleButton.setAttribute('data-bs-target', '#group-modal');
        modalsToggleButton.click();

        const musicianForm = document.forms['group-form'];
        const formElements = musicianForm.elements;

        // set form elements and attributes to match the "modify existing profile" state
        let formTitle = document.getElementById('group-profile-creation-title');
        formTitle.innerText = "Modifica profilo Gruppo";

        let submitButton = document.getElementById('group-profile-submit');
        submitButton.innerText = "Applica Modifiche";

        musicianForm.setAttribute('request-type', 'put');

        // pre-compile the form with the current informations
        formElements['group-name'].value = group.Name;
        formElements['group-city'].value = group.City;
        formElements['group-province'].value = group.Province;
        formElements['group-contacts'].value = group.Contacts;
        formElements['group-musical-genres'].value = group.MusicalGenres;
        formElements['group-components'].value = group.MusiciansList;
        formElements['group-description'].value = group.Description;
        formElements['group-time-table'].value = group.TimeTable;
        formElements['group-available-for-hire'].checked = (group.AvailableForHire === "true") ? true : false;
        formElements['group-available-locations'].value = group.AvailableLocations;

        // image is not touched as the previous one is going to be used if no other one is inserted

        // the rest of the modify operation is handled by the same handler used for profile creation (see the addMusicianFormEventListers function)

    }

    // create and fill the demos tab in a user profile
    // isLoggedIn is used as a flag to either show or not buttons to add and delete a demo
    async createProfileDemosTab(userID, userType, isLoggedIn) {
        let demosTab = document.getElementById('profile-demos-tab-pane');

        // retreive all demos uploaded by a user
        let demos = await Api.getUserDemos(userID, userType);
        if (demos.length == 0) {
            demosTab.innerText = "Nessuna demo musicale caricata\n\n";
        }

        // if the user is logged in, show the button to add a new demo
        if (isLoggedIn && this.userLoggedIn != null && userID == this.userLoggedIn['profileID'] && userType == this.userLoggedIn['type']) {

            // create the button and his event listener to show a modal+form
            let addDemo = document.createElement('button');
            addDemo.classList = "btn btn-round-black";
            addDemo.id = "profile-add-demo";
            addDemo.innerText = "Carica una nuova demo";

            addDemo.addEventListener('click', async (event) => {
                event.preventDefault();

                // use the hidden button to toggle the demos modal+form
                const toggleModal = document.getElementById('modals-toggle-button');
                toggleModal.setAttribute("data-bs-target", "#demos-modal");
                toggleModal.click();
            });

            // append the button to the demos tab, above all other demos (if there is any)
            demosTab.appendChild(addDemo);
        }

        // for each demo retrieved from the database create a new card and append it in the grid system
        for (let demo of demos) {
            let row = document.createElement('div');
            row.classList = "row"
            // isLoggedIn is used to display or not the delete button
            row.innerHTML = createDemoCard(demo, isLoggedIn);

            // for each demo, if the delete button was created, add the event listener
            let btn = row.querySelector('.btn');
            if (btn != null) {
                btn.addEventListener('click', async (event) => {
                  // a custom attribute set when creating the demo card
                    let demoID = btn.getAttribute('demoid');
                    // remove the demo row from the database
                    await Api.deleteDemo(demoID);
                    // redirect to the profile page to update the list of demos
                    page('/profile');
                });
            }

            // add the new demo to the page
            demosTab.appendChild(row);
        }
    }

    // create and fill the announcements tab in a user profile
    // isLoggedIn is used as a flag to either show or not buttons to add and delete an announcement
    async createProfileAnnouncementsTab(userID, userType, isLoggedIn) {
        let announcementsTab = document.getElementById('profile-announcements-tab-pane');

        // retrieve all announcements published by a user using a filtered query
        let announcements = await Api.getAllAnnouncements(`authorID=${userID}&authorType=${userType}`);

        if (announcements.length == 0) {
            announcementsTab.innerText = "Nessun annuncio pubblicato\n\n";
        }

        // if the user is logged in, show the button to publish a new announcement
        if (isLoggedIn && this.userLoggedIn != null && userID == this.userLoggedIn['profileID'] && userType == this.userLoggedIn['type']) {

            // create the button and his event listener to show a modal+form
            let addAnnouncement = document.createElement('button');
            addAnnouncement.classList = "btn btn-round-black";
            addAnnouncement.id = "profile-add-demo";
            addAnnouncement.innerText = "Pubblica un nuovo annuncio";

            addAnnouncement.addEventListener('click', async (event) => {
                event.preventDefault();

                // dinamically change announcement type options based on the type of the user who's creating the announcement
                const announcementTypeOptions = document.getElementById('announcement-type');

                // dinamically change the announcement options available for the current type of logged in user
                if (userType === 'MUSICIAN') {
                    // reset previous options
                    announcementTypeOptions.innerHTML = '';

                    // create new options + values
                    let opt0 = new Option("Evento", "EVENT");
                    let opt1 = new Option("Musicista cerca altri Musicisti", "M_SEARCH_M");
                    let opt2 = new Option("Creazione di un Gruppo", "G_CREATION");

                    // insert new options in the select element
                    announcementTypeOptions.add(opt0);
                    announcementTypeOptions.add(opt1);
                    announcementTypeOptions.add(opt2);
                }
                else if (userType === 'GROUP') {
                    announcementTypeOptions.innerHTML = '';

                    let opt0 = new Option("Evento", "EVENT");
                    let opt1 = new Option("Gruppo cerca nuovi membri", "G_SEARCH_M");

                    announcementTypeOptions.add(opt0);
                    announcementTypeOptions.add(opt1);
                }

                // use the hidden button to close the modal+form
                const toggleModal = document.getElementById('modals-toggle-button');
                toggleModal.setAttribute("data-bs-target", "#announcements-modal");
                toggleModal.click();
            });

            // append the button to the announcement tab, above all other announcements (if there is any)
            announcementsTab.appendChild(addAnnouncement);
        }

        // for each announcement retrieved from the database create a new card and append it in the grid system
        for (let announcement of announcements) {
            let row = document.createElement('div');
            row.classList = "row";
            // isLoggedIn is used to display or not the delete button
            row.innerHTML = createAnnouncementCard(announcement, isLoggedIn);

            // for each announcement, if the delete button was created, add the event listener
            const btn = row.querySelector('.btn');
            if (btn != null) {
                btn.innerText = "Cancella annuncio";

                btn.addEventListener('click', async (event) => {
                    // a custom attribute set when creating the announcement card
                    let announcementID = btn.getAttribute('announcementid');
                    // remove the announcement row from the database
                    await Api.deleteAnnouncement(announcementID);

                    // redirect to the profile page to update the list of announcements
                    page('/profile');
                });
            }

            // add the new announcement to the page
            announcementsTab.appendChild(row);
        }
    }
}
