# Seafood Implementation Command

*Comprehensive implementation plan for seafood categories with individual piece ordering*

## Command Usage
```bash
claude implement-seafood
```

## Overview
Seafood categories feature sophisticated individual piece ordering, preparation style selection, and complex pricing calculations across multiple seafood types with preparation variations.

**Estimated Timeline**: 2-3 weeks  
**Components Required**: 8-12  
**Testing Required**: 20+ test suites  
**POS Integration**: Advanced piece tracking with preparation coordination

## Seafood Categories Coverage

### 1. Individual Seafood Pieces
- **Fish**: $2.85 per piece (regular/cajun)
- **Perch**: $2.05 per piece (regular/cajun)
- **Frog Legs**: $3.60 per piece (regular/cajun)
- **Order Types**: Only (-$2.00) vs Dinner (includes sides)

### 2. Hand-Battered Shrimp
- **Regular Shrimp**: Size-based pricing
- **Cajun Shrimp**: +$0.50 surcharge
- **Portion Sizes**: 6pc, 10pc, 15pc, 21pc
- **Order Types**: Only vs Dinner

## Component Architecture

### 1. Enhanced Seafood Customizer

#### **SeafoodCustomizer.svelte** (Enhanced)
```typescript
interface SeafoodCustomizerProps {
  item: MenuItem;
  seafoodType: 'fish' | 'perch' | 'frog-legs' | 'shrimp';
  onAddToCart: (config: SeafoodOrderConfig) => void;
  onCancel: () => void;
}

interface SeafoodOrderConfig {
  seafoodType: 'fish' | 'perch' | 'frog-legs' | 'shrimp';
  orderingMode: 'individual' | 'portion';
  
  // Individual piece selection
  selectedPieces?: Record<string, number>;
  
  // Standard portion selection
  portionSize?: number;
  
  // Order type and pricing
  orderType: 'only' | 'dinner';
  
  // Preparation styles
  preparationStyle: 'regular' | 'cajun';
  cookingPreference?: 'light' | 'regular' | 'well-done';
  
  // Sides and customization
  selectedSides: string[];
  sideSubstitutions: Record<string, string>;
  selectedSauces: string[];
  
  // Configuration
  quantity: number;
  specialInstructions: string;
}
```

## Implementation Timeline

### Week 1: Foundation and Individual Pieces
- [ ] Enhance SeafoodCustomizer with dual modes
- [ ] Implement SeafoodPieceSelector with piece types
- [ ] Create PreparationStyleSelector (regular/cajun)
- [ ] Build SeafoodPricingCalculator foundation
- [ ] Write unit tests for piece selection

### Week 2: Preparation and Order Types
- [ ] Implement SeafoodPortionSelector for shrimp
- [ ] Create CookingPreferenceSelector
- [ ] Add enhanced sauce selection system
- [ ] Integrate order type logic
- [ ] Add comprehensive pricing tests

### Week 3: Integration and Polish
- [ ] Integrate all components into enhanced customizer
- [ ] Implement POS DTO generation
- [ ] Add cart integration
- [ ] Performance optimization and testing
- [ ] Accessibility compliance

This comprehensive seafood implementation provides sophisticated ordering capabilities matching the POS system complexity.