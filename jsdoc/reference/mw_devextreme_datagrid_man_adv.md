# mw_devextreme_datagrid_man_adv

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_man_adv(params){`

## Source snippet

```javascript
w Array();	
		}
		this.array_data[cod].push(data);
	}
	this.get_array_data=function(cod){
		if(!this.array_data[cod]){
			this.array_data[cod]=new Array();	
		}
		return this.array_data[cod];
	}
		
}


function mw_devextreme_datagrid_man_adv(params){
	mw_devextreme_datagrid_man.call(this,params);
	this.next_uniq_index=0;
	this.setUI=function(ui){
		this.ui=ui;
	}
	this.clearData=function(){
		this.next_uniq_index=0;
		if(this.regs_items_col){
			this.regs_items_col=new mw_objcol();
		}
		if(this.DataStore){
			this.DataStore.clear();
		}
	}
	this.clear=function(){
		this.clearData();
		this.refreshGrid();	
	}

	this.loadDataByAjax=fun
```

---

*Auto-extracted from source.*
