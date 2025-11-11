# mw_devextreme_datagrid_column_txtlinebreak

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_txtlinebreak(cod,params){`

## Source snippet

```javascript
et_param("link_mode.enable")){
			if(!opts["cellTemplate"]){
				opts.cellTemplate=function(cellElement, cellInfo){_this.cellTemplate(cellElement, cellInfo)};
			}
		}
	}
	this.init(cod,params);
		
}
function mw_devextreme_datagrid_column_txtlinebreak(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	
	this.cellTemplate=function(cellElement, cellInfo){
		var str=cellInfo.text;
		var elem=document.createElement("div");
		var breakTag = '<br>';
		elem.innerHTML=(str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');		
		//elem.innerHTML=cellInfo.text;
		$(elem)
          .appendTo(cellElement);
	}
	this.editCellTem
```

---

*Auto-extracted from source.*
