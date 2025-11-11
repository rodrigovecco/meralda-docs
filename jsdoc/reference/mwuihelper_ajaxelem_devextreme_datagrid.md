# mwuihelper_ajaxelem_devextreme_datagrid

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem/devextreme_datagrid.js`

---

## Signature

`function mwuihelper_ajaxelem_devextreme_datagrid(params){`

## Source snippet

```javascript
function mwuihelper_ajaxelem_devextreme_datagrid(params){
	mwuihelper_ajaxelem.call(this,params);
	this.afterDataGridManSet=function(){
			
	}
	this.beforeDataGridManSet=function(){
			
	}
	
	this.onLoadedDataOK=function(){
		
		if(!this.loadedData){
			return this.onLoadedDataFail();
		}
		var dgman=this.loadedData.get_param_if_object("jsresponse.datagridman");
		if(!dgman){
			return this.onLoadedDataFail();	
		}
		if(!this.dom_body){
			retur
```

---

*Auto-extracted from source.*
