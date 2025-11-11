# mw_events_listener

**Location:** `src/public_html/res/js/mw_events.js`

---

## Signature

`function mw_events_listener(cod){`

## Source snippet

```javascript
}
	this._dispatch=function(data){
		var fnc=this.get_param_if_function("onDispatch");
		if(fnc){
			fnc(data,this);	
		}
	}
	this.set_listener=function(listener){
		this.listener=listener;	
	}
	
}
function mw_events_listener(cod){
	this.cod=cod;
	this.eventsCount=0;
	
	
	
	this.handlers=new mw_objcol();
	this.handlers.enable_autocod("listener_");
	
	this.dispatch=function(data,extraData){
		this.eventsCount++;
		this.currentData=data;
		this.stop_dispatch=false;
		this.currentExtraData=extraData;
		var list=this.handlers.get_items_by_index();
		
		if(!list){
			return;	
		}
		var handler;
		for(var i=0;i<list.length;i
```

---

*Auto-extracted from source.*
