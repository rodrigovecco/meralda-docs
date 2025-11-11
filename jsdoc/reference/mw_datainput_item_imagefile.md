# mw_datainput_item_imagefile

**Location:** `src/public_html/res/js/inputs/image.js`

---

## Signature

`function mw_datainput_item_imagefile(options){`

## Source snippet

```javascript
//under construction
function mw_datainput_item_imagefile(options){
	this.getFile=function(){
		if(this.input_elem){
			if(this.input_elem.files){
				return this.input_elem.files[0];
			}
		}
	}
	this._upload=function(){
		if(this.disabled){
			return;
		}
		this.upload();
	}
	this.upload=function(){
		console.log("upload","Extend this method to execute");
	}
	this.setImgUrl=function(url){
		this.imageURL=url;
		this.updateDisplayImg();
	}
	this.updateD
```

---

*Auto-extracted from source.*
