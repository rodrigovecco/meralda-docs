# mw_events_handler

**Location:** `src/public_html/res/js/mw_events.js`

---

## Signature

`function mw_events_handler(params){`

## Source snippet

```javascript
function mw_events_handler(params){
	
	this.params=new mw_obj();
	this.params.set_params(params);
	this.cod=this.params.get_param_or_def("cod",cod);
	
	this.setCurrentData=function(data,extraData){
		this.currentData=data;	
		this.currentExtraData=extraData;	
	}
	this.setCurrentDataAndDispatch=function(data,extraData){
		this.setCurrentData(data,extraData);	
		this.dispatch(data);	
	}
	
	this.dispatch=function(data){
		retu
```

---

*Auto-extracted from source.*
