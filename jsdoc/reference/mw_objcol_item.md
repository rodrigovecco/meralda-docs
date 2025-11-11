# mw_objcol_item

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol_item(cod,citem,index,col){`

## Source snippet

```javascript
_first_item=function(){
		return this.get_item_by_index(0);	
	}
	this.get_last_item=function(){
		if(!this.items_num){
			return false;	
		}
		return this.get_item_by_index(this.items_num-1);	
	}
	
}
function mw_objcol_item(cod,citem,index,col){
	this.index=index;
	this.cod=cod;
	this.item=citem;
	this.col=col;
	this.deleted=false;
	this.get_item=function(){
		return this.item;	
	}
	
	
	this.get_rel_item_man=function(pos){
		var i=pos+this.index;
		return this.col.get_item_man_by_index(i);	
	}
	this.get_prev_or_last=function(){
		if(this.is_first()){
			return 	this.col.get_last_item();	
		}else{
			return this.get_p
```

---

*Auto-extracted from source.*
