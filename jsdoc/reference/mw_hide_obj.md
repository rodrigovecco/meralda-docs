# mw_hide_obj

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mw_hide_obj(obj) {`

## Source snippet

```javascript
return false;	
	}
	if(!list.hasOwnProperty("length")){
		return 	false;
	}
	for(var i=0;i<list.length;i++){
		if(hide){
			mw_hide_obj(list[i]);	
		}else{
			mw_show_obj(list[i]);	
				
		}
	}
		
}

function mw_hide_obj(obj) {
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
		return 	mw_hide_show_objs(obj,true);
	}
	var displayonshow=obj.getAttribute('displayonshow');
	if (typeof(displayonshow)!="string"){
		obj.setAttribute('displayonshow',obj.style["display"]);
	}
	obj.style["display"]="none"
```

---

*Auto-extracted from source.*
