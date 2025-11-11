# mw_datainput_item_submit

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_submit(options){`

## Source snippet

```javascript
f(p){
			innerHTML=innerHTML+p;
		}
		this.lblJQ.html(innerHTML);
		this.set_def_input_atts(c);
		return c;
	}
	
	
	this.init(options);	
}
mw_datainput_item_btn.prototype=new mw_datainput_item_abs();

function mw_datainput_item_submit(options){
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_input_elem();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	this._onClick=function(){
		var fnc=this.options.get_param_if_function("onclick");
		if(fnc){
			return fnc(this);	
		}
		return true;
	}
	this.create_input_elem=f
```

---

*Auto-extracted from source.*
