# mw_datainput_item_number

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_number(options){`

## Source snippet

```javascript
{
			newval=input.value+txt;
		}
		this.set_input_value(newval);
		input.focus();
		if(endpos){
			 input.setSelectionRange(endpos, endpos);	
		}
	}

	if(!dontinit){
		this.init(options);	
	}
	
	
	
}


function mw_datainput_item_number(options){
	
	mw_datainput_item_base.call(this,options);
	this.oldValue="";
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
		var _this=this;
		inputElem.onfocus=function(){_this.save_old_value()};
		inputElem.onkeydown=function(){_this.save_old_value()};
		inputElem.onkeyup=function(e){_this.onKeyUp(e)};
	}
	this.on_change=function(){
		this.validateNumValueA
```

---

*Auto-extracted from source.*
