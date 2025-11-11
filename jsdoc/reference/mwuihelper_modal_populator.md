# mwuihelper_modal_populator

**Location:** `src/public_html/res/js/ui/helpers/modal.js`

---

## Signature

`function mwuihelper_modal_populator(params){`

## Source snippet

```javascript
function mwuihelper_modal_populator(params){
	this.params=new mw_obj();
	this.body_input_data=new mw_obj();
	this.actions=new mw_objcol();
	this.create_actions_by_list=function(){
		var list=this.params.get_param_as_list("actions");
		if(!list){
			return false;	
		}
		var _this=this;
		mw_objcol_array_process(list,function(elem){_this.add_action_obj(elem)});
	}
	this.add_footer_btn_by_action_cod=function(cod){
		if(!cod){
			return
```

---

*Auto-extracted from source.*
