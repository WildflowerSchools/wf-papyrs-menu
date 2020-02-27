# Papyrs Bootstrap CSS

### To test

1) `npm install`
2) `npm start`

### Release

Not incredibly elegant for now:

`npm build`

Host the JS that's created in: *build/wf-papyrs-menu.{VERSION}.{HASH}.js*

Load the menu on Papyrs the following JS:

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