# ev

**Location:** `src/public_html/res/js/inputs/inputs.js`

---

## Signature

`var ev=function(ch){_this.onChildChanged(ch)};`

## Source snippet

```javascript
{
		this.on_change();
	}
	this.listen_children_change=function(cod){
		if(!cod){
			if(this.cod){
				cod="parent_changed_"+this.cod;	
			}else{
				cod="parent_changed";		
			}
		}
		var _this=this;
		var ev=function(ch){_this.onChildChanged(ch)};
		var list=this.get_children();
		if(!list){
			return false;	
		}
		
		for(var i=0;i<list.length;i++){
			list[i].add_children_and_self_on_change_event(cod,ev);	
		}
		return true;
		
	}
	this.add_children_and_self_on_change_event=function(cod,ev){
		this.add_on_change_event(cod,ev);
		var list=this.get_children();
		
		if(list){
			
			
			for(var i=0;i<list.length
```

---

*Auto-extracted from source.*
