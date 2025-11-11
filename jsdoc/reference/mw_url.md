# mw_url

**Location:** `src/public_html/res/js/url.js`

---

## Signature

`function mw_url(){`

## Source snippet

```javascript
function mw_url(){
	this.params=new Array();
	this.get_url_from_path_as_obj=function(baseurl,pathasobj,rest){
		var url=baseurl;
		if(pathasobj){
			if(typeof(pathasobj)=="object"){
				for(var c in pathasobj){
					url=url+"/"+c+"/"+pathasobj[c];	
				}
			}
		}
		if(rest){
			url=url+"/"+rest;		
		}
		return url;

	}
	this.get_url_from_data_varargs=function(url,var_args_keys,data,args){
		if(!mw_is_object(args)
```

---

*Auto-extracted from source.*
