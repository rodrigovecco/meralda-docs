# loadNextBatch

**Location:** `src/public_html/res/js/mwdevextreme/mw_data.js`

---

## Signature

`function loadNextBatch() {`

## Source snippet

```javascript
quedas/etc.)
		var baseOpts = (loadOptions && typeof loadOptions === "object")
			? JSON.parse(JSON.stringify(loadOptions))
			: {};
		// Evita re-entrar al modo "all"
		delete baseOpts.isLoadingAll;
		function loadNextBatch() {
			if (done) {
				console.log("✅ All batches loaded. Total:", allData.length);
				deferred.resolve(allData);
				return;
			}
			if (loopCount++ > maxLoops) {
				console.warn("⚠️ Loop safety triggered: exceeded " + maxLoops + " iterations");
				done = true;
				deferred.resolve(allData);
				return;
			}

			// compose load options for this batch
			var opts = Object.assign({}, baseOpts, {
```

---

*Auto-extracted from source.*
