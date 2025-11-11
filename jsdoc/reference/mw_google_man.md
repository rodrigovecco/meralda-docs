# mw_google_man

**Location:** `src/public_html/res/js/google/mw_google.js`

---

## Signature

`function mw_google_man(params){`

## Source snippet

```javascript
function mw_google_object_loader(params){
	mw_events_enabled_obj.call(this);
	
}


function mw_google_man(params){
	mw_events_enabled_obj.call(this);
	this.params=new mw_obj();
	
	this.params.set_params(params);
	this.loadingStatus=0;
	this.loaded=false;

	this.loadAuth2=function(fnc,params){
		if(!this.gapiOK()){
			console.log("Google Api not laoded");
			return false;
		}
		if(!mw_is_object(params)){
			params={};
		}
		params["client_id"]=this.params.get_param_or_def("clientID","");
		gapi.load('a
```

---

*Auto-extracted from source.*
