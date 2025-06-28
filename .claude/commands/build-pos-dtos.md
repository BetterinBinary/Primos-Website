# Build and Test POS Integration DTOs Command

Create and validate Data Transfer Objects for seamless POS system integration:

## Implementation Steps

1. **Analyze POS Data Structure**

   - Review existing POS menuContent.js structure
   - Map all item categories (pizza, pasta, seafood, etc.)
   - Document complex structures (pizzaToppings, tracker objects)
   - Identify edge cases and special pricing rules

2. **Create DTO Classes**

   - `WebOrderToPosDTO.js` - Transform website orders to POS format
   - `PosOrderToWebDTO.js` - Transform POS responses to website format
   - `PosMenuToWebDTO.js` - Convert POS menu data to website structure
   - `WebMenuToPosDTO.js` - Sync website menu changes back to POS

3. **Test Data Transformation**

   - Create test cases for each menu category
   - Validate pizza topping transformations (whole/first/second)
   - Test complex orders (twins, delivery, special instructions)
   - Verify pricing calculations match POS exactly

4. **Integration Testing**
   - Test order submission to actual POS API (http://192.168.0.75:8050)
   - Verify orders appear correctly in POS system
   - Test kitchen printer output matches expectations
   - Validate customer data synchronization

## Required Test Cases

**Pizza Orders:**

```javascript
// Test Case: Half-and-Half Pizza
const websiteOrder = {
  item: "Large Pizza",
  size: "large",
  toppings: {
    firstHalf: ["pepperoni", "mushrooms"],
    secondHalf: ["sausage", "peppers"],
  },
};

// Expected POS Output:
const expectedPOS = {
  category: "pizza",
  size: ["large"],
  type: ["round_square"],
  pizzaToppings: {
    whole: {},
    first: { pepperoni: 1, mushrooms: 1 },
    second: { sausage: 1, peppers: 1 },
  },
  numToppings: 4,
  tracker: {
    /* populated correctly */
  },
};
```

**Seafood Orders:**

```javascript
// Test Case: Quantity-based Seafood
const websiteOrder = {
  item: "Fish Dinner",
  quantity: 2,
  sides: ["fries", "coleslaw"],
};

// Expected POS Output:
const expectedPOS = {
  category: "seafood",
  type: ["hbs"],
  quantity: 2,
  special: ["fries", "coleslaw"],
  tracker: { type: { hbs: 2 } },
};
```

## Validation Checklist

**Order Structure Validation:**

- [ ] All POS required fields populated
- [ ] Array formats match POS expectations (size, type arrays)
- [ ] Pizza toppings use correct whole/first/second structure
- [ ] Tracker object populated for POS analytics
- [ ] Customer data matches POS customer schema

**Pricing Validation:**

- [ ] Twin pizza discounts calculated correctly
- [ ] Delivery fees added appropriately ($3.50)
- [ ] Topping prices match POS pricing rules
- [ ] Size-based pricing accurate across all categories

**Integration Testing:**

- [ ] Orders successfully POST to POS API
- [ ] POS staff can process orders without confusion
- [ ] Kitchen printer outputs correctly formatted receipts
- [ ] Order numbers sync between systems
- [ ] Customer lookup works for repeat customers

## Testing Commands

```bash
# Run DTO unit tests
npm run test:dtos

# Test against live POS (development)
npm run test:pos-integration

# Validate order transformation
npm run validate:order-format

# Test menu sync from POS
npm run test:menu-sync
```

## Common POS Integration Issues

**Array Format Mismatches:**

- Website: `selectedSize: "large"`
- POS Expects: `size: ["large"]`

**Pizza Topping Structure:**

- Website: `toppings: [{id: "pepperoni", placement: "whole"}]`
- POS Expects: `pizzaToppings: {whole: {"pepperoni": 1}}`

**Customer Data Fields:**

- Website: `customer.firstName, customer.lastName`
- POS Expects: `customer.first, customer.last`

## Success Criteria

- [ ] All test orders process successfully in POS
- [ ] Kitchen receives properly formatted order tickets
- [ ] Pricing matches POS calculations exactly
- [ ] Customer data syncs correctly
- [ ] Error handling gracefully falls back
- [ ] Performance meets requirements (<500ms transformation)
