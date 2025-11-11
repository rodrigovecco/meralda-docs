# mw_input_elem_chkbox

**Location:** `src/public_html/res/js/inputsman.js`

---

## Signature

`function mw_input_elem_chkbox(frmman,inputname,params){`

## Source snippet

```javascript
var _v=mw_getNumber(_input.value);
			
			if(_v>_ref){
				_input.value="";	
			}else{
				_input.value=_v;		
			}
			
		});	
		
	}

	
	_input.onchange=function(){_this.do_after_change_events()}	
	
}


function mw_input_elem_chkbox(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}
mw_input_elem_chkbox.prototype=new mw_input_elem_abs();
mw_input_elem_chkbox.prototype.isChecked=function(){
	if(!this.chkbox){
		return false;	
	}
	if(this.chkbox.checked){
		return true;		
	}
	return false;	
	
}
mw_input_elem_chkbox.prototype.onLabelClick=function(){
	var val=true;
	if(!this.input){
		return false;	
	}
	if(!thi
```

---

*Auto-extracted from source.*
