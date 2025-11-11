# mwuihelper_ajaxelem

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem.js`

---

## Signature

`function mwuihelper_ajaxelem(params){`

## Source snippet

```javascript
function mwuihelper_ajaxelem(params){
	this.params=new mw_obj();
	if(params){
		this.params.set_params(params);
	}
	
	this.initFromParams=function(){
		if(!this.params){
			return false;	
		}
		var url =this.params.get_param_if_string("url");
		if(url){
			this.url=url;
		}
		if(!this.dom_container){
			var container_id=this.params.get_param_if_string("container_id");
			if(container_id){
				this.dom_container=document.getEl
```

---

*Auto-extracted from source.*
