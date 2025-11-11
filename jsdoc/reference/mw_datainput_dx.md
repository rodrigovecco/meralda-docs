# mw_datainput_dx

**Location:** `src/public_html/res/js/inputs/dx.js`

---

## Signature

`function mw_datainput_dx(options){`

## Source snippet

```javascript
function mw_datainput_dx(options){
	mw_datainput_item_abs.call(this);
	this.init(options);
	this.get_input_value=function(){
		return this.DXValue;
		
	}
	this.setInputStateProp=function(cod,val,children){
	
		//cod: disabled, readOnly , required 
		if(val){
			val=true;	
		}else{
			val=false;	
		}
		this.options.set_param(val,"state."+cod);
		if(this.input_elem){
			this.update_input_atts(this.input_elem);	
		}
		if(thi
```

---

*Auto-extracted from source.*
