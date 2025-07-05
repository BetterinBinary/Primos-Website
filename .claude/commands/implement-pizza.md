# Pizza Implementation Command
*Comprehensive implementation plan for the most complex menu category*

## Command Usage
```bash
claude implement-pizza
```

## Overview
Pizza is the most complex category in the Primos menu system, requiring sophisticated topping management, half-pizza support, size restrictions, preset combinations, and complex pricing matrices.

**Estimated Timeline**: 2-3 weeks  
**Components Required**: 12-15  
**Testing Required**: 20+ test suites  
**POS Integration**: Advanced DTO structure with topping tracking

## POS Data Analysis

### Pizza Entries from menuContent.js
```javascript
// Base structure - 400+ pizza entries
{
  "Category": "pizza",
  "Type": "round_square|round|twins|stuffed|tray",
  "Size": "slice|small|medium|large|xlarge|stuffed|tray", 
  "Toppings": 0-9, // topping count determines pricing
  "price": [varies by size and topping count]
}

// Special combinations
{
  "Category": "pizza", 
  "Type": "special|supreme|bbq_chicken|all_meat|veggie|hawaiian",
  "Size": "small|medium|large|xlarge",
  "Toppings": "preset", // fixed topping combinations
  "price": [preset pricing]
}
```

### Pricing Matrix Analysis
| Size | 0 Toppings | 1 Topping | 2 Toppings | 3 Toppings | 4 Toppings | 5 Toppings | 9+ Toppings |
|------|-----------|-----------|-----------|-----------|-----------|-----------|-------------|
| Slice | $2.75 | $3.25 | $3.75 | $4.25 | $4.75 | $5.25 | $5.75 |
| Small | $11.35 | $12.70 | $14.05 | $15.40 | $16.75 | $18.25 | $19.50 |
| Medium | $13.85 | $15.55 | $17.25 | $18.95 | $20.65 | $22.50 | $24.25 |
| Large | $17.00 | $18.95 | $20.90 | $22.85 | $24.80 | $26.90 | $29.50 |
| XLarge | $20.85 | $23.10 | $25.35 | $27.60 | $29.85 | $32.50 | $35.50 |

### Twin Pizza Pricing (Special Logic)
- **Small Twins**: $20.25 base, $2.45 per topping (for both pizzas)
- **Medium Twins**: $24.35 base, $3.10 per topping  
- **Large Twins**: $29.10 base, $3.65 per topping

## Component Architecture

### 1. Main Container Component

#### **PizzaCustomizer.svelte**
```typescript
interface PizzaCustomizerProps {
  item: MenuItem;
  onAddToCart: (config: PizzaOrderConfig) => void;
  onCancel: () => void;
}

interface PizzaOrderConfig {
  size: PizzaSize;
  shape: 'round' | 'square';
  toppings: PizzaToppingSelection[];
  crust: PizzaCrust;
  sauce: PizzaSauce;
  cheese: CheeseOption;
  quantity: number;
  specialInstructions: string;
  isTwin: boolean;
  twinConfiguration?: PizzaOrderConfig;
}
```

### 2. Size & Shape Selection

#### **PizzaSizeSelector.svelte**
```typescript
interface PizzaSizeSelectorProps {
  selectedSize: PizzaSize;
  selectedShape: 'round' | 'square';
  onSizeChange: (size: PizzaSize) => void;
  onShapeChange: (shape: 'round' | 'square') => void;
  showTwinOption: boolean;
  isTwin: boolean;
  onTwinToggle: (twin: boolean) => void;
}

// Size restrictions logic
const sizeRestrictions = {
  'slice': { shapes: ['round', 'square'], twins: false },
  'small': { shapes: ['round', 'square'], twins: true },
  'medium': { shapes: ['round', 'square'], twins: true },
  'large': { shapes: ['round', 'square'], twins: true },
  'xlarge': { shapes: ['round'], twins: false }, // XLarge only round
  'stuffed': { shapes: ['square'], twins: false },
  'tray': { shapes: ['square'], twins: false }
};
```

### 3. Topping Selection System

#### **PizzaToppingSelector.svelte**
```typescript
interface PizzaToppingSelectorProps {
  availableToppings: PizzaTopping[];
  selectedToppings: PizzaToppingSelection[];
  allowHalfToppings: boolean;
  maxToppings?: number;
  size: PizzaSize;
  onToppingChange: (selection: PizzaToppingSelection) => void;
  onToppingRemove: (toppingId: string) => void;
}

interface PizzaToppingSelection {
  topping: PizzaTopping;
  position: 'whole' | 'first' | 'second'; // half-pizza positioning
  quantity: 0.5 | 1 | 2; // light, regular, extra
}

// Available toppings from POS
const pizzaToppings = [
  // Meats
  { id: 'pepperoni', name: 'Pepperoni', category: 'meat', premium: false },
  { id: 'sausage', name: 'Sausage', category: 'meat', premium: false },
  { id: 'ham', name: 'Ham', category: 'meat', premium: false },
  { id: 'bacon', name: 'Bacon', category: 'meat', premium: true },
  { id: 'ground_beef', name: 'Ground Beef', category: 'meat', premium: false },
  { id: 'chicken', name: 'Chicken', category: 'meat', premium: true },
  
  // Vegetables  
  { id: 'mushrooms', name: 'Mushrooms', category: 'vegetable', premium: false },
  { id: 'onions', name: 'Onions', category: 'vegetable', premium: false },
  { id: 'green_peppers', name: 'Green Peppers', category: 'vegetable', premium: false },
  { id: 'black_olives', name: 'Black Olives', category: 'vegetable', premium: false },
  { id: 'green_olives', name: 'Green Olives', category: 'vegetable', premium: false },
  { id: 'tomatoes', name: 'Tomatoes', category: 'vegetable', premium: false },
  { id: 'pineapple', name: 'Pineapple', category: 'fruit', premium: false },
  
  // Premium
  { id: 'extra_cheese', name: 'Extra Cheese', category: 'cheese', premium: true },
  { id: 'feta_cheese', name: 'Feta Cheese', category: 'cheese', premium: true }
];
```

### 4. Half-Pizza Builder

#### **HalfPizzaBuilder.svelte**
```typescript
interface HalfPizzaBuilderProps {
  firstHalfToppings: PizzaToppingSelection[];
  secondHalfToppings: PizzaToppingSelection[];
  availableToppings: PizzaTopping[];
  onFirstHalfChange: (toppings: PizzaToppingSelection[]) => void;
  onSecondHalfChange: (toppings: PizzaToppingSelection[]) => void;
  showVisualBuilder: boolean;
}

// Half-pizza pricing logic
function calculateHalfPizzaPrice(
  wholeToppings: number,
  firstHalfToppings: number, 
  secondHalfToppings: number
): number {
  // Whole toppings count as 1, half toppings count as 0.5
  const totalToppingCount = wholeToppings + (firstHalfToppings + secondHalfToppings) * 0.5;
  return Math.ceil(totalToppingCount); // Round up for pricing tier
}
```

### 5. Preset Combinations

#### **PizzaPresetSelector.svelte**
```typescript
interface PizzaPresetSelectorProps {
  selectedPreset: string | null;
  availablePresets: PizzaPreset[];
  size: PizzaSize;
  onPresetSelect: (preset: PizzaPreset | null) => void;
  onCustomizePreset: (preset: PizzaPreset) => void;
}

// Preset combinations from POS
const pizzaPresets = [
  {
    id: 'special',
    name: 'Primos Special',
    description: 'Pepperoni, sausage, mushrooms, onions, green peppers',
    toppings: ['pepperoni', 'sausage', 'mushrooms', 'onions', 'green_peppers'],
    pricing: 'preset' // uses preset pricing from POS
  },
  {
    id: 'supreme', 
    name: 'Supreme',
    description: 'Pepperoni, sausage, mushrooms, onions, green peppers, black olives',
    toppings: ['pepperoni', 'sausage', 'mushrooms', 'onions', 'green_peppers', 'black_olives'],
    pricing: 'preset'
  },
  {
    id: 'bbq_chicken',
    name: 'BBQ Chicken',
    description: 'BBQ sauce, chicken, onions, green peppers',
    toppings: ['chicken', 'onions', 'green_peppers'],
    sauce: 'bbq',
    pricing: 'preset'
  },
  {
    id: 'all_meat',
    name: 'All Meat',
    description: 'Pepperoni, sausage, ham, bacon, ground beef',
    toppings: ['pepperoni', 'sausage', 'ham', 'bacon', 'ground_beef'],
    pricing: 'preset'
  },
  {
    id: 'veggie',
    name: 'Veggie',
    description: 'Mushrooms, onions, green peppers, black olives, tomatoes',
    toppings: ['mushrooms', 'onions', 'green_peppers', 'black_olives', 'tomatoes'],
    pricing: 'preset'
  },
  {
    id: 'hawaiian',
    name: 'Hawaiian', 
    description: 'Ham and pineapple',
    toppings: ['ham', 'pineapple'],
    pricing: 'preset'
  }
];
```

### 6. Crust & Sauce Options

#### **PizzaCrustSelector.svelte**
```typescript
interface PizzaCrustSelectorProps {
  selectedCrust: PizzaCrust;
  availableCrusts: CrustOption[];
  size: PizzaSize;
  onCrustChange: (crust: PizzaCrust) => void;
}

// Crust options with pricing
const crustOptions = [
  { id: 'regular', name: 'Regular', upcharge: 0 },
  { id: 'thin', name: 'Thin Crust', upcharge: 0 },
  { id: 'thick', name: 'Thick Crust', upcharge: 1.50 },
  { id: 'garlic', name: 'Garlic Crust', upcharge: 1.00 },
  { id: 'butter', name: 'Butter Crust', upcharge: 0.50 },
  { id: 'parmesan', name: 'Parmesan Crust', upcharge: 1.00 },
  { id: 'sesame', name: 'Sesame Crust', upcharge: 0.75 },
  { id: 'cajun', name: 'Cajun Crust', upcharge: 0.50 }
];

// Sauce options
const sauceOptions = [
  { id: 'pizza', name: 'Pizza Sauce', upcharge: 0 },
  { id: 'bbq', name: 'BBQ Sauce', upcharge: 0 },
  { id: 'ranch', name: 'Ranch', upcharge: 0.50 },
  { id: 'light', name: 'Light Sauce', upcharge: 0 },
  { id: 'extra', name: 'Extra Sauce', upcharge: 0.50 },
  { id: 'none', name: 'No Sauce', upcharge: 0 }
];
```

### 7. Twin Pizza Builder

#### **TwinPizzaBuilder.svelte**
```typescript
interface TwinPizzaBuilderProps {
  firstPizza: PizzaOrderConfig;
  secondPizza: PizzaOrderConfig;
  onFirstPizzaChange: (config: PizzaOrderConfig) => void;
  onSecondPizzaChange: (config: PizzaOrderConfig) => void;
  allowDifferentToppings: boolean;
  syncToppings: boolean;
  onSyncToggle: (sync: boolean) => void;
}

// Twin pizza pricing logic
function calculateTwinPizzaPrice(
  size: PizzaSize,
  firstPizzaToppings: number,
  secondPizzaToppings: number,
  syncedToppings: boolean
): number {
  const basePrices = {
    'small': 20.25,
    'medium': 24.35, 
    'large': 29.10
  };
  
  const toppingPrices = {
    'small': 2.45,
    'medium': 3.10,
    'large': 3.65
  };
  
  if (syncedToppings) {
    // Both pizzas have same toppings
    const toppingCount = Math.max(firstPizzaToppings, secondPizzaToppings);
    return basePrices[size] + (toppingCount * toppingPrices[size]);
  } else {
    // Different toppings - pay for both
    const totalToppings = firstPizzaToppings + secondPizzaToppings;
    return basePrices[size] + (totalToppings * toppingPrices[size]);
  }
}
```

### 8. Visual Pizza Builder (Optional Enhancement)

#### **PizzaVisualBuilder.svelte**
```typescript
interface PizzaVisualBuilderProps {
  size: PizzaSize;
  toppings: PizzaToppingSelection[];
  crust: PizzaCrust;
  sauce: PizzaSauce;
  cheese: CheeseOption;
  onToppingClick: (position: { x: number; y: number }) => void;
  onToppingDrag: (toppingId: string, position: { x: number; y: number }) => void;
}

// Visual representation for better UX
// SVG-based pizza with draggable toppings
// Half-pizza visual split for half-topping orders
// Real-time topping placement preview
```

## Pricing Calculation Engine

### **PizzaPricingCalculator.ts**
```typescript
class PizzaPricingCalculator {
  private sizePricing = {
    'slice': { base: [2.75, 3.25, 3.75, 4.25, 4.75, 5.25, 5.75] },
    'small': { base: [11.35, 12.70, 14.05, 15.40, 16.75, 18.25, 19.50] },
    'medium': { base: [13.85, 15.55, 17.25, 18.95, 20.65, 22.50, 24.25] },
    'large': { base: [17.00, 18.95, 20.90, 22.85, 24.80, 26.90, 29.50] },
    'xlarge': { base: [20.85, 23.10, 25.35, 27.60, 29.85, 32.50, 35.50] }
  };

  calculatePizzaPrice(config: PizzaOrderConfig): PricingCalculation {
    if (config.isTwin) {
      return this.calculateTwinPrice(config);
    }
    
    const toppingCount = this.calculateToppingCount(config.toppings);
    const basePriceIndex = Math.min(toppingCount, 6); // Max index for 9+ toppings
    const basePrice = this.sizePricing[config.size].base[basePriceIndex];
    
    const crustUpcharge = this.calculateCrustUpcharge(config.crust);
    const sauceUpcharge = this.calculateSauceUpcharge(config.sauce);
    
    const subtotal = basePrice + crustUpcharge + sauceUpcharge;
    const total = subtotal * config.quantity;
    const tax = total * 0.06; // 6% Michigan sales tax
    
    return {
      basePrice,
      toppingCount,
      crustUpcharge,
      sauceUpcharge,
      subtotal,
      quantity: config.quantity,
      total,
      tax,
      finalTotal: total + tax,
      breakdown: this.generatePriceBreakdown(config)
    };
  }

  private calculateToppingCount(toppings: PizzaToppingSelection[]): number {
    return toppings.reduce((count, selection) => {
      const multiplier = selection.position === 'whole' ? 1 : 0.5;
      return count + (selection.quantity * multiplier);
    }, 0);
  }

  private calculateTwinPrice(config: PizzaOrderConfig): PricingCalculation {
    // Twin pizza pricing logic with special rates
    // Returns combined pricing for both pizzas
  }
}
```

## POS Integration

### Pizza Order DTO Structure
```typescript
interface PizzaPOSOrder extends POSOrderItem {
  // Standard fields
  category: 'pizza';
  type: ['round_square' | 'round' | 'twins' | 'stuffed' | 'tray'];
  size: [PizzaSize];
  toppings: [number]; // topping count for pricing
  
  // Pizza-specific fields
  pizzaToppings?: {
    whole?: Record<string, number>;
    first?: Record<string, number>;  
    second?: Record<string, number>;
  };
  displayToppings?: Record<string, number>; // for preset pizzas
  crust?: [string];
  sauceAmount?: [string];
  
  // Tracking object
  tracker: {
    type: { [pizzaType]: 1 };
    size: { [size]: 1 };
    topping: { [toppingCount]: 1 };
    pizzaToppings?: {
      whole?: Record<string, number>;
      first?: Record<string, number>;
      second?: Record<string, number>;
    };
  };
}

// Example: Large pizza with pepperoni and mushrooms, half with sausage
{
  category: 'pizza',
  type: ['round_square'],
  size: ['large'],
  toppings: [3], // whole pepperoni + whole mushrooms + half sausage = 2.5 → 3
  pizzaToppings: {
    whole: { pepperoni: 1, mushrooms: 1 },
    first: { sausage: 1 }
  },
  crust: ['regular'],
  sauceAmount: ['regular'],
  quantity: 1,
  price: '22.85',
  tracker: {
    type: { 'round_square': 1 },
    size: { 'large': 1 },
    topping: { '3': 1 },
    pizzaToppings: {
      whole: { pepperoni: 1, mushrooms: 1 },
      first: { sausage: 1 }
    }
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
describe('Pizza Implementation', () => {
  describe('PizzaToppingSelector', () => {
    it('should add whole toppings correctly');
    it('should add half toppings correctly');
    it('should handle extra/light toppings');
    it('should enforce maximum topping limits');
    it('should calculate topping counts accurately');
  });

  describe('PizzaPricingCalculator', () => {
    it('should calculate base pricing by size and topping count');
    it('should apply crust upcharges correctly');
    it('should handle half-topping pricing');
    it('should calculate twin pizza pricing');
    it('should match POS pricing exactly', () => {
      // Test against known POS prices
      const calc = new PizzaPricingCalculator();
      expect(calc.getPrice('medium', 2)).toBe(17.25);
      expect(calc.getPrice('large', 5)).toBe(26.90);
    });
  });

  describe('HalfPizzaBuilder', () => {
    it('should track first and second half toppings separately');
    it('should calculate combined topping count correctly');
    it('should prevent invalid half-topping combinations');
  });

  describe('PizzaPresetSelector', () => {
    it('should apply preset topping combinations');
    it('should use preset pricing when available'); 
    it('should allow customization of presets');
  });
});
```

### Integration Tests
```typescript
describe('Pizza Integration', () => {
  describe('Full Pizza Building Workflow', () => {
    it('should build a complete custom pizza order');
    it('should generate correct POS DTO');
    it('should add to cart successfully');
    it('should handle twin pizza orders');
  });

  describe('POS Compatibility', () => {
    it('should match POS pricing for all size/topping combinations');
    it('should generate tracker objects matching POS format');
    it('should handle all preset pizza combinations');
  });
});
```

### Performance Tests
```typescript
describe('Pizza Performance', () => {
  it('should render topping selector in <200ms');
  it('should update pricing in <50ms');
  it('should handle 30+ toppings without lag');
  it('should support real-time topping preview');
});
```

## Implementation Timeline

### Week 1: Foundation
- [ ] Set up component structure
- [ ] Implement PizzaSizeSelector with shape restrictions
- [ ] Create PizzaToppingSelector basic functionality
- [ ] Build pricing calculation engine
- [ ] Write unit tests for core logic

### Week 2: Advanced Features  
- [ ] Implement HalfPizzaBuilder with visual positioning
- [ ] Add PizzaPresetSelector with all combinations
- [ ] Create TwinPizzaBuilder with sync options
- [ ] Implement crust and sauce selection
- [ ] Add comprehensive pricing tests

### Week 3: Integration & Polish
- [ ] Integrate all components into PizzaCustomizer
- [ ] Implement POS DTO generation
- [ ] Add cart integration
- [ ] Performance optimization
- [ ] Accessibility compliance
- [ ] Full integration testing

## Accessibility Requirements

- **WCAG 2.1 AA**: Full compliance for all pizza components
- **Keyboard Navigation**: Tab through all topping options
- **Screen Reader**: Announce topping additions, price changes
- **Color Contrast**: 4.5:1 minimum for all text and controls
- **Focus Management**: Clear focus indicators for complex UI

## Performance Optimization

- **Lazy Loading**: Load topping images on demand
- **Memoization**: Cache pricing calculations
- **Virtual Scrolling**: For large topping lists
- **Debounced Updates**: Prevent excessive pricing recalculations
- **Component Splitting**: Code split by pizza features

This comprehensive pizza implementation provides the most sophisticated menu ordering experience, matching the full complexity of the POS system while maintaining excellent user experience and performance.