# POS-to-Website Implementation Guide
*Complete mapping and implementation strategy for Primos Pizza menu system*

## Overview
This document provides a comprehensive mapping between the Primos POS system (1,962 menu entries) and the website implementation requirements. It serves as the master navigation guide for implementing all menu categories with full POS-level functionality.

**POS System Location**: `/Users/ayo/Documents/GitHub/Primos-POS/`  
**Website Location**: `/Users/ayo/Documents/GitHub/Primos-Website/`  
**Last Updated**: 2025-07-02

---

## Menu Category Implementation Matrix

| Category | POS Complexity | Components Required | Est. Timeline | Dependencies |
|----------|----------------|-------------------|---------------|--------------|
| **Appetizers** | Simple | 3-4 | 3-5 days | Universal components |
| **Pizza** | Very Complex | 12-15 | 2-3 weeks | Topping system, half-pizza logic |
| **Salads** | Simple-Medium | 4-6 | 5-7 days | Size scaling, sauce system |
| **Pasta** | Medium | 6-8 | 1-2 weeks | Size-based sides, baked options |
| **BBQ Ribs** | Medium | 5-7 | 1-2 weeks | Sauce level system, portion types |
| **Chicken** | Very Complex | 8-12 | 2-3 weeks | Individual pieces, order types |
| **Chicken Tenders** | Complex | 6-8 | 1-2 weeks | Individual pieces, sauce system |
| **Wing Dings** | Complex | 6-8 | 1-2 weeks | Individual pieces, sauce system |
| **Seafood** | Very Complex | 8-12 | 2-3 weeks | Individual pieces, preparation styles |
| **Hand-Battered Shrimp** | Complex | 6-8 | 1-2 weeks | Size variations, cajun options |
| **Submarines** | Complex | 8-10 | 1-2 weeks | Preset modifications, extra options |
| **Sandwiches** | Medium | 5-7 | 1-2 weeks | Only/deluxe system, modifications |
| **Combination Plates** | Very Complex | 15-20 | 3-4 weeks | Multi-protein coordination |
| **Desserts** | Simple | 2-3 | 2-3 days | Basic selection system |

## Universal Reusable Components

### 1. Core Components (Required for All Categories)

#### **MenuItemCard**
```typescript
interface MenuItemCardProps {
  item: MenuItem;
  onQuickAdd: () => void;
  onCustomize: () => void;
  showCustomizeButton: boolean;
}
```
- **Usage**: Base container for all menu items
- **Features**: Image display, pricing, availability status
- **Categories**: All

#### **QuantitySelector**
```typescript
interface QuantitySelectorProps {
  quantity: number;
  min: number;
  max: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}
```
- **Usage**: Quantity selection for all items
- **Features**: +/- buttons, input validation, limits
- **Categories**: All

#### **PricingDisplay**
```typescript
interface PricingDisplayProps {
  pricing: PricingCalculation;
  showBreakdown: boolean;
  isUpdating?: boolean;
}
```
- **Usage**: Real-time pricing with breakdown
- **Features**: Tax calculation, discounts, upcharges
- **Categories**: All

#### **OrderTypeSelector** 
```typescript
interface OrderTypeSelectorProps {
  orderType: 'only' | 'dinner' | 'deluxe';
  onChange: (type: string) => void;
  pricing: { only: number; dinner: number; deluxe?: number };
  description: Record<string, string>;
}
```
- **Usage**: "Only" vs "Dinner" vs "Deluxe" selection
- **Features**: Price difference display, automatic side adjustment
- **Categories**: Seafood, Chicken, Tenders, Wing Dings, Sandwiches

### 2. Customization Components

#### **SideSelector**
```typescript
interface SideSelectorProps {
  selectedSides: string[];
  availableSides: SideOption[];
  defaultSides: string[];
  orderType: 'only' | 'dinner';
  maxMain: number;
  maxAdditional: number;
  onChange: (sides: string[]) => void;
}
```
- **Usage**: Side selection with substitution logic
- **Features**: Free/premium sides, order type restrictions
- **Categories**: All dinner items

#### **SauceSelector**
```typescript
interface SauceSelectorProps {
  selectedSauces: string[];
  availableSauces: SauceOption[];
  freeLimit: number;
  specialRules?: Record<string, { freeLimit: number }>;
  onChange: (sauces: string[]) => void;
}
```
- **Usage**: Sauce selection with free limits
- **Features**: BBQ special rule (5 free), charge calculation
- **Categories**: All fried items, subs, salads

#### **CookingStyleSelector**
```typescript
interface CookingStyleSelectorProps {
  selectedStyle: string;
  availableStyles: CookingStyle[];
  onChange: (style: string) => void;
  surcharges?: Record<string, number>;
}
```
- **Usage**: Cooking preference selection
- **Features**: Light/regular/well-done, surcharge handling
- **Categories**: All fried items, some pasta

### 3. Category-Specific Components

#### **IndividualPieceSelector**
```typescript
interface IndividualPieceSelectorProps {
  pieces: PieceOption[];
  selectedPieces: Record<string, number>;
  maxPieces: number;
  showQuickCombinations: boolean;
  onPieceChange: (pieceId: string, quantity: number) => void;
  onCombinationSelect?: (combination: string) => void;
}
```
- **Usage**: Individual piece ordering (seafood, chicken)
- **Features**: Piece counter, quick combinations, price calculation
- **Categories**: Seafood, Chicken, Tenders, Wing Dings

#### **PizzaToppingSelector**
```typescript
interface PizzaToppingSelectorProps {
  availableToppings: PizzaTopping[];
  selectedToppings: PizzaToppingSelection[];
  allowHalfToppings: boolean;
  maxToppings?: number;
  size: PizzaSize;
  onToppingChange: (selection: PizzaToppingSelection) => void;
}
```
- **Usage**: Pizza topping selection with half-pizza support
- **Features**: Whole/half positioning, extra topping options
- **Categories**: Pizza only

#### **PresetModificationTracker**
```typescript
interface PresetModificationTrackerProps {
  presetItems: string[];
  selectedItems: string[];
  additionPrices: Record<string, number>;
  removalCredits?: Record<string, number>;
  onChange: (items: string[]) => void;
}
```
- **Usage**: Track modifications to preset combinations
- **Features**: Addition/removal tracking, price adjustments
- **Categories**: Submarines, some salads

#### **CombinationBuilder**
```typescript
interface CombinationBuilderProps {
  availableProteins: ProteinOption[];
  selectedProteins: string[];
  maxProteins: number;
  defaultCombination?: string[];
  onProteinChange: (proteins: string[]) => void;
  totalPrice: number;
}
```
- **Usage**: Multi-protein combination building
- **Features**: Protein selection, default combinations, price balancing
- **Categories**: Combination Plates, Smorgasbord

## Category-Specific Implementation Details

### 1. Pizza (Most Complex)

#### POS Data Structure
```javascript
// From menuContent.js - Pizza entries
{
  "Category": "pizza",
  "Type": "round_square|round|twins|stuffed|tray",
  "Size": "slice|small|medium|large|xlarge|stuffed|tray",
  "Toppings": 0-9,
  "price": [varies by size and topping count]
}
```

#### Implementation Requirements
- **Topping System**: 30+ toppings with half-pizza positioning
- **Size Restrictions**: Round vs Square availability by size
- **Preset Combinations**: Special, Supreme, BBQ Chicken, etc.
- **Complex Pricing**: Size + topping count matrix
- **Twin Pizza Logic**: Special discount pricing for identical pairs
- **Crust Options**: Regular, thin, thick (+$1.50), garlic (+$1.00)

#### Components Required
1. **PizzaCustomizer** (main container)
2. **PizzaSizeSelector** (with shape restrictions)
3. **PizzaToppingSelector** (with half-pizza support)
4. **PizzaPresetSelector** (special combinations)
5. **PizzaCrustSelector** (with pricing)
6. **HalfPizzaVisualizer** (optional enhancement)
7. **TwinPizzaBuilder** (for twin orders)

### 2. Chicken Categories (Chicken, Tenders, Wing Dings)

#### POS Data Structure
```javascript
// Broasted Chicken
{
  "Category": "fry",
  "Type": "broasted",
  "Size": "2|4|8|12|16|20|24|breast|custom",
  "Toppings": "only|dinner",
  "broasted": ["all white", "all dark", "breast", "thigh", "leg", "wing"]
}
```

#### Implementation Requirements
- **Individual Piece System**: Breast ($4.15), Thigh ($3.00), Leg ($2.60), Wing ($2.10)
- **Standard Portions**: 2pc, 4pc, 8pc, etc. with meat selection
- **Order Type Logic**: "Only" (-$2.00) vs "Dinner" (+sides)
- **BBQ Style**: +$0.10 per piece surcharge
- **Side Substitution**: Standard (ff, roll, slaw) vs Premium (+upcharge)

#### Components Required
1. **ChickenCustomizer** (enhanced - already created)
2. **IndividualPieceSelector** (already created)
3. **OrderTypeSelector** (universal)
4. **MeatSelectionRadio** (all white/dark/mixed)
5. **BBQStyleToggle** (with per-piece pricing)
6. **SideSelector** (universal)

### 3. Seafood Categories

#### POS Data Structure
```javascript
// Individual Seafood Pieces
{
  "Category": "seafood", 
  "Type": "fish|perch|fl", // fl = frog legs
  "Size": "1", // individual piece
  "Toppings": "only|dinner",
  "price": "2.85|2.05|3.60"
}
```

#### Implementation Requirements
- **Individual Pieces**: Fish ($2.85), Perch ($2.05), Frog Legs ($3.60)
- **Portion Options**: Snack, Dinner, Family sizes
- **Preparation Styles**: Regular, Cajun
- **Order Type Logic**: Same as chicken
- **Sauce Selection**: 8+ sauce options

#### Components Required
1. **SeafoodCustomizer** (enhanced - already created)
2. **IndividualPieceSelector** (shared with chicken)
3. **PreparationStyleSelector** (regular/cajun)
4. **SauceSelector** (universal)
5. **OrderTypeSelector** (universal)

### 4. Pasta

#### POS Data Structure
```javascript
{
  "Category": "pasta",
  "Type": "spag_most|ravioli",
  "Size": "pint|quart|bucket",
  "Toppings": "mr|mb|mr_mb|baked|baked_mr|baked_mb|baked_mr_mb"
}
```

#### Implementation Requirements
- **Size-Based Pricing**: Pint/Quart/Bucket with different add-on costs
- **Baked Options**: Cheese topping with size-based pricing
- **Meatball Options**: Regular, Mixed, Both
- **Default Sides**: Roll + garlic sticks, quantity scales by size
- **Sauce Types**: Meat sauce vs Marinara

#### Components Required
1. **PastaCustomizer** (existing - needs enhancement)
2. **PastaSizeSelector** (with side quantity display)
3. **BakedCheeseToggle** (with size-based pricing)
4. **MeatballSelector** (radio group: none/regular/mixed/both)
5. **SauceTypeSelector** (meat/marinara)

### 5. Submarines

#### POS Data Structure
```javascript
{
  "Category": "subs",
  "Type": "italian|ham_cheese|pizza_sub|vegetarian|meatball|turkey|deluxe|steak_cheese|chicken_parm|chicken_tender",
  "Size": "half|whole",
  "Toppings": ["preset ingredients with modifications"]
}
```

#### Implementation Requirements
- **Preset Ingredients**: Each sub type has defined ingredients
- **Modification Tracking**: Add/remove from preset with pricing
- **Extra Options**: Extra meat (+$1.50), Extra cheese (+$1.50)
- **Size Scaling**: Half vs Whole pricing

#### Components Required
1. **SubmarineCustomizer** (new)
2. **PresetModificationTracker** (universal)
3. **ExtraOptionsSelector** (meat/cheese additions)
4. **IngredientsList** (visual preset display)

### 6. Combination Plates & Smorgasbord

#### POS Data Structure
```javascript
// Smorgasbord
{
  "Category": "fry",
  "Type": "smorg",
  "smorg": ["ckn", "rib", "fl", "shrimp"], // choose 4
  "Toppings": "dinner",
  "price": "20.80"
}
```

#### Implementation Requirements
- **Multi-Protein Selection**: Choose 2-4 proteins from available list
- **Default Combinations**: Smorgasbord default (chicken, ribs, frog legs, shrimp)
- **Protein Pricing**: Individual protein prices for combinations
- **Shared Customization**: Cooking style, sauces apply to all proteins
- **Portion Balancing**: Equal portions of each selected protein

#### Components Required
1. **CombinationPlateCustomizer** (enhanced)
2. **CombinationBuilder** (universal)
3. **ProteinSelector** (multi-select with limits)
4. **SmorgasbordPresets** (quick selection buttons)
5. **SharedCustomizationPanel** (cooking, sauces for all)

## Implementation Priority & Dependencies

### Phase 1: Foundation (Weeks 1-2)
**Focus**: Universal components and simple categories
- **Universal Components**: All 8 core components
- **Simple Categories**: Appetizers, Desserts
- **Testing**: Component library validation

### Phase 2: Core Menu (Weeks 3-5)  
**Focus**: High-traffic categories with moderate complexity
- **Categories**: Salads, Pasta, BBQ Ribs
- **Components**: Size-based logic, sauce systems
- **Testing**: Category-specific validation

### Phase 3: Complex Ordering (Weeks 6-9)
**Focus**: Individual piece systems and complex customization  
- **Categories**: All Chicken categories, Seafood
- **Components**: Individual piece selectors, order type logic
- **Testing**: Pricing calculation validation

### Phase 4: Advanced Features (Weeks 10-12)
**Focus**: Most complex categories and final integration
- **Categories**: Pizza, Submarines, Combination Plates
- **Components**: Half-pizza builder, preset modifiers, combination builder
- **Testing**: Full system integration testing

## POS Integration Specifications

### Standard Order Object Format
```typescript
interface POSOrderItem {
  category: string;
  type: string[];
  size: (string | number)[];
  topping: string[];
  sauce?: string[];
  side?: string[];
  quantity: number;
  price: string;
  tracker: {
    type?: Record<string, number>;
    size?: Record<string, number>;
    topping?: Record<string, number>;
    sauce?: Record<string, number>;
    side?: Record<string, number>;
  };
}
```

### Category-Specific DTO Patterns

#### Pizza Orders
```typescript
interface PizzaOrder extends POSOrderItem {
  pizzaToppings?: {
    whole?: Record<string, number>;
    first?: Record<string, number>;
    second?: Record<string, number>;
  };
  displayToppings?: Record<string, number>;
  crust?: string[];
  sauceAmount?: string[];
}
```

#### Individual Piece Orders
```typescript
interface IndividualPieceOrder extends POSOrderItem {
  pieces: Record<string, number>; // pieceType -> quantity
  orderType: 'only' | 'dinner';
  preparation?: string; // regular/cajun/bbq
  sideSubstitutions?: string[];
}
```

#### Combination Orders
```typescript
interface CombinationOrder extends POSOrderItem {
  proteins: string[]; // selected protein types
  portions: Record<string, number>; // protein -> portion size
  sharedCustomizations: {
    cooking?: string;
    sauces?: string[];
    sides?: string[];
  };
}
```

## Testing Strategy

### Unit Testing Requirements
- **Component Tests**: >90% coverage for all reusable components
- **Pricing Tests**: Validate all calculation logic against POS data
- **Validation Tests**: Ensure order constraints are properly enforced

### Integration Testing Requirements  
- **Category Tests**: End-to-end testing for each menu category
- **POS Compatibility**: Validate DTO generation matches POS expectations
- **Cart Integration**: Ensure seamless cart operations

### Performance Requirements
- **Load Times**: <2s initial load, <500ms category switching
- **Interaction Response**: <100ms for all user interactions
- **Calculation Speed**: <50ms for pricing updates

## Accessibility Standards
- **WCAG 2.1 AA Compliance**: All components must meet accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: 4.5:1 minimum contrast ratio

## Development Guidelines

### Code Standards
- **TypeScript**: Full typing for all components and interfaces
- **Component Structure**: Consistent props interface patterns
- **Error Handling**: Graceful degradation for all failure modes
- **Documentation**: JSDoc comments for all public interfaces

### File Organization
```
src/lib/components/menu/
├── universal/           # Reusable components
├── pizza/              # Pizza-specific components  
├── chicken/            # Chicken category components
├── seafood/           # Seafood category components
├── combinations/      # Combination plate components
└── [category]/        # Other category components

src/lib/types/
├── menu.ts            # Core menu interfaces
├── pos-integration.ts # POS DTO interfaces
└── [category].ts      # Category-specific types

src/lib/utils/
├── pricing/           # Pricing calculation utilities
├── validation/        # Order validation utilities
└── pos-mapping/       # POS conversion utilities
```

This comprehensive guide provides the roadmap for implementing the complete Primos Pizza menu system with full POS compatibility and maintainable architecture.