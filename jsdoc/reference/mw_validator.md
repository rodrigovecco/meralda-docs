# mw_validator

**Location:** `src/public_html/res/js/validator.js`

---

## Signature

`function mw_validator(){`

## Source snippet

```javascript
//2015-03-04 RVH
function mw_validator(){
	this.valid_file=function(filename,validexts,allowempty){
		if(!filename){
			if(allowempty){
				return true;	
			}
			return false;	
		}
		var ext=this.fileExt(filename);
		if(!ext){
			return false;	
		}
		ext=ext.toLowerCase();
		if(!validexts){
			return false;	
		}
		if(!mw_is_array(validexts)){
			validexts=validexts+"";
			validexts=validexts.split(",");
		}
		for(var i=0;i<validexts.le
```

---

*Auto-extracted from source.*
