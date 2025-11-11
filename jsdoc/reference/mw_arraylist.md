# mw_arraylist

**Location:** `src/public_html/res/js/arraylist.js`

---

## Signature

`function mw_arraylist(){`

## Source snippet

```javascript
function mw_arraylist(){
	this.addOptions2select=function(selectinput,dontaddempty,dontremoveexisting){
		if(!selectinput){
			return false;	
		}
		var i;
		if(!dontremoveexisting){
			selectinput.selectIndex=0;
			for(i=selectinput.options.length-1;i>=0;i--){
				selectinput.remove(i);
			}
		}
		if(!dontaddempty){
			selectinput.appendChild(document.createElement('option'));	
		}
		var l=this.getElemsList();
		if(!l)
```

---

*Auto-extracted from source.*
