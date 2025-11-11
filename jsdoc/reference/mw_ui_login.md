# mw_ui_login

**Location:** `src/public_html/res/js/ui/mwui_login.js`

---

## Signature

`function mw_ui_login(info){`

## Source snippet

```javascript
function mw_ui_login(info){
	mw_ui.call(this,info);
	
	
	
	this.set_frm_man=function(frm_man){
		
		if(!frm_man){
			return false;	
		}
		this.frm_man=frm_man;
		this.frm_man.disable_on_submit=true;
		this.submit_btn_man=this.frm_man.get_input_manager("_btns[_submit]");
		this.input_pass_man=this.frm_man.get_input_manager("login_pass");
		
		
		
		if(this.frm_container){

			mw_show_obj(this.frm_container);
		}

	}
```

---

*Auto-extracted from source.*
