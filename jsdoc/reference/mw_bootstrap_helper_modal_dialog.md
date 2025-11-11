# mw_bootstrap_helper_modal_dialog

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_modal_dialog(options){`

## Source snippet

```javascript
adingTitle;
	}
	this.get_body=function(){
		return this.panelBody;
	}
	
	this.show=function(){
		mw_show_obj(this.domContainer);	
			
	}
	this.hide=function(){
		mw_hide_obj(this.domContainer);	
	}
}

function mw_bootstrap_helper_modal_dialog(options){
	this.options=new mw_obj();
	if(options){
		this.options.set_params(options);
	}
	this.setDisplayType=function(dType,modal){
		var m=this.getModal(modal);
		if(m){
			m.setDisplayType(dType);	
		}
	}
	this.show=function(modal){
		var m=this.getModal(modal);
		if(m){
			m.show();	
		}
	}
	this.getModal=function(modal){
		if(modal){
			return this.setModal(modal);
		}
		return this.modal;
```

---

*Auto-extracted from source.*
