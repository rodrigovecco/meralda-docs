# mw_events_man

**Location:** `src/public_html/res/js/mw_events.js`

---

## Signature

`function mw_events_man(){`

## Source snippet

```javascript
ion(handler)){
			
			e=this.handlers.add_item(cod,handler);
			if(!e){
				return false;	
			}
			
			return e.cod;
			
		}
		return false;	
	}
	
	this.set_man=function(man){
		this.man=man;	
	}
	
}
function mw_events_man(){
	this.listeners=new mw_objcol();
	this.dispatch=function(listenerCod,data,extraData){
		
		var l=this.get_listener_if_exists(listenerCod);
		
		if(!l){
			return false;
			
		}
		
		return l.dispatch(data,extraData);
		
	}
	this.addHandlers=function(listenerCod,list){
		var l=this.get_listener(listenerCod);
		
		if(l){
			return l.addHandlers(list);	
		}
		return false;
	}
	this.removeHandler=f
```

---

*Auto-extracted from source.*
