# mw_fb_man

**Location:** `src/public_html/res/js/fb/mw_fb.js`

---

## Signature

`function mw_fb_man(params){`

## Source snippet

```javascript
function mw_fb_man(params){
	mw_events_enabled_obj.call(this);
	this.params=new mw_obj();
	this.loadingStatus=0;
	this.fbCreated=false;
	
	this.params.set_params(params);
	
	this.setMainUI=function(mainui){
		this.mainUI=mainui;
	}
	this.createFB=function(fnc){
		if(this.fbCreated){
			if(fnc){
				this.onFBReady(fnc);
					
			}
			return true;
		}
		if(fnc){
			this.onFBReady(fnc);	
		}
		this.loadScript();	
	}
	t
```

---

*Auto-extracted from source.*
