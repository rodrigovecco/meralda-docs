# mw_datainput_item_abs

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_abs(){`

## Source snippet

```javascript
function mw_datainput_item_abs(){
	this.init=function(options){
		this.options=new mw_obj();
		this.options.set_params(options);
		this.set_cod(this.options.get_param_or_def("cod",false));
		this.afterInit();
	}
	this.disabledOnReadOnly=function(){
		return false;
	}
	this.getDebugInfoExtra=function(info){
		
	}
	this.getDebugInfo=function(){
		var r={
			cod:this.cod,
			fullCod:this.getFullCod()	
		};
		this.getDebugInfoExtra
```

---

*Auto-extracted from source.*
