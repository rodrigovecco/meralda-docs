# mwuihelper_modal_populator_yes_no

**Location:** `src/public_html/res/js/ui/helpers/modal.js`

---

## Signature

`function mwuihelper_modal_populator_yes_no(params){`

## Source snippet

```javascript
et_param_or_def("size",false));	
		}
	}
	this.set_title=function(title){
		this.params.set_param(title,"title");
	}
	this.set_body_cont=function(cont){
		this.params.set_param(cont,"body_cont");
	}
}
function mwuihelper_modal_populator_yes_no(params){
	this.params=new mw_obj();
	this.params.set_params(params);
	this.body_input_data=new mw_obj();
	this.actions=new mw_objcol();
	this.noClick=function(){
		this.hide();
		this.afterNoClick();
	}
	this.afterNoClick=function(){
			
	}
	this.afterYesClick=function(){
			
	}
	this.yesClick=function(){
		this.hide();
		this.afterYesClick();
	}
	this.init_dafault=function(yesdanger){
		this.set_
```

---

*Auto-extracted from source.*
