# mw_datainput_item_datagrid_row

**Location:** `src/public_html/res/js/inputs/datagrid.js`

---

## Signature

`function mw_datainput_item_datagrid_row(cod,data,man){`

## Source snippet

```javascript
function mw_datainput_item_datagrid_row(cod,data,man){
	this.cod=cod;
	this.data=new mw_obj();	
	this.data.set_params(data);
	this.man=man;
	this.deleted=false;
	this.set_col_item=function(colitem){
		this.colitem=colitem;	
	}
	this.addValue2list=function(list){
		if(!this.deleted){
			list.push(this.data.get_param());
		}
	}
	this.addInputs2container=function(container){
		var c=document.createElement("div");
		var e=document.createEle
```

---

*Auto-extracted from source.*
