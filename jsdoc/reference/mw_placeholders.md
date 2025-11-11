# mw_placeholders

**Location:** `src/public_html/res/js/mw_placeholders.js`

---

## Signature

`function mw_placeholders(data){`

## Source snippet

```javascript
function mw_placeholders(data){
	mw_objcol_item_with_children_abs.call(this);
	this.addPHForMWInput=function(elem){
		if(this.modal){
			this.modal.hide();
		}
		var val=this.getStrFromFrm();
		if(!val){
			return false;
		}
		val="[["+val+"]]";
		if(!mw_is_object(elem)){
			return false;
		}
		if(mw_is_object(elem,"insertText")){
			elem.insertText(val);	
		}else{
			var n=elem.get_input_value();
			if(n){
				val=n+val;
```

---

*Auto-extracted from source.*
