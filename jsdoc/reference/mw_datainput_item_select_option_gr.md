# mw_datainput_item_select_option_gr

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_select_option_gr(cod,data){`

## Source snippet

```javascript
endChild(e);
		return e;
	}
	this.create_dom_elem=function(){
		var option=document.createElement('option');
		option.innerHTML = this.get_lbl()+"";
		option.value = this.cod;
		return option;
	}
	
}
function mw_datainput_item_select_option_gr(cod,data){
	this.data=data;
	this.cod=cod;
	this.create_options_list=function(){
		this.options_list=new mw_arraylist();
		var list=	this.data.options
		
		if(list){
			var _this=this;
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});	
			//mw_objcol_array_process(list);	
		}
			
	}
	this.add_option_from_data=function(data){
		if(!mw_is_object(data)){
			retu
```

---

*Auto-extracted from source.*
