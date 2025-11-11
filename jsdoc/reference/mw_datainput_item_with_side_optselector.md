# mw_datainput_item_with_side_optselector

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_with_side_optselector(options){`

## Source snippet

```javascript
f(typeof(option)!="object"){
			var n=option;
			option={cod:cod,name:n};
		}
		var i=this.options_list.add_item(cod,option);
		if(i){
			this.update_display_if_created();
			
			return i;	
		}
	}

}

function mw_datainput_item_with_side_optselector(options){
	mw_datainput_item_base.call(this,options);
	mw_datainput_item_with_optionsList_base.call(this);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
	}
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		var p=this.options.get_param_or_def("hidden",false);
		if(p){
			this.
```

---

*Auto-extracted from source.*
