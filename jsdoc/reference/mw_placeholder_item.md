# mw_placeholder_item

**Location:** `src/public_html/res/js/mw_placeholders.js`

---

## Signature

`function mw_placeholder_item(data){`

## Source snippet

```javascript
is);
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
