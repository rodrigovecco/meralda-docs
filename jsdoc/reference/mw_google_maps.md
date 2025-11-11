# mw_google_maps

**Location:** `src/public_html/res/js/google/mw_google_maps.js`

---

## Signature

`function mw_google_maps(){`

## Source snippet

```javascript
function mw_google_maps(){
	this.loaded=false;
	this.onLoadTodo=[];
	this.onLoad=function(fnc){
		if(this.loaded){
			console.log("mw_google_maps","Already loaded");
			fnc();
		}else{
			console.log("mw_google_maps","Adding TODO onload");
			this.onLoadTodo.push(fnc);
		}
	}
	this.afterLoaded=function(){
		this.loaded=true;
		console.log("mw_google_maps","Running TODO onload");
		for(var i=0;i<this.onLoadTodo.length;i++
```

---

*Auto-extracted from source.*
