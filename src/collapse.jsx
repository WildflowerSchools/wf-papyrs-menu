import wfJquery from "jquery"
import { h, Fragment, render } from "preact"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const PAPYRS_HEADING_CLASS_IDENTIFIER = "obj_heading_h"

const jQuerySearchString = match => {
  return `div[class*=${PAPYRS_HEADING_CLASS_IDENTIFIER}]:contains("${match}")`
}

export const transform = props => {
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
