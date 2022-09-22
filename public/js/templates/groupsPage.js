"use strict";

// this template creates the groups page adding all the filters and creating the div where all the cards will be inserted
function createGroupsPage() {
    return `
    <div id="groups-page" class="container-fluid">
        <div id="home-page-body" class="row">
            <div id="groups-filters" class="col-md-4 no-padding">
                <div class="container-fluid no-padding">

                    Filtra per: <br>

                    <form id="groups-page-filters" name="groups-page-filters class="row g-3">
                        <div class="col-md-8">
                            <label for="city-filter" class="form-label">Città:</label>
                            <input type="text" class="form-control" id="city-filter">
                        </div>
                        <div class="col-md-8">
                            <label for="province-filter" class="form-label">Provincia:</label>
                            <input type="text" class="form-control" id="province-filter">
                        </div>
                        <div class="col-md-8">
                            <label for="musical-tastes-filter" class="form-label">Generi Musicali:</label>
                            <input type="text" class="form-control" id="musical-genres-filter">
                        </div>

                        <label for="available-for-hire-filter" class="form-label">Disponibilità per Ingaggio:</label>
                        <input type="checkbox" class="form-checkbox" id="available-for-hire-filter">
                        <br>
                        <button type="submit" class="btn btn-round-black">filtra </button>
                    </form>

                </div>
            </div>

            <div id="groups-list" class="col-md-8 container-fluid">

            </div>
        </div>
    </div>
    `;
}

// this template creates a group card used to display all informations stored in a group object
function createGroupCard(group) {
    return `
    <div class="card">
        ${group.ProfilePicturePath != null ? '<img src="' + group.ProfilePicturePath + '" class="card-img-top" alt="">' : ''}
        <!-- <img src=${group.ProfilePicturePath} class="card-img-top" alt=""> -->
        <div class="card-body">
        <h5 class="card-title">${group.Name}</h5>
        ${group.AvailableForHire == 'true' ? '<span class="badge text-bg-dark">hire-me</span>' : ''}
        <p class="card-text">${group.City} (${group.Province}) <br> ${group.MusicalGenres} </p>
        <button class="btn btn-round-black" profileID=${group.ProfileID} profileType="GROUP">vedi profilo</button>
    </div>
    `;
}
