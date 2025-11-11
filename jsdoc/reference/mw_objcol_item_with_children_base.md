# mw_objcol_item_with_children_base

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol_item_with_children_base(data){`

## Source snippet

```javascript
ef){
		this.init_children();
		return this.children.add_items_by_list_autocod(list,pref);	
	}

	this.addChildrenFromData=function(){
		this.addChildren(this.data.get_param_as_list("children"));	
	}
}

function mw_objcol_item_with_children_base(data){
	mw_objcol_item_with_children_abs.call(this);
	this.set_data(data);
	this.createChild=function(data){
		var ch=new mw_objcol_item_with_children_base(data);
		return ch;
	}
	this.getDebugInfo=function(){
		var r={};
		r.cod=this.cod;
		r.className="mw_objcol_item_with_children_base";
		var ch=this.getChildrenDebugInfo();
		if(ch){
			r.children=ch;	
		}
		return r;
		
	}
	
	this.init();
}
```

---

*Auto-extracted from source.*
