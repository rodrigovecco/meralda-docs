# mwuihelper_ajaxelem_devextreme_graph

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem/devextreme_graph.js`

---

## Signature

`function mwuihelper_ajaxelem_devextreme_graph(){`

## Source snippet

```javascript
function mwuihelper_ajaxelem_devextreme_graph(){
	this.afterGraphManSet=function(){
			
	}
	this.render=function(renderOptions,nodef){
		if(!this.graphMan){
			return false;
		}
		return this.graphMan.render(renderOptions,nodef);
	}
	
	this.onLoadedDataOK=function(){
		
		if(!this.loadedData){
			return this.onLoadedDataFail();
		}
		var dgman=this.loadedData.get_param_if_object("jsresponse.chartman");
		if(!dgman){
			return this.onLoadedDat
```

---

*Auto-extracted from source.*
