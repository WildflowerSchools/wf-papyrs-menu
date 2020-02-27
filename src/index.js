import styles from "./prefix.less"
import "./index.css"

import "bootstrap"
import wfJquery from "jquery"

const bootstrapMenuHTML = `
<div class="bootstrap-wf">
  <!--Navbar-->
  <nav class="navbar navbar-expand-lg navbar-light bg-light hide">

    <!-- <a class="navbar-brand" href="#">Wildflower</a> -->

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav" aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="basicExampleNav">

      <!-- Links -->
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">Home
            <span class="sr-only">(current)</span>
          </a>
        </li>

        <!-- Dropdown: School Resources -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">School Resources</a>
          <div class="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
            <div class="container p-0 m-0 fit-content">
              <div class="row">
                <div class="col-12 col-md-6">
                  <a class="dropdown-item" href="#">Roadmaps</a>
                  <a class="dropdown-item" href="#">Roles & Responsibilities</a>
                  <a class="dropdown-item" href="#">Human Relations</a>
                  <a class="dropdown-item" href="#">Legal & Insurance</a>
                  <a class="dropdown-item" href="#">Financial Management</a>
                  <a class="dropdown-item" href="#">School Board</a>
                </div>
                <div class="col-12 col-md-6">
                  <a class="dropdown-item" href="#">Fundraising</a>
                  <a class="dropdown-item" href="#">Admissions/Enrollment</a>
                  <a class="dropdown-item" href="#">Marketing</a>
                  <a class="dropdown-item" href="#">Facilities</a>
                  <a class="dropdown-item" href="#">Licensure</a>
                </div>
              </div>
            </div>
          </div>
        </li>
        <!-- Dropdown: School Resources -->

        <!-- Dropdown: Hub Resources -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Hub Resources</a>
          <div class="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
            <div class="container p-0 m-0 fit-content">
              <div class="row">
                <div class="col-12 col-md-6">
                  <a class="dropdown-item" href="#">Colorado</a>
                  <a class="dropdown-item" href="#">Indiana</a>
                  <a class="dropdown-item" href="#">Minnesota</a>
                  <div class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Massachusetts</a>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">San Lorenzo</a>
                      <a class="dropdown-item" href="#">Broadway</a>
                      <a class="dropdown-item" href="#">MassBridge</a>
                      <a class="dropdown-item" href="#">Partnerships & Growth</a>
                    </div>
                  </div>
                  <a class="dropdown-item" href="#">New Jersey</a>
                </div>
                <div class="col-12 col-md-6">
                  <a class="dropdown-item" href="#">New York</a>
                  <a class="dropdown-item" href="#">Northern California</a>
                  <a class="dropdown-item" href="#">Puerto Rico</a>
                  <a class="dropdown-item" href="#">Washington DC</a>
                </div>
              </div>
            </div>
          </div>
        </li>
        <!-- Dropdown: Hub Resources -->

        <!-- Dropdown: Network Resources -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Network Resources</a>
          <div class="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
            <a class="dropdown-item" href="#">Wildflower Collection</a>
            <a class="dropdown-item" href="#">Wholeness Center</a>
            <a class="dropdown-item" href="#">Coaches</a>
            <a class="dropdown-item" href="#">Conflict Resolution</a>
            <a class="dropdown-item" href="#">Advice Process</a>
          </div>
        </li>
        <!-- Dropdown: Network Resources -->

        <li class="nav-item">
          <a class="nav-link" href="#">Foundation Resources</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="#">Papyrs How-Tos</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="#">Share</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="#">Contact</a>
        </li>

      </ul>
      <!-- Links -->
    </div>
    <!-- Collapsible content -->

  </nav>
  <!--/.Navbar-->
</div>`

export const renderMenu = (selector, template) => {
  console.log("Rendering WF Papyrs Menu...")

  const styleRef = document.createElement("style")
  styleRef.setAttribute("type", "text/css")
  styleRef.appendChild(document.createTextNode(styles))

  document.getElementsByTagName("head")[0].appendChild(styleRef)
  document
    .querySelector(selector)
    .insertAdjacentHTML("beforeend", bootstrapMenuHTML)

  wfJquery(".bootstrap-wf .dropdown-menu a.dropdown-toggle").on(
    "click",
    function(e) {
      if (
        !wfJquery(this)
          .next()
          .hasClass("show")
      ) {
        wfJquery(this)
          .parents(".dropdown-menu")
          .first()
          .find(".show")
          .removeClass("show")
      }
      let subMenu = wfJquery(this).next(".dropdown-menu")
      subMenu.toggleClass("show")

      wfJquery(this)
        .parents("li.nav-item.dropdown.show")
        .on("hidden.bs.dropdown", function(e) {
          wfJquery(".dropdown-submenu .show").removeClass("show")
        })

      return false
    }
  )

  wfJquery(".bootstrap-wf .navbar").removeClass("hide")
}
