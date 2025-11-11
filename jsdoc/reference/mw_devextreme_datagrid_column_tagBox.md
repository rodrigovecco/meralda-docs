# mw_devextreme_datagrid_column_tagBox

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_tagBox(cod,params){`

## Source snippet

```javascript
ookup"]){
			//opts.lookup=_this.getLookup();
		}
		if(!opts["calculateCellValue"]){
			opts.calculateCellValue=function(d){return _this.calculateCellValue(d)};
		}
		
	}
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_tagBox(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
		opts["encodeHtml"]=false;	
		if(!opts["editCellTemplate"]){
			opts.editCellTemplate=function(cellElement, cellInfo){return _this.editCellTemplate(cellElement, cellInfo)}
		}
		if(!opts["cellTemplate"]){
			opts.cellTemplate=function(container, options){_this.cellTemplate(container
```

---

*Auto-extracted from source.*
