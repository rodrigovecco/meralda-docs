# mw_datainput_item_select_option

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_select_option(cod,data){`

## Source snippet

```javascript
this.options_list.addItem(op,cod);
		op.add2finalOptionsList(this.final_options_list);
		return r;
			
	}
	
	this.init(options);
	
}

//mw_datainput_item_select.prototype=new mw_datainput_item_abs();

function mw_datainput_item_select_option(cod,data){
	this.data=data;
	this.cod=cod;
	this.add2finalOptionsList=function(listman){
		listman.addItem(this,this.cod);
	}
	this.get_lbl=function(){
		if(this.data.name){
			return this.data.name;
		}
		return this.cod;
	}
	this.get_value=function(){
		return this.cod;
	}
	this.append2select=function(sel){
		var e=this.create_dom_elem();
		if(!e){
			return false;	
		}
		sel.appendChild(e);
		r
```

---

*Auto-extracted from source.*
