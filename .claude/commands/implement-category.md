# Implement Menu Category Command

**Command**: `claude implement-category [category-name]`  
**Purpose**: Generate complete implementation plan for any menu category  
**Dependencies**: POS-Website Navigation Guide, existing base architecture  

## Command Usage

```bash
# Examples
claude implement-category appetizers
claude implement-category pizza  
claude implement-category chicken
claude implement-category combination-plates
```

## Command Process Flow

### Phase 1: Analysis and Planning (5-10 minutes)

1. **Category Analysis**
   - Load category data from menu system
   - Analyze complexity level and requirements
   - Identify existing vs required components
   - Determine implementation priority and dependencies

2. **Component Specification Generation**
   - Generate list of required reusable components
   - Create category-specific component specifications
   - Define component interaction patterns
   - Specify data flow and state management requirements

3. **Integration Planning**
   - Map to existing cart and pricing systems
   - Identify menu store enhancements needed
   - Plan POS DTO generation requirements
   - Define testing and validation strategies

### Phase 2: Implementation Specification (10-15 minutes)

4. **Technical Specification Creation**
   - Generate detailed component specifications
   - Create TypeScript interfaces and types
   - Define Svelte component props and events
   - Specify state management patterns

5. **Implementation Roadmap**
   - Create step-by-step implementation plan
   - Identify dependencies and prerequisites
   - Generate timeline estimates
   - Define milestone checkpoints

6. **Testing Strategy**
   - Generate comprehensive test specifications
   - Create test cases for edge cases
   - Define integration testing requirements
   - Specify accessibility and performance tests

### Phase 3: Implementation Execution (Variable time)

7. **Code Generation**
   - Generate base component files
   - Create category-specific enhancements
   - Implement pricing and cart integration
   - Generate test files and specifications

8. **Validation and Testing**
   - Run comprehensive test suites
   - Validate pricing calculations
   - Test cart integration
   - Verify POS DTO generation

## Category Implementation Matrix

### Input: Category Name
**Accepted Values:**
- `appetizers` - Simple display and ordering
- `pizza` - Complex topping and customization system
- `salads` - Size and add-on selection
- `pasta` - Size and sauce selection  
- `bbq-ribs` - Portion and preparation options
- `chicken` - Piece selection and order type system
- `chicken-tenderloins` - Count and sauce selection
- `wing-dings` - Count and sauce combinations
- `seafood` - Piece selection and preparation styles
- `hand-battered-shrimp` - Count and preparation options
- `submarines` - Size and ingredient customization
- `sandwiches` - Bread type and ingredient options
- `combination-plates` - Multi-protein selection system
- `desserts` - Simple display and ordering

### Output: Complete Implementation Package

```typescript
interface ImplementationPackage {
  // Analysis Results
  categoryAnalysis: {
    complexity: 'simple' | 'medium' | 'complex';
    priority: 'P1' | 'P2' | 'P3' | 'P4';
    dependencies: string[];
    estimatedEffort: string;
  };
  
  // Component Specifications
  components: {
    required: ComponentSpec[];
    reusable: ComponentSpec[];
    categorySpecific: ComponentSpec[];
    integration: ComponentSpec[];
  };
  
  // Implementation Plan
  implementationPlan: {
    phases: ImplementationPhase[];
    timeline: string;
    milestones: Milestone[];
    riskFactors: RiskFactor[];
  };
  
  // Technical Specifications
  technicalSpecs: {
    typeDefinitions: string;
    componentInterfaces: string;
    stateManagement: string;
    pricingLogic: string;
  };
  
  // Testing Requirements
  testingSpecs: {
    unitTests: TestSpec[];
    integrationTests: TestSpec[];
    e2eTests: TestSpec[];
    performanceTests: TestSpec[];
  };
  
  // POS Integration
  posIntegration: {
    dtoStructure: string;
    mappingLogic: string;
    validationRules: string;
    errorHandling: string;
  };
}
```

## Category-Specific Implementation Templates

### Simple Categories (Appetizers, Desserts)

```typescript
interface SimpleCategoryImplementation {
  requiredComponents: [
    'MenuItemCard',           // Item display with image and description
    'QuantitySelector',       // Simple quantity selection
    'PriceDisplay',          // Formatted price display
    'AddToCartButton',       // Add to cart functionality
    'SpecialInstructions'    // Optional special instructions
  ];
  
  customizationLevel: 'minimal';
  
  implementationSteps: [
    'Create category page component',
    'Implement item grid/list display',
    'Add quantity selection',
    'Integrate with cart system',
    'Add special instructions',
    'Test and validate'
  ];
  
  testingPriority: 'high';  // Baseline functionality for other categories
  estimatedEffort: '1-2 days';
}
```

### Medium Categories (Salads, Pasta, BBQ Ribs)

```typescript
interface MediumCategoryImplementation {
  requiredComponents: [
    'MenuItemCard',          // Enhanced item display
    'SizeSelector',          // Size selection with pricing
    'QuantitySelector',      // Quantity selection
    'SauceSelector',         // Sauce/dressing selection
    'AddOnSelector',         // Additional items selection
    'PriceCalculator',       // Real-time price calculation
    'CustomizationSummary',  // Summary of selections
    'AddToCartButton',       // Enhanced add to cart
    'SpecialInstructions'    // Special instructions
  ];
  
  customizationLevel: 'moderate';
  
  implementationSteps: [
    'Create category page with size selection',
    'Implement sauce/dressing selection system',
    'Add add-on selection with pricing',
    'Create real-time price calculation',
    'Build customization summary display',
    'Integrate with enhanced cart system',
    'Add comprehensive testing',
    'Validate pricing accuracy'
  ];
  
  testingPriority: 'medium';
  estimatedEffort: '3-5 days';
}
```

### Complex Categories (Pizza, Chicken, Seafood, Combinations)

```typescript
interface ComplexCategoryImplementation {
  requiredComponents: [
    'MenuItemCard',              // Advanced item display
    'SizeSelector',              // Size selection (where applicable)
    'ComplexCustomizationUI',    // Category-specific customization
    'PieceSelector',             // Individual piece selection (chicken/seafood)
    'ToppingSelector',           // Topping system (pizza)
    'HalfItemBuilder',           // Half-pizza/combination builder
    'OrderTypeSelector',         // Only vs Dinner selection
    'SideSelector',              // Side dish selection
    'SauceSelector',             // Multiple sauce selection
    'RealTimePricingEngine',     // Complex pricing calculation
    'CustomizationValidator',    // Validation logic
    'CustomizationPreview',      // Visual preview
    'CustomizationSummary',      // Detailed summary
    'AddToCartButton',           // Advanced add to cart
    'SpecialInstructions'        // Special instructions
  ];
  
  customizationLevel: 'comprehensive';
  
  implementationSteps: [
    'Analysis and component planning (1 day)',
    'Create base category structure (1 day)',
    'Implement core customization system (2-3 days)',
    'Build category-specific logic (2-3 days)',
    'Integrate real-time pricing (1-2 days)',
    'Create validation and error handling (1 day)',
    'Build comprehensive testing suite (1-2 days)',
    'Integration testing and validation (1 day)',
    'Performance optimization (1 day)',
    'Documentation and review (0.5 day)'
  ];
  
  testingPriority: 'critical';
  estimatedEffort: '10-15 days';
}
```

## Implementation Process by Category Type

### For Simple Categories

1. **Setup Phase** (30 minutes)
   - Create category page component file
   - Set up basic routing and navigation
   - Import required base components

2. **Display Implementation** (2-3 hours)
   - Implement menu item grid/list display
   - Add item filtering and search integration
   - Create responsive layout

3. **Interaction Implementation** (2-3 hours)
   - Add quantity selection
   - Implement add to cart functionality
   - Add special instructions field

4. **Integration Phase** (1-2 hours)
   - Test cart integration
   - Validate pricing calculations
   - Test localStorage persistence

5. **Testing and Validation** (2-3 hours)
   - Unit test all components
   - Integration testing
   - Manual testing and edge cases

### For Medium Categories

1. **Analysis Phase** (1 hour)
   - Analyze category requirements
   - Plan component architecture
   - Identify reusable vs custom components

2. **Base Implementation** (4-6 hours)
   - Create category page with base functionality
   - Implement size selection system
   - Add basic customization options

3. **Customization Implementation** (6-8 hours)
   - Build sauce/dressing selection
   - Implement add-on system with pricing
   - Create real-time price calculation
   - Add customization summary

4. **Advanced Features** (4-6 hours)
   - Implement complex pricing logic
   - Add validation and error handling
   - Create customization preview

5. **Integration and Testing** (4-6 hours)
   - Cart system integration
   - Comprehensive testing
   - Performance validation

### For Complex Categories

1. **Planning and Architecture** (1-2 days)
   - Deep analysis of requirements
   - Component architecture design
   - Data flow and state management planning
   - Risk assessment and mitigation

2. **Core System Implementation** (3-4 days)
   - Base category page structure
   - Core customization system
   - State management implementation
   - Basic UI components

3. **Advanced Features** (3-4 days)
   - Category-specific customization logic
   - Complex pricing engine
   - Advanced UI components
   - Real-time preview and validation

4. **Integration Phase** (2-3 days)
   - Cart system integration
   - Menu store enhancements
   - POS DTO generation
   - Error handling and validation

5. **Testing and Optimization** (2-3 days)
   - Comprehensive testing suite
   - Performance optimization
   - Accessibility compliance
   - User experience validation

## Generated Deliverables

### 1. Component Files
```
/src/lib/components/menu/[category]/
├── [Category]Page.svelte           # Main category page
├── [Category]ItemCard.svelte       # Category-specific item display
├── [Category]Customization.svelte  # Customization UI
├── [Category]Summary.svelte        # Customization summary
└── index.js                        # Component exports
```

### 2. Type Definitions
```
/src/lib/types/[category].ts        # Category-specific types
```

### 3. Store Enhancements
```
/src/lib/stores/[category]-store.svelte.js  # Category-specific state
```

### 4. Utility Functions
```
/src/lib/utils/[category]-helpers.ts        # Category utilities
/src/lib/utils/[category]-validation.ts     # Validation logic
/src/lib/utils/[category]-pricing.ts        # Pricing calculations
```

### 5. Test Files
```
/src/lib/components/menu/[category]/
├── [Category]Page.test.js
├── [Category]ItemCard.test.js
├── [Category]Customization.test.js
└── [Category]Integration.test.js
```

### 6. POS Integration
```
/src/lib/pos/[category]-dto.ts              # POS DTO definitions
/src/lib/pos/[category]-mapper.ts           # Data mapping logic
```

## Success Validation

### Functional Validation
- [ ] All category items display correctly
- [ ] Customization options work as expected
- [ ] Pricing calculations are accurate
- [ ] Cart integration functions properly
- [ ] Special instructions save correctly
- [ ] POS DTO generation works

### Technical Validation
- [ ] All TypeScript types compile without errors
- [ ] Svelte components render without warnings
- [ ] State management works reactively
- [ ] Performance meets benchmarks
- [ ] Memory usage is optimized

### Quality Validation
- [ ] Unit tests pass with >90% coverage
- [ ] Integration tests pass
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness validated

### Business Validation
- [ ] Order accuracy matches requirements
- [ ] User experience is intuitive
- [ ] Complex customizations work correctly
- [ ] POS integration data is accurate
- [ ] Error handling is graceful

## Error Handling and Troubleshooting

### Common Issues and Solutions

1. **TypeScript Compilation Errors**
   - Check type imports and exports
   - Verify interface definitions
   - Validate component prop types

2. **State Management Issues**
   - Ensure reactive declarations are correct
   - Check store import/export patterns
   - Validate state update logic

3. **Pricing Calculation Problems**
   - Verify pricing logic implementation
   - Test edge cases thoroughly
   - Check floating point precision

4. **Cart Integration Failures**
   - Validate CartItem interface compatibility
   - Check localStorage serialization
   - Test cart persistence across sessions

5. **Performance Issues**
   - Profile component render times
   - Optimize reactive computations
   - Check for memory leaks

## Command Extensions

### Additional Commands Available
- `claude implement-category-enhanced [category] [feature]` - Add specific features
- `claude test-category [category]` - Run comprehensive testing
- `claude optimize-category [category]` - Performance optimization
- `claude validate-category [category]` - Quality validation
- `claude debug-category [category] [issue]` - Troubleshooting

---

**Command Maintained by**: Claude Code Implementation System  
**Last Updated**: July 2025  
**Version**: 1.0 - Master Category Implementation