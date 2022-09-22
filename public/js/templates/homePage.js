"use strict";

// this template is used to "inject" into the index.html file the home page image
// (initially this template contained more divs and elements but they have been moved in other templates)
function createHomePage() {
 return `
    <!-- Home Image -->
    <div class="container-fluid no-padding">
        <img class="img-fluid" src="/media/images/inTheCantine-bg-greyScale.jpg">
    </div>
`;
}
