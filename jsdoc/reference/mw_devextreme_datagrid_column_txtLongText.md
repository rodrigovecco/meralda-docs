# mw_devextreme_datagrid_column_txtLongText

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_txtLongText(cod,params){`

## Source snippet

```javascript
lElement, cellInfo)};
		}
		if(!opts["editCellTemplate"]){
			opts.editCellTemplate=function(cellElement, cellInfo){_this.editCellTemplate(cellElement, cellInfo)};
		}
	}
	this.init(cod,params);
		
}
function mw_devextreme_datagrid_column_txtLongText(cod,params){
	mw_devextreme_datagrid_column_txtlinebreak.call(this);
	this.init(cod,params);
	this.cellTemplate=function(cellElement, cellInfo){
		var str=cellInfo.text;
		var breakTag = '<br>';
		var e=$("<div>")
		.addClass("dxGridLongTextWpopover")
		.html((str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2'))
		.appendTo(cellElement);
		var popover=$("<div>")
		.html((str
```

---

*Auto-extracted from source.*
