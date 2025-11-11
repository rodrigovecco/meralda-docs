# mw_input_elem_calendar

**Location:** `src/public_html/res/js/inputsman/calendar.js`

---

## Signature

`function mw_input_elem_calendar(frmman,inputname,params){`

## Source snippet

```javascript
// JavaScript Document
function mw_input_elem_calendar(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}

mw_input_elem_calendar.prototype=new mw_input_elem_abs();
mw_input_elem_calendar.prototype.onCalendarChange=function(){
	if(this.cal.isEmpty){
		return true;	
	}
	var ref_date
	ref_date=this.sysFormatStr2date(this.get_param("mindate"));
	if(ref_date){
		if(this.cal.date<ref_date){
			this.cal.setValueByDate();
			return false;
```

---

*Auto-extracted from source.*
