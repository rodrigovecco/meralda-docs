# mw_datainput_item_btn

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`function mw_datainput_item_btn(options){`

## Source snippet

```javascript
0; i<list.length;i++){
			list[i].append_to_container(c);
		}
		container.appendChild(c);
		return true;
	}
	this.init(options);
}
mw_datainput_item_btnsgroup.prototype=new mw_datainput_item_group();
function mw_datainput_item_btn(options){
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_input_elem();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	this.append2OtherContainer=function(containerItem){
		if(!this.container){
			this.container=document.createElement("div");
			this.container.className="btn-group"
```

---

*Auto-extracted from source.*
