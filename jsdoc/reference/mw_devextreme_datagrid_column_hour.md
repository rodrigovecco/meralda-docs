# mw_devextreme_datagrid_column_hour

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_hour(cod,params){`

## Source snippet

```javascript
s"]["format"]){
			opts["editorOptions"]["format"]="datetime";	
		}
		if(!opts["editorOptions"]["formatString"]){
			opts["editorOptions"]["formatString"]="x";	
		}
		
	}
	this.init(cod,params);
		
}
function mw_devextreme_datagrid_column_hour(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.get_mw_date=function(){
		if(!this.mw_date){
			this.mw_date=new mw_date();
			this.mw_date.omit_date=true;
			this.mw_date.omit_secs=true;
		}
		return this.mw_date;
	}
	this.setCellValue=function(rowData, value){
		
		var mwD=this.get_mw_date();
		var date = mwD.get_date_from_sys_formated_str(value);
		var v=mwD.format_date_as_sys
```

---

*Auto-extracted from source.*
