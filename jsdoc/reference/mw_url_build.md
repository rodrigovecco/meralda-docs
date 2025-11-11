# mw_url_build

**Location:** `src/public_html/res/js/url.js`

---

## Signature

`function mw_url_build(baseurl,params){`

## Source snippet

```javascript
(typeof(val)=="boolean"){
			if(val){
				val=1;	
			}else{
				val=0;	
			}
		}
		return val+"";
	}
	
	this.get_query_txt=function(){
		return this.name+"="+encodeURIComponent(this.get_val());	
	}
}
function mw_url_build(baseurl,params){
	var u =new mw_url();
	return u.get_url(baseurl,params);
	
}
```

---

*Auto-extracted from source.*
