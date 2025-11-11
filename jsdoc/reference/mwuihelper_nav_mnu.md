# mwuihelper_nav_mnu

**Location:** `src/public_html/res/js/ui/helpers/mnu.js`

---

## Signature

`function mwuihelper_nav_mnu(ui){`

## Source snippet

```javascript
function mwuihelper_nav_mnu(ui){
	this.ui=ui;
	this.items=new mw_objcol();
	
	
	this.add_item=function(elem){
		elem.setMan(this);
		return this.items.add_item_and_set(elem,elem.cod);
	}
	
	this.set_list_dom_elem=function(elem){
		if(!elem){
			return false;	
		}
		this.list_elem=elem;
	}
	this.appendElems=function(){
		if(!this.list_elem){
			return false;	
		}
		var _this=this;
		return mw_objcol_array_process(this.items.g
```

---

*Auto-extracted from source.*
