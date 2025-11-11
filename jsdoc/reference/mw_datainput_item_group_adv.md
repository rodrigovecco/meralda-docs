# mw_datainput_item_group_adv

**Location:** `src/public_html/res/js/inputs/container.js`

---

## Signature

`function mw_datainput_item_group_adv(options){`

## Source snippet

```javascript
function mw_datainput_item_group_adv(options){
	mw_datainput_item_gr_base.call(this,options);
	
}
function mw_datainput_item_group_oncols(options){
	mw_datainput_item_gr_base.call(this,options);
	
	this.append_to_container=function(container){
		
		this.beforeAppend();
		this.itemsContainer=document.createElement("div");
		//$(this.itemsContainer).addClass("container");
		container.appendChild(this.itemsContainer);
		this.itemsSubCon
```

---

*Auto-extracted from source.*
