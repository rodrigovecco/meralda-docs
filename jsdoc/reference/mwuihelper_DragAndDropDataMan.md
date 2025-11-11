# mwuihelper_DragAndDropDataMan

**Location:** `src/public_html/res/js/ui/mwuihelpers.js`

---

## Signature

`function mwuihelper_DragAndDropDataMan(ui){`

## Source snippet

```javascript
_msg("drop target action "+this.cod);
	}
	this.onDropSrcItem=function(src_item){
		//this.target.ui.debug_msg("drop target action "+this.cod);
	}
	
	this.is_allowed=function(ev){
		return true;	
	}
}
function mwuihelper_DragAndDropDataMan(ui){
	this.init=function(ui){
		this.ui=ui;
		this.clear();
	}
	this.onDragEnd=function(){
		this.clear();
		//this.ui.debug_msg("drag end");
		return true;
			
	}

	this.onDragStart=function(src_item,actioncode,ev){
		this.clear();
		this.src_item=src_item;
		this.actioncode=actioncode;
		this.dad_event=ev;
		return true;
			
	}
	this.clear=function(){
		this.src_item=false;
		this.actioncode=fal
```

---

*Auto-extracted from source.*
