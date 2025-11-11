# mw_devextreme_datagrid_man_rdataedit

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_rdata.js`

---

## Signature

`function mw_devextreme_datagrid_man_rdataedit(params){`

## Source snippet

```javascript
ource=this.dataSource;	
		}
		this.set_create_data_grid_options_events(ops);
		this.set_create_data_grid_options_others(ops);
		
		console.log("create_data_grid_options",ops);
		return ops;
		
	}
	
}

function mw_devextreme_datagrid_man_rdataedit(params){
	mw_devextreme_datagrid_man_rdata.call(this,params);
	this.set_create_data_grid_options_events=function(ops){
		var _this=this;
		if(!ops['onRowRemoved']){
			ops['onRowRemoved']=function(e){_this.onRowRemoved(e)};	
		}
		if(!ops['onRowUpdating']){
			ops['onRowUpdating']=function(e){_this.onRowUpdating(e)};	
		}
		if(!ops['onRowInserting']){
			ops['onRowInserting']=function(e){_this.onR
```

---

*Auto-extracted from source.*
