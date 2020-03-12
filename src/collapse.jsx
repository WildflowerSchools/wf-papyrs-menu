import wfJquery from "jquery"
import { h, Fragment, render } from "preact"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const PAPYRS_HEADING_CLASS_IDENTIFIER = "obj_heading_h"
const PAPYRS_PAGE_FORM_CONTENT_IDENTIFIER = "#page_form"
const PAPYRS_EDIT_CLICK_IDENTIFIER =
  "#btn_edit_page, #lnk_edit_page, #sidebarmenu_view .button.rbutton"

let originalContent = null
let originalProps = {}

const jQuerySearchHeaderString = match => {
  return `div[class*=${PAPYRS_HEADING_CLASS_IDENTIFIER}]:contains("${match}")`
}

const loadOriginalContent = () => {
  console.log("Reloaded original content")
  if (originalContent === null) {
    console.error("Unable to load original page content, content not captured")
    return
  }

  wfJquery(PAPYRS_PAGE_FORM_CONTENT_IDENTIFIER).replaceWith(originalContent)
  originalContent = null
}

const observeModeChange = () => {
  const target = document.getElementById("pagewrapper")
  if (!target) {
    console.error(
      "Unable to observe view/edit mode changes, cannot locate #pagewrapper element"
    )
    return
  }

  // Listen for Papyrs viewing mode to change to editing mode. When change detected, reload original content
  wfJquery(PAPYRS_EDIT_CLICK_IDENTIFIER).each((_, elem) => {
    elem.addEventListener(
      "click",
      () => {
        loadOriginalContent()
      },
      true
    )
  })

  // Listen for Papyrs viewing/editing mode change. When change detected reload original content or reapply transform.
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.attributeName === "class") {
        const classValue = wfJquery(mutation.target).prop(
          mutation.attributeName
        )

        // Old version of content load was not fast enough to beat Papyrs' own editing jQuery
        // if (
        //   classValue.split(" ").includes("mode_edit") &&
        //   !mutation.oldValue.split(" ").includes("mode_edit") &&
        //   mutation.oldValue.split(" ").includes("mode_view")
        // ) {
        //   loadOriginalContent()
        // } else

        if (
          classValue.split(" ").includes("mode_view") &&
          !mutation.oldValue.split(" ").includes("mode_view") &&
          mutation.oldValue.split(" ").includes("mode_edit")
        ) {
          applyTransform(originalProps)
        }
      }
    }
  }

  const observer = new MutationObserver(callback)
  const config = { attributes: true, attributeOldValue: true }

  observer.observe(target, config)
  target.addEventListener("unload", () => {
    observer.disconnect()
  })
}

const applyTransform = props => {
  originalContent = wfJquery(PAPYRS_PAGE_FORM_CONTENT_IDENTIFIER)
  let modifiedContent = originalContent.clone()
  wfJquery(PAPYRS_PAGE_FORM_CONTENT_IDENTIFIER).replaceWith(modifiedContent)

  const { match = "+ " } = props

  const searchHeaders = jQuerySearchHeaderString(match)

  const matchingElements = wfJquery(searchHeaders)

  matchingElements.each((idx, e) => {
    const parent = wfJquery(e)
      .parents(".papyrs_node_container")
      .first()
    wfJquery(parent)
      .parent()
      .addClass("bootstrap-wf-collapsible")
    const siblings = parent.nextAll()
    const nextHeader = siblings
      .find(searchHeaders)
      .first()
      .parents(".papyrs_node_container")
      .first()
    const siblingIndex = siblings.index(wfJquery(nextHeader))
    const filteredSiblings =
      siblingIndex === -1 ? siblings : siblings.slice(0, siblingIndex)

    const dataTarget = `wf_collapsible_${idx}`
    wfJquery(e).wrap(
      `<div class="collapsible collapsed" data-toggle="collapse" data-target="#${dataTarget}" aria-expanded="false" aria-controls=${dataTarget} />`
    )
    wfJquery(e).addClass("inline-block")

    const icon = document.createElement("span")
    icon.setAttribute("class", "pl-2")

    wfJquery(e)
      .text(
        wfJquery(e)
          .text()
          .replace(match, "")
      )
      .append(icon)
    render(
      <FontAwesomeIcon
        icon={faChevronDown}
        alt="chevron toggle"
        className="chevron"
      />,
      icon
    )

    filteredSiblings.wrapAll(`<div id='${dataTarget}' class="collapse"/>`)
  })
}

export const transform = props => {
  originalProps = props
  observeModeChange()
  applyTransform(props)
}
