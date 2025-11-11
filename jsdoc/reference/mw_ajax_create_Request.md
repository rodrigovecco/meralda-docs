# mw_ajax_create_Request

**Location:** `src/public_html/res/js/ajax.js`

---

## Signature

`function mw_ajax_create_Request() {`

## Source snippet

```javascript
// JavaScript Document
function mw_ajax_create_Request() {
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}else{
		return new ActiveXObject("Microsoft.XMLHTTP");
		
	}
}

function mw_ajax_launcher(url,onload){
	this.url=url;
	this.reqMode=false;//set to use GET or POST By Default;
	this.onloadActionList=new Array;
	if(onload){
		this.onloadActionList.push(onload);
	}
}

mw_ajax_launcher.prototype.getResponseXMLAsMWData=function(allowJsCod
```

---

*Auto-extracted from source.*
