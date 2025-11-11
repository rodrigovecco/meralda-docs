# mw_datainput_dx_textBox

**Location:** `src/public_html/res/js/inputs/dx.js`

---

## Signature

`function mw_datainput_dx_textBox(options){`

## Source snippet

```javascript
t_param_or_def("lbl",false);
		if(p){
			var lbl=document.createElement("label");
			lbl.innerHTML=p;
			p=this.get_input_id();
			if(p){
				lbl.htmlFor =p;	
			}
			return lbl;
			
		}
			
	}
	
	
}
function mw_datainput_dx_textBox(options){
	mw_datainput_dx.call(this,options);	
}

function mw_datainput_dx_selectBox(options){
	mw_datainput_dx.call(this,options);
	this.createDXctr=function(container,ops){
		console.log(ops);
		$($(container)).dxSelectBox(ops);
		this.DXctr=$($(container)).dxSelectBox('instance');
	}
	this.autoCreateItems=function(){
		var list=this.options.get_param_as_list("optionslist");
		if(!list){
			lis
```

---

*Auto-extracted from source.*
