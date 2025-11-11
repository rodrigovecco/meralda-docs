# mw_main_ui

**Location:** `src/public_html/res/js/ui/mainui/mwmainui.js`

---

## Signature

`function mw_main_ui(info){`

## Source snippet

```javascript
function mw_main_ui(info){
	mw_events_enabled_obj.call(this);

	this.info=new mw_obj();
	this.info.set_params(info);
	this.debug_mode=false;
	this.fullScreenInitDone=false;
	this.managers=new mw_objcol();
	this.fullScreenMode=false;
	this.fullScreenIsEnabled=true;
	//this.events=new mw_events_man(); //use this.eventsMan
	this.events=this.eventsMan;
	this.doAfterInit=function(fnc,cod){
		this.initEvents();
		this.even
```

---

*Auto-extracted from source.*
