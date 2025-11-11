# mw_datainput_item_checkbox

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_checkbox(options){`

## Source snippet

```javascript
(this.input_elem){
			if(this.input_elem.files){
				return this.input_elem.files[0];
			}
		}
		return null;
	}
	
	this.init(options);
}
mw_datainput_item_file.prototype=new mw_datainput_item_abs();

function mw_datainput_item_checkbox(options){
	this.init(options);
	this.disabledOnReadOnly=function(){
		return true;
	}
	this.create_input_elem=function(){
		var _this=this;
		var c=document.createElement("input");
		c.type="checkbox";
		c.className="form-check-input";
		c.onchange=function(){_this.on_change_chkbox()};
		c.value=1;
		this.update_input_atts(c);
		return c;
	}
	this.on_change_chkbox=function(){
		this.update_real_in
```

---

*Auto-extracted from source.*
