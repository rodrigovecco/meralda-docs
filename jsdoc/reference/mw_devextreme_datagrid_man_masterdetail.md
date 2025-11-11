# mw_devextreme_datagrid_man_masterdetail

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_man_masterdetail(params){`

## Source snippet

```javascript
url,params);	
		}
		this.exec();
	}
	this.setDetailInfo=function(detailInfo){
		this.detailInfo=detailInfo;
	}
	this.setDetailElement=function(detailElement){
		this.detailElement=detailElement;
	}
}




function mw_devextreme_datagrid_man_masterdetail(params){
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
		if(!ops['o
```

---

*Auto-extracted from source.*
