# mw_bootstrap_helper_grid

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_grid(options){`

## Source snippet

```javascript
(options);	
		}
		this.cols_num++;
		var id=this.cols_num;
		col.set_id(id);
		col.set_parent(this);
		this.cols.add_item(id,col);
		if(!this.def_col){
			this.def_col=col;	
		}
		return col;
	}
		
}
function mw_bootstrap_helper_grid(options){
	mw_bootstrap_helper_grid_base.call(this,options);
	this.rows=new mw_objcol();
	this.rows_num=0;
	this.getCol=function(rowIndex,colIndex){
		var row=this.getRow(rowIndex);
		if(row){
			return row.getCol(colIndex);	
		}
	}
	this.getRow=function(rowIndex){
		var row=this.rows.get_item(rowIndex);
		if(row){
			return row;	
		}
		return this.def_row;
	}
	
	this.onContainerCreated=function(c
```

---

*Auto-extracted from source.*
