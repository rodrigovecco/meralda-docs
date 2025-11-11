# mw_devextreme_datagrid_column

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column(cod,params){`

## Source snippet

```javascript
s.get_options=function(){
		var o=this.params.get_param_or_def("options",{});
		this.set_col_options(o);
		if(!o["name"]){
			o.name=this.cod;	
		}
		return o;	
	}
	this.after_init=function(){};
		
}

function mw_devextreme_datagrid_column(cod,params){
	this.init(cod,params);
}
mw_devextreme_datagrid_column.prototype=new mw_devextreme_datagrid_column_abs();
function mw_devextreme_datagrid_column_with_filter_lookup(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		
		this.set_col_options_lookup_from_man(opts);	
		this.set_col_options_headerCellTemplate(opts);
		var _this=this;
		if(!o
```

---

*Auto-extracted from source.*
