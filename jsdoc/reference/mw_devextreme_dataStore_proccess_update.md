# mw_devextreme_dataStore_proccess_update

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_dataStore_proccess_update(dataStore,params,onDone,onFail){`

## Source snippet

```javascript
=function(){
		var _this=this;
		this.dataStore.load(this.params)
		.done(function(result) {
			_this.onDone(result);
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}

function mw_devextreme_dataStore_proccess_update(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.update(this.params.key,this.params.values)
		.done(function(dataItem) {
			_this.onDone(dataItem);
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}
function mw_devextreme_dataStore_proccess_remove(da
```

---

*Auto-extracted from source.*
