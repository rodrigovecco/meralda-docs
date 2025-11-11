# mw_eraseCookie

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mw_eraseCookie(name) {`

## Source snippet

```javascript
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
		return false;	
	}
	if (typeof(data)=="object" ) {
		if(!checkfnc){
			return true;
		}
		return mw_is_function(data[checkfnc]);
	}
	return false;
}
function mw_is_function(data){
	if(!data){
		return false;	
	}
	if (typeof(data)=="function" ) {
		return true;
	}
	return false;
}

function mw_is_array(data)
```

---

*Auto-extracted from source.*
