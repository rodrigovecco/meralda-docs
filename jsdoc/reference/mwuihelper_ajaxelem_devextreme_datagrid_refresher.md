# mwuihelper_ajaxelem_devextreme_datagrid_refresher

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem/devextreme_datagrid.js`

---

## Signature

`function mwuihelper_ajaxelem_devextreme_datagrid_refresher(){`

## Source snippet

```javascript
an.create_data_grid_on_elem(this.dom_body);
		
		//this.datagridman=dgman;
		this.afterDataGridManSet();

			
	}
	
	
	
}
//mwuihelper_ajaxelem_devextreme_datagrid.prototype=new mwuihelper_ajaxelem();

function mwuihelper_ajaxelem_devextreme_datagrid_refresher(){
	this.afterDataGridManSet=function(){
			
	}
	this.set_datagrid_man=function(dgman){
		
		if(!dgman){
			return false;	
		}
		if(!this.dom_body){
			return false;		
		}
		dgman.init_from_params();
		dgman.create_data_grid_on_elem(this.dom_body);
		
		this.datagridman=dgman;
		this.afterDataGridManSet();
		
			
	}
	this.onLoadedDataOK=function(){
		
		
		
		if(!this.loadedData){
			return this.o
```

---

*Auto-extracted from source.*
