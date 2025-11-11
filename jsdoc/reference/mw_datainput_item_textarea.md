# mw_datainput_item_textarea

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_textarea(options){`

## Source snippet

```javascript
this.setLbl=function(txt){
		
		var ie=this.get_input_elem();
		if(ie){
			$(ie).attr("value",txt);
		}
	}
	
	
	this.init(options);	
}
mw_datainput_item_submit.prototype=new mw_datainput_item_abs();

function mw_datainput_item_textarea(options){
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("textarea");
		c.className="form-control";
		c.onchange=function(){_this.on_change()};
		if(this.options.get_param_or_def("validateonkeyup",false)){
			c.onkeyup=function(){_this.on_change()};
				
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			c.placeholder=p;
		}
		p=t
```

---

*Auto-extracted from source.*
