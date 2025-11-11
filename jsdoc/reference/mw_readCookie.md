# mw_readCookie

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mw_readCookie(name) {`

## Source snippet

```javascript
= new Date();
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
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function mw_eraseCookie(name) {
	mw_createCookie(name,"",-1);
}

function mw_is_object(data,checkfnc){
	if(!data){
		return fal
```

---

*Auto-extracted from source.*
