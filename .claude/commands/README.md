# Claude Commands Index

This directory contains automated commands for implementing the complete Primos Pizza menu system. Each command provides comprehensive implementation plans, technical specifications, and step-by-step execution guidance.

## Master Implementation System

### Navigation Guide
- **[POS-Website Navigation Guide](../specs/pos-website-navigation-guide.md)** - Complete mapping between POS system and website implementation

### Core Commands

#### 1. Master Category Implementation
- **[implement-category.md](./implement-category.md)** - Universal category implementation command
- **Usage**: `claude implement-category [category-name]`
- **Purpose**: Generate complete implementation plan for any menu category
- **Input**: Category name (appetizers, pizza, chicken, etc.)
- **Output**: Complete implementation package with components, tests, and integration

#### 2. Specific Category Commands

##### High Priority (P1) - Foundation Categories
- **[implement-pizza.md](./implement-pizza.md)** - Complete pizza category with topping system
  - **Complexity**: Very High
  - **Features**: Size selection, crust options, comprehensive topping system, half-pizza support
  - **Timeline**: 7 days

##### Medium Priority (P2-P3) - Standard Categories
- **[implement-chicken.md](./implement-chicken.md)** - All chicken categories with piece selection
  - **Complexity**: High  
  - **Features**: Piece selection, order types (only/dinner), BBQ style, sauce selection
  - **Timeline**: 10 days
  - **Categories**: Chicken Dinners, Chicken Tenderloins, Wing Dings

- **[implement-seafood.md](./implement-seafood.md)** - Seafood categories with individual pieces
  - **Complexity**: High
  - **Features**: Individual pieces, preparation styles, order types
  - **Timeline**: 8 days

- **[implement-pasta.md](./implement-pasta.md)** - Pasta with size-based sides
  - **Complexity**: Medium
  - **Features**: Size scaling, baked options, meatball selection
  - **Timeline**: 6 days

- **[implement-salads.md](./implement-salads.md)** - Salads with dressing systems
  - **Complexity**: Medium
  - **Features**: Size-based pricing, dressing scaling
  - **Timeline**: 5 days

- **[implement-bbq-ribs.md](./implement-bbq-ribs.md)** - BBQ ribs with sauce levels
  - **Complexity**: Medium
  - **Features**: Sauce levels, portion types, cooking preferences
  - **Timeline**: 6 days

##### Standard Priority (P3-P4) - Remaining Categories
- **[implement-submarines.md](./implement-submarines.md)** - Subs with preset modifications
  - **Complexity**: Medium
  - **Features**: Preset tracking, extra options, modifications
  - **Timeline**: 6 days

- **[implement-sandwiches.md](./implement-sandwiches.md)** - Sandwiches with only/deluxe
  - **Complexity**: Medium
  - **Features**: Order type system, bread selection, modifications
  - **Timeline**: 6 days

- **[implement-appetizers.md](./implement-appetizers.md)** - Simple appetizers
  - **Complexity**: Simple
  - **Features**: Cooking styles, sauce selection
  - **Timeline**: 3 days

- **[implement-desserts.md](./implement-desserts.md)** - Simple desserts
  - **Complexity**: Simple
  - **Features**: Size/flavor selection, toppings
  - **Timeline**: 2 days

##### Complex Priority (P4) - Advanced Categories
- **[implement-combinations.md](./implement-combinations.md)** - Combination plates with multi-protein system
  - **Complexity**: Very High
  - **Features**: Multi-protein selection, portion balancing, cooking coordination
  - **Timeline**: 12 days

## Command Usage Patterns

### Quick Category Implementation
```bash
# Implement simple categories
claude implement-category appetizers
claude implement-category desserts

# Implement medium complexity categories  
claude implement-category salads
claude implement-category pasta
claude implement-category bbq-ribs

# Implement complex categories with specialized commands
claude implement-pizza
claude implement-chicken
claude implement-combinations
```

### Development Workflow
```bash
# 1. Start with foundation categories
claude implement-appetizers             # Baseline functionality
claude implement-pizza                  # Complex topping system

# 2. Implement standard categories
claude implement-salads
claude implement-pasta
claude implement-bbq-ribs

# 3. Implement piece-selection categories
claude implement-chicken                # All chicken categories
claude implement-seafood               # Seafood with individual pieces

# 4. Implement remaining categories
claude implement-submarines
claude implement-sandwiches
claude implement-desserts

# 5. Implement most complex category
claude implement-combinations           # Multi-protein system
```

## Category Implementation Matrix

| Category | Command | Priority | Complexity | Timeline | Dependencies |
|----------|---------|----------|------------|----------|-------------|
| **Appetizers** | `implement-appetizers` | P1 | Simple | 3 days | None |
| **Pizza** | `implement-pizza` | P1 | Very High | 7 days | Base components |
| **Salads** | `implement-salads` | P2 | Medium | 5 days | P1 complete |
| **Pasta** | `implement-pasta` | P2 | Medium | 6 days | P1 complete |
| **BBQ Ribs** | `implement-bbq-ribs` | P2 | Medium | 6 days | P1 complete |
| **Chicken** | `implement-chicken` | P3 | High | 10 days | P1-P2 complete |
| **Seafood** | `implement-seafood` | P3 | High | 8 days | Piece selection system |
| **Submarines** | `implement-submarines` | P4 | Medium | 6 days | P1-P3 complete |
| **Sandwiches** | `implement-sandwiches` | P4 | Medium | 6 days | P1-P3 complete |
| **Combinations** | `implement-combinations` | P4 | Very High | 12 days | All categories complete |
| **Desserts** | `implement-desserts` | P4 | Simple | 2 days | Any time |

## Generated Deliverables

Each command generates a complete implementation package:

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
/src/lib/types/[category].ts        # Category-specific TypeScript types
```

### 3. Utility Functions
```
/src/lib/utils/[category]/
├── [category]-helpers.ts           # Category utilities
├── [category]-validation.ts        # Validation logic
└── [category]-pricing.ts          # Pricing calculations
```

### 4. Store Enhancements
```
/src/lib/stores/[category]-store.svelte.js  # Category-specific state management
```

### 5. Test Files
```
/tests/[category]/
├── [Category]Page.test.js          # Page component tests
├── [Category]Customization.test.js # Customization tests
├── [Category]Integration.test.js   # Integration tests
└── [Category]E2E.spec.js          # End-to-end tests
```

### 6. POS Integration
```
/src/lib/pos/[category]/
├── [category]-dto.ts               # POS DTO definitions
├── [category]-mapper.ts            # Data mapping logic
└── [category]-validator.ts         # POS data validation
```

## Implementation Features by Category

### Simple Categories (Appetizers, Desserts)
- Basic item display and selection
- Quantity selection
- Simple add to cart
- Special instructions
- **Components**: 5-6 components
- **Timeline**: 1-2 days

### Medium Categories (Salads, Pasta, BBQ Ribs, Submarines, Sandwiches)
- Size selection with pricing
- Sauce/dressing selection
- Add-on system
- Real-time pricing
- **Components**: 8-10 components  
- **Timeline**: 3-4 days

### High Complexity Categories (Pizza)
- Comprehensive topping system
- Half-pizza customization
- Crust and sauce selection
- Complex pricing engine
- Visual customization tools
- **Components**: 12-15 components
- **Timeline**: 7 days

### Very High Complexity (Chicken, Combinations)
- Individual piece selection
- Multi-item coordination
- Complex pricing logic
- Advanced customization options
- **Components**: 15-20 components
- **Timeline**: 10-12 days

## Quality Assurance

### Testing Standards
- **Unit Tests**: >90% coverage for all categories
- **Integration Tests**: Complete cart and pricing integration
- **E2E Tests**: Critical user flows for each category
- **Performance Tests**: Load times and responsiveness
- **Accessibility Tests**: WCAG 2.1 AA compliance

### Code Quality
- **TypeScript**: Full type safety across all components
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting standards
- **Svelte 5**: Modern runes-based state management

### Performance Benchmarks
- **Page Load**: <2 seconds for category pages
- **Customization**: <100ms response times
- **Cart Updates**: <50ms for simple additions
- **Complex Calculations**: <200ms for advanced pricing

## POS Integration Standards

### DTO Structure
Each category generates standardized POS DTOs:
- Universal order item format
- Category-specific customization data
- Pricing breakdown and validation
- Kitchen coordination information

### Data Mapping
- Automatic POS code generation
- Modifier tracking and validation
- Price verification and reconciliation
- Error handling and fallback options

## Support and Maintenance

### Command Extensions
- **Debug Commands**: Troubleshooting and error resolution
- **Test Commands**: Automated testing execution
- **Optimization Commands**: Performance tuning
- **Validation Commands**: Quality assurance checks

### Monitoring and Analytics
- Implementation progress tracking
- Performance monitoring
- Error rate analysis
- User experience metrics

---

**Commands Maintained by**: Claude Code Implementation System  
**Last Updated**: July 2025  
**Version**: 1.0 - Complete Implementation Command Suite