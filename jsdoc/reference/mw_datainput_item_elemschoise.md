# mw_datainput_item_elemschoise

**Location:** `src/public_html/res/js/inputs/elemschoise.js`

---

## Signature

`function mw_datainput_item_elemschoise(options){`

## Source snippet

```javascript
function mw_datainput_item_elemschoise(options){
	this.options_list=new mw_arraylist();
	this.selected_items_in_order=new mw_objcol();
	mw_datainput_item_abs.call(this);
	this.afterInit=function(){
		
		var list=this.options.get_param_as_list("optionslist");
		//console.log(list);
		var _this=this;
		if(list){
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});		
		}
	}
	this.set_input_value=functio
```

---

*Auto-extracted from source.*
