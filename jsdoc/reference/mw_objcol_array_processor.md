# mw_objcol_array_processor

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol_array_processor(){`

## Source snippet

```javascript
p_by_pos(-1);
	}
	this.mov_forward=function(pos){
		return this.swap_by_pos(1);	
	}
	this.swap_by_pos=function(pos){
		var other=this.get_rel_item_man(pos);
		return this.col.swap(this,other);
	}
	
}
function mw_objcol_array_processor(){
	this.queuIndex=0;
	this.queuDelay=0;
	
	this.process_elem=function(elem,index){
		return index;
	}
	
	this.abortQueu=function(){
		this.unsetQueuTimeout();
		this.aborted=true;
		this.queuIndex=0;
		this.queuList=new Array();
		
	}
	this.unsetQueuTimeout=function(){
		if(this.queuTimeout){
			clearTimeout(this.queuTimeout);	
			this.queuTimeout=false;
		}
	}
	this.createQueue=function(list,fnc
```

---

*Auto-extracted from source.*
