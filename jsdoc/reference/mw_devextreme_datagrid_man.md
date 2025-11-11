# mw_devextreme_datagrid_man

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_man(params){`

## Source snippet

```javascript
rs[i]);
			}
		}
	}

	this.addHandlers=function(list){
		if(!mw_is_array(list)){
			this.addHandler(list);
			return;
		}
		var i;
		for(i=0;i<list.length;i++){
			this.addHandler(list[i]);	
		}
	}
}

function mw_devextreme_datagrid_man(params){
	this.params=new mw_obj();
	this.dataKey="id";
	this.params.set_params(params);
	this.columns=new mw_objcol();
	this.data=new mw_objcol();//no usado
	this.data_key="id";//verificar uso
	
	this.getCurrentColumnsOptionsByName = function(propsToInclude, unsafe) {
		var data = {};
		var dg = this.get_data_grid();
	
		if (!dg) return false;
	
		var columnCount = dg.columnCount();
		var allData
```

---

*Auto-extracted from source.*
