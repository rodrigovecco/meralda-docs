# mw_datainput_item_DXnumber

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function mw_datainput_item_DXnumber(options){`

## Source snippet

```javascript
ms["dataSource"]){
				params["dataSource"]=this.getDataSource();
			}


		}
		if(!params["onItemClick"]){
			params["onItemClick"]=function(e){_this.onItemClick(e)};
		}
		
		return params;

	
	}

}
function mw_datainput_item_DXnumber(options){
	mw_datainput_item_dx_normal.call(this,options);
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxNumberBox(ops);
		
		return $($(container)).dxNumberBox('instance');
		
	}

}

function mw_datainput_item_normal_dx_textbox(options){
	mw_datainput_item_dx_normal.call(this,options);

}

function mw_datainput_item_dx_normal(options){
	mw_datainput_item_
```

---

*Auto-extracted from source.*
