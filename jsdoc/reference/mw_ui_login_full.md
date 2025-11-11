# mw_ui_login_full

**Location:** `src/public_html/res/js/ui/mwui_loginfull.js`

---

## Signature

`function mw_ui_login_full(info){`

## Source snippet

```javascript
function mw_ui_login_full(info){
	mw_ui_login.call(this,info);
	
	
	this.set_reset_pass_frm_man=function(frm_man){
		
		if(!frm_man){
			return false;	
		}
		var _this=this;
		this.reset_pass_frm_man=frm_man;
		this.reset_pass_frm_man.disable_on_submit=true;
		
		

		if(this.reset_pass_frm_container){
			mw_show_obj(this.reset_pass_frm_container);
		}

	}
	
	this.setNewResetPassCaptcha=function(url){
		console.log("setNewR
```

---

*Auto-extracted from source.*
