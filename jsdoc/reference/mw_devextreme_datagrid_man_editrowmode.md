# mw_devextreme_datagrid_man_editrowmode

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_man_editrowmode(params){`

## Source snippet

```javascript
params){
	mw_devextreme_datagrid_man_adv.call(this,params);
	this.set_main_man=function(man){
		this.main_man=man;	
	}
	this.set_main_item=function(main_item){
		this.main_item=main_item;	
	}
	
	
	
}



function mw_devextreme_datagrid_man_editrowmode(params){
	mw_devextreme_datagrid_man_adv.call(this,params);
	
	this.set_create_data_grid_options_events=function(ops){
		var _this=this;
		if(!ops['onRowRemoved']){
			ops['onRowRemoved']=function(e){_this.onRowRemoved(e)};	
		}
		if(!ops['onRowUpdating']){
			ops['onRowUpdating']=function(e){_this.onRowUpdating(e)};	
		}
		if(!ops['onRowInserting']){
			ops['onRowInserting']=function(e){_this.onR
```

---

*Auto-extracted from source.*
