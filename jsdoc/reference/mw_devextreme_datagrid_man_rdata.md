# mw_devextreme_datagrid_man_rdata

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_rdata.js`

---

## Signature

`function mw_devextreme_datagrid_man_rdata(params){`

## Source snippet

```javascript
function mw_devextreme_datagrid_man_rdata(params){
	mw_devextreme_datagrid_man_adv.call(this,params);
	this.getDataStore=function(){
		if(!this.DataStore){
			this.DataStore=this.getDataSourceMan().getDataStore();
		}
		return this.DataStore;	
	}
	this.getDataSourceMan=function(){
		if(this.dataSourceMan){
			return this.dataSourceMan;	
		}
		this.createDataSourceMan()
		return this.dataSourceMan;	
	}
	
	this.createDataSourceMan=function(
```

---

*Auto-extracted from source.*
