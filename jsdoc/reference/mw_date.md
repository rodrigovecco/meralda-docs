# mw_date

**Location:** `src/public_html/res/js/mw_date.js`

---

## Signature

`function mw_date(){`

## Source snippet

```javascript
function mw_date(){
	this.empty=true;
	this.sys_value="";
	this.date=new Date();
	this.omit_date=false;
	this.omit_hour=false;
	this.omit_secs=false;
	this.set_date=function(date){
		this.set_empty();
		if(!date){
			return false;	
		}
		this.date=date;
		this.empty=false;
		this.sys_value=this.format_date_as_sys_value(date,false,false);
		//console.log(this.sys_value);
		return this.date;
		
	}
	this.strIsTimeOnl
```

---

*Auto-extracted from source.*
