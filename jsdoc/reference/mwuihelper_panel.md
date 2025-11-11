# mwuihelper_panel

**Location:** `src/public_html/res/js/ui/helpers/panel.js`

---

## Signature

`function mwuihelper_panel(ui){`

## Source snippet

```javascript
function mwuihelper_panel(ui){
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
	this.set_t
```

---

*Auto-extracted from source.*
