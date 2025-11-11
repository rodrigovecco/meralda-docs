# mw_devextreme_datagrid_column_uniqBool

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_cols.js`

---

## Signature

`function mw_devextreme_datagrid_column_uniqBool(cod,params){`

## Source snippet

```javascript
Info){
		if(cellInfo.data._new){
			$('<span>*</span>')
			.appendTo(cellElement);
			return;
		}
		$('<span>'+cellInfo.text+'</span>')
			.appendTo(cellElement);
		
	}
	
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_uniqBool(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
		if(!opts["calculateCellValue"]){
			opts.calculateCellValue=function(d){return _this.calculateCellValue(d)};
		}
		
	}
	this.calculateCellValue=function(data){
		if(!this.dgMan){
			return false;
		}
		return this.dgMan.isUniqBoolItemByData(data,this.getDataFieldCod());
	}
	this.in
```

---

*Auto-extracted from source.*
