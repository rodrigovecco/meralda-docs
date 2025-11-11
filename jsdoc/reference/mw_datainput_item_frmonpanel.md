# mw_datainput_item_frmonpanel

**Location:** `src/public_html/res/js/inputs/frm.js`

---

## Signature

`function mw_datainput_item_frmonpanel(options){`

## Source snippet

```javascript
n this.get_input_value_as_group();
	}
	this.getInputValueIfNotEmpty=function(){
		return this.get_input_value_as_group_IfNotEmpty();
	}

}
mw_datainput_item_frm.prototype=new mw_datainput_item_abs();

function mw_datainput_item_frmonpanel(options){
	this.create_container=function(){
		var p;
		var _this=this;
		
		var c=document.createElement("form");
		this.formElem=c;
		var frm=c;
		p=this.options.get_param_or_def("enctype","multipart/form-data");
		if(p){
			frm.enctype=p;	
		}
		p=this.options.get_param_or_def("autocomplete","off");
		if(p){
			frm.autocomplete=p;	
		}
		p=this.options.get_param_or_def("method","post");
		if(p)
```

---

*Auto-extracted from source.*
