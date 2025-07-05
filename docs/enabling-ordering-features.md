# Enabling Ordering Features

*Quick guide for activating cart and ordering functionality*

## Current State

The Primos Pizza website is currently configured as a **digital menu display only**. All ordering functionality is hidden from the user interface but preserved in the source code.

## What's Hidden

- **Cart icon** in the header
- **Cart drawer** (slide-out cart panel)
- **Add to Cart buttons** on menu items
- **Customize buttons** and customization interfaces
- **Quantity selectors** and ordering controls

## What's Visible

- ✅ **Complete menu display** with search and filtering
- ✅ **Grid and list view modes**
- ✅ **Item descriptions and pricing** (view-only)
- ✅ **Category navigation**
- ✅ **Digital menu notice** with phone number

## Enabling Ordering Features

To activate ordering functionality, edit the feature flags file:

### 1. Open Feature Flags
```bash
src/lib/config/features.js
```

### 2. Update Feature Flags
```javascript
// Change these values from false to true:
export const ENABLE_ORDERING = true;       // Shows add to cart buttons
export const ENABLE_CART = true;           // Shows cart icon and drawer  
export const ENABLE_CUSTOMIZATION = true;  // Shows customize buttons
```

### 3. Result
After saving the file, the following will instantly become visible:
- Cart icon in header with live item counts
- Add to Cart and Customize buttons on all menu items
- Full customization interfaces for complex items
- Cart drawer with item management
- Complete ordering workflow

## Advanced Features (Future)

Additional features can be enabled when ready:
```javascript
export const ENABLE_CHECKOUT = true;       // Checkout process
export const ENABLE_USER_ACCOUNTS = true;  // User registration/login
export const ENABLE_ORDER_TRACKING = true; // Order status tracking
export const ENABLE_FAVORITES = true;      // Favorite items
```

## Source Code Preservation

**Important**: All ordering functionality is fully preserved in the source code:
- Cart store with localStorage persistence
- Complete customization components (9 different types)
- Pricing calculations and business logic
- POS integration preparation
- Order validation and error handling

Nothing needs to be rebuilt or reimplemented - just change the feature flags!

## Testing Ordering Features

When ordering is enabled, test these workflows:
1. **Add simple items** to cart (appetizers, desserts)
2. **Customize complex items** (pizza with toppings, chicken with pieces)
3. **Cart management** (quantities, removal, totals)
4. **Price calculations** (taxes, discounts, surcharges)
5. **Responsive design** on mobile and desktop

## Rollback Plan

To disable ordering features again:
```javascript
export const ENABLE_ORDERING = false;
export const ENABLE_CART = false;
export const ENABLE_CUSTOMIZATION = false;
```

The site will instantly return to digital menu display mode.

---

**Current Configuration**: Digital Menu Display Only  
**Phone for Orders**: (586) 731-1122  
**Last Updated**: July 2025