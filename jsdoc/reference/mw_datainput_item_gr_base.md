# mw_datainput_item_gr_base

**Location:** `src/public_html/res/js/inputs/container.js`

---

## Signature

`function mw_datainput_item_gr_base(options){`

## Source snippet

```javascript
document.createElement("div");
		pbody.className="card-body";
		pcolb.appendChild(pbody);
		this.children_container=pbody;
		this.childrenContainer=this.children_container;
		return c;
		
		
	}
	
	
}

function mw_datainput_item_gr_base(options){
	mw_datainput_item_base.call(this,options);
	this.append_to_container=function(container){
		this.beforeAppend();
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].append_to_container(container);
		}
		
		this.afterAppend();
		return true;
	}
	this.validate=function
```

---

*Auto-extracted from source.*
