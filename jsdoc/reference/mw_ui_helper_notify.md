# mw_ui_helper_notify

**Location:** `src/public_html/res/js/ui/mwui.js`

---

## Signature

`function mw_ui_helper_notify(params){`

## Source snippet

```javascript
function mw_ui_helper_notify(params){
	//params.message
	//params.type: 'info'|'warning'|'error'|'success'|'custom'
	if(!params){
		return false;	
	}
	var msg;
	if(!mw_is_object(params)){
		msg=params;
		params={message:msg};	
	}
	var m;
	
	var fmsg="";
	if(mw_is_array(params.list)){
		var p;
		m=params["message"]+"";
		if(m){
			if(params["multiline"]){
				m=m.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ "<br />" +'$2');
```

---

*Auto-extracted from source.*
