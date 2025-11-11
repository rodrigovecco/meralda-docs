# mw_datainput_item_base

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_base(options){`

## Source snippet

```javascript
ar cod;
		var input;
		for(var i =0; i<list.length;i++){
			cod=list[i].cod;
			input=list[i].elem;
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
function mw_dat
```

---

*Auto-extracted from source.*
