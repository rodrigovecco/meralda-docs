# mw_url_param

**Location:** `src/public_html/res/js/url.js`

---

## Signature

`function mw_url_param(name,val){`

## Source snippet

```javascript
tDateStr(val);
			}
		}
		
		if(mw_is_object(val)){
			for(var p in val){
				this.add_param(p,val[p],ncod);
			}
			
		}else{
			p=new mw_url_param(ncod,val);
			this.params.push(p);
		}
		
		
	}

}
function mw_url_param(name,val){
	this.name=name;
	this.val=val;
	this.get_val=function(){
		var val=this.val;
		if(typeof(val)=="boolean"){
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
