# mw_bootstrap_helper_row

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_row(options){`

## Source snippet

```javascript
+" "+p;	
		}
		return r;
	}
	this.getColsNum=function(){
		var p=mw_getInt(this.options.get_param_or_def("colSpan",0));
		if(p<=0){
			return 12;
		}
		if(p>12){
			return 12;
		}
		return p;
	}

	
}


function mw_bootstrap_helper_row(options){
	mw_bootstrap_helper_grid_base.call(this,options);
	this.cols=new mw_objcol();
	this.cols_num=0;
	
	this.getCol=function(colIndex){
		var col=this.cols.get_item(colIndex);
		if(col){
			return col;	
		}
		return this.def_col;
	}
	
	this.onContainerCreated=function(container){
		container.className="row";	
		var list =this.cols.get_items_by_index();
		if(list){
			for(var i=0;i<list.lengt
```

---

*Auto-extracted from source.*
