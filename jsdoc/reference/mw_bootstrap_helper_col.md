# mw_bootstrap_helper_col

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_col(options){`

## Source snippet

```javascript
getJQContainer();
		if(!cont){
			return false;
		}
		var list=$(cont).find('.'+className);
		if(!list){
			return false;	
		}
		if(!list.length){
			return false;	
		}
		return list[0];
		
		
	}
	
}


function mw_bootstrap_helper_col(options){
	mw_bootstrap_helper_grid_base.call(this,options);
	this.onContainerCreated=function(container){
		container.className=this.getColClassName();
	}
	this.getColClassName=function(){
		var r="col-"+this.options.get_param_or_def("colSizeCod","md")+"-"+this.getColsNum();
		var p=this.options.get_param_or_def("aditionalclasses",false);
		if(p){
			r=r+" "+p;	
		}
		return r;
	}
	this.getColsNu
```

---

*Auto-extracted from source.*
