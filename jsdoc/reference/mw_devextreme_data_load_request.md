# mw_devextreme_data_load_request

**Location:** `src/public_html/res/js/mwdevextreme/mw_data.js`

---

## Signature

`function mw_devextreme_data_load_request(dataman,deferred,loadOptions){`

## Source snippet

```javascript
rams.get_param_if_object("dataSourceCfg",true);		
		ops.store=s;
		this.dataSource= new DevExpress.data.DataSource(ops);
		//console.log("Created DataSource",ops);
		return this.dataSource;  	
	}
	
}
function mw_devextreme_data_load_request(dataman,deferred,loadOptions){
	this.dataMan=dataman;
	this.deferred=deferred;
	this.loadOptions={};
	if(mw_is_object(loadOptions)){
		this.loadOptions=loadOptions;
	}
	this.doLoad=function(){
		var url=this.getUrl();
		console.log("loadOptions",this.loadOptions);
		if(!url){
			return false;	
		}
		var _this=this;
		this.ajax=this.dataMan.getAjaxLoader();
		this.ajax.abort_and_set_url(url);
		thi
```

---

*Auto-extracted from source.*
