# mw_dx_context_menu_item_link

**Location:** `src/public_html/res/js/mwdevextreme/mw_context_menu.js`

---

## Signature

`function mw_dx_context_menu_item_link(data){`

## Source snippet

```javascript
turn false;	
			}
		}
		var ch=new mw_dx_context_menu_item(data);
		return ch;
	}
	
}



function mw_dx_context_menu_item(data){
	mw_dx_context_menu_item_base.call(this);
	this.set_data(data);
	
		
}
function mw_dx_context_menu_item_link(data){
	mw_dx_context_menu_item_base.call(this);
	this.set_data(data);
	this.newInnerDomElem=function(evtn){
		/*
		var args=this.params.get_param_if_object("link_mode.args");
		var varargs=this.params.get_param_if_object("link_mode.varargs");
		var url_creator=new mw_url();
		var url=url_creator.get_url_from_data_varargs(this.params.get_param_or_def("link_mode.url","")
					,varargs,cellInfo.data
```

---

*Auto-extracted from source.*
