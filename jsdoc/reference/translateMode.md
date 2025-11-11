# translateMode

**Location:** `src/public_html/res/js/maps/routes.js`

---

## Signature

`function translateMode(mode) {`

## Source snippet

```javascript
});
    };
  
    return self;
  }
  
  // OSRM Manager
  function mwOSRMRouteManager(cfg) {
    const self = mwRouteManager(cfg);
    const baseURL = self.cfg.osrmURL || "http://localhost:5000";
  
    function translateMode(mode) {
      switch (mode.toLowerCase()) {
        case 'driving': return 'car';
        case 'walking': return 'foot';
        case 'bicycling': return 'bike';
        default: return 'car';
      }
    }
  
    self.buildRouteURL = function(route) {
      const mode = translateMode(route.mode);
      const coords = [route.origin]
        .concat(route.waypoints)
        .concat([route.destinati
```

---

*Auto-extracted from source.*
