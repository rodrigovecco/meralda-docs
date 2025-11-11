# mw_datainput_item_groupwithtitle

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_groupwithtitle(options){`

## Source snippet

```javascript
nput.name=p;	
		}
		p=this.get_input_id();
		if(p){
			input.id=p;	
		}
		input.type="hidden";
		this.update_input_atts(input);
	}
		
}
mw_datainput_item_hidden.prototype=new mw_datainput_item_abs();

function mw_datainput_item_groupwithtitle(options){
	this.init(options);
	
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_container();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="card-group mwfrmgr";
		
		this.frm_group_e
```

---

*Auto-extracted from source.*
