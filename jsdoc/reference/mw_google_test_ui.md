# mw_google_test_ui

**Location:** `src/public_html/res/js/google/mw_google_test_ui.js`

---

## Signature

`function mw_google_test_ui(info){`

## Source snippet

```javascript
function mw_google_test_ui(info){
	mw_ui.call(this,info);
	this.after_init=function(){
		var _this=this;
		window.onGoogleSignIn=function(googleUser){_this.onSignIn(googleUser)};
		this.testFrm=this.params.get_param_if_object("testfrm");
		var e=this.get_ui_elem("testfrmcontainer");
		if(e){
			if(	this.testFrm){
				this.testFrm.append_to_container(e);	
			}
		}
		//main_ui.doAfterInit(function(){_this.onMainUiInit()});
	}
```

---

*Auto-extracted from source.*
