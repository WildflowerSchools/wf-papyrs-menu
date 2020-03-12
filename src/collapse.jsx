import wfJquery from "jquery"
import { h, Fragment, render } from "preact"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const PAPYRS_HEADING_CLASS_IDENTIFIER = "obj_heading_h"
const PAPYRS_EDIT_CLICK_IDENTIFIER = "#btn_edit_page, #lnk_edit_page"

let originalContent = null
let originalProps = {}

wfJquery.fn.bindFirst = function(name, fn) {
  // Thanks: https://stackoverflow.com/questions/2360655/jquery-event-handlers-always-execute-in-order-they-were-bound-any-way-around-t
  this.on(name, fn)

  // Thanks to a comment by @Martin, adding support for
  // namespaced events too.
  this.each(() => {
    let handlers = wfJquery._data(this[0], "events")[name.split(".")[0]]
    // take out the handler we just inserted from the end
    let handler = handlers.pop()
    // move it at the beginning
    handlers.splice(0, 0, handler)
  })
}

const jQuerySearchString = match => {
  return `div[class*=${PAPYRS_HEADING_CLASS_IDENTIFIER}]:contains("${match}")`
}

const loadOriginalContent = () => {
  if (originalContent === null) {
    console.error("Unable to load original page content, content not captured")
    return
  }

  wfJquery("#page_form").replaceWith(originalContent)
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
  //wfJquery(PAPYRS_EDIT_CLICK_IDENTIFIER).bindFirst('click', loadOriginalContent)

  // Listen for Papyrs editing mode to change to viewing mode. When change detected reapply transform.
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.attributeName === "class") {
        const classValue = wfJquery(mutation.target).prop(
          mutation.attributeName
        )
        if (
          classValue.split(" ").includes("mode_edit") &&
          !mutation.oldValue.split(" ").includes("mode_edit") &&
          mutation.oldValue.split(" ").includes("mode_view")
        ) {
          loadOriginalContent()
        } else if (
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

const undoTransform = props => {}

const applyTransform = props => {
  originalContent = wfJquery("#page_form")
  let modifiedContent = originalContent.clone()
  wfJquery("#page_form").replaceWith(modifiedContent)

  const { match = "+ " } = props

  const search = jQuerySearchString(match)

  const matchingElements = wfJquery(search)

  matchingElements.each((idx, e) => {
    const parent = wfJquery(e)
      .parents(".papyrs_node_container")
      .first()
    wfJquery(parent)
      .parent()
      .addClass("bootstrap-wf-collapsible")
    const siblings = parent.nextAll()
    const nextHeader = siblings
      .find(search)
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
