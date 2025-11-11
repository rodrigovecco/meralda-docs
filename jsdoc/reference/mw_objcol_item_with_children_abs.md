# mw_objcol_item_with_children_abs

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol_item_with_children_abs(){`

## Source snippet

```javascript
set_col_item=function(colitem){
		if(this.col_item){
			return false;
		}
		this.col_item=colitem;
		if(!this.cod){
			this.cod=this.col_item.cod;	
		}
		//console.log("set_col_item "+this.cod);
	}
}
function mw_objcol_item_with_children_abs(){
	mw_objcol_item_base.call(this);
	this.children=new mw_objcol();
	this.getDebugInfo=function(){
		var r={};
		r.cod=this.cod;
		var ch=this.getChildrenDebugInfo();
		if(ch){
			r.children=ch;	
		}
		return r;
		
	}
	
	this.getChild=function(cod){
		this.init_children();
		return this.children.get_item(cod);
		
	}
	this.getChildren=function(){
		this.init_children();
		var list=this.children.get
```

---

*Auto-extracted from source.*
