# mw_devextreme_datagrid_column_mnu_item_abs

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_mnu_item_abs(){`

## Source snippet

```javascript
lick=function(){
		return this.mnuitem.onInstanceClick(this);
	}
	
	this.get_dom_elem=function(){
		if(!this.dom_elem){
			this.dom_elem=this.create_dom_elem();	
		}
		return this.dom_elem;
	}
	

	
}

function mw_devextreme_datagrid_column_mnu_item_abs(){
	this.init=function(cod,params){
		this.cod=cod;
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
	}
	this.onInstanceClick=function(instance){
		var fnc=this.params.get_param_if_function("onclick");
		if(!fnc){
			return;	
		}
		return fnc(instance);
	}
	this.handle_click=function(){
		if(	this.params.get_param_if_function("onclick")){
			return true;	
		}
		re
```

---

*Auto-extracted from source.*
