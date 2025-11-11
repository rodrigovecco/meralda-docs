# mw_arraylist_item

**Location:** `src/public_html/res/js/arraylist.js`

---

## Signature

`function mw_arraylist_item(man,index,cod,eitem){`

## Source snippet

```javascript
turn r;
}

mw_arraylist.prototype.getList=function(){
	var l=this.getElemsList();
	if(!l){
		return false;
	}
	var r=new Array();
	for(var i =0; i<l.length;i++){
		r.push(l[i].elem);	
	}
	return r;
}
function mw_arraylist_item(man,index,cod,eitem){
	this.man=man;
	this.cod=cod;
	this.elem=eitem;
	this.index=index;
	this.deleted=false;
	this.getHTMLInfo=function(){
		return "<div><b>"+this.index+"</b> "+this.cod+"</div>";
	}
	this.add_2_select_options=function(selectinput){
		if(!selectinput){
			return false;	
		}
		var option=this.create_select_option();
		if(!option){
			return false;	
		}
		selectinput.appendChild(op
```

---

*Auto-extracted from source.*
