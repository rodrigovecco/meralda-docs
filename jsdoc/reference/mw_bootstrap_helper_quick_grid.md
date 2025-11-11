# mw_bootstrap_helper_quick_grid

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_quick_grid(){`

## Source snippet

```javascript
r);
		return this.container;
	}
	this.doInitElems=function(){
			
	}
	
	this.initElems=function(){
		if(this.initElemsDone){
			return;	
		}
		this.initElemsDone=true;
		this.doInitElems();
	}
	
		
}
function mw_bootstrap_helper_quick_grid(){
	this.currentRow=false;
	this.currentRowColsNum=0;
	this.maxCols=12;
	this.defColspan=1;
	this.colsSize="md";
	this.setContainer=function(container){
		this.container=container;
	}
	this.addContent=function(content,colsNum){
		var col=this.addCol(colsNum);
		if(!col){
			return false;
		}
		if(content){
			col.append(content);	
		}
		return col;
	}
	this.addCol=function(colsNum){
		if(!colsNum)
```

---

*Auto-extracted from source.*
