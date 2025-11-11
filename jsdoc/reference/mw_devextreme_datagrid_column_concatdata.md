# mw_devextreme_datagrid_column_concatdata

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_concatdata(cod,params){`

## Source snippet

```javascript
ion(){};
		
}
function mw_devextreme_datagrid_column_mnu_item(cod,params){
	this.init(cod,params);
}
mw_devextreme_datagrid_column_mnu_item.prototype=new mw_devextreme_datagrid_column_mnu_item_abs();



function mw_devextreme_datagrid_column_concatdata(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.data_items=new mw_objcol();
	this.after_init=function(){
		var doptim =this.params.get_param_if_object("dataitems");
		if(doptim){
			doptim.add2objcol(this.data_items);
		}
	};
	this.get_data_item_name=function(cod){
		var ditem=this.data_items.get_item(cod);
		if(ditem){
			return ditem.name;	
		}
		return false;
	}
	this.get_calc
```

---

*Auto-extracted from source.*
