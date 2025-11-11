# mw_datainput_item_with_placeholders

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_with_placeholders(options,dontinit){`

## Source snippet

```javascript
sNumber(value);
		return o;
		
		
	}
	this.isEmptyString=function(val){
		if(typeof(val)=="string"){
			if(val==""){
				return true;
			}
		}
		return false;
	}
	
	
	this.init(newValue,oldValue);	
}

function mw_datainput_item_with_placeholders(options,dontinit){
	mw_datainput_item_abs.call(this);
	//

	//mw_datainput_item_base.call(this,options);
	this.onRightBtnClick=function(){
		var fnc=this.options.get_param_if_function("rightBtn.onclick");
		if(fnc){
			fnc(this);	
		}
		var m=this.getPHMan();
		if(m){
			m.openModalForMWInput(this);	
		}
		
			
	}
	this.getPHMan=function(){
		return this.options.get_param_if_object("placeholderman
```

---

*Auto-extracted from source.*
