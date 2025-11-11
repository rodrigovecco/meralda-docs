# mw_input_elem_def

**Location:** `src/public_html/res/js/inputsman.js`

---

## Signature

`function mw_input_elem_def(frmman,inputname,params){`

## Source snippet

```javascript
one=function(){
	if(!this.check_preinit()){
		return false;	
	}
	this.after_all_init_done();
	this.after_all_init_done_events();
	if(this.is_bt_mode()){
		this.after_all_init_done_bt_mode();
		
	}

}
function mw_input_elem_def(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}
mw_input_elem_def.prototype=new mw_input_elem_abs();

mw_input_elem_def.prototype.on_set_validation_function=function(){
	var i=this.get_input();
	if(i){
		var _this=this;
		if(!this.get_param("omitValidationOnKeyUp")){
			i.onkeyup=function(){_this.validation_function_after_change()};	
		}
	}
}

mw_input_elem_def.prototype.init=
```

---

*Auto-extracted from source.*
