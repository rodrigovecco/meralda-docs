# mwuihelper_modal

**Location:** `src/public_html/res/js/ui/helpers/modal.js`

---

## Signature

`function mwuihelper_modal(ui){`

## Source snippet

```javascript
onclick:function(){_this.yesClick()},
		});
		gr.addItem(btn,"yes");
		
		this.set_footer_input(gr);
		return gr;
	}
	
}
mwuihelper_modal_populator_yes_no.prototype=new mwuihelper_modal_populator();

function mwuihelper_modal(ui){
	this.ui=ui;
	this.set_cont=function(title,body,footer){
		this.set_title(title);
		this.set_body(body);
		this.set_footer(footer);
		
		
	}
	this.set_footer=function(cont){
		var e=this.get_footer();
		mw_dom_set_cont(e,cont);
		if(!cont){
			mw_hide_obj(e);	
		}else{
			mw_show_obj(e);	
		}
	}
	this.set_body=function(cont){
		return mw_dom_set_cont(this.get_body(),cont);	
	}
	this.set_title
```

---

*Auto-extracted from source.*
