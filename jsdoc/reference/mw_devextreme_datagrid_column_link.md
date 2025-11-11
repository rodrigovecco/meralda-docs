# mw_devextreme_datagrid_column_link

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_link(cod,params){`

## Source snippet

```javascript
s);
	
}
function mw_devextreme_datagrid_column_band(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
	}
	this.init(cod,params);
		
}


function mw_devextreme_datagrid_column_link(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	
	this.cellTemplate=function(cellElement, cellInfo){
		var args=this.params.get_param_if_object("link_mode.args");
		var varargs=this.params.get_param_if_object("link_mode.varargs");
		var url_creator=new mw_url();
		var url=url_creator.get_url_from_data_varargs(this.params.get_param_or_def("link_mode.url","")
					,varargs,cellInfo.data
```

---

*Auto-extracted from source.*
