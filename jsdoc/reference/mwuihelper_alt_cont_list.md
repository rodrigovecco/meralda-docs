# mwuihelper_alt_cont_list

**Location:** `src/public_html/res/js/ui/helpers/altcont.js`

---

## Signature

`function mwuihelper_alt_cont_list(ui){`

## Source snippet

```javascript
function mwuihelper_alt_cont_list(ui){
	this.ui=ui;
	this.items=new mw_objcol();
	
	this.addItemByData=function(cod,data){
		var i=new mwuihelper_alt_cont_item(cod,data,this.ui);
		this.add_item(i);
		return i;
	}
	this.get_item=function(cod){
		return this.items.get_item(cod);	
	}
	this.show_all=function(loadifreq){
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		
		var e;
		for(var i=0;i<list.len
```

---

*Auto-extracted from source.*
