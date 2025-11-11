# mw_devextreme_datagrid_column_band

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_column_band(cod,params){`

## Source snippet

```javascript
displayExpr: displayExpr,
			value:cellInfo.value,
			onValueChanged: function (e) {
                        cellInfo.setValue(e.value);
                    }
		});
	}
	
	this.init(cod,params);
	
}
function mw_devextreme_datagrid_column_band(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
	}
	this.init(cod,params);
		
}


function mw_devextreme_datagrid_column_link(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	
	this.cellTemplate=function(cellElement, cellInfo){
		var args=this.params.get_param_if_object("link_mode.args");
		var varargs=this.params.get_
```

---

*Auto-extracted from source.*
