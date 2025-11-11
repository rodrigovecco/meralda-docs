# mwuihelper_ajaxelem_devextreme_pivotgrid

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem/devextreme_privotgrid.js`

---

## Signature

`function mwuihelper_ajaxelem_devextreme_pivotgrid(){`

## Source snippet

```javascript
function mwuihelper_ajaxelem_devextreme_pivotgrid(){
	
	this.lookupSources=new mw_objcol();
	this.createPivotGrid=function(){
		if(!this.pivotGridOptions){
			console.log("No pivot grid options set");
			return false;
		}
		this.clearBody();
		$(this.dom_body).dxPivotGrid(this.pivotGridOptions);
		return true;
	
	
	}
	this.customizeText = function(cellInfo,field) {
		
		var lookup = this.lookupSources.get_item(field.dataField);
		if(lookup){
```

---

*Auto-extracted from source.*
