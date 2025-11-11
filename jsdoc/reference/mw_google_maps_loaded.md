# mw_google_maps_loaded

**Location:** `src/public_html/res/js/google/mw_google_maps.js`

---

## Signature

`function mw_google_maps_loaded(){`

## Source snippet

```javascript
this.loaded=true;
		console.log("mw_google_maps","Running TODO onload");
		for(var i=0;i<this.onLoadTodo.length;i++){
			this.onLoadTodo[i]();
		}
	}
}
window.mw_google_maps_man=new mw_google_maps()
function mw_google_maps_loaded(){
	console.log("mw_google_maps_loaded");
	window.mw_google_maps_man.afterLoaded();
	
}
```

---

*Auto-extracted from source.*
