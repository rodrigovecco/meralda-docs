# mw_datainput_item_captcha

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_captcha(options){`

## Source snippet

```javascript
ner);
		this.optionSelectorListContainer=$('<ul class="dropdown-menu"></ul>')
			.appendTo(this.leftBtnContainer);
			
			
		this.refresh_lists_options();
		return this.leftBtnContainer;
		
	}

	
	
}

function mw_datainput_item_captcha(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
	}
	this.create_left_btn=function(){
		var _this=this;
		var p;
		this.leftBtnContainer=document.createElement("div");
		this.leftBtnContainer.className="input-group-addon";
		
		this.imgContainerSelector=$('<span></span>')
			.appendTo(this.leftBtnContainer)
```

---

*Auto-extracted from source.*
