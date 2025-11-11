# mw_devextreme_datagrid_column_datetime

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_datetime(cod,params){`

## Source snippet

```javascript
+ '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2'))
		.appendTo(cellElement);
		popover.dxPopover({
		target:e,
        showEvent: "dxclick",
        width: 500
   		});
		
	}
	
}

function mw_devextreme_datagrid_column_datetime(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.get_mw_date=function(){
		if(!this.mw_date){
			this.mw_date=new mw_date();
		}
		return this.mw_date;
	}
	this.customizeText=function(cellInfo){
		//not used
		var dformat=this.params.get_param_or_def("dateformat",null,true);
		var tformat=this.params.get_param_or_def("timeformat",null,true);
		var mwd=this.get_mw_date();
		return
```

---

*Auto-extracted from source.*
