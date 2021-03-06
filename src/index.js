import "bootstrap"
import wfJquery from "jquery"

import { load as loadMenu } from "./menu.jsx"
import { transform as _transformCollapsibles } from "./collapse.jsx"
import styles from "./styles/prefix.scss"

// Load style
const styleRef = document.createElement("style")
styleRef.setAttribute("type", "text/css")
styleRef.appendChild(document.createTextNode(styles))
document.getElementsByTagName("head")[0].appendChild(styleRef)

export const renderMenu = async (selector, menuUrl) => {
  console.log("Rendering WF Papyrs Menu...")

  // Load menu
  const menuContainer = document.createElement("div")
  await loadMenu(menuUrl, menuContainer)
  document
    .querySelector(selector)
    .insertAdjacentElement("beforeend", menuContainer)

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
  console.log("WF Papyrs Menu created!")
}

export const transformCollapsibles = (options = {}) => {
  _transformCollapsibles(options)
}
