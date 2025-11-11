# mw_input_elem_withoptsselector

**Location:** `src/public_html/res/js/inputsman/withoptsselector.js`

---

## Signature

`function mw_input_elem_withoptsselector(frmman,inputname,params){`

## Source snippet

```javascript
// JavaScript Document
function mw_input_elem_withoptsselector(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
	this.options_list=new mw_objcol();
	this.setInitialSelOpt=function(){
		var scod="";
		var src=this.getOptionInputSrc();
		if(src){
			if(scod=src.get_value()){
				if(this.options_list.get_item(scod)){
					this.setSelectedOption(scod,true);
					return;	
				}
			}
		}
		if(!scod){
			scod=this.get_param("optdef")+"";	
		}
		thi
```

---

*Auto-extracted from source.*
