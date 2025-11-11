# mw_datainput_item_frm

**Location:** `src/public_html/res/js/inputs/frm.js`

---

## Signature

`function mw_datainput_item_frm(options){`

## Source snippet

```javascript
function mw_datainput_item_frm(options){
	this.init(options);
	
	this.getFormData=function(){
		if(this.formElem){
			return new FormData(this.formElem);	
		}
		return false;
	}
	this.create_container=function(){
		var p;
		var _this=this;
		
		var c=document.createElement("form");
		this.formElem=c;

		var frm=c;
		p=this.options.get_param_or_def("enctype","multipart/form-data");
		if(p){
			frm.enctype=p;	
		}
		p=this.option
```

---

*Auto-extracted from source.*
