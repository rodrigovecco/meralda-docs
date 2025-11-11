# mw_devextreme_datagrid_ajax_saveItem

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_ajax_saveItem(man){`

## Source snippet

```javascript
rl;
	
		
	}
}
function mw_devextreme_datagrid_ajax_createItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onNewItemCreatedResponse(this);
	}
}
function mw_devextreme_datagrid_ajax_saveItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onItemSavedResponse(this);
	}
}
function mw_devextreme_datagrid_ajax_deleteItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onItemDeleteResponse(this);
	}
}


function mw_devextreme_dataStore_proccess(dataStore,params,onDone,onFail){
	this.da
```

---

*Auto-extracted from source.*
