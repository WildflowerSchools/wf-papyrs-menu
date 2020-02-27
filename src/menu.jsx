import yaml from "js-yaml"
import {h, Fragment, render} from 'preact'

const MENU_YML_URL = process.env.MENU_YML_URL
const COLUMN_DIVIDE_AT = 6


const downloadMenuYml = async url => {
  return await fetch(url || MENU_YML_URL)
    .then(response => response.blob())
    .then(blob => blob.text())
    .then(text => text)
}

const loadMenuYml = async url => {
  try {
    return yaml.safeLoad(await downloadMenuYml(url))
  } catch (e) {
    console.log(e)
  }
}

const menuContainer = menuModel => {
  return (
    <div className="bootstrap-wf">
      <nav className="navbar navbar-expand-lg navbar-light bg-light hide">
        <div className="collapse navbar-collapse" id="basicExampleNav">
          <ul className="navbar-nav mr-auto">
            {menuModel.map(menuItem => menuNavItem(menuItem))}
          </ul>
        </div>
      </nav>
    </div>
  )
}

const menuNavItem = menuItem => {
  if (menuItem.children.length === 0) {
    return (
      <li className="nav-item">
         <a className={["nav-link", (menuItem.active ? "active" : "")].join(' ')} href={menuItem.link}>{menuItem.name}</a>
       </li>)
  } else {
    return (menuNavItemDropdown(menuItem))
  }
}

const menuNavItemDropdown = dropdownMenuItem => {
  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" href={dropdownMenuItem.link} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {dropdownMenuItem.name}
      </a>
      <div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
        {dropdownMenuItem.children.length < COLUMN_DIVIDE_AT &&
          <>
            {dropdownMenuItem.children
            .map(dropdownMenuItemChild =>
              menuNavItemDropdownItem(dropdownMenuItemChild)
            )}
          </>
        }

        {dropdownMenuItem.children.length >= COLUMN_DIVIDE_AT &&
          <div className="container p-0 m-0 fit-content">
            <div className="row">
              {dropdownMenuItem.children
              .map(dropdownMenuItemChild =>
                menuNavItemDropdownItem(dropdownMenuItemChild)
              )}
            </div>
          </div>
        }
      </div>
    </li>
  )
}

const menuNavItemDropdownItem = dropdownMenuItemChild => {
    return (
      <>
        {dropdownMenuItemChild.children.length === 0 &&
          <a className="dropdown-item" href={dropdownMenuItemChild.link}>
            {dropdownMenuItemChild.name}
          </a>
        }
        {dropdownMenuItemChild.children.length > 0 &&
          menuNavItemDropdownSubmenu(dropdownMenuItemChild)
        }
      </>
    )
}

const menuNavItemDropdownSubmenu = dropdownMenuItemChild => {
  return (
    <div className="dropdown-submenu">
      <a className="dropdown-item dropdown-toggle" href={dropdownMenuItemChild.link}>
        {dropdownMenuItemChild.name}
      </a>
      <div className="dropdown-menu">
        {dropdownMenuItemChild.children
          .map(dropdownMenuItemSubChild =>
            menuNavItemDropdownItem(dropdownMenuItemSubChild)
          )}
      </div>
    </div>
  )
}

export const buildModel = (menu, isRoot = true) => {
  if (!menu) {
    return null
  }

  return menu.map((val, idx) => {
    return {
      name: Object.keys(val)[0],
      link: Object.values(val)[0].link,
      active: isRoot && idx === 0,
      root: isRoot,
      children: buildModel(Object.values(val)[0].children || [], false)
    }
  })
}

export const loadMenu = async (url, container) => {
  const jsonMenu = await loadMenuYml(url)
  const menuModel = buildModel(jsonMenu)

  render(menuContainer(menuModel), container)
}
