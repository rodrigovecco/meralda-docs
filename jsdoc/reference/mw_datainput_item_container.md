# mw_datainput_item_container

**Location:** `src/public_html/res/js/inputs/container.js`

---

## Signature

`function mw_datainput_item_container(options){`

## Source snippet

```javascript
p(val);
		
	}
	
	this.get_input_value=function(){
		return this.get_input_value_as_group();
	}
	this.getInputValueIfNotEmpty=function(){
		return this.get_input_value_as_group_IfNotEmpty();
	}
	

	
}



function mw_datainput_item_container(options){
	this.init(options);
	this.noValueMode=function(){
		return true;	
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		if(this.options.get_param_or_def("childrenOnCols",false)){
			//c.className="container";
			this.childrenContainer=document.createElement("div");
			this.childrenContainer.className="row";
			c.appendChild(this.childrenContainer);
```

---

*Auto-extracted from source.*
