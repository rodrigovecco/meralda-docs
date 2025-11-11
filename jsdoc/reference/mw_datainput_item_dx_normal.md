# mw_datainput_item_dx_normal

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function mw_datainput_item_dx_normal(options){`

## Source snippet

```javascript
container)).dxNumberBox(ops);
		
		return $($(container)).dxNumberBox('instance');
		
	}

}

function mw_datainput_item_normal_dx_textbox(options){
	mw_datainput_item_dx_normal.call(this,options);

}

function mw_datainput_item_dx_normal(options){
	mw_datainput_item_base.call(this,options);
	this.getDXOptions=function(){
		var _this=this;
		var params=this.options.get_param_if_object("DXOptions",true);
		var p;
		if(!this.options.param_exists("DXOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_e
```

---

*Auto-extracted from source.*
