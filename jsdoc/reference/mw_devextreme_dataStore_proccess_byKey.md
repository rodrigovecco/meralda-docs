# mw_devextreme_dataStore_proccess_byKey

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_dataStore_proccess_byKey(dataStore,params,onDone,onFail){`

## Source snippet

```javascript
e(dataItem,this);	
		}
	}
	this.onFail=function(error){
		this.error=error;
		if(mw_is_function(this.cusOnFail)){
			this.cusOnFail(error,this);	
		}
	}
	this.exec=function(){
		return false;	
	}
	
}
function mw_devextreme_dataStore_proccess_byKey(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.byKey(this.params.key)
		.done(function(dataItem) {
			_this.onDone(dataItem);
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}
function mw_devextreme_dataStore_proccess_load(dataStore,params,onDone,
```

---

*Auto-extracted from source.*
