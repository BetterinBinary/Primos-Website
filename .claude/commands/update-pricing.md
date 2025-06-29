# Update Menu Pricing Command

Execute comprehensive pricing updates across the Primos Pizza menu system using TypeScript utilities and SvelteKit 5 components.

## Specification File Management

**IMPORTANT**: Before starting this command, create a detailed specification file for better context management:

1. **Create Specification File**
   ```bash
   # Ensure directories exist
   mkdir -p .claude/specs .claude/old_specs
   
   # Create spec file with timestamp
   touch .claude/specs/update-pricing-$(date +%Y%m%d_%H%M%S).spec.md
   ```

2. **Specification Template**
   Use this structure in your `.spec.md` file:
   ```markdown
   # Update Pricing Specification - [Timestamp]
   
   ## Current Context
   - Current pricing structure in src/lib/data/ files
   - PricingCalculator class capabilities and tax rates
   - MenuItem.svelte component pricing display logic
   - Existing backup procedures in scripts/backups/
   - pricing.test.js test coverage and validation
   
   ## Implementation Plan
   - Specific pricing changes to implement (items, percentages, categories)
   - Backup strategy and file locations
   - PricingCalculator modifications needed
   - Component updates for price display
   - Testing approach and validation steps
   
   ## Validation Criteria
   - All prices display correctly across components
   - PricingCalculator calculations accurate
   - Tax calculations remain at 6% Michigan rate
   - Cart totals update properly
   - No broken price displays or formatting
   - Mobile and desktop layouts maintained
   
   ## References
   - src/lib/data/*.json pricing files
   - src/lib/utils/pricing.ts PricingCalculator class
   - src/lib/components/menu/MenuItem.svelte pricing logic
   - src/lib/utils/pricing.test.js validation tests
   - scripts/backups/ directory structure
   ```

3. **During Execution**
   - Reference spec for current pricing structure
   - Update spec with backup file locations
   - Use spec for validation checkpoints and rollback procedures

4. **After Completion**
   ```bash
   # Move spec to archive with completion status
   mv .claude/specs/update-pricing-*.spec.md \
      .claude/old_specs/update-pricing-$(date +%Y%m%d_%H%M%S)-completed.spec.md
   ```

## Implementation Steps

1. **Backup Current Pricing**
   - Create backup of current menu data files
   - Document current pricing structure
   - Save backup with timestamp: `backup-YYYY-MM-DD-pricing.json`
   - Store backups in `scripts/backups/` directory

2. **Update Data Files**
   - Modify pricing in relevant `src/lib/data/[category].json` files
   - Update size-based pricing arrays
   - Adjust topping/add-on prices
   - Validate JSON syntax after changes

3. **Pricing Calculator Updates**
   - Update PricingCalculator class if tax rates change
   - Modify delivery fee calculations if needed
   - Test calculations with new pricing
   - Ensure twin pizza discounts work correctly

4. **Component Verification**
   - Test MenuItem.svelte displays updated prices
   - Verify derived price calculations work with Svelte 5 runes
   - Check cart total calculations
   - Validate price formatting consistency

5. **Cross-System Validation**
   - Test pricing consistency across all menu displays
   - Verify mobile and desktop layouts
   - Check cart calculations and order totals
   - Validate tax calculations (6% Michigan)

6. **Testing and Documentation**
   - Run pricing test suite: `npm run test pricing.test.js`
   - Update documentation if pricing rules change
   - Log changes in git commit with detailed message

## Price Update Types

### Individual Item Changes
- Single menu item price adjustments
- Size option price modifications
- Topping/add-on price updates
- Special pricing for limited-time offers

### Category-Wide Adjustments
- Pizza category price increases/decreases
- Pasta pricing restructure
- Beverage price standardization
- Appetizer pricing alignment

### Seasonal Modifications
- Holiday pricing changes
- Summer/winter menu adjustments
- Weekly special pricing
- Happy hour discounts

### System-Wide Updates
- Tax rate changes (update PricingCalculator.TAX_RATE)
- Delivery fee adjustments
- Minimum order requirements
- Twin pizza discount modifications

## File Structure Reference

```
src/lib/data/
├── pizza.json              # Pizza pricing
├── menu-categories.json    # Category structure
├── restaurant-info.json    # System-wide pricing rules
└── [category].json         # Other category pricing

src/lib/utils/
├── pricing.ts              # PricingCalculator class
└── pricing.test.js         # Pricing validation tests

scripts/backups/
└── backup-YYYY-MM-DD-pricing.json
```

## Pricing Commands

```bash
# Run pricing validation tests
npm run test pricing.test.js

# Full test suite
npm run test

# TypeScript validation
npm run typecheck

# Development server for testing
npm run dev

# Build to check for pricing errors
npm run build
```

## Validation Process

### Data Validation
```javascript
// Example pricing validation
import { PricingCalculator } from '$lib/utils/pricing.ts';

const item = {
  basePrice: 12.99,
  sizes: [
    { id: 'small', price: 10.99 },
    { id: 'large', price: 15.99 }
  ]
};

// Test calculations
const result = PricingCalculator.calculateItemPrice(item, 'large', [], 1);
console.log('Price check:', result.total); // Should include tax
```

### Price Testing Scenarios
1. **Basic Item Pricing**
   - Test base prices display correctly
   - Verify size upgrades work
   - Check quantity multipliers

2. **Complex Calculations**
   - Pizza with multiple toppings
   - Size-based topping pricing
   - Delivery fee calculations

3. **Tax and Totals**
   - 6% Michigan sales tax application
   - Cart total calculations
   - Final order total accuracy

## Quality Assurance Checklist

### Data Integrity
- [ ] All prices are positive numbers
- [ ] JSON syntax remains valid
- [ ] Required fields maintained
- [ ] Price formatting consistent (2 decimal places)
- [ ] No duplicate pricing entries

### Display Validation
- [ ] Prices display correctly on MenuItem components
- [ ] Size options show price differences
- [ ] Topping prices add correctly
- [ ] Cart totals calculate accurately
- [ ] Tax calculations display properly

### Functionality Testing
- [ ] Add to cart with new pricing works
- [ ] Quantity changes update totals
- [ ] Size changes affect pricing
- [ ] Topping selections modify totals
- [ ] Delivery fee calculations correct

### Cross-Platform Testing
- [ ] Mobile display formatting maintained
- [ ] Desktop layout pricing aligned
- [ ] Print-friendly pricing format
- [ ] Screen reader price accessibility

### Performance Validation
- [ ] No console errors in browser
- [ ] Fast price calculation updates
- [ ] Smooth UI interactions
- [ ] TypeScript compilation successful

## Success Criteria

- All prices display correctly across the application
- Cart calculations match expected totals
- Tax calculations accurate (6% rate)
- No broken price displays or components
- Mobile and desktop layouts both functional
- POS integration pricing structure maintained
- Performance impact minimal (<100ms price updates)

## Example Price Update

### Before (pizza.json):
```json
{
  "id": "pepperoni_pizza",
  "name": "Pepperoni Pizza",
  "sizes": [
    { "id": "small", "name": "Small (10\")", "price": 11.99 },
    { "id": "medium", "name": "Medium (12\")", "price": 14.99 },
    { "id": "large", "name": "Large (14\")", "price": 17.99 }
  ]
}
```

### After (pizza.json):
```json
{
  "id": "pepperoni_pizza",
  "name": "Pepperoni Pizza",
  "sizes": [
    { "id": "small", "name": "Small (10\")", "price": 12.99 },
    { "id": "medium", "name": "Medium (12\")", "price": 15.99 },
    { "id": "large", "name": "Large (14\")", "price": 18.99 }
  ]
}
```

### Validation Test:
```javascript
// Test new pricing
const item = menuData.find(item => item.id === 'pepperoni_pizza');
const pricing = PricingCalculator.calculateItemPrice(item, 'large', [], 1);
expect(pricing.basePrice).toBe(18.99);
expect(pricing.total).toBe(20.13); // Including 6% tax
```

## Common Issues and Solutions

### Price Display Problems
- **Issue**: Prices showing as undefined
- **Solution**: Check MenuItem component pricing derivation logic
- **Fix**: Verify `$derived()` calculations in Svelte components

### Tax Calculation Errors
- **Issue**: Incorrect tax amounts
- **Solution**: Verify PricingCalculator.TAX_RATE = 0.06
- **Fix**: Test calculations with pricing.test.js

### Component Update Failures
- **Issue**: Prices not updating in UI
- **Solution**: Check Svelte 5 runes reactivity
- **Fix**: Ensure `$state()` and `$derived()` patterns correct

### JSON Syntax Errors
- **Issue**: Menu data not loading
- **Solution**: Validate JSON with online formatter
- **Fix**: Check for trailing commas, missing quotes

## Rollback Procedure

If pricing updates cause issues:

1. **Immediate Rollback**
   ```bash
   # Restore from backup
   cp scripts/backups/backup-YYYY-MM-DD-pricing.json src/lib/data/pizza.json
   
   # Test restoration
   npm run test
   npm run build
   ```

2. **Validation After Rollback**
   - Verify all prices display correctly
   - Test cart functionality
   - Check for console errors
   - Validate mobile display

3. **Issue Analysis**
   - Review error logs
   - Test problematic pricing individually
   - Identify root cause
   - Plan corrected implementation