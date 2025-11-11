# mw_datainput_item_hiddenpass

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_hiddenpass(options){`

## Source snippet

```javascript
}
		if(!this.imgContainerSelector){
			return false;	
		}
		this.imgContainerSelector.empty();
		this.imgSelector=$('<img src="'+url+'">')
			.appendTo(this.imgContainerSelector);
		
		
	}

	
	
}


function mw_datainput_item_hiddenpass(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="password";
	}

	this.create_right_btn=function(){
		var _this=this;
		this.rightBtnContainer=document.createElement("span");
		//this.rightBtnContainer.className="input-group-text";
		//this.rightBtnContainer.innerHTML="";
		$(this.rightBtnContainer).html("<i class=
```

---

*Auto-extracted from source.*
