# mw_bootstrap_helper_panel

**Location:** `src/public_html/res/js/mw_bootstrap_helper.js`

---

## Signature

`function mw_bootstrap_helper_panel(options){`

## Source snippet

```javascript
function mw_bootstrap_helper_panel(options){
	mw_bootstrap_helper_container.call(this,options);
	this.afterAppend=function(){
		
		var p=this.options.get_param_or_def("title",false);
		
		this.set_title(p);	
		p=this.options.get_param_or_def("body",false);
		this.set_body(p);	
		p=this.options.get_param_or_def("footer",false);
		this.set_footer(p);	
		if(this.options.get_param_or_def("hideFooter",false)){
			mw_hide_obj(this.get_fo
```

---

*Auto-extracted from source.*
