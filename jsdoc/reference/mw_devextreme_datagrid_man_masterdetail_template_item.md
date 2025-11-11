# mw_devextreme_datagrid_man_masterdetail_template_item

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_man_masterdetail_template_item(){`

## Source snippet

```javascript
function mw_devextreme_datagrid_man_masterdetail_template_item(){
	mw_devextreme_datagrid_ajax.call(this);
	this.prepareDisplay=function(){
		
	}
	this.onDataLoaded=function(){
			
	}
	this.getData=function(cod){
		if(this.responseData){
			if(cod){
				return this.responseData.get_param(cod);	
			}
			return this.responseData.params;
				
		}
	}
	
	this.getRowKey=function(){
		return this.detailInfo.key;
	}
	this.getRowData=function(cod){
		if(cod){
			retur
```

---

*Auto-extracted from source.*
