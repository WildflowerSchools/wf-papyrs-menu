import "bootstrap"
import wfJquery from "jquery"

import { loadMenu } from "./menu.jsx"
import styles from "./prefix.less"

export const renderMenu = async (selector, menuUrl) => {
  console.log("Rendering WF Papyrs Menu...")

  // Load style
  const styleRef = document.createElement("style")
  styleRef.setAttribute("type", "text/css")
  styleRef.appendChild(document.createTextNode(styles))
  document.getElementsByTagName("head")[0].appendChild(styleRef)

  // Load menu
  const menuContainer = document.createElement("div")
  await loadMenu(menuUrl, menuContainer)
  document.querySelector(selector).insertAdjacentElement("beforeend", menuContainer)

  wfJquery(".bootstrap-wf .dropdown-menu a.dropdown-toggle").on(
    "mouseenter",
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
