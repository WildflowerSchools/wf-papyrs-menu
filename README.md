# wf-papyrs-menu
A simple custom dropdown menu we can add to Papyrs

Add the following code snipped to Papyrs' Custom Javascript:

```
if ($('#sidebarmenu .tags-val').text().trim().split().indexOf("menu") !== -1) {
	$.getScript("https://<<CDN>>/bootstrap-wf-menu.js", function() {
		$(document).ready(function() {
			var setIntervalID = setInterval(function() {
				if (typeof renderMenu === 'function') {
					clearInterval(setIntervalID)
					renderMenu('#page-heading-wrapper')
				}
			}, 250)
		})
	})
}
```
