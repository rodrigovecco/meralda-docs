# mw_datainput_item_html

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_html(options){`

## Source snippet

```javascript
var e=document.createElement("li");
		$(e).attr("role","separator");
		e.className="divider";

		return e;
	}
	

}
mw_datainput_item_btndrpdown_child_separetor.prototype=new mw_datainput_item_btn();

function mw_datainput_item_html(options){
	this.init(options);
	this.create_in_html_container=function(){
		var n=this.options.get_param_or_def("cont","");
		
		
		var e=document.createElement("div");
		if(this.is_horizontal()){
			e.className="col-sm-10";	
		}
		mw_dom_set_cont(e,n);
		this.innerHtmlContainer=e;
		return e;
		
	}
	this.getContentElem=function(){
		return this.innerHtmlContainer;
	}
	
	this.create_container=func
```

---

*Auto-extracted from source.*
