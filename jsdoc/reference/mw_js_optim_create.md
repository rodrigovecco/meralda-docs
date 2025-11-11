# mw_js_optim_create

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_js_optim_create(ops){`

## Source snippet

```javascript
}
		return r;
	
	}
}
function mw_objcol_array_process(list,fnc){
	var p = new mw_objcol_array_processor();
	if(mw_is_function(fnc)){
		p.process_elem=fnc;	
	}
	return p.process_list(list);
	
}

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
		return 	this.data_col.g
```

---

*Auto-extracted from source.*
