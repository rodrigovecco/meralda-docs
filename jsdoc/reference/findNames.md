# findNames

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function findNames(items) {`

## Source snippet

```javascript
ds) || !selectedIds.length) {
				selectedIds = [];
			}
			//console.log("[DX_dropDownTreeView] fieldTemplate - selectedIds", selectedIds);

			var levelIndex = params.levelIndex;
			var names = [];

			function findNames(items) {
				items.forEach(function(item) {
					if (selectedIds.includes(item.id)) {
						if (levelIndex == null || item.level == levelIndex) {
							names.push(item.name);
						}
					}
					if (item.items && item.items.length) {
						findNames(item.items);
					}
				});
			}
			//console.log("[DX_dropDownTreeView] fieldTemplate - dataSource", params.dataSource);
			findNames(params.dataSou
```

---

*Auto-extracted from source.*
