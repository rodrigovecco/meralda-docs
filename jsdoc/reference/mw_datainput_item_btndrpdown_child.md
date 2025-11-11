# mw_datainput_item_btndrpdown_child

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_btndrpdown_child(options){`

## Source snippet

```javascript
lse{
			c.innerHTML="<span class='caret'></span>";	
		}
		this.set_def_input_atts(c);
		
		return c;
	}
	
	
	this.init(options);	
}
mw_datainput_item_btndrpdown.prototype=new mw_datainput_item_btn();
function mw_datainput_item_btndrpdown_child(options){
	this.init(options);
	this._is_disabled=false;
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("a");
		c.href=this.options.get_param_or_def("url","#");
		//c.role="button";
		
		
		p=this.options.get_param_or_def("target",false);
		if(p){
			c.target=p;
		}
		p=this.options.get_param_or_def("url",false);
		if(p){
			c.onclick=function(){if(_t
```

---

*Auto-extracted from source.*
