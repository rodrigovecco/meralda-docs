# mw_devextreme_datagrid_column_mnu

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_mnu(cod,params){`

## Source snippet

```javascript
"pickerType"]){
			opts["editorOptions"]["pickerType"]="list";	
		}
		if(!opts["editorOptions"]["formatString"]){
			opts["editorOptions"]["formatString"]="t";	
		}
		
	}
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_mnu(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.mnu_items=new mw_objcol();
	this.add_mnu_item=function(mnu_item){
		var cod=mnu_item.cod;
		
		this.mnu_items.add_item(cod,mnu_item);
		return mnu_item;	
	}
	this.after_init=function(){
		var list =this.params.get_param_as_list("mnuitems");
		if(!list){
			return;	
		}
		for(var i=0;i<list.length;i++){
			this.add_mnu_item(list[i]);
```

---

*Auto-extracted from source.*
