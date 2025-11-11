# mw_devextreme_datagrid_reg

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_reg(cod,data){`

## Source snippet

```javascript
on(){
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
	this.data=data;
	this.array_data={};
	this.set_man=function(man){
		this.man=man;
	}
	this.add_array_data=function(cod,data){
		if(!this.array_data[cod]){
			this.array_data[cod]=new Array();	
		}
		this.array_data[cod].push(data);
	}
	this.get_array_data=function(cod){
		if(!this.array_data[cod]){
			this.array_data[cod]=new Array();	
		}
		return this.array_data[cod];
```

---

*Auto-extracted from source.*
