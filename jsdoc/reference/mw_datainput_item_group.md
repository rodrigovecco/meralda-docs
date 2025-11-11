# mw_datainput_item_group

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_group(options){`

## Source snippet

```javascript
_array_process(this.options_list.getList(),function(data,index){data.append2select(gr)});	
		
		return gr;
	}
	
	
}
mw_datainput_item_select_option_gr.prototype=new mw_datainput_item_select_option();

function mw_datainput_item_group(options){
	this.init(options);
	this.append_to_container=function(container){
		var finalContainer=container;
		if(this.options.get_param_or_def("hasOwnContainer",false)){
			if(container){
				finalContainer=document.createElement("div");
				container.appendChild(finalContainer);
				this.frm_group_elem=finalContainer;
			}
			//
		}
		
		this.beforeAppend();
		if(!this.sub_items_list){
			retur
```

---

*Auto-extracted from source.*
