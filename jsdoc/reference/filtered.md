# filtered

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`filtered = filtered.filter((id) => {`

## Source snippet

```javascript
x", null);

        // Filter by levelIndex if needed
        if(levelIndex != null){
            var allNodes = this.options.get_param_or_def("DXOptions.dataSource", null);
            if(allNodes){
                filtered = filtered.filter((id) => {
                    var node = _findNodeById(allNodes, id);
                    return node && (node.level == levelIndex);
                });
            }
        }

        this.DXValue = filtered;
        console.log("[DX_dropDownTreeView] Updated DXValue", this.DXValue);

        if(this.input_elem){
            this.input_elem.value = this.format_input_value(this.DXValue);
			
            c
```

---

*Auto-extracted from source.*
