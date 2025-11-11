# mw_datainput_item_minutes_helper

**Location:** `src/public_html/res/js/inputs/minutes.js`

---

## Signature

`function mw_datainput_item_minutes_helper(){`

## Source snippet

```javascript
function mw_datainput_item_minutes_helper(){
	this.format_DHM=function(val){
		var r=this.val2result(val);
		if(!r.valid){
			return "";
		}
		
		var str="";
		if(r.negative){
			str=str+"-";
		}
		if(r.days>0){
			str=str+r.days+" ";
		}
		str=str+this.twoDigits(r.hours)+":"+this.twoDigits(r.minutes);
		return str;
		
	}
	this.format_txt=function(val,sep){
		var r=this.val2result(val);
		if(!r.valid){
			return "";
		}
		if(!r.actualValu
```

---

*Auto-extracted from source.*
