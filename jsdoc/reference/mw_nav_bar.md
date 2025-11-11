# mw_nav_bar

**Location:** `src/public_html/res/js/mw_nav_bar.js`

---

## Signature

`function mw_nav_bar(data){`

## Source snippet

```javascript
function mw_nav_bar(data){
	mw_objcol_item_with_children_dom_base.call(this);
	this.set_data(data);
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		var c=this.get_container();
		if(c){
			container.appendChild(c);
			$($(c)).metisMenu();
			
		}
	}
	
	this.create_container=function(){
		this.container=document.createElement("div");
		var list=this.getChildren();
		if(list){
```

---

*Auto-extracted from source.*
