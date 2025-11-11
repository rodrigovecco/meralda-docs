# mw_datainput_item_btndrpdown

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_btndrpdown(options){`

## Source snippet

```javascript
d(btns);
		}
		if(this.options.get_param_or_def("autoaddchild",false)){
			this.addNewChild();	
		}
		
	}
}
mw_datainput_item_group_multiple_children.prototype=new mw_datainput_item_groupwithtitle();

function mw_datainput_item_btndrpdown(options){
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_container();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	this.create_children_container=function(){
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;
```

---

*Auto-extracted from source.*
