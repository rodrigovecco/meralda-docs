# mw_datainput_item_DX_dropDownTreeView

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function mw_datainput_item_DX_dropDownTreeView(options){`

## Source snippet

```javascript
){
			required=false;	
		}
		
		if(this.dx_ctr){
			
			this.dx_ctr.option("disabled",disabled);	
			this.dx_ctr.option("required",required);	
			this.dx_ctr.option("readOnly",readOnly);	
		}
	}
	

}


function mw_datainput_item_DX_dropDownTreeView(options){
    mw_datainput_item_dx_normal.call(this, options);

    this.createDXctr = function(container, ops){
        //console.log("[DX_dropDownTreeView] createDXctr", ops);
        return $($(container)).dxDropDownBox(ops).dxDropDownBox('instance');
    };

    this.arraysEqual = function(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if (arr1.le
```

---

*Auto-extracted from source.*
