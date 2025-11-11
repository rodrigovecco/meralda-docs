# mwOSRMRouteManager

**Location:** `src/public_html/res/js/maps/routes.js`

---

## Signature

`function mwOSRMRouteManager(cfg) {`

## Source snippet

```javascript
route.onResult(result);
          }
        } else {
          console.error("Google Directions API failed:", status);
        }
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
      c
```

---

*Auto-extracted from source.*
