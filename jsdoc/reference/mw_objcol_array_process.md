# mw_objcol_array_process

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol_array_process(list,fnc){`

## Source snippet

```javascript
process_list=function(list){
		if(!mw_is_array(list)){
			return false;	
		}
		var r=new Array();
		for(var i=0;i<list.length;i++){
			r.push(this.process_elem(list[i],i));
			
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
```

---

*Auto-extracted from source.*
