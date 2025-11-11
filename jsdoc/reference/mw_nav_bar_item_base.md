# mw_nav_bar_item_base

**Location:** `src/public_html/res/js/mw_nav_bar.js`

---

## Signature

`function mw_nav_bar_item_base(data){`

## Source snippet

```javascript
ion(data){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={lbl:lbl};
			}else{
				return false;	
			}
		}
		var ch=new mw_nav_bar_item(data);
		return ch;
	}
}
function mw_nav_bar_item_base(data){
	mw_objcol_item_with_children_dom_base.call(this);
	this.set_data(data);
	this.create_container=function(){
		this.container=document.createElement("li");
		this.lblContainer=document.createElement("a");
		this.lblContainer.href="#";
		
		
		this.lblContainer.innerHTML=this.data.get_param_or_def("lbl","");
		
		var _this=this;
		this.lblContainer.onclick=function(e){_this.onClick(e); return
```

---

*Auto-extracted from source.*
