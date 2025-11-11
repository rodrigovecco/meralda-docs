# mw_ui_frm

**Location:** `src/public_html/res/js/ui/mwui_frm.js`

---

## Signature

`function mw_ui_frm(info){`

## Source snippet

```javascript
function mw_ui_frm(info){
	
	mw_ui.call(this,info);

	this.createCtrs=function(){
		var _this=this;
		var e=this.get_ui_elem("ctrs");
		if(!e){
			return false;
			
		}
		this.ctrs=this.params.get_param_if_object("ctrs");
		if(!this.ctrs){
			return false;
		}

		this.ctrs.append_to_container(e);
		this.afterAppendCtrs();
		
	

	}
	this.afterAppendCtrs=function(){

	}

	this.after_init=function(){
		this.set_contain
```

---

*Auto-extracted from source.*
