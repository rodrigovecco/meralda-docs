# mw_placeholder_item_base

**Location:** `src/public_html/res/js/mw_placeholders.js`

---

## Signature

`function mw_placeholder_item_base(data){`

## Source snippet

```javascript
){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={cod:lbl};
			}else{
				return false;	
			}
		}
		var ch=new mw_placeholder_item(data);
		return ch;
	}
	
	
}
function mw_placeholder_item_base(data){
	mw_objcol_item_base.call(this);
	this.set_data(data);
	this.get_lbl=function(){
		return this.data.get_param_or_def("lbl",this.cod);	
	}
	this.getParamsInputs=function(){
		return this.data.get_param_if_object("inputs");	
	}
}
function mw_placeholder_item(data){
	mw_placeholder_item_base.call(this,data);	
}
```

---

*Auto-extracted from source.*
