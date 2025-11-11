# mw_datainput_item_text

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_text(options){`

## Source snippet

```javascript
if(input.parentAllowGetValue()){
				d[cod]=input.get_input_value();
			}
		}
		return d;
	}
	
}
function mw_datainput_item_base(options){
	mw_datainput_item_abs.call(this);
	this.init(options);
	
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
		p=this.get_input_name(
```

---

*Auto-extracted from source.*
