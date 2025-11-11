# mw_select_removeAllOptions

**Location:** `src/public_html/res/js/util.js`

---

## Signature

`function mw_select_removeAllOptions(selectobj){`

## Source snippet

```javascript
function mw_select_removeAllOptions(selectobj){
	if(!selectobj){
		return false;
	}
	
	if(selectobj.nodeName!="SELECT"){
		return false;
	}
	var i;
	selectobj.selectIndex=0;
	for(i=selectobj.options.length-1;i>=0;i--){
		selectobj.remove(i);
	}
}
function mw_select_addOption(selectobj,val,txt,maxlen){
	if(!selectobj){
		return false;
	}
	
	if(selectobj.nodeName!="SELECT"){
		return false;
	}
	var option=document.createElement('optio
```

---

*Auto-extracted from source.*
