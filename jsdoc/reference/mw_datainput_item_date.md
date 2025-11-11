# mw_datainput_item_date

**Location:** `src/public_html/res/js/inputs/date.js`

---

## Signature

`function mw_datainput_item_date(options){`

## Source snippet

```javascript
function mw_datainput_item_date(options){
	mw_datainput_item_abs.call(this);
	this.mw_date=new mw_date();
	this.init(options);
	this.onDXValueChanged=function(e){
		var date=false;
		if(e){
			if(e.value){
				date=e.value;	
			}
		}
		if(this.set_mw_date_and_input_value(date)){
			this.on_change();
		}
	}
	this.setMWDateFromStr=function(strDate){
		if(this.options.get_param_or_def("inputTimeOnlyMode",false)){
			return 	this.mw
```

---

*Auto-extracted from source.*
