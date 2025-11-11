# mw_devextreme_datagrid_column_id

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_cols.js`

---

## Signature

`function mw_devextreme_datagrid_column_id(cod,params){`

## Source snippet

```javascript
function mw_devextreme_datagrid_column_id(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
		if(!opts["cellTemplate"]){
			opts.cellTemplate=function(cellElement, cellInfo){return _this.cellTemplate(cellElement, cellInfo)};
		}
		
	}
	this.cellTemplate=function(cellElement, cellInfo){
		if(cellInfo.data._new){
			$('<span>*</span>')
			.appendTo(cellElement);
			return;
```

---

*Auto-extracted from source.*
