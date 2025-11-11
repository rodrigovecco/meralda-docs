# mw_devextreme_datagrid_column_mnu_item

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_mnu_item(cod,params){`

## Source snippet

```javascript
ram_or_def("iconClass","")+"'  title='"+this.params.get_param_or_def("lbl","")+"'  aria-hidden='true'></a>";
		
		$(html)
          .appendTo(cellElement);
		
	}
	
	this.after_init=function(){};
		
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
			doptim.ad
```

---

*Auto-extracted from source.*
