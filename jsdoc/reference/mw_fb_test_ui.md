# mw_fb_test_ui

**Location:** `src/public_html/res/js/fb/mw_fb_test_ui.js`

---

## Signature

`function mw_fb_test_ui(info){`

## Source snippet

```javascript
function mw_fb_test_ui(info){
	mw_ui.call(this,info);
	this.after_init=function(){
		var _this=this;
		main_ui.doAfterInit(function(){_this.onMainUiInit()});
	}
	this.onFbLoginCheckResponse=function(){
		var data=this.getAjaxDataResponse(true);
		if(!data){
			return false;	
		}
		var _this=this;
		console.log("onFbLoginCheckResponse",data.params);
	}
	
	
	this.onMainUiInit=function(){
		console.log("onMainUiInit");
		t
```

---

*Auto-extracted from source.*
