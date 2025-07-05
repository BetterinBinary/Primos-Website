# Pasta Implementation Command

*Implementation plan for pasta categories with size-based sides and baked options*

## Command Usage
```bash
claude implement-pasta
```

## Overview
Pasta categories feature size-based pricing with scaling side quantities, baked cheese options with size-dependent pricing, and meatball selection systems.

**Estimated Timeline**: 1-2 weeks  
**Components Required**: 6-8  
**Testing Required**: 15+ test suites  
**POS Integration**: Size-based DTO with addon tracking

## Pasta Categories Coverage

### 1. Spaghetti with Meat Sauce
- **Sizes**: Pint, Quart, Bucket
- **Options**: Regular, with Meatballs, Baked with Cheese
- **Sides**: Roll + Garlic Sticks (quantity scales by size)

### 2. Ravioli
- **Sizes**: Pint, Quart, Bucket  
- **Options**: Meat or Cheese filled, Baked options
- **Sauce**: Meat sauce or Marinara

## Component Architecture

### 1. Main Container

#### **PastaCustomizer.svelte** (Enhanced)
```typescript
interface PastaCustomizerProps {
  item: MenuItem;
  pastaType: 'spaghetti' | 'ravioli';
  onAddToCart: (config: PastaOrderConfig) => void;
  onCancel: () => void;
}

interface PastaOrderConfig {
  pastaType: 'spaghetti' | 'ravioli';
  size: 'pint' | 'quart' | 'bucket';
  
  // Pasta-specific options
  sauceType: 'meat' | 'marinara';
  meatballOption: 'none' | 'regular' | 'mixed' | 'both';
  bakedWithCheese: boolean;
  
  // Sides (auto-scaled by size)
  defaultSides: string[];
  sideQuantities: Record<string, number>;
  
  // Configuration
  quantity: number;
  specialInstructions: string;
}
```

## Implementation Timeline

### Week 1: Core Components
- [ ] Enhance PastaCustomizer with size selection
- [ ] Implement PastaSizeSelector with side scaling
- [ ] Create BakedCheeseToggle with size-based pricing
- [ ] Build MeatballSelector
- [ ] Write unit tests

### Week 2: Integration and Polish
- [ ] Integrate all components
- [ ] Implement POS DTO generation
- [ ] Add cart integration
- [ ] Testing and optimization

This pasta implementation provides complete size-based customization with proper side scaling.