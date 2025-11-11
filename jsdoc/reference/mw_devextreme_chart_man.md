# mw_devextreme_chart_man

**Location:** `src/public_html/res/js/mwdevextreme/mw_chart_helper.js`

---

## Signature

`function mw_devextreme_chart_man(params){`

## Source snippet

```javascript
function mw_devextreme_chart_man(params){
	this.params=new mw_obj();
	
	this.params.set_params(params);
	this.series=new mw_objcol();
	
	this.render=function(renderOptions,nodef){
		if(!nodef){
			if(!mw_is_object(renderOptions)){
				renderOptions={
					force: true,
					animate: true,
					asyncSeriesRendering: false
				}	
			}
		}
		
		var ch=this.get_chart();
		if(!ch){
			return false;	
		}
		if(mw_is_object(renderOptions)
```

---

*Auto-extracted from source.*
