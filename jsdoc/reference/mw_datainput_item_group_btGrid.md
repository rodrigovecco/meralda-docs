# mw_datainput_item_group_btGrid

**Location:** `src/public_html/res/js/inputs/container.js`

---

## Signature

`function mw_datainput_item_group_btGrid(options){`

## Source snippet

```javascript
function(child,childContainer){
		//todo: other col sizes (sm, xl, etc)
		var p=child.options.get_param_or_def("parentGrid.classForContainer");
		if(p){
			$(childContainer).addClass(p);
		}
	}
	
	
}


function mw_datainput_item_group_btGrid(options){
	mw_datainput_item_gr_base.call(this,options);
	this.createBTGrid=function(){
		
		var options=this.options.get_param_if_object("btGrid");
		if(!mw_is_object(options)){
			options={};	
		}
		var btGrid;
		if(mw_is_object(options,"append2Container")){
			btGrid=options;
		}else{
			btGrid = new mw_bootstrap_helper_grid(options);	
		}
		
		this.btGrid=btGrid;
	}
	this.getBTGrid=function(){
```

---

*Auto-extracted from source.*
