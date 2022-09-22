"use strict";

// this template creates the announcements page adding all the filters and creating the div where all the cards will be inserted
function createAnnouncementsPage() {
    return `
    <div id="announcements-page" class="container-fluid">
        <div id="home-page-body" class="row">
            <div id="announcements-filters" class="col-md-4 no-padding">
                <div class="container-fluid no-padding">
                    Filtra per: <br>
                    <form id="announcements-page-filters" name="announcements-page-filters class="row g-3">
                        <div class="col-md-8">
                            <label for="city-filter" class="form-label">Città:</label>
                            <input type="text" class="form-control" id="city-filter">
                        </div>
                        <div class="col-md-8">
                            <label for="province-filter" class="form-label">Provincia:</label>
                            <input type="text" class="form-control" id="province-filter">
                        </div>
                        <div class="col-md-8">
                            <br>
                            <select id="type-filter" class="form-control form-select form-select-sm form-label" aria-label=".form-select-sm example">
                                <option value="default" selected>Tipo di annuncio</option>
                                <option value="EVENT">Evento</option>
                                <option value="G_SEARCH_M">Gruppo cerca membri</option>
                                <option value="M_SEARCH_M">Musicista cerca altri Musicisti</option>
                                <option value="G_CREATION">Creazione di un Gruppo</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-round-black">filtra </button>
                    </form>
                </div>
            </div>
            <div id="announcements-list" class="col-md-8 container-fluid">

            </div>
        </div>
    </div>
    `;
}

// this template creates an announcement card used to display all informations stored in an announcement object
// showButton is used as a flag, to show or not the button that links to the announcement author's profile
function createAnnouncementCard(announcement, showButton) {
    if (showButton === undefined) showButton = true;
    return `
    <div class="card">
        <div class="card-body">
        <div class="row">
            <div class="col-md-8">
                <h5 class="card-title"> ${announcement.Title.toUpperCase()}</h5>
            </div>
            <div class="col-md-4">
                Dove: ${announcement.City} (${announcement.Province})
            </div>
        </div>
        <p class="card-text">
            <div class="row">
                <!--
                <div cass="col-md-12">
                    Autore: ${announcement.AuthorID} (${announcement.AuthorType})
                </div>
                -->
                ${announcement.Description != null ? `<div class="col-md-12">${announcement.Description}</div>` : ''}
                <div class="col-md-12">
                    Pubblicato il ${announcement.PublishDate}
                </div>
            </div>
        </p>
        ${showButton == false ? '' : `
            <div class="row">
                <div class="col-12">
                    <button class="btn btn-round-black" announcementID=${announcement.ID} profileID=${announcement.AuthorID} profileType=${announcement.AuthorType}>profilo autore</button>
                </div>
            </div>
        `}
    </div>
    `;
}
