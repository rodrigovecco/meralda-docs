# mw_bootstrap_nav

**Location:** `src/public_html/res/js/bootstrap/mw_bootstrap_nav.js`

---

## Signature

`function mw_bootstrap_nav(){`

## Source snippet

```javascript
function mw_bootstrap_nav(){
	mw_events_enabled_obj.call(this);
	this.onLinkClick=function(elem,evtn){
		//console.log("onLinkClick elem",elem);
		//console.log("onLinkClick evtn",evtn);
		var cod=this.getNavCodFromLinkElem(elem);
		//console.log("onLinkClick cod",cod);
		this.setSelectedItemCod(cod);
		
	}
	this.setSelectedItemCod=function(cod,omitEvent){
		this.selectedItemCod=false;
		if(cod){
			if(typeof(cod)=="string
```

---

*Auto-extracted from source.*
