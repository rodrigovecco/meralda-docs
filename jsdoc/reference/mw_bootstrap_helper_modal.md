# mw_bootstrap_helper_modal

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_modal(options){`

## Source snippet

```javascript
this.afterAppendFinal=function(){
		var inputs=this.getFooterInputs();
		var c=this.get_footer();
		if(inputs){
			if(c){
				inputs.append_to_container(c);
				mw_show_obj(c);	
			}
		}
	}
	
	
}
function mw_bootstrap_helper_modal(options){
	mw_bootstrap_helper_container.call(this,options);
	this.userResponseData={};
	
	this.onCloseDone=function(e){
		console.log("onCloseDone");
		//needs setOnCloseDoneListener
	}
	this.setOnCloseDoneListener=function(fnc){
		var o={};
		var _this=this;
		var cont=this.getJQContainer();
		if(!cont){
			return false;
		}
		if(fnc){
			
			$(cont).on('hidden.bs.modal', function (e) {fnc(_this
```

---

*Auto-extracted from source.*
