# mw_bootstrap_helper_container

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_container(options){`

## Source snippet

```javascript
emoveClass("modal-lg");
		$(elem).removeClass("modal-sm");
		
		if(size=="large"){
			$(elem).addClass("modal-lg");	
		}
		if(size=="small"){
			$(elem).addClass("modal-sm");	
		}
		return true;
	}
}

function mw_bootstrap_helper_container(options){
	
	this.options=new mw_obj();
	if(options){
		this.options.set_params(options);
	}

	this.afterAppendFinal=function(){
			
	}
	this.afterAppend=function(){
		this.afterAppendFinal();	
	}
	this.appendToDocument=function(){
		return this.appendToContainer(document.body,true);	
	}
	this.appendToContainer=function(cont,once){
		var c=this.getDomContainerToAppend();
		if(!c){
			return false;
```

---

*Auto-extracted from source.*
