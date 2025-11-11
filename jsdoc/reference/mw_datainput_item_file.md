# mw_datainput_item_file

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_file(options){`

## Source snippet

```javascript
ther_params=function(inputElem){
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
		this.set_def_input_atts_by_cfg(input);//new
		this.set_def_input_atts_more(input);//new
		
		this.update_input_atts(input);
	}
	this.getFile=function(){
		if(this.input_e
```

---

*Auto-extracted from source.*
