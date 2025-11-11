# mw_ui

**Location:** `src/public_html/res/js/ui/mwui.js`

---

## Signature

`function mw_ui(info){`

## Source snippet

```javascript
<br>" +'$2');
			msg_container.html(m);
					
		};
	
	}
	if(!window["DevExpress"]){
		console.log("No DevExpress",params);
		return false;
	}
	
	
	
	
	
	
	return DevExpress.ui.notify(params);

	

	
}


function mw_ui(info){
	this.info=new mw_obj();
	this.info.set_params(info);
	this.debug_mode=false;
	
	
	
	this.jquery_ok=function(){
		if(this.jquery_ok_checked){
			return this.jquery_ok_result;	
		}
		this.jquery_ok_checked=true;
		this.jquery_ok_result=false;
		if(window["jQuery"]){
			this.jquery_ok_result=true;
		}
		return this.jquery_ok_result;
	}
	
	this.get_popup_msg_container=function(){
		if(this.pop
```

---

*Auto-extracted from source.*
