# mwuihelper_nav_mnu_item_dropdown

**Location:** `src/public_html/res/js/ui/helpers/mnu.js`

---

## Signature

`function mwuihelper_nav_mnu_item_dropdown(cod,params,ui){`

## Source snippet

```javascript
return cont;
	}
	
	this.getListItemElem=function(){
		if(!this.listItemElem){
			this.listItemElem=this.createListItemElem();	
		}
		return this.listItemElem;
	}
	this.init(cod,params,ui);
	
	
}
function mwuihelper_nav_mnu_item_dropdown(cod,params,ui){
	this.classNameActive="dropdown active";
	this.classNameNormal="dropdown";
	this.createListItemElem=function(){
		var cont=document.createElement("li");
		cont.style.position="relative";
		var _this=this;
		
		//cont.onmouseover=function(){_this.onMouseOver()};
		 $(cont).hover(
            function(){ $(this).addClass('open') },
            function(){ $(this).removeClass('open')
```

---

*Auto-extracted from source.*
