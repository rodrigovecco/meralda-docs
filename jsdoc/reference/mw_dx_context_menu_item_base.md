# mw_dx_context_menu_item_base

**Location:** `src/public_html/res/js/mwdevextreme/mw_context_menu.js`

---

## Signature

`function mw_dx_context_menu_item_base(){`

## Source snippet

```javascript
function mw_dx_context_menu_item_base(){
	mw_objcol_item_with_children_abs.call(this);
	mw_events_enabled_obj.call(this);
	this.onClick=function(e){
		//console.log("onClick",e);
		this.dispatchEvent("click",{evtn:e});
	}
	this.onClickItemMode=function(e,man){
		var ee={evtn:e};
		if(man){
			man.customSetItemClickEvent(ee);
		}
		
		//console.log("onClickItemMode",e);
		this.dispatchEvent("click",ee);
	}
	this.onRendered=function(e){
```

---

*Auto-extracted from source.*
