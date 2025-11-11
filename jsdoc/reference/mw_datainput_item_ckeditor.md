# mw_datainput_item_ckeditor

**Location:** `src/public_html/res/js/inputs/ckeditor.js`

---

## Signature

`function mw_datainput_item_ckeditor(options){`

## Source snippet

```javascript
function mw_datainput_item_ckeditor(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("textarea");
		c.className="form-control";
		c.onchange=function(){_this.on_change()};
		if(this.options.get_param_or_def("validateonkeyup",false)){
			c.onkeyup=function(){_this.on_change()};
				
		}
		p=this.options.get_param_or_def("placeholder",fa
```

---

*Auto-extracted from source.*
