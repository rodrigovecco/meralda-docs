# mw_devextreme_data

**Location:** `src/public_html/res/js/mwdevextreme/mw_data.js`

---

## Signature

`function mw_devextreme_data(params){`

## Source snippet

```javascript
//20250307
function mw_devextreme_data(params){
	this.params=new mw_obj();
	this.params.set_params(params);
	this.editedIds=[];
	this.getDataKey=function(){
		return this.params.get_param_or_def("dataKey","id");	
	}
	this.addEditedId=function(id){
		if(!id){
			return false;	
		}
		if(!this.params.get_param("editedIds.enabled")){
			return false;
		}
		if(this.editedIds.indexOf(id)>-1){
			return false;
		}
		this.editedIds.push(id);
```

---

*Auto-extracted from source.*
