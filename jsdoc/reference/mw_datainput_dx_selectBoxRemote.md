# mw_datainput_dx_selectBoxRemote

**Location:** `src/public_html/res/js/inputs/dx.js`

---

## Signature

`function mw_datainput_dx_selectBoxRemote(options){`

## Source snippet

```javascript
s",options);
			this.DXctr.option("value",null);
			this.DXctr.repaint();
			//console.log("Options added on fly",options);
		}else{
			//console.warn("⚠️ DX SelectBox not initialized yet");
		}
	}
}

function mw_datainput_dx_selectBoxRemote(options){
	mw_datainput_dx_selectBox.call(this,options);
	this.getDXOptionsMore=function(params){
		if(this.options.get_param_if_object("dataSourceMan")){
			if(!params["dataSource"]){
				params["dataSource"]=this.getDataSource();
			}


		}
	}
	this.getDataStore=function(){
		if(!this.DataStore){
			this.DataStore=this.getDataSourceMan().getDataStore();
		}
		return this.DataStore;	
	}
	this.get
```

---

*Auto-extracted from source.*
