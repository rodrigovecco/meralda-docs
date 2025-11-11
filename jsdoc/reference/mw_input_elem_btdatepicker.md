# mw_input_elem_btdatepicker

**Location:** `src/public_html/res/js/inputsman/btdatepicker.js`

---

## Signature

`function mw_input_elem_btdatepicker(frmman,inputname,params){`

## Source snippet

```javascript
// JavaScript Document

function mw_input_elem_btdatepicker(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}

mw_input_elem_btdatepicker.prototype=new mw_input_elem_abs();
mw_input_elem_btdatepicker.prototype.get_datetimepicker_params=function(){
	var p=new Object();
	var param;
	var ref;
	param=this.get_param("locale");
	if(param){
		p["locale"]=param;
	}
	p["showClear"]=true;
	if(this.get_param("nohour")){
		p["format"]="L";	
	}
	para
```

---

*Auto-extracted from source.*
