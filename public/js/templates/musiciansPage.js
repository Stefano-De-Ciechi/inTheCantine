"use strict";

// this template creates the musicians page adding all the filters and creating the div where all the cards will be inserted
function createMusiciansPage() {
    return `
    <div id="musicians-page" class="container-fluid">
        <div id="home-page-body" class="row">
            <div id="musicians-filters" class="col-md-4 no-padding">
                <div class="container-fluid no-padding">

                    Filtra per: <br>
                    <form id="musicians-page-filters" name="musicians-page-filters class="row g-3">
                        <div class="col-md-8">
                            <label for="city-filter" class="form-label">Città:</label>
                            <input type="text" class="form-control" id="city-filter">
                        </div>
                        <div class="col-md-8">
                            <label for="province-filter" class="form-label">Provincia:</label>
                            <input type="text" class="form-control" id="province-filter">
                        </div>
                        <div class="col-md-8">
                            <label for="musical-tastes-filter" class="form-label">Gusti Musicali:</label>
                            <input type="text" class="form-control" id="musical-tastes-filter">
                        </div>
                        <div class="col-md-8">
                            <label for="instruments-filter" class="form-label">Strumenti Suonati:</label>
                            <input type="text" class="form-control" id="instruments-filter">
                        </div>

                        <label for="available-for-hire-filter" class="form-label">Disponibilità per Ingaggio:</label>
                        <input type="checkbox" class="form-checkbox" id="available-for-hire-filter">
                        <br>
                        <button type="submit" class="btn btn-round-black">filtra </button>
                    </form>
                </div>
            </div>

            <div id="musicians-list" class="col-md-8 container-fluid">

            </div>
        </div>
    </div>
    `;
}

// this template creates a group card used to display all informations stored in a group object
function createMusicianCard(musician) {
    return `
    <div class="card">
        ${musician.ProfilePicturePath != null ? '<img src="' + musician.ProfilePicturePath + '" class="card-img-top" alt="">' : ''}
        <!-- <img src=${musician.ProfilePicturePath} class="card-img-top" alt=""> -->
        <div class="card-body">
        <h5 class="card-title">${musician.Name}</h5>
        ${musician.AvailableForHire == 'true' ? '<span class="badge text-bg-dark">hire-me</span>' : ''}
        <p class="card-text">${musician.Age} anni <br> ${musician.City} (${musician.Province}) <br> ${musician.MusicalTastes} <br> ${musician.Instruments} </p>
        <button class="btn btn-round-black" profileID=${musician.ProfileID} profileType="MUSICIAN">vedi profilo</button>
    </div>
    `;
}
