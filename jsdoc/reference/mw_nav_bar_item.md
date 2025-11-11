# mw_nav_bar_item

**Location:** `src/public_html/res/js/mw_nav_bar.js`

---

## Signature

`function mw_nav_bar_item(data){`

## Source snippet

```javascript
(data){
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

function mw_nav_bar_item(data){
	mw_nav_bar_item_base.call(this,data);
}
```

---

*Auto-extracted from source.*
