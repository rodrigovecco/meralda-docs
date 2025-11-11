# mw_show_obj

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mw_show_obj(obj) {`

## Source snippet

```javascript
obj,true);
	}
	var displayonshow=obj.getAttribute('displayonshow');
	if (typeof(displayonshow)!="string"){
		obj.setAttribute('displayonshow',obj.style["display"]);
	}
	obj.style["display"]="none";
}
function mw_show_obj(obj) {
	if (typeof(obj)=="string"){
		obj=mw_get_element_by_id(obj);
	}
	
	if(!obj){
		return false;	
	}
	
	if (typeof(obj)!="object"){
		return false;	
	}
	if(!obj["tagName"]){
		return 	mw_hide_show_objs(obj,false);
	}
	
	if(!obj.style["display"]){
		return;	
	}
	if(obj.style["display"]!="none"){
		return;	
	}
	
	
	var displayonshow=obj.getAttribute('displayonshow');
	var displayonshowdo="";
	if
```

---

*Auto-extracted from source.*
