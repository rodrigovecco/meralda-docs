# mw_datainput_item_DX_normal_Autocomplete

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function mw_datainput_item_DX_normal_Autocomplete(options){`

## Source snippet

```javascript
//20240122
function mw_datainput_item_DX_normal_Autocomplete(options){
	mw_datainput_item_dx_normal.call(this,options);
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxAutocomplete(ops);
		
		return $($(container)).dxAutocomplete('instance');
		
	}
	this.onItemClick=function(e){
		console.log("onItemClick",e);
		//can be rewritten by UI or others
	}
	
	this.getDataStore=function(){
		if(!this.DataStore){
			this.DataS
```

---

*Auto-extracted from source.*
