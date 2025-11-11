# mw_objcol_item_base

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol_item_base(){`

## Source snippet

```javascript
function mw_objcol_item_base(){
	this.data=new mw_obj();
	this.getDebugInfo=function(){
		var r={};
		r.cod=this.cod;
		return r;
		
	}
	this.set_data=function(data){
		this.data.set_params(data);
		if(!this.cod){
			this.cod=this.data.get_param_or_def("cod");	
		}
	}
	this.init=function(){
		if(this.initDone){
			return;	
		}
		this.initDone=true;
		this.do_init();
	}
	this.do_init=function(){
	}
	
	this.set_col_item=functio
```

---

*Auto-extracted from source.*
