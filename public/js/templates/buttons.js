"use strict";

// this template creates the login button in the navbar, which toggles the login modal + form
function createLoginButton() {
    return `<button id="login-btn" type="button" class="btn btn-round-black" data-bs-toggle="modal" data-bs-target="#login-modal">Accedi</button>`;
}

// this templates creates the two buttons 'view profile' and 'logout' in the navbar (those should replace the login button)
function createProfileAndLogoutButtons() {
    return `
    <button id="view-profile" type="button" class="btn btn-round-black"> il tuo profilo </button>
    <button id="logout" type="button" class="btn btn-round-black"> esci </button>
    `;
}
