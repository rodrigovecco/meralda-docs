# mw_createCookie

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mw_createCookie(name,value,days) {`

## Source snippet

```javascript
oin(thousendsep);
	var numS=intS;
	if(precision){
		numS=numS+decsep+nList[1].toString();
	}
	if(neg){
		if(negParenthesis){
			numS="("+numS+")";	
		}else{
			numS="-"+numS;		
		}
	}
	return numS;
}

function mw_createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function mw_readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.
```

---

*Auto-extracted from source.*
