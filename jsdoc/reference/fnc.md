# fnc

**Location:** `src/public_html/res/js/inputsman/calendar.js`

---

## Signature

`var fnc=function(){`

## Source snippet

```javascript
(){_this.onCalendarChange()});
	return true;
	
}

mw_input_elem_calendar.prototype.after_all_init_done=function(){
	
	var param=this.get_param("nocalendar");
	if(param){
		return;
	}
	var _this=this;
	var fnc=function(){
		var cal=mw_calendar_manager.createCalendar();
		
		_this.set_cal(cal);
	}
	mw_calendar_manager.addOnInitAccion(fnc);
	mw_calendar_manager.loadScripts();
}
var mw_calendar_manager=function(){};
mw_calendar_manager.disClassesNamesPrefDef="mw_cal_";
mw_calendar_manager.disClassesNames=new Object();
mw_calendar_manager.disParams=new Object();
mw_calendar_manager.plparams=new Object();
mw_calendar
```

---

*Auto-extracted from source.*
