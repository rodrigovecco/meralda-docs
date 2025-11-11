# mwuihelper_ajaxelem_auto

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem.js`

---

## Signature

`function mwuihelper_ajaxelem_auto(params){`

## Source snippet

```javascript
se){
			return true;
		}
		return false;
	}
	
	this.set_cont_xml_url=function(url){
		
		var _this=this;
		this.load_cont_ajax= new mw_ajax_launcher(url,function(){_this.onContXMLLoaded()});
	}
	
	
}

function mwuihelper_ajaxelem_auto(params){
	mwuihelper_ajaxelem.call(this,params);
	this.onLoadedDataOK=function(){
		
		var cont="";
		if(this.loadedData){
			cont=this.loadedData.get_param_or_def("htmlcont",cont);
		}
		mw_dom_set_cont(this.dom_body,cont);
		if(this.loadedData){
			var fnc=this.loadedData.get_param_if_function("jsresponse.init");
			if(fnc){
				fnc.call(this);
			}
		}
			
	}
	
	
	
}
```

---

*Auto-extracted from source.*
