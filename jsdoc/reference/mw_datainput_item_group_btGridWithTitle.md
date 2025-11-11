# mw_datainput_item_group_btGridWithTitle

**Location:** `src/public_html/res/js/inputs/container.js`

---

## Signature

`function mw_datainput_item_group_btGridWithTitle(options){`

## Source snippet

```javascript
etColForChild=function(child){
		if(!this.btGrid){
			return false;	
		}
		return this.btGrid.getCol(child.options.get_param("parentGrid.row",0),child.options.get_param("parentGrid.col",0));
	}
	
	
}
function mw_datainput_item_group_btGridWithTitle(options){
	mw_datainput_item_group_btGrid.call(this,options);
	this.append_to_container=function(outcontainer){
		
		this.beforeAppend();
		var btGrid=this.getBTGrid();
		if(!btGrid){
			return false;	
		}
		var p_container=this.create_panel_container();
		
		var container=this.childrenContainer;
		outcontainer.appendChild(p_container);
		btGrid.append2Container(container);
		//this.container=btGr
```

---

*Auto-extracted from source.*
