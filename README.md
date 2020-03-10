# WF Papyrs Library

* Adds a bootstrap based menu to Papyrs: `wfLibrary.renderMenu(<<Element selector>>)`
* Adds a collapsible header transform to Papyrs: `wfLibrary.transformCollapsibles(<<options>>)`

### Test

1) `npm install`
2) `npm start`

To test the local **menu.yml**, create a `.env` from the `.env.template` and use:

```
MENU_YML_URL=http://localhost:3000/menu.yml
``` 

### Release JS

Not incredibly elegant for now:

1) `npm run build`

2) Host the JS that's created in: `build/wf-papyrs-library.{VERSION}.{HASH}.js`

3) Load on Papyrs with the following JS (notice the conditionals for using menu and collapsibles):

```
// Custom menu functionality, see: https://github.com/WildflowerSchools/wf-papyrs-library
const useMenu = $('#sidebarmenu .tags-val').text().trim().split().indexOf("menu") !== -1
const useCollapse = $('#sidebarmenu .tags-val').text().trim().split().indexOf("collapse") !== -1

if (useMenu || useCollapse) {
	$.getScript("<<HOSTED_URL>>", function() {
		const loadLibraryInterval = setInterval(function() {
            if (typeof wfLibrary === 'object') {
                clearInterval(loadLibraryInterval)

                if (useMenu) {
                    wfLibrary.renderMenu('#page-heading-wrapper')
                }

                if (useCollapse) {
                    wfLibrary.transformCollapsibles()
                }
            }
        }, 50)
	})
}
``` 

4) In Papyrs, add a `menu` tag to all pages the menu should be displayed on and a `collapse` tag to all pages the collapsible headers should be used. (Note that line 1 & 2 of the code you copy/paste in step 3 are searching for these tags. This was the easiest way I could come up with a method for selectively adding custom functionality)
