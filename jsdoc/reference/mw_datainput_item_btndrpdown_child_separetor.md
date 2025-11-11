# mw_datainput_item_btndrpdown_child_separetor

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_btndrpdown_child_separetor(options){`

## Source snippet

```javascript
se{
			input.readOnly=false;		
		}
		if(required){
			input.required=true;
		}else{
			input.required=false;		
		}
		
	}
	

}
mw_datainput_item_btndrpdown_child.prototype=new mw_datainput_item_btn();

function mw_datainput_item_btndrpdown_child_separetor(options){
	this.init(options);
	this.create_input_elem=function(){
		return false;
	}

	this.create_list_elem_container_empty=function(){
		var e=document.createElement("li");
		$(e).attr("role","separator");
		e.className="divider";

		return e;
	}
	

}
mw_datainput_item_btndrpdown_child_separetor.prototype=new mw_datainput_item_btn();

function mw_datainput_item_html(options){
	this.init(options
```

---

*Auto-extracted from source.*
