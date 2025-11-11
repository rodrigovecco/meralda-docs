# mw_datainput_helper_value_validator

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_helper_value_validator(newValue,oldValue){`

## Source snippet

```javascript
function mw_datainput_helper_value_validator(newValue,oldValue){
	
	this.init=function(newValue,oldValue){
		this.setNewValue(newValue);
		this.setOldValue(oldValue);
		
		
	}
	this.setOldValue=function(value){
		this.oldValue=this.newValueObject(value);
			
	}
	this.setNewValue=function(value){
		this.newValue=this.newValueObject(value);
			
	}
	this.newValueObject=function(value){
		var o={};
		o.value=value;
		o.stringValue=value+"";
		o.
```

---

*Auto-extracted from source.*
