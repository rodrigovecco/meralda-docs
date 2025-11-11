# mw_devextreme_dataStore_proccess

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_dataStore_proccess(dataStore,params,onDone,onFail){`

## Source snippet

```javascript
ponse(this);
	}
}
function mw_devextreme_datagrid_ajax_deleteItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onItemDeleteResponse(this);
	}
}


function mw_devextreme_dataStore_proccess(dataStore,params,onDone,onFail){
	this.dataStore=dataStore;
	this.params=params;
	this.cusOnDone=onDone;
	this.cusOnFail=onFail;
	this.onDone=function(dataItem){
		this.data=dataItem;
		if(mw_is_function(this.cusOnDone)){
			this.cusOnDone(dataItem,this);	
		}
	}
	this.onFail=function(error){
		this.error=error;
		if(mw_is_function(this.cusOnFail)){
			this.cusOnFail(error,this);	
		}
	}
	this.exe
```

---

*Auto-extracted from source.*
