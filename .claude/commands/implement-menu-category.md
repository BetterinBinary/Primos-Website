# Universal Menu Category Implementation Command

## Command Usage
```bash
claude implement-menu-category [category-name]
```

## Supported Categories
- `appetizers` - Simple selection with cooking options
- `pizza` - Complex topping system with half-pizza support  
- `salads` - Size-based pricing with sauce scaling
- `pasta` - Size-based sides with baked options
- `bbq-ribs` - Sauce levels and portion types
- `chicken` - Individual pieces with order types
- `chicken-tenderloins` - Individual tender pieces
- `wing-dings` - Individual wing pieces  
- `seafood` - Individual pieces with preparation styles
- `hand-battered-shrimp` - Size variations with cajun options
- `submarines` - Preset modifications with extras
- `sandwiches` - Only/deluxe system with modifications
- `combination-plates` - Multi-protein coordination
- `desserts` - Simple selection system

## Command Process

### 1. Category Analysis Phase
The command will:
- Analyze POS data for the specified category
- Identify unique customization patterns
- Map required reusable components
- Calculate implementation complexity
- Estimate timeline and dependencies

### 2. Implementation Plan Generation
The command outputs:
- **Component Specifications**: Required UI components with props
- **Type Definitions**: TypeScript interfaces for the category
- **Pricing Logic**: Calculation functions and business rules
- **Integration Requirements**: Cart and POS integration specs
- **Testing Checklist**: Unit and integration test requirements
- **Implementation Timeline**: Step-by-step development plan

### 3. Code Generation Templates
The command provides:
- Component boilerplate code
- Type definition files
- Test file templates
- Integration utility functions
- Documentation templates

## Category Implementation Templates

### Simple Category Template (Appetizers, Desserts)
```typescript
// Generated for simple categories
interface SimpleCategoryProps {
  item: MenuItem;
  quantity: number;
  cookingStyle?: string;
  sauces: string[];
  onAddToCart: (config: SimpleOrderConfig) => void;
}

const SimpleCategoryCustomizer = ({ item, ...props }: SimpleCategoryProps) => {
  // Basic customization logic
  // Cooking style selection (if applicable)
  // Sauce selection with free limits
  // Quantity controls
  // Price calculation
};
```

### Medium Category Template (Salads, Pasta, BBQ Ribs)
```typescript
// Generated for medium complexity categories
interface MediumCategoryProps {
  item: MenuItem;
  selectedSize: string;
  selectedAddOns: string[];
  quantity: number;
  specialOptions: Record<string, any>;
  onAddToCart: (config: MediumOrderConfig) => void;
}

const MediumCategoryCustomizer = ({ item, ...props }: MediumCategoryProps) => {
  // Size selection with scaling logic
  // Add-on selection with size-based pricing
  // Special category options
  // Complex pricing calculations
  // Validation logic
};
```

### Complex Category Template (Pizza, Chicken, Seafood, Combinations)
```typescript
// Generated for complex categories
interface ComplexCategoryProps {
  item: MenuItem;
  customizationMode: 'standard' | 'advanced';
  selectedOptions: ComplexOrderConfig;
  onAddToCart: (config: ComplexOrderConfig) => void;
}

const ComplexCategoryCustomizer = ({ item, ...props }: ComplexCategoryProps) => {
  // Multiple customization modes
  // Advanced selection systems (individual pieces, toppings, etc.)
  // Complex business logic
  // Multi-step validation
  // Advanced pricing with discounts/surcharges
};
```

## Implementation Specifications by Category

### Appetizers
**Complexity**: Simple (3-5 days)
**Components Required**: 3-4
**Key Features**:
- Basic item selection
- Cooking style options (regular, well-done)
- Sauce selection with free limits
- Simple quantity controls

**Generated Files**:
```
src/lib/components/menu/appetizers/
├── AppetizerCustomizer.svelte
├── AppetizerCard.svelte
└── index.ts

src/lib/types/appetizers.ts
src/lib/utils/appetizer-pricing.ts
tests/appetizers/
├── AppetizerCustomizer.test.ts
└── appetizer-pricing.test.ts
```

### Pizza  
**Complexity**: Very Complex (2-3 weeks)
**Components Required**: 12-15
**Key Features**:
- Size selection with shape restrictions
- 30+ toppings with half-pizza positioning
- Preset combinations (Special, Supreme, etc.)
- Crust options with pricing
- Twin pizza logic
- Complex pricing matrix

**Generated Files**:
```
src/lib/components/menu/pizza/
├── PizzaCustomizer.svelte
├── PizzaToppingSelector.svelte
├── HalfPizzaBuilder.svelte
├── PizzaPresetSelector.svelte
├── PizzaCrustSelector.svelte
├── TwinPizzaBuilder.svelte
└── index.ts

src/lib/types/pizza.ts
src/lib/utils/pizza-pricing.ts
tests/pizza/
├── PizzaCustomizer.test.ts
├── pizza-pricing.test.ts
└── half-pizza-logic.test.ts
```

### Chicken (Broasted, Tenders, Wing Dings)
**Complexity**: Very Complex (2-3 weeks)  
**Components Required**: 8-12
**Key Features**:
- Individual piece selection system
- Standard portion alternatives
- Order type logic (only vs dinner)
- Meat selection (all white/dark/mixed)
- BBQ style with per-piece pricing
- Side substitution system

**Generated Files**:
```
src/lib/components/menu/chicken/
├── ChickenCustomizer.svelte (enhanced)
├── IndividualPieceSelector.svelte (shared)
├── ChickenPortionSelector.svelte
├── MeatSelectionRadio.svelte
├── BBQStyleToggle.svelte
└── index.ts

src/lib/types/chicken.ts
src/lib/utils/chicken-pricing.ts
tests/chicken/
├── ChickenCustomizer.test.ts
├── individual-pieces.test.ts
└── chicken-pricing.test.ts
```

### Seafood
**Complexity**: Very Complex (2-3 weeks)
**Components Required**: 8-12
**Key Features**:
- Individual piece system (fish, perch, frog legs)
- Portion size alternatives
- Preparation styles (regular, cajun)
- Order type logic (only vs dinner)
- Cooking preferences
- Sauce selection system

**Generated Files**:
```
src/lib/components/menu/seafood/
├── SeafoodCustomizer.svelte (enhanced)
├── SeafoodPieceSelector.svelte
├── PreparationStyleSelector.svelte
├── SeafoodPortionSelector.svelte
└── index.ts

src/lib/types/seafood.ts
src/lib/utils/seafood-pricing.ts
tests/seafood/
├── SeafoodCustomizer.test.ts
├── seafood-pieces.test.ts
└── preparation-styles.test.ts
```

### Combination Plates
**Complexity**: Very Complex (3-4 weeks)
**Components Required**: 15-20
**Key Features**:
- Multi-protein selection (2-4 proteins)
- Smorgasbord builder (choose 4 from 6)
- Protein portion balancing
- Shared customization (cooking, sauces)
- Complex pricing coordination
- Visual combination builder

**Generated Files**:
```
src/lib/components/menu/combinations/
├── CombinationPlateCustomizer.svelte
├── CombinationBuilder.svelte
├── ProteinSelector.svelte
├── SmorgasbordBuilder.svelte
├── PortionBalancer.svelte
├── SharedCustomizationPanel.svelte
└── index.ts

src/lib/types/combinations.ts
src/lib/utils/combination-pricing.ts
tests/combinations/
├── CombinationBuilder.test.ts
├── smorgasbord-logic.test.ts
└── combination-pricing.test.ts
```

## Universal Component Requirements

Every category implementation includes these universal components:

### 1. OrderTypeSelector (for applicable categories)
```typescript
interface OrderTypeSelectorProps {
  orderType: 'only' | 'dinner' | 'deluxe';
  pricing: Record<string, number>;
  descriptions: Record<string, string>;
  onChange: (type: string) => void;
}
```

### 2. SideSelector (for dinner orders)
```typescript
interface SideSelectorProps {
  selectedSides: string[];
  defaultSides: string[];
  availableSides: SideOption[];
  orderType: string;
  onChange: (sides: string[]) => void;
}
```

### 3. SauceSelector (for applicable categories)
```typescript
interface SauceSelectorProps {
  selectedSauces: string[];
  availableSauces: SauceOption[];
  freeLimit: number;
  specialRules?: Record<string, { freeLimit: number }>;
  onChange: (sauces: string[]) => void;
}
```

### 4. PricingDisplay (all categories)
```typescript
interface PricingDisplayProps {
  pricing: PricingCalculation;
  showBreakdown: boolean;
  isUpdating?: boolean;
}
```

## Testing Requirements

### Unit Testing (>90% coverage)
```typescript
describe('[Category] Implementation', () => {
  describe('Component Rendering', () => {
    it('should render customizer with default state');
    it('should handle prop changes correctly');
    it('should validate user inputs');
  });

  describe('Pricing Calculations', () => {
    it('should calculate base pricing correctly');
    it('should apply discounts and surcharges');
    it('should handle quantity multiplication');
    it('should calculate tax properly');
  });

  describe('Business Logic', () => {
    it('should enforce category-specific constraints');
    it('should validate order configurations');
    it('should handle edge cases gracefully');
  });
});
```

### Integration Testing
```typescript
describe('[Category] Integration', () => {
  describe('Cart Integration', () => {
    it('should add items to cart correctly');
    it('should handle cart modifications');
    it('should maintain cart state');
  });

  describe('POS Integration', () => {
    it('should generate correct POS DTOs');
    it('should match POS pricing exactly');
    it('should handle all configuration options');
  });
});
```

## POS Integration Requirements

### Order DTO Generation
Each category must generate POS-compatible order objects:

```typescript
interface POSOrder {
  category: string;
  type: string[];
  size: (string | number)[];
  topping: string[];
  sauce?: string[];
  side?: string[];
  quantity: number;
  price: string;
  tracker: POSTracker;
}
```

### Category-Specific Extensions
- **Pizza**: `pizzaToppings`, `displayToppings`, `crust`, `sauceAmount`
- **Individual Pieces**: Piece tracking in `tracker.type`
- **Combinations**: `smorg` array for smorgasbord orders
- **Preset Items**: Modification tracking in custom fields

## Quality Assurance Checklist

### Code Quality
- [ ] TypeScript types for all interfaces
- [ ] JSDoc comments for public APIs
- [ ] Error handling for all user inputs
- [ ] Loading states for async operations
- [ ] Responsive design for all screen sizes

### Functionality
- [ ] All POS features implemented correctly
- [ ] Pricing matches POS system exactly
- [ ] Validation prevents invalid orders
- [ ] Cart integration works seamlessly
- [ ] POS DTO generation is accurate

### Performance
- [ ] Initial load < 2 seconds
- [ ] Interaction response < 100ms
- [ ] Pricing updates < 50ms
- [ ] Memory usage within limits
- [ ] No unnecessary re-renders

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Full keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast requirements met
- [ ] Focus management implemented

## Implementation Timeline

### Week 1: Setup & Analysis
- [ ] Analyze POS data for category
- [ ] Design component architecture
- [ ] Create type definitions
- [ ] Set up test infrastructure

### Week 2-3: Core Implementation
- [ ] Implement main customizer component
- [ ] Build category-specific components
- [ ] Implement pricing calculations
- [ ] Add validation logic

### Week 3-4: Integration & Testing
- [ ] Integrate with cart system
- [ ] Implement POS DTO generation
- [ ] Write comprehensive tests
- [ ] Performance optimization

### Week 4: Quality Assurance
- [ ] Accessibility testing
- [ ] Cross-browser testing
- [ ] POS compatibility validation
- [ ] Documentation completion

## Support & Maintenance

### Documentation Requirements
- Component API documentation
- Implementation notes and decisions
- Testing strategies and edge cases
- POS integration mapping
- Performance optimization notes

### Monitoring & Metrics
- User interaction analytics
- Performance monitoring
- Error tracking and reporting
- A/B testing for UX improvements
- POS integration success rates

This universal command provides a comprehensive framework for implementing any menu category with consistent architecture, full POS compatibility, and maintainable code structure.