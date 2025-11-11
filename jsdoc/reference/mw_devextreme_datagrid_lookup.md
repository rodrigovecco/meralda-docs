# mw_devextreme_datagrid_lookup

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_lookup(cod,doptim){`

## Source snippet

```javascript
function mw_devextreme_datagrid_lookup(cod,doptim){
	this.cod=cod;
	this.doptim=doptim;
	this.getDS=function(){
		var list=this.doptim.get_all_data();
		if(list){
			return list;	
		}
		return new Array();
	}
	this.get_data_col_item=function(cod){
		if(this.doptim){
			return this.doptim.get_data_col_item(cod);	
		}
	}
	this.get_data_col_item_value=function(id,cod){
		var o=this.get_data_col_item(id);
		if(!o){
			return false;	
		}
```

---

*Auto-extracted from source.*
