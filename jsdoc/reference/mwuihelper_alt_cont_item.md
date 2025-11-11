# mwuihelper_alt_cont_item

**Location:** `src/public_html/res/js/ui/helpers/altcont.js`

---

## Signature

`function mwuihelper_alt_cont_item(cod,params,ui){`

## Source snippet

```javascript
];
			if(e.cod==cod){
				if(loadifreq){
					e.loadContIfReqAndShow();	
				}else{
					e.show();	
				}
				r=e;
			}else{
				if(!this.all_visible){
					e.hide();	
				}
			}
		}
		return r;
	}
}

function mwuihelper_alt_cont_item(cod,params,ui){
	this.init=function(cod,params,ui){
		this.params=new mw_obj();
		if(cod){
			this.cod=cod;	
		}
		if(params){
			this.params.set_params(params);
		}
		if(ui){
			this.ui=ui;	
		}
	}
	this.set_loading_overlay=function(){
		if(this.loading_overlay){
			return true;	
		}
		if(!this.container){
			return false;	
		}
		this.container.style.position="relative";
		this.loading_overlay=do
```

---

*Auto-extracted from source.*
