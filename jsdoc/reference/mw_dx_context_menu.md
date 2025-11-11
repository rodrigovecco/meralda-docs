# mw_dx_context_menu

**Location:** `src/public_html/res/js/mwdevextreme/mw_context_menu.js`

---

## Signature

`function mw_dx_context_menu(data){`

## Source snippet

```javascript
e.log("ee",ee);
		if(ee.cancel){
			return;
		}
		var elem=this.newInnerDomElem(e);
		var ce=e.itemElement.find('.dx-menu-item-text');
		if(ce){
			ce.empty();
			$(elem).appendTo(ce);	
		}
	}
	
		
}

function mw_dx_context_menu(data){
	mw_objcol_item_with_children_abs.call(this);
	this.set_data(data);
	this.currentData={};
	this._itemsClickMode=false;
	this.customSetItemOptions=new mw_obj();
	
	this.setCustomSetItemOptionsFnc=function(cod,fnc){
		this.customSetItemOptions.set_param(fnc,cod);
	}
	this.doCustomSetItemOptions=function(cod,ops){
		var f=this.customSetItemOptions.get_param_if_function(cod);
		if(f){
			f(ops)
```

---

*Auto-extracted from source.*
