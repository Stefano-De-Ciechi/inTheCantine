"use strict";

// select the app container div and the place for the buttons in the navbar (the "dynamic parts" of the page)
const appContainer = document.querySelector('#app-container');
const navBtnToolbar = document.querySelector('#navbar-btn-toolbar');

// creating the app
const app = new App(appContainer, navBtnToolbar);
