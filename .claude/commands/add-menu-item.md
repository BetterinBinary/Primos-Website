# Add Menu Item Command

Add a new menu item to the Primos Pizza dynamic menu system following SvelteKit 5 patterns and TypeScript validation.

## Specification File Management

**IMPORTANT**: Before starting this command, create a detailed specification file for better context management:

1. **Create Specification File**
   ```bash
   # Ensure directories exist
   mkdir -p .claude/specs .claude/old_specs
   
   # Create spec file with timestamp
   touch .claude/specs/add-menu-item-$(date +%Y%m%d_%H%M%S).spec.md
   ```

2. **Specification Template**
   Use this structure in your `.spec.md` file:
   ```markdown
   # Add Menu Item Specification - [Timestamp]
   
   ## Current Context
   - Current menu data structure in src/lib/data/
   - Existing MenuItem.svelte component capabilities
   - Image optimization setup with @sveltejs/enhanced-img
   - TypeScript interfaces in src/lib/types/menu.ts
   - PricingCalculator implementation status
   
   ## Implementation Plan
   - Target category and specific item details
   - JSON structure modifications needed
   - Image processing and optimization steps
   - Component integration requirements
   - Testing and validation approach
   
   ## Validation Criteria
   - Item appears correctly in menu display
   - Pricing calculations work with PricingCalculator
   - Image optimization generates proper sizes
   - TypeScript compilation succeeds
   - Tests pass for new item
   
   ## References
   - src/lib/data/[category].json files
   - src/lib/components/menu/MenuItem.svelte
   - src/lib/types/menu.ts interfaces
   - src/lib/utils/pricing.ts calculations
   - static/images/menu/ structure
   ```

3. **During Execution**
   - Reference the spec file for implementation details
   - Update spec with any discovered issues or changes
   - Use spec for validation checkpoints

4. **After Completion**
   ```bash
   # Move spec to archive with completion status
   mv .claude/specs/add-menu-item-*.spec.md \
      .claude/old_specs/add-menu-item-$(date +%Y%m%d_%H%M%S)-completed.spec.md
   ```

## Implementation Steps

1. **Data Entry**
   - Add item to appropriate category file in `src/lib/data/[category].json`
   - Follow existing JSON structure with TypeScript menu types
   - Validate data using `menu-validation.ts` utilities
   - Ensure proper pricing structure for POS compatibility

2. **Image Processing**
   - Add high-quality food photo to `static/images/menu/`
   - Use @sveltejs/enhanced-img optimization
   - Follow naming convention: `kebab-case-item-name.jpg`
   - Ensure responsive image sizes (320px, 640px, 1024px)

3. **Component Integration**
   - Verify MenuItem.svelte displays new item correctly
   - Test size selection and pricing calculations
   - Validate topping/modifier options functionality
   - Ensure Svelte 5 runes state management works

4. **Testing and Validation**
   - Run existing test suite: `npm run test`
   - Create specific tests if needed following Button.test.js pattern
   - Test pricing calculations with PricingCalculator class
   - Validate mobile responsiveness

5. **Documentation Update**
   - Update menu data model documentation if structure changes
   - Log changes in git commit with proper format

## Required Information

**Basic Item Data:**
- Item name, description, base price
- Category assignment (appetizers, pizza, pasta, seafood, chicken, beverages, desserts)
- Availability status (boolean)

**Size and Pricing:**
```json
{
  "sizes": [
    { "id": "small", "name": "Small (10\")", "price": 11.99 },
    { "id": "medium", "name": "Medium (12\")", "price": 14.99 },
    { "id": "large", "name": "Large (14\")", "price": 17.99 }
  ]
}
```

**Modifiers (if applicable):**
```json
{
  "toppings": [
    { "id": "pepperoni", "name": "Pepperoni", "price": 2.50 },
    { "id": "mushrooms", "name": "Mushrooms", "price": 1.50 }
  ],
  "addOns": [
    { "id": "extra_cheese", "name": "Extra Cheese", "price": 2.00 }
  ]
}
```

**Additional Information:**
- Allergen information array
- Dietary restrictions (vegetarian, vegan, gluten-free)
- Prep time estimate
- Spice level (1-5 scale)

## File Structure Reference

```
src/lib/data/
├── menu-categories.json    # Category definitions
├── pizza.json             # Pizza items
├── pasta.json             # Pasta items (if exists)
├── appetizers.json        # Appetizer items (if exists)
└── [category].json        # Other category files

static/images/menu/
├── pepperoni-pizza.jpg
├── margherita-pizza.jpg
└── [new-item-name].jpg
```

## Testing Commands

```bash
# Run full test suite
npm run test

# Run pricing-specific tests
npm run test pricing.test.js

# Type validation
npm run typecheck

# Component testing in watch mode
npm run test:watch -- MenuItem
```

## Validation Checklist

**Data Structure:**
- [ ] Item follows TypeScript MenuItem interface
- [ ] JSON syntax is valid
- [ ] All required fields populated
- [ ] Pricing structure matches existing items
- [ ] Category correctly assigned

**Visual Display:**
- [ ] Item appears in correct menu category
- [ ] Image loads with enhanced-img optimization
- [ ] Price displays correctly with PricingCalculator
- [ ] Size options function properly
- [ ] Topping/modifier selection works
- [ ] Mobile display formatting maintained

**Functionality:**
- [ ] Add to cart functionality works
- [ ] Quantity selection operates correctly
- [ ] Price calculations update dynamically
- [ ] Allergen warnings display
- [ ] Dietary indicators visible

**Code Quality:**
- [ ] TypeScript compilation succeeds
- [ ] ESLint validation passes
- [ ] No console errors in browser
- [ ] Component tests pass
- [ ] Responsive design maintained

## Success Criteria

- Item displays correctly in menu grid
- All customization options function properly
- Pricing calculations accurate with tax
- Image optimization working (multiple sizes generated)
- No TypeScript or build errors
- Component tests validate new item behavior
- Mobile and desktop layouts both functional
- POS integration data structure maintained

## Example Implementation

```json
{
  "id": "buffalo_chicken_pizza",
  "name": "Buffalo Chicken Pizza",
  "description": "Spicy buffalo chicken with celery, onions, and ranch drizzle",
  "category": "pizza",
  "basePrice": 0,
  "image": "buffalo-chicken-pizza.jpg",
  "available": true,
  "sizes": [
    { "id": "small", "name": "Small (10\")", "price": 13.99 },
    { "id": "medium", "name": "Medium (12\")", "price": 16.99 },
    { "id": "large", "name": "Large (14\")", "price": 19.99 }
  ],
  "toppings": [
    { "id": "extra_buffalo", "name": "Extra Buffalo Sauce", "price": 1.00 },
    { "id": "blue_cheese", "name": "Blue Cheese Crumbles", "price": 2.00 }
  ],
  "allergens": ["dairy", "gluten", "celery"],
  "dietary": [],
  "spiceLevel": 3,
  "prepTime": "15-20 minutes"
}
```

## Common Issues

**Image Problems:**
- Ensure images are high quality (min 1024px width)
- Use JPG format for photos
- Place in `static/images/menu/` directory
- Verify enhanced-img processing in browser dev tools

**Pricing Issues:**
- Validate calculations with PricingCalculator.calculateItemPrice()
- Ensure tax rate applied correctly (6% Michigan)
- Test size-based pricing changes
- Verify topping price additions

**TypeScript Errors:**
- Check MenuItem interface compliance
- Validate required vs optional fields
- Ensure proper typing for arrays and objects