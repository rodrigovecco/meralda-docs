# mw_objcol

**Location:** `src/public_html/res/js/mw_objcol.js`

---

## Signature

`function mw_objcol(){`

## Source snippet

```javascript
function(){
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


function mw_objcol(){
	this.items_mans_by_cod=new Object;
	this.items_mans_by_index=new Array;
	this.items_num=0;
	this.next_auto_cod_index=0;
	this.current_item_index=-1;
	this.auto_cod_pref="__auto_cod_";
	this.auto_cod_enabled=false;
	////////
	this.resetCursor=function(){
		var info={
			old:this.current_item_index,
			moveTo:null,
			current:-1,
			
		};
		
		this.current_item_index=-1;
		this.onCurrentItemChan
```

---

*Auto-extracted from source.*
