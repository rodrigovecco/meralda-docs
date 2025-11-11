# mw_datainput_item_btnsgroup

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_btnsgroup(options){`

## Source snippet

```javascript
return this.get_input_value_as_group_IfNotEmpty();
	}
	
	this.get_input_value=function(){
		return this.get_input_value_as_group();
	}
}
mw_datainput_item_group.prototype=new mw_datainput_item_abs();

function mw_datainput_item_btnsgroup(options){
	this.append_to_container=function(container){
		this.beforeAppend();
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		if(!container){
			return false;	
		}
		var c=document.createElement("div");
		c.className="mw-subinterface-btns-container";
		for(var i =0; i<list.length;i++){
			list[i].append_to_container
```

---

*Auto-extracted from source.*
