# mwuihelper_droptarget

**Location:** `src/public_html/res/js/ui/mwuihelpers.js`

---

## Signature

`function mwuihelper_droptarget(ui){`

## Source snippet

```javascript
function mwuihelper_droptarget(ui){
	
	this.dragAndDropSupported=function(){
		if(this.ui){
			return this.ui.dragAndDropSupported();	
		}
	}
	this.set_msg=function(msg){
		if(!this.elem_msg){
			return false;	
		}
		mw_dom_remove_children(this.elem_msg);
		mw_hide_obj(this.elem_msg);
		if(!msg){
			return false;	
		}
		if(typeof(msg)!="object"){
			var c=msg;
			msg=document.createElement("div");
			msg.innerHTML=c;	
		}
		thi
```

---

*Auto-extracted from source.*
