# mw_js_optim_data

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_js_optim_data(keys,data,params){`

## Source snippet

```javascript
function mw_js_optim_create(ops){
	if(!mw_is_object(ops)){
		return false;
	}
	if(mw_is_function(ops["get_key_cod"])){
		return ops;
	}
	return new mw_js_optim_data(ops.keys,ops.data,ops.params);
}

function mw_js_optim_data(keys,data,params){
	this.keys=keys;
	this.data=data;
	this.params=new mw_obj();
	this.params.set_params(params);
	
	this.get_data_col_item=function(cod){
		this.init_data_col();
		return 	this.data_col.get_item(cod);
			
	}
	this.get_data_col=function(){
		this.init_data_col();
		return 	this.data_col;
	}
	this.init_data_col=function(){
		if(this.data_col){
			return;
		}
		this.data_col=new mw_ob
```

---

*Auto-extracted from source.*
