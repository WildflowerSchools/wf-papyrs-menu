# WF Papyrs Menu

Add a bootstrap based menu to Papyrs

### To test

1) `npm install`
2) `npm start`

To test the local **menu.yml**, create a `.env` from the `.env.template` and use:

```
MENU_YML_URL=http://localhost:3000/menu.yml
``` 

### Release

Not incredibly elegant for now:

1) `npm build`

2) Host the JS that's created in: `build/wf-papyrs-menu.{VERSION}.{HASH}.js`

3) Load the menu on Papyrs with the following JS:

```
if ($('#sidebarmenu .tags-val').text().trim().split().indexOf("menu") !== -1) {
	$.getScript("<<HOSTED_URL>>", function() {
		$(document).ready(function() {
			var setIntervalID = setInterval(function() {
				if (typeof wfMenu.renderMenu === 'function') {
					clearInterval(setIntervalID)
					wfMenu.renderMenu('#page-heading-wrapper')
				}
			}, 250)
		})
	})
}
``` 