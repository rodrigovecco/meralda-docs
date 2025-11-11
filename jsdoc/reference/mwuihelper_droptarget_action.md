# mwuihelper_droptarget_action

**Location:** `src/public_html/res/js/ui/mwuihelpers.js`

---

## Signature

`function mwuihelper_droptarget_action(cod,target){`

## Source snippet

```javascript
;
			
			
		}
		this.on_inactive();
		
		
		return this.elem;
	}

	this.get_elem=function(){
		if(this.elem){
			return this.elem;	
		}
		this.create_elem();
		return this.elem ;
	}
	this.init(ui);
}
function mwuihelper_droptarget_action(cod,target){
	this.set_target_and_cod=function(cod,target){
		this.cod=cod;
		this.target=target;
	}
	this.set_target_and_cod(cod,target);
	this.onDragEnter=function(ev){
		//return true;	
	}
	this.onDrop=function(ev){
		//this.target.ui.debug_msg("drop target action "+this.cod);
	}
	this.onDropSrcItem=function(src_item){
		//this.target.ui.debug_msg("drop target action "+this.cod);
	}
	
	this.is_
```

---

*Auto-extracted from source.*
