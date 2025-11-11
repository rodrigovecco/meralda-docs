# mw_datainput_item_select

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_select(options){`

## Source snippet

```javascript
);
		this.update_real_input_value();
		return c;
	}
	this.get_tooltip_target_elem=function(){
		return this.tooltip_target;	
	}
	
	
}
mw_datainput_item_checkbox.prototype=new mw_datainput_item_abs();


function mw_datainput_item_select(options){
	mw_datainput_item_abs.apply( this, arguments );
	
	
	this.afterInit=function(){
		var list=	this.options.get_param_as_list("optionslist");
		var _this=this;
		if(list){
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});	
		}
		list=	this.options.get_param_as_list("optionsgroupslist");
		if(list){
			mw_objcol_array_process(list,function(data,index){
```

---

*Auto-extracted from source.*
