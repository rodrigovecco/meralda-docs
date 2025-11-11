# mw_devextreme_datagrid_events_man

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper.js`

---

## Signature

`function mw_devextreme_datagrid_events_man(cod){`

## Source snippet

```javascript
a_col_item(cod);	
		}
	}
	this.get_data_col_item_value=function(id,cod){
		var o=this.get_data_col_item(id);
		if(!o){
			return false;	
		}
		if(!cod){
			return o;	
		}
		return o[cod];
	}
	
	
		
}
function mw_devextreme_datagrid_events_man(cod){
	this.cod=cod;
	this.handlers=new Array();
	this.setDataGridMan=function(dataGridMan){
		this.dataGridMan=dataGridMan;
	}
	this.addHandler=function(handler){
		
		if(!mw_is_function(handler)){
			return false;
		}
		this.handlers.push(handler);
		return true;
		
			
	}
	this.addEvents2DG=function(dg){
		
		if(!dg){
			return false;	
		}
		for(var i=0;i<this.handlers.length;i++){
			if(mw_is_
```

---

*Auto-extracted from source.*
