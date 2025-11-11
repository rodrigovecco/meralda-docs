# mw_datainput_item_minutes

**Location:** `src/public_html/res/js/inputs/minutes.js`

---

## Signature

`function mw_datainput_item_minutes(options){`

## Source snippet

```javascript
}else{
			r.unit="min";	
			r.actualDisplayValue=r.totalMinutes;
		}
		if(r.negative){
			r.actualValue=r.actualValue*(-1);
			r.actualDisplayValue=r.actualDisplayValue*(-1);
		}
		return r;
		
	}

}
function mw_datainput_item_minutes(options){
	this.init(options);
	this.options_list=new mw_arraylist();
	this.selected_items_in_order=new mw_objcol();
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		this.set_unit_from_dd(this.options.get_param_or_def("defunit","day"));
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
	}
	this.get_minutes_helper=function(){
		if(!this.minutes_helper){
			this.minute
```

---

*Auto-extracted from source.*
