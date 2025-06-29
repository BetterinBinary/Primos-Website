# Build and Test POS Integration DTOs Command

Create and validate Data Transfer Objects for seamless POS system integration using TypeScript and SvelteKit architecture.

## Specification File Management

**IMPORTANT**: Before starting this command, create a detailed specification file for better context management:

1. **Create Specification File**
   ```bash
   # Ensure directories exist
   mkdir -p .claude/specs .claude/old_specs
   
   # Create spec file with timestamp
   touch .claude/specs/build-pos-dtos-$(date +%Y%m%d_%H%M%S).spec.md
   ```

2. **Specification Template**
   Use this structure in your `.spec.md` file:
   ```markdown
   # Build POS DTOs Specification - [Timestamp]
   
   ## Current Context
   - POS API endpoint: http://192.168.0.75:8050
   - Current menu data structure in src/lib/data/
   - Existing TypeScript interfaces in src/lib/types/menu.ts
   - Website order format vs POS order format differences
   - Pizza topping structure (whole/first/second) requirements
   - Customer data field mapping needs
   
   ## Implementation Plan
   - DTO classes to create (WebOrderToPosDTO, PosOrderToWebDTO, etc.)
   - TypeScript interface definitions needed
   - Test cases for pizza orders, seafood orders, complex scenarios
   - Validation logic and error handling approach
   - Integration testing strategy with live POS system
   
   ## Validation Criteria
   - All DTO transformations preserve data integrity
   - Pizza toppings map correctly to POS structure
   - Customer data fields map properly (firstName -> first, etc.)
   - Pricing calculations match between systems
   - Array formats handled correctly (size: ["large"])
   - TypeScript compilation successful with strict typing
   
   ## References
   - src/lib/types/menu.ts existing interfaces
   - src/lib/dtos/ directory structure (to be created)
   - Test data samples in migration guide
   - POS API documentation and expected formats
   - src/lib/utils/pricing.ts for price calculations
   ```

3. **During Execution**
   - Reference spec for POS data structure mappings
   - Update spec with discovered integration issues
   - Use spec for test case validation and edge cases

4. **After Completion**
   ```bash
   # Move spec to archive with completion status
   mv .claude/specs/build-pos-dtos-*.spec.md \
      .claude/old_specs/build-pos-dtos-$(date +%Y%m%d_%H%M%S)-completed.spec.md
   ```

## Implementation Steps

1. **Analyze POS Data Structure**
   - Review existing POS menuContent.js structure
   - Map all item categories (pizza, pasta, seafood, chicken, etc.)
   - Document complex structures (pizzaToppings, tracker objects)
   - Identify edge cases and special pricing rules
   - Study twin pizza discounts and delivery fee logic

2. **Create DTO Classes**
   - `src/lib/dtos/WebOrderToPosDTO.ts` - Transform website orders to POS format
   - `src/lib/dtos/PosOrderToWebDTO.ts` - Transform POS responses to website format
   - `src/lib/dtos/PosMenuToWebDTO.ts` - Convert POS menu data to website structure
   - `src/lib/dtos/WebMenuToPosDTO.ts` - Sync website menu changes back to POS

3. **Implement TypeScript Interfaces**
   - Create POS-specific type definitions
   - Define transformation interfaces
   - Ensure type safety across all DTOs
   - Add validation schemas

4. **Test Data Transformation**
   - Create comprehensive test cases for each menu category
   - Validate pizza topping transformations (whole/first/second)
   - Test complex orders (twins, delivery, special instructions)
   - Verify pricing calculations match POS exactly

5. **Integration Testing**
   - Test order submission to actual POS API (http://192.168.0.75:8050)
   - Verify orders appear correctly in POS system
   - Test kitchen printer output matches expectations
   - Validate customer data synchronization

## File Structure Setup

```
src/lib/dtos/
├── index.ts                    # Export all DTOs
├── WebOrderToPosDTO.ts        # Website → POS order transformation
├── PosOrderToWebDTO.ts        # POS → Website response transformation
├── PosMenuToWebDTO.ts         # POS → Website menu transformation
├── WebMenuToPosDTO.ts         # Website → POS menu sync
└── types/
    ├── pos-types.ts           # POS system type definitions
    └── dto-interfaces.ts      # DTO transformation interfaces

src/lib/dtos/tests/
├── WebOrderToPosDTO.test.ts   # Unit tests for order transformation
├── pizza-orders.test.ts       # Pizza-specific test cases
├── complex-orders.test.ts     # Multi-item order scenarios
└── test-data/
    ├── sample-pos-orders.json # Sample POS order formats
    └── sample-web-orders.json # Sample website order formats
```

## Required Test Cases

### Pizza Orders
```typescript
// Test Case: Half-and-Half Pizza
const websiteOrder: WebsiteOrder = {
  item: "Large Pizza",
  size: "large",
  toppings: {
    firstHalf: ["pepperoni", "mushrooms"],
    secondHalf: ["sausage", "peppers"],
  },
  quantity: 1,
  specialInstructions: "Extra crispy"
};

// Expected POS Output:
const expectedPOS: POSOrder = {
  category: "pizza",
  size: ["large"],
  type: ["round_square"],
  pizzaToppings: {
    whole: {},
    first: { pepperoni: 1, mushrooms: 1 },
    second: { sausage: 1, peppers: 1 },
  },
  numToppings: 4,
  special: ["Extra crispy"],
  tracker: {
    size: { large: 1 },
    type: { round_square: 1 },
    topping: { pepperoni: 1, mushrooms: 1, sausage: 1, peppers: 1 }
  },
  quantity: 1,
  price: 19.99
};
```

### Seafood Orders
```typescript
// Test Case: Quantity-based Seafood
const websiteOrder: WebsiteOrder = {
  item: "Fish Dinner",
  category: "seafood",
  quantity: 2,
  sides: ["fries", "coleslaw"],
  sauce: ["tartar", "cocktail"]
};

// Expected POS Output:
const expectedPOS: POSOrder = {
  category: "seafood",
  type: ["hbs"],
  quantity: 2,
  special: ["fries", "coleslaw"],
  sauce: ["tartar", "cocktail"],
  tracker: { 
    type: { hbs: 2 },
    sauce: { tartar: 1, cocktail: 1 }
  },
  price: 24.98
};
```

### Twin Pizza Orders
```typescript
// Test Case: Twin Pizza Discount
const websiteOrder: WebsiteOrder = {
  items: [
    {
      item: "Large Pepperoni Pizza",
      size: "large",
      toppings: { whole: ["pepperoni"] }
    },
    {
      item: "Large Sausage Pizza", 
      size: "large",
      toppings: { whole: ["sausage"] }
    }
  ],
  orderType: "pickup",
  applyTwinDiscount: true
};

// Expected POS transformation with twin pricing
```

## TypeScript Implementation

### Base DTO Interface
```typescript
// src/lib/dtos/types/dto-interfaces.ts
export interface DTOTransformer<TInput, TOutput> {
  transform(input: TInput): TOutput;
  validate(input: TInput): ValidationResult;
  reverse?(output: TOutput): TInput;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

### WebOrderToPosDTO Implementation
```typescript
// src/lib/dtos/WebOrderToPosDTO.ts
import type { WebsiteOrder, POSOrder } from '$lib/types';
import type { DTOTransformer, ValidationResult } from './types/dto-interfaces';

export class WebOrderToPosDTO implements DTOTransformer<WebsiteOrder, POSOrder> {
  transform(websiteOrder: WebsiteOrder): POSOrder {
    const posOrder: POSOrder = {
      type: websiteOrder.orderType, // "pick-up" or "delivery"
      items: websiteOrder.items.map(item => this.transformItem(item)),
      customer: this.transformCustomer(websiteOrder.customer),
      price: websiteOrder.total,
      note: websiteOrder.specialInstructions || "",
    };

    return posOrder;
  }

  private transformItem(websiteItem: WebsiteItem): POSItem {
    const posItem: POSItem = {
      category: websiteItem.category,
      size: [websiteItem.selectedSize], // POS expects array
      type: [this.mapItemType(websiteItem)], // POS expects array
      quantity: websiteItem.quantity,
      price: websiteItem.calculatedPrice,
    };

    // Handle pizza toppings (POS-specific structure)
    if (websiteItem.category === "pizza") {
      posItem.pizzaToppings = this.transformPizzaToppings(websiteItem);
      posItem.numToppings = this.calculateToppingCount(websiteItem);
      posItem.displayToppings = this.createDisplayToppings(websiteItem);
    } else {
      // Handle non-pizza items
      posItem.topping = websiteItem.selectedToppings?.map(t => t.id) || [];
      posItem.special = websiteItem.specialPreparations || [];
      posItem.sauce = websiteItem.selectedSauces || [];
    }

    // POS tracker structure for analytics
    posItem.tracker = this.buildTracker(websiteItem);

    return posItem;
  }

  private transformPizzaToppings(item: WebsiteItem): PizzaToppings {
    const toppings: PizzaToppings = {
      whole: {},
      first: {},
      second: {}
    };

    item.selectedToppings?.forEach(topping => {
      const placement = topping.placement || 'whole';
      toppings[placement][topping.id] = 1;
    });

    return toppings;
  }

  validate(websiteOrder: WebsiteOrder): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!websiteOrder.customer?.firstName) {
      errors.push("Customer first name is required");
    }

    if (!websiteOrder.items?.length) {
      errors.push("Order must contain at least one item");
    }

    // Validate pricing
    const calculatedTotal = this.calculateTotal(websiteOrder);
    if (Math.abs(calculatedTotal - websiteOrder.total) > 0.01) {
      warnings.push(`Price mismatch: calculated ${calculatedTotal}, provided ${websiteOrder.total}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
```

## Testing Commands

```bash
# Run DTO unit tests
npm run test -- dto

# Test specific DTO transformation
npm run test WebOrderToPosDTO.test.ts

# Test against sample POS data
npm run test:integration -- pos-dto

# Validate order format transformation
npm run test -- --grep "pizza transformation"

# Test complex order scenarios
npm run test complex-orders.test.ts
```

## Validation Checklist

### Order Structure Validation
- [ ] All POS required fields populated correctly
- [ ] Array formats match POS expectations (size, type arrays)
- [ ] Pizza toppings use correct whole/first/second structure
- [ ] Tracker object populated for POS analytics
- [ ] Customer data matches POS customer schema
- [ ] Special instructions preserved and formatted

### Pricing Validation
- [ ] Twin pizza discounts calculated correctly
- [ ] Delivery fees added appropriately ($3.50 base)
- [ ] Topping prices match POS pricing rules
- [ ] Size-based pricing accurate across all categories
- [ ] Tax calculations match (6% Michigan)
- [ ] Quantity multipliers applied correctly

### Data Type Validation
- [ ] TypeScript compilation successful
- [ ] All interfaces properly implemented
- [ ] No runtime type errors
- [ ] Null/undefined handling robust
- [ ] Array/object structure validation

### Integration Testing
- [ ] Orders successfully POST to POS API
- [ ] POS staff can process orders without confusion
- [ ] Kitchen tickets print with correct details
- [ ] Order numbers sync between systems
- [ ] Customer lookup works for repeat customers

## Success Criteria

- Zero order data loss during transformation
- 100% kitchen printer compatibility
- All test orders process successfully in POS
- Pricing matches POS calculations exactly
- Customer data syncs correctly between systems
- Error handling gracefully falls back
- Performance meets requirements (<500ms transformation)
- TypeScript type safety maintained throughout

## Common POS Integration Issues

### Array Format Mismatches
```typescript
// Website format
const websiteOrder = {
  selectedSize: "large"
};

// POS expects arrays
const posOrder = {
  size: ["large"] // Must be array format
};
```

### Pizza Topping Structure
```typescript
// Website format
const websiteToppings = [
  { id: "pepperoni", placement: "whole" },
  { id: "mushrooms", placement: "first" }
];

// POS expects object structure
const posToppings = {
  pizzaToppings: {
    whole: { "pepperoni": 1 },
    first: { "mushrooms": 1 },
    second: {}
  }
};
```

### Customer Data Fields
```typescript
// Website format
const websiteCustomer = {
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "555-1234"
};

// POS format
const posCustomer = {
  first: "John",
  last: "Doe", 
  phone: "555-1234"
};
```

## Performance Optimization

- Use efficient data transformation algorithms
- Implement caching for repeated transformations
- Minimize object copying during transformation
- Use TypeScript readonly types where appropriate
- Implement lazy loading for large menu transformations

## Error Handling Strategy

```typescript
export class DTOTransformationError extends Error {
  constructor(
    message: string,
    public originalData: any,
    public transformationType: string
  ) {
    super(message);
    this.name = 'DTOTransformationError';
  }
}

// Usage in DTO
try {
  const posOrder = this.transform(websiteOrder);
  return posOrder;
} catch (error) {
  throw new DTOTransformationError(
    `Failed to transform website order to POS format: ${error.message}`,
    websiteOrder,
    'WebOrderToPosDTO'
  );
}
```