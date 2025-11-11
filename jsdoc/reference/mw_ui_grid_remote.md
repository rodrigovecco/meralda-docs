# mw_ui_grid_remote

**Location:** `src/public_html/res/js/ui/mwui_grid.js`

---

## Signature

`function mw_ui_grid_remote(info){`

## Source snippet

```javascript
s;
		this.gridEvent=	gridevent;
		var url=this.ui.get_xmlcmd_url("newitem",{nd:gridevent.data});
		this.ajax = new mw_ajax_launcher(url,function(){_this.onItemInserted()});
		this.ajax.run();
		
	}
}
function mw_ui_grid_remote(info){
	mw_ui_grid.call(this,info);
	this.after_init=function(){
		this.set_container();
		this.loadGridManager();
		
	}

}
mw_ui_grid_remote.prototype=new mw_ui();
```

---

*Auto-extracted from source.*
