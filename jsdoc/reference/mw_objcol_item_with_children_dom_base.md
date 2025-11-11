# mw_objcol_item_with_children_dom_base

**Location:** `src/public_html/res/js/mw_objcol_adv.js`

---

## Signature

`function mw_objcol_item_with_children_dom_base(){`

## Source snippet

```javascript
function mw_objcol_item_with_children_dom_base(){
	mw_objcol_item_with_children_abs.call(this);
	mw_events_enabled_obj.call(this);
	
	
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		var c=this.get_container();
		if(c){
			container.appendChild(c);
			
		}
	}
	this.create_container=function(){
		this.container=document.createElement("div");
		this.container.innerHTML=this.data.get_param_or_def("lbl","")
```

---

*Auto-extracted from source.*
