# mw_ui_grid

**Location:** `src/public_html/res/js/ui/mwui_grid.js`

---

## Signature

`function mw_ui_grid(info){`

## Source snippet

```javascript
function mw_ui_grid(info){
	this.info=new mw_obj();
	this.info.set_params(info);
	this.afterDataGridManSetOnLoaderCus=function(){
		
	}
	this.formatMinutes=function(minutes){
		if (minutes === null || isNaN(minutes)) {
			return "";
		}
		return this.formatSeconds(minutes * 60);
	}
	this.formatSeconds=function(seconds){
		if (seconds === null || isNaN(seconds)) {
			return "";
		}
	
		let days = Math.floor(seconds /
```

---

*Auto-extracted from source.*
