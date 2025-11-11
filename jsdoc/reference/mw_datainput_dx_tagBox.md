# mw_datainput_dx_tagBox

**Location:** `src/public_html/res/js/inputs/dx.js`

---

## Signature

`function mw_datainput_dx_tagBox(options){`

## Source snippet

```javascript
provided
				if (callback && typeof callback === "function") {
					callback(insertedItem);
				}
			});
			
		}).fail(function(error) {
			console.error("Error adding item:", error);
		});
	};



}
function mw_datainput_dx_tagBox(options){
	mw_datainput_dx.call(this, options);
	
	this.createDXctr = function(container, ops){
		$($(container)).dxTagBox(ops);
		this.DXctr = $($(container)).dxTagBox('instance');
	};

	this.autoCreateItems = function(){
		var list = this.options.get_param_as_list("optionslist");
		if(!list){
			list = [];
		}
		return list.map(function(item){
			// Fuerza que el valueExpr (cod) sea string
			if
```

---

*Auto-extracted from source.*
