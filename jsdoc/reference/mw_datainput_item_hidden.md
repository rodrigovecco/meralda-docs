# mw_datainput_item_hidden

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_hidden(options){`

## Source snippet

```javascript
}
		return valman;
		
			
	}
	this.save_old_value=function(){
		var valman=this.numValMan(this.get_input_value(),this.oldValue);
		//console.log(valman);
		this.oldValue=valman.finalValue;
	}

	
	
}


function mw_datainput_item_hidden(options){
	this.init(options);
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var inputelem=this.get_input_elem();
		if(inputelem){
			container.appendChild(inputelem);
			this.afterAppend();
			return true;	
		}
	}
	this.set_def_input_atts=function(input){
		var p;
		p=this.get_input_name();
		if(p){
			input.name=p;	
		}
		p=this.g
```

---

*Auto-extracted from source.*
