# mw_dx_dialog

**Location:** `src/public_html/res/js/mwdevextreme/mw_dialog_helper.js`

---

## Signature

`function mw_dx_dialog(params){`

## Source snippet

```javascript
function mw_dx_dialog(params){
	this.params=new mw_obj();
	this.params.set_params(params);
	
	this.onDialogResultYes=function(){
		var fnc=this.params.get_param_if_function("onYes");
		if(fnc){
			fnc(this);	
		}
	}
	this.onDialogResultNo=function(){
		var fnc=this.params.get_param_if_function("onNo");
		if(fnc){
			fnc(this);	
		}
	}
	this.onDialogResult=function(dialogResult){
		this.dialogResult=dialogResult;	
		$(w
```

---

*Auto-extracted from source.*
