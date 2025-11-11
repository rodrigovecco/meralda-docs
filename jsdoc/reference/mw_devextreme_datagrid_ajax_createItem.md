# mw_devextreme_datagrid_ajax_createItem

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_ajax_createItem(man){`

## Source snippet

```javascript
}
	}
	this.get_url=function(){
		if(!this.base_url){
			return false;	
		}
		var u =new mw_url();
		var url=u.get_url(this.base_url,this.url_params);
		//console.log(url);
		return url;
	
		
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
	mw_devextreme_datagrid_ajax.
```

---

*Auto-extracted from source.*
