# mwmod_sctrl_reports_pivotgrid_lookup

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem/devextreme_privotgrid.js`

---

## Signature

`function mwmod_sctrl_reports_pivotgrid_lookup(cod,options,man){`

## Source snippet

```javascript
m.cod,item);
			
		}

		console.log("✅ Lookups applied to PivotGrid fields:", this.lookupSources.items_num);
	};
		
	
	
}
mwuihelper_ajaxelem_devextreme_pivotgrid.prototype=new mwuihelper_ajaxelem();

function mwmod_sctrl_reports_pivotgrid_lookup(cod,options,man){
	this.cod=cod;
	//console.log("mwmod_sctrl_reports_pivotgrid_lookup",cod,options,man);
	this.options=new mw_obj();
	this.options.set_params(options);
	this.items=new mw_objcol();
	this.man=man;
	this.get_id=function(){
		return this.cod;
	}
	this.afterCreate=function(){
		var d=this.options.get_param_if_object("data");
		
		if(d){
			d.add2objcol(this.items);
		}
		
	}
	this.cust
```

---

*Auto-extracted from source.*
