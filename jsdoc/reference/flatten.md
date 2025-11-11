# flatten

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function flatten(items, parentId){`

## Source snippet

```javascript
r = "name";

        var levelIndex = params.levelIndex;
        //console.log("[DX_dropDownTreeView] levelIndex:", levelIndex);

        // 1️⃣ FLATTEN THE TREE DATA
        var flatDataSource = [];
        function flatten(items, parentId){
            items.forEach(function(item){
                flatDataSource.push({
                    id: item.id,
                    name: item.name,
                    level: item.level,
                    parentId: parentId || null
                });
                if(item.items && item.items.length){
                    flatten(item.items, item.id);
                }
```

---

*Auto-extracted from source.*
