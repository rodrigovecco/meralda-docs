# mw_bootstrap_helper_modal_with_footer_inputs

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_modal_with_footer_inputs(options){`

## Source snippet

```javascript
ction(){
		if(this.modal){
			this.modal.hide();	
		}
		
	}
	this.onCancel=function(){
		this.hide();
	}
	this.onClose=function(){
		this.hide();
	}
	this.onAccept=function(){
		this.hide();
	}

		
}



function mw_bootstrap_helper_modal_with_footer_inputs(options){
	mw_bootstrap_helper_modal.call(this,options);
	this.cancelClick=function(){
		this.setUserAction("cancel");
		this.hide();
	}
	this.closeClick=function(){
		this.setUserAction("close");
		this.hide();
	}
	this.acceptClick=function(){
		this.setUserAction("accept");
		console.log("Accept");	
		if(this.options.get_param_or_def("btns.accept.hideModalOnClick",false,true)){
			this.hide();
```

---

*Auto-extracted from source.*
