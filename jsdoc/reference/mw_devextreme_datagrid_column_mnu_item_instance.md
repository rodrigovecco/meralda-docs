# mw_devextreme_datagrid_column_mnu_item_instance

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_mnu_item_instance(mnuitem,cellElement, cellInfo){`

## Source snippet

```javascript
plate(cellElement, cellInfo)};
		}
		if(!opts["cellTemplate"]){
			opts.cellTemplate=function(cellElement, cellInfo){_this.cellTemplate(cellElement, cellInfo)};
		}
		
	}
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_mnu_item_instance(mnuitem,cellElement, cellInfo){
	this.mnuitem=mnuitem;
	this.cellElement=cellElement;
	this.cellInfo=cellInfo;
	this.add2Container=function(container){
		var elem=this.get_dom_elem();
		if(elem){
			if(container){
				$(elem).appendTo(container);	
			}
		}
	}
	this.get_data=function(cod){
		if(!mw_is_object(this.cellInfo)){
			return false;	
		}
		if(!mw_is_object(this.cellInfo.data)){
			return f
```

---

*Auto-extracted from source.*
