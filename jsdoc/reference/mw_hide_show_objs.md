# mw_hide_show_objs

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mw_hide_show_objs(list,hide) {`

## Source snippet

```javascript
true;
	}
	return false;
}

function mw_is_array(data){
	if(!mw_is_object(data)){
		return false;	
	}
	if(Object.prototype.toString.apply(data)=="[object Array]"){
		return true;	
	}
	return false;
}


function mw_hide_show_objs(list,hide) {
	if(!list){
		return false;	
	}
	if (typeof(list)!="object"){
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
```

---

*Auto-extracted from source.*
