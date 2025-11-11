# mw_datainput_item_with_optionsList_base

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_with_optionsList_base(){`

## Source snippet

```javascript
}
		var e=this.create_in_html_container();
		if(e){
			c.appendChild(e);	
		}
		
		this.create_notes_elem_if_req();
		return c;
	}

	

}
mw_datainput_item_html.prototype=new mw_datainput_item_abs();



function mw_datainput_item_with_optionsList_base(){
	this.options_list=new mw_objcol();
	this.update_display_if_created=function(){
		
		this.refresh_lists_options();	
	}
	this.refresh_lists_options=function(){
	}
	
	this.beforeAppend=function(){
		var p=this.options.get_param_or_def("value",false);
		if(p){
			this.set_orig_value(p);	
		}
		this.addItemsFromOptions();
		this.initOptionsList();
	}
	
	this.initOptionsList=function(){
		var list=t
```

---

*Auto-extracted from source.*
