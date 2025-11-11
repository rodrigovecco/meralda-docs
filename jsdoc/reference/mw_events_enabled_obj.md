# mw_events_enabled_obj

**Location:** `src/public_html/res/js/mw_events.js`

---

## Signature

`function mw_events_enabled_obj(){`

## Source snippet

```javascript
turn false;	
		}
		return this.listeners.get_item(cod);
	}
	this.getListenerEventsCount=function(cod){
		var l=this.get_listener_if_exists(cod);
		if(l){
			return l.eventsCount;
		}
		return 0;
	}
}
function mw_events_enabled_obj(){
	this.eventsMan=new mw_events_man();
	this.do_initEvents=function(){
			
	}
	this.initEvents=function(){
		if(this.initEventsDone){
			return;	
		}
		this.initEventsDone=true;
		this.do_initEvents();
	}
	this.on=function(listenerCod,handler,cod){
		this.initEvents();
		if(mw_is_array(handler)){
			return this.eventsMan.addHandlers(listenerCod,handler);
		}

		return 	this.eventsMan.on(listenerC
```

---

*Auto-extracted from source.*
