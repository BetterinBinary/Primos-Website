# Menu Data Structure

This directory contains the structured menu data for Primos Pizza, organized into separate JSON files for easy maintenance and editing.

## File Structure

```
src/lib/data/
├── restaurant-info.json    # Restaurant details, hours, contact info
├── menu-categories.json    # Menu items organized by category
├── toppings.json          # Available pizza toppings
├── sauces.json           # Available sauces
├── coupons.json          # Current promotional offers
└── README.md             # This documentation
```

## Data Files

### restaurant-info.json
Contains basic restaurant information:
- Name, phone, address, location
- Hours of operation
- Awards and recognition
- Payment methods accepted
- Services offered (delivery, pickup, etc.)

### menu-categories.json
Main menu structure with categories and items:
- **Categories**: appetizers, pizza, salads, desserts
- **Items**: Each item includes:
  - ID, name, description
  - Pricing (base price or size-based pricing)
  - Availability status
  - Category association
  - Optional: sizes, includes, options

### toppings.json
Available pizza toppings:
- ID and display name
- Category (meat, vegetable, cheese, fruit, seafood)
- Availability status

### sauces.json
Available sauces for various items:
- ID and display name
- Optional spice level
- Availability status

### coupons.json
Current promotional offers:
- Deal description
- Pricing information
- Restrictions and terms
- Expiration dates
- Location-specific offers

## TypeScript Types

All data structures are typed using TypeScript interfaces defined in:
- `src/lib/types/menu.ts` - Core menu types
- `src/lib/utils/menu-validation.ts` - Validation functions
- `src/lib/utils/menu-loader.ts` - Data loading utilities

## Usage

### Loading Menu Data
```typescript
import { menuLoader } from '$lib/utils/index.js';

// Load complete menu data
const menuData = await menuLoader.loadMenuData();

// Get specific category
const pizzas = menuLoader.getCategoryById('pizza');

// Search menu items
const results = menuLoader.searchMenuItems('chicken');
```

### Data Validation
```typescript
import { validateMenuData } from '$lib/utils/menu-validation.js';

try {
  const validatedData = validateMenuData(rawData);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### Pricing Calculations
```typescript
import { PricingCalculator } from '$lib/utils/pricing.js';

const price = PricingCalculator.calculateItemPrice(
  menuItem,
  'large',        // selectedSize
  ['pepperoni'],  // selectedToppings
  2               // quantity
);
```

## Editing Guidelines

### Adding New Menu Items
1. Add the item to the appropriate category in `menu-categories.json`
2. Ensure all required fields are included:
   - `id` (unique identifier)
   - `name` (display name)
   - `description` (item description)
   - `category` (category ID)
   - `available` (boolean)
   - `basePrice` or `sizes` array

### Modifying Prices
- Single-price items: Update `basePrice`
- Size-based items: Update the `sizes` array with size-specific pricing

### Adding Toppings/Sauces
1. Add to appropriate JSON file (`toppings.json` or `sauces.json`)
2. Include required fields: `id`, `name`, `category`, `available`

### Updating Restaurant Info
Modify `restaurant-info.json` for:
- Hours changes
- Contact information updates
- New services or payment methods

## POS Integration

The data structure is designed to be compatible with standard POS systems:
- Each item has a unique ID for inventory tracking
- Pricing is clearly separated by size/option
- Modifiers (toppings, sauces) are tracked separately
- Order totals include tax calculations

## Data Integrity

All JSON files are validated on load using TypeScript schemas. Invalid data will throw descriptive errors to help identify issues quickly.

Key validation rules:
- All IDs must be unique within their scope
- Required fields cannot be empty
- Prices must be positive numbers
- Availability must be boolean
- Category references must exist