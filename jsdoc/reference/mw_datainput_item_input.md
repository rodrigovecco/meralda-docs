# mw_datainput_item_input

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_input(options){`

## Source snippet

```javascript
nit(options);
	
}
function mw_datainput_item_text(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
	}
	
	
}



function mw_datainput_item_input(options){
	this.init(options);	
}
mw_datainput_item_input.prototype=new mw_datainput_item_abs();
function mw_datainput_item_file(options){
	this.set_def_input_atts=function(input){
		var p;
		p=this.get_input_name();
		if(p){
			input.name=p;	
		}
		p=this.get_input_id();
		if(p){
			input.id=p;	
		}
		input.className="form-control";
		input.type="file";
		this.set_def_input_atts_by_cfg(input);//n
```

---

*Auto-extracted from source.*
