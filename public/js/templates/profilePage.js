"use strict";

// this template creates a Musician profile page, displaying three different tabs (description, demos and announcements) and the profile card preview
// loggedIn is used as a flag to show or not the button 'modify profile' (that should be showed only when a logged in musician is viewing his own profile)
function createMusicianProfilePage(musician, loggedIn) {
    return `
    <div id="profile-page" class="container-fluid">
        <div id="profile-page-body" class="row">
            <div id="profile-info" class="col-md-3 no-padding">
                <div class="card">
                    <img src=${musician.ProfilePicturePath} class="card-img-top" alt="">
                    <div class="card-body">
                    <h5 class="card-title">${musician.Name} ${musician.Surname}</h5>
                    <p class="card-text">
                        <span class="form-label">Età:</span> ${musician.Age} anni
                        <br>
                        <span class="form-label">Vive a:</span> ${musician.City} (${musician.Province})
                        <br>
                        <span class="form-label">Gusti musicali:</span> ${musician.MusicalTastes}
                        <br>
                        <span class="form-label">Strumenti:</span> ${musician.Instruments}
                    </p>
                    ${loggedIn? '<button id="modify-profile-button" class="btn btn-round-black">modifica profilo</button>' : ''}
                    </div>
                </div>
            </div>

            <div id="profile-tabs" class="col-md-8 container-fluid">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active form-label" id="profile-informations-tab" data-bs-toggle="tab" data-bs-target="#profile-informations-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Informazioni</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link form-label" id="profile-demos-tab" data-bs-toggle="tab" data-bs-target="#profile-demos-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Demo Musicali</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link form-label" id="profile-announcements-tab" data-bs-toggle="tab" data-bs-target="#profile-announcements-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Annunci</button>
                    </li>
                </ul>
                <div class="tab-content" id="profile-tabs-content">
                    <div class="tab-pane fade show active" id="profile-informations-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div class="row">
                            <label class="form-label no-padding">Descrizione:</label> ${musician.Description}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Contatti:</label> ${musician.Contacts}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Posti per suonare:</label> ${musician.AvailableLocations === '' ? "nessuno" : musician.AvailableLocations}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Disponibilità per Ingaggio:</label> ${musician.AvailableForHire == 'true' ? "SI'" : "NO"}
                        </div>
                    </div>

                    <div class="tab-pane fade" id="profile-demos-tab-pane" role="tabpanel" aria-labelledby="profile-demos-tab-pane" tabindex="0">

                    </div>

                    <div class="tab-pane fade" id="profile-announcements-tab-pane" role="tabpanel" aria-labelledby="profile-announceents-tab-pane" tabindex="0">

                    </div>
                </div>

            </div>
        </div>
    </div>
    `;
}
// this template creates a Group profile page
// loggedIn is used as a flag to show or not the button 'modify profile' (that should be showed only when a logged in group is viewing his own profile)
function createGroupProfilePage(group, loggedIn) {
    return `
    <div id="profile-page" class="container-fluid">
        <div id="profile-page-body" class="row">
            <div id="profile-info" class="col-md-3 no-padding">
                <div class="card">
                    <img src=${group.ProfilePicturePath} class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title">${group.Name}</h5>
                        <p class="card-text">
                            <span class="form-label">Zona:</span> ${group.City} (${group.Province})
                            <br>
                            <span class="form-label">Generi musicali:</span> ${group.MusicalGenres}
                        </p>
                        ${loggedIn? '<button id="modify-profile-button" class="btn btn-round-black">modifica profilo</button>' : ''}
                    </div>
                </div>
            </div>

            <div id="profile-tabs" class="col-md-8 container-fluid">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active form-label" id="profile-informations-tab" data-bs-toggle="tab" data-bs-target="#profile-informations-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Informazioni</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link form-label" id="profile-demos-tab" data-bs-toggle="tab" data-bs-target="#profile-demos-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Demo Musicali</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link form-label" id="profile-announcements-tab" data-bs-toggle="tab" data-bs-target="#profile-announcements-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Annunci</button>
                    </li>
                </ul>
                <div class="tab-content" id="profile-tabs-content">
                    <div class="tab-pane fade show active" id="profile-informations-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div class="row">
                            <label class="form-label no-padding">Descrizione:</label> ${group.Description === '' ? "nessuna" : group.Description}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Componenti del Gruppo:</label> ${group.MusiciansList}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Tabella Oraria:</label> ${group.TimeTable === '' ? "nessuna" : group.TimeTable}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Contatti:</label> ${group.Contacts}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Posti per suonare:</label> ${group.AvailableLocations === '' ? "nessuno" : group.AvailableLocations}
                        </div>
                        <br>
                        <div class="row">
                            <label class="form-label no-padding">Disponibilità per Ingaggio:</label> ${group.AvailableForHire == 'true' ? "SI'" : "NO"}
                        </div>
                    </div>
                    <div class="tab-pane fade" id="profile-demos-tab-pane" role="tabpanel" aria-labelledby="profile-demos-tab-pane" tabindex="0">
                    </div>
                    <div class="tab-pane fade" id="profile-announcements-tab-pane" role="tabpanel" aria-labelledby="profile-announcements-tab-pane" tabindex="0">
                    </div>
                </div>

            </div>
        </div>
    </div>
    `;
}

// this template creates a demo file card used to display all informations stored in a demo object (including an audio player)
function createDemoCard(demo, loggedIn) {
    return `
    <div class="card">
        <div class="card-body">
        <div class="row">
            <div class="col-md-8">
                <h5 class="card-title">${demo.Title}</h5>
            </div>
            <!--
            <div class="col-md-4">
                Data di pubblicazione: ${demo.PublishDate}
            </div>
            -->
        </div>
        <div class="card-text">
            <div class="row">
                ${demo.Description != null ? `<div class="col-md-12">Descrizione: ${demo.Description}</div>` : ''}
                <div class="col-md-12">Data di pubblicazione: ${demo.PublishDate}</div>
            </div>
            <br>
            <div class="row">
                <audio controls>
                    <source src=${demo.FilePath} type="audio/mpeg">
                </audio>
            </div>
            <br>
            ${loggedIn == false ? '' : `
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-round-black" } demoID=${demo.ID}>rimuovi demo</button>
                    </div>
                </div>
            `}
        </div>
    </div>
    `;
}
