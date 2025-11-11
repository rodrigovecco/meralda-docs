# mw_devextreme_datagrid_column_abs

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_abs(){`

## Source snippet

```javascript
i]);	
			}	
		}
		
		return r;
	}
	this.add_colum=function(col){
		if(!col){
			return false;	
		}
		var cod=col.cod;
		this.columns.add_item(cod,col);
		col.setDGMan(this);
		return col;	
	}
	
	
	
}
function mw_devextreme_datagrid_column_abs(){
	this.init=function(cod,params){
		this.cod=cod;
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
	}
	this.isNewData=function(data){
		if(this.dgMan){
			return 	this.dgMan.isNewData(data);
		}
	}
	this.getRelatedObject=function(cod){
		if(this.dgMan){
			return this.dgMan.getRelatedObject(cod);	
		}
			
	}
	this.headerCellTemplateTooltipMode=function(header, i
```

---

*Auto-extracted from source.*
