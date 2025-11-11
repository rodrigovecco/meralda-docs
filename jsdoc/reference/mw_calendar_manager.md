# mw_calendar_manager

**Location:** `src/public_html/res/js/inputsman/calendar.js`

---

## Signature

`var mw_calendar_manager=function(){};`

## Source snippet

```javascript
;
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
mw_calendar_manager.disParamsHTML=new Object();
mw_calendar_manager.lngparams=new Object();
mw_calendar_manager.lngparams.inputSep="-";
mw_calendar_manager.calendars=new Array();
mw_calendar_manager.scrip
```

---

*Auto-extracted from source.*
