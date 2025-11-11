# mw_devextreme_chart_serie

**Location:** `src/public_html/res/js/mwdevextreme/mw_chart_helper.js`

---

## Signature

`function mw_devextreme_chart_serie(cod,params){`

## Source snippet

```javascript
serie_options=function(opts){
			
	}
	this.get_options=function(){
		var o=this.params.get_param_or_def("options",{});
		this.set_serie_options(o);
		return o;	
	}
	this.after_init=function(){};
		
}

function mw_devextreme_chart_serie(cod,params){
	this.init(cod,params);
}
mw_devextreme_chart_serie.prototype=new mw_devextreme_chart_serie_abs();
```

---

*Auto-extracted from source.*
