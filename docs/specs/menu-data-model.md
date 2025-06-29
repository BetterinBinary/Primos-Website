# Menu Data Model Specification

## Overview

This document defines the data model for the Primos Pizza menu system, ensuring consistency between the website display and POS integration.

## Core Data Structures

### Restaurant Information
```typescript
interface RestaurantInfo {
  name: string;
  phone: string;
  address: string;
  location: string;
  established: string;
  website: string;
  hours: Record<string, string>;
  awards: string[];
  paymentMethods: string[];
  services: string[];
}
```

### Menu Categories
```typescript
interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
  addOns?: AddOn[];
  extras?: Extra[];
  dressings?: string[];
}
```

### Menu Items
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice?: number;
  sizes?: Size[];
  toppings?: ToppingPricing;
  includes?: string[];
  options?: string[];
  allergens?: string[];
  available: boolean;
  image?: string;
}
```

### Pricing Structure
```typescript
interface Size {
  size: string;
  name: string;
  price: number;
}

interface ToppingPricing {
  extraItems: Size[];
}
```

## Data Storage Structure

```
src/lib/data/
├── restaurant-info.json     # Business information
├── menu-categories.json     # Menu items by category
├── toppings.json           # Available toppings
├── sauces.json            # Available sauces
├── coupons.json           # Promotional offers
└── README.md              # Data management guide
```

## Category Definitions

### Primary Categories
- **appetizers**: Appetizers & Side Orders
- **pizza**: Hand-tossed pizzas (round/square)
- **salads**: Fresh salads with dressings
- **pasta**: Traditional pasta dishes
- **desserts**: Sweet treats

### Secondary Categories
- **bbq-ribs**: BBQ rib selections
- **chicken**: Broasted chicken options
- **seafood**: Fresh seafood dishes
- **sandwiches**: Subs and sandwiches
- **combination-plates**: Mixed item plates

## POS Integration Mapping

Each menu item includes a `posMapping` object for POS system compatibility:

```typescript
interface PosMapping {
  category: string;        // POS category identifier
  type: string;           // POS item type
  sizeMap?: Record<string, string>;  // Size translation
}
```

## Data Validation Rules

1. **Required Fields**: All items must have id, name, category, available
2. **Price Structure**: Items must have either basePrice OR sizes array
3. **Category References**: All item categories must exist in categories array
4. **ID Uniqueness**: All IDs must be unique within their scope
5. **Price Validation**: All prices must be positive numbers

## Usage Examples

### Loading Menu Data
```typescript
import { menuLoader } from '$lib/utils/menu-loader.js';

const menuData = await menuLoader.loadMenuData();
const pizzas = menuLoader.getCategoryById('pizza');
```

### Search Functionality
```typescript
const results = menuLoader.searchMenuItems('chicken');
const filteredItems = menuLoader.getMenuItemsByCategory('pizza');
```

### Price Calculations
```typescript
import { PricingCalculator } from '$lib/utils/pricing.js';

const price = PricingCalculator.calculateItemPrice(
  menuItem,
  'large',
  ['pepperoni', 'mushrooms'],
  2
);
```

## Future Considerations

- **Seasonal Items**: Add seasonal availability flags
- **Nutrition Info**: Extend items with nutritional data
- **Inventory Tracking**: Add real-time availability checking
- **Multi-Location**: Support for multiple restaurant locations
- **Dynamic Pricing**: Time-based or demand-based pricing