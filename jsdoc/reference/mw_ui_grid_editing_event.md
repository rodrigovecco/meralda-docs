# mw_ui_grid_editing_event

**Location:** `src/public_html/res/js/ui/mwui_grid.js`

---

## Signature

`function mw_ui_grid_editing_event(ui){`

## Source snippet

```javascript
ue;
			return false;	
		}
		var url=this.get_xmlcmd_url("saveitem",{nd:info.newData,itemid:info.oldData.id});
		var a = new mw_ajax_launcher(url);
		a.run();
	}
	
}

mw_ui_grid.prototype=new mw_ui();
function mw_ui_grid_editing_event(ui){
	this.ui=ui;
	
	this.save_item=function(info){
		var _this=this;
		this.gridEvent=	info;
		var url=this.ui.get_xmlcmd_url("saveitem",{nd:info.newData,itemid:info.oldData.id});
		this.ajax = new mw_ajax_launcher(url,function(){_this.onItemUpdated()});
		this.ajax.run();
		
	}
	
	this.onItemUpdated=function(){
		var data= new mw_obj();
		data.set_params(this.ajax.getResponseXMLFirstNodeByTagnam
```

---

*Auto-extracted from source.*
