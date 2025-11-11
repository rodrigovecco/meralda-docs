# mw_devextreme_dataStore_proccess_remove

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_dataStore_proccess_remove(dataStore,params,onDone,onFail){`

## Source snippet

```javascript
;
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
function mw_devextreme_dataStore_proccess_remove(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.remove(this.params.key)
		.done(function() {
			_this.onDone({result:true});
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}

function mw_devextreme_datagrid_reg(cod,data){
	this.cod=cod;
	this.data
```

---

*Auto-extracted from source.*
