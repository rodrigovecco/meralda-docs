# mw_bootstrap_helper_grid_base

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_grid_base(options){`

## Source snippet

```javascript
options);	
		}
		this.rows_num++;
		var id=this.rows_num;
		row.set_id(id);
		row.set_parent(this);
		this.rows.add_item(id,row);
		if(!this.def_row){
			this.def_row=row;	
		}
		return row;
	}
	
	
}
function mw_bootstrap_helper_grid_base(options){
	this.options=new mw_obj();
	this.options.set_params(options);
	
	this.set_id=function(id){
		this.id=id;	
	}
	this.set_parent=function(parent){
		this.parent=parent;	
	}
	this.get_container=function(){
		if(!this.container){
			this.create_container();
		}
		return this.container;
	}
	this.afterAppend=function(container){
			
	}
	this.append2Container=function(container){
		if(!containe
```

---

*Auto-extracted from source.*
