# mw_devextreme_datagrid_ajax

**Location:** `src/public_html/res/js/mwdevextreme/mw_datagrid_helper_adv.js`

---

## Signature

`function mw_devextreme_datagrid_ajax(man){`

## Source snippet

```javascript
}
	this.onInitNewRow=function(info){
		var fnc=this.params.get_param_if_function("onInitNewRow");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onInitNewRowDef(info);	
		}
	}
	
		
}


function mw_devextreme_datagrid_ajax(man){
	this.man=man;
	this.allowJsCode=false;
	this.eventInfo=new mw_obj();
	this.setEventInfo=function(info){
		this.eventInfo.set_params(info);
	}
	this.getEventInfo=function(dotkey){
		return this.eventInfo.get_param(dotkey);
	}
	this.set_url=function(url,params){
		this.base_url=url;
		this.url_params=params;	
	}
	this.onAjaxResponseLoaded=function(){
			
	}
	
	this.onAjaxResponse=function(){
```

---

*Auto-extracted from source.*
