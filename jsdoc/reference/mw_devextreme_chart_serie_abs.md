# mw_devextreme_chart_serie_abs

**Location:** `src/public_html/res/js/mwdevextreme/mw_chart_helper.js`

---

## Signature

`function mw_devextreme_chart_serie_abs(){`

## Source snippet

```javascript
(var i=0;i<list.length;i++){
			r.push(list[i].get_options());	
		}
		return r;
	}
	this.add_serie=function(serie){
		var cod=serie.cod;
		this.series.add_item(cod,serie);
		return serie;	
	}
	
	
	
}
function mw_devextreme_chart_serie_abs(){
	this.init=function(cod,params){
		this.cod=cod;
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
	}
	this.set_serie_options=function(opts){
			
	}
	this.get_options=function(){
		var o=this.params.get_param_or_def("options",{});
		this.set_serie_options(o);
		return o;	
	}
	this.after_init=function(){};
		
}

function mw_devextreme_chart_serie(cod,params){
	th
```

---

*Auto-extracted from source.*
