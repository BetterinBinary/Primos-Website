# Implement Combination Plates Command

**Command**: `claude implement-combinations`  
**Purpose**: Complete implementation of combination plates with multi-protein selection system  
**Complexity**: Very High - Most complex category with multiple protein coordination  
**Priority**: P4 (Final implementation after all base categories)  

## Combination Plates Overview

### Business Requirements
- **Multi-Protein Selection**: Choose multiple proteins in one order
- **Portion Distribution**: Balance portions across selected proteins  
- **Protein Compatibility**: Ensure compatible protein combinations
- **Complex Pricing**: Calculate pricing across multiple protein types
- **Side Coordination**: Shared sides across all proteins
- **Cooking Coordination**: Coordinate cooking times and preferences

### Available Combinations

```typescript
interface CombinationTypes {
  'ribs-chicken': {
    proteins: ['bbq-ribs', 'chicken'];
    defaultPortions: { ribs: 0.5, chicken: 0.5 };
    complexity: 'medium';
    minPortions: 2;
  };
  
  'ribs-shrimp': {
    proteins: ['bbq-ribs', 'hand-battered-shrimp'];
    defaultPortions: { ribs: 0.6, shrimp: 0.4 };
    complexity: 'medium';
    minPortions: 2;
  };
  
  'chicken-fish': {
    proteins: ['chicken', 'fish'];
    defaultPortions: { chicken: 0.5, fish: 0.5 };
    complexity: 'medium';
    minPortions: 2;
  };
  
  'shrimp-frog-legs': {
    proteins: ['hand-battered-shrimp', 'frog-legs'];
    defaultPortions: { shrimp: 0.5, frogLegs: 0.5 };
    complexity: 'high';
    minPortions: 2;
  };
  
  'primo-smorgasbord': {
    proteins: ['bbq-ribs', 'chicken', 'hand-battered-shrimp', 'fish'];
    defaultPortions: { ribs: 0.3, chicken: 0.3, shrimp: 0.2, fish: 0.2 };
    complexity: 'very-high';
    minPortions: 4;
    maxSelections: 'unlimited';
  };
}
```

## Technical Architecture

### Core Type Definitions

```typescript
// /src/lib/types/combinations.ts
export interface CombinationPlateCustomization {
  combinationType: CombinationType;
  selectedProteins: Record<string, ProteinSelection>;
  portionDistribution: Record<string, number>;  // Percentages adding to 1.0
  sharedSides: string[];
  cookingPreferences: Record<string, CookingPreference>;
  specialInstructions?: string;
}

export interface ProteinSelection {
  proteinId: string;
  proteinType: 'ribs' | 'chicken' | 'shrimp' | 'fish' | 'frog-legs';
  portion: number;           // Percentage (0.0 to 1.0)
  specificCustomizations: any;  // Protein-specific options
  pieceCount?: number;       // For chicken/shrimp
  preparation?: string;      // Cooking style
}

export interface CombinationPricingCalculation {
  proteinPricing: Record<string, number>;
  portionAdjustments: Record<string, number>;
  combinationDiscount: number;
  sharedSidesCost: number;
  subtotal: number;
  tax: number;
  total: number;
  breakdown: PriceBreakdownItem[];
  proteinBreakdown: Record<string, ProteinPricingDetail>;
}

export interface ProteinPricingDetail {
  basePrice: number;
  portionMultiplier: number;
  adjustedPrice: number;
  customizationUpcharges: number;
  finalPrice: number;
}

export type CombinationType = 
  | 'ribs-chicken' 
  | 'ribs-shrimp' 
  | 'chicken-fish' 
  | 'ribs-fish'
  | 'shrimp-frog-legs' 
  | 'primo-smorgasbord';

export interface CookingPreference {
  proteinId: string;
  preference: string;       // e.g., 'well-done', 'regular', 'cajun-style'
  timing: 'standard' | 'rush' | 'hold';
}
```

## Component Architecture

### Required Components (16 components)

```typescript
interface CombinationComponents {
  // Main combination components
  CombinationPlatesPage: Component;            // Main category page
  CombinationItemCard: Component;              // Combination item display
  CombinationTypeSelector: Component;          // Select combination type
  CombinationBuilder: Component;               // Main customization interface
  
  // Protein management components
  ProteinSelector: Component;                  // Select available proteins
  ProteinPortionSlider: Component;             // Adjust protein portions
  ProteinCustomizer: Component;                // Protein-specific customizations
  ProteinCoordinator: Component;               // Coordinate cooking preferences
  
  // Advanced combination components
  CombinationVisualizer: Component;            // Visual portion representation
  PortionBalancer: Component;                  // Balance portions across proteins
  CombinationPricingEngine: Component;         // Complex pricing calculation
  CombinationValidator: Component;             // Validate combination rules
  
  // Integration components
  CombinationSummary: Component;               // Detailed customization summary
  CombinationCartIntegration: Component;       // Enhanced cart integration
  CombinationPreview: Component;               // Preview final combination
  CombinationAdvancedOptions: Component;       // Advanced cooking preferences
}
```

### Core Component Specifications

#### CombinationBuilder Component
```svelte
<!-- /src/lib/components/menu/combinations/CombinationBuilder.svelte -->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ProteinSelector from './ProteinSelector.svelte';
  import PortionBalancer from './PortionBalancer.svelte';
  import CombinationVisualizer from './CombinationVisualizer.svelte';
  import CombinationPricingEngine from './CombinationPricingEngine.svelte';
  
  let { 
    combinationType,
    availableProteins = [],
    selectedProteins = $bindable({}),
    portionDistribution = $bindable({}),
    basePrice = 0
  } = $props();
  
  const dispatch = createEventDispatcher();
  
  // Get combination configuration
  const combinationConfig = $derived(() => {
    return getCombinationConfig(combinationType);
  });
  
  // Validate current selection
  const isValidSelection = $derived(() => {
    const selectedCount = Object.keys(selectedProteins).length;
    const minProteins = combinationConfig().minPortions || 2;
    const maxProteins = combinationConfig().maxSelections || 4;
    
    const portionSum = Object.values(portionDistribution).reduce(
      (sum, portion) => sum + portion, 0
    );
    
    return selectedCount >= minProteins && 
           selectedCount <= maxProteins &&
           Math.abs(portionSum - 1.0) < 0.01; // Within 1% of 100%
  });
  
  // Calculate total pricing
  const totalPricing = $derived(() => {
    if (!isValidSelection()) return null;
    
    return CombinationPricingCalculator.calculateCombinationPrice(
      selectedProteins,
      portionDistribution,
      basePrice,
      combinationType
    );
  });
  
  function handleProteinSelection(event) {
    const { proteinId, selected, proteinData } = event.detail;
    
    if (selected) {
      selectedProteins = {
        ...selectedProteins,
        [proteinId]: {
          proteinId,
          proteinType: proteinData.type,
          portion: getDefaultPortion(proteinId),
          specificCustomizations: {}
        }
      };
      
      // Auto-balance portions
      rebalancePortions();
    } else {
      const { [proteinId]: removed, ...rest } = selectedProteins;
      selectedProteins = rest;
      
      const { [proteinId]: removedPortion, ...restPortions } = portionDistribution;
      portionDistribution = restPortions;
      
      // Rebalance remaining portions
      rebalancePortions();
    }
    
    validateAndNotify();
  }
  
  function handlePortionChange(event) {
    const { proteinId, newPortion } = event.detail;
    
    portionDistribution = {
      ...portionDistribution,
      [proteinId]: newPortion
    };
    
    validateAndNotify();
  }
  
  function rebalancePortions() {
    const proteinIds = Object.keys(selectedProteins);
    if (proteinIds.length === 0) return;
    
    const defaultPortions = combinationConfig().defaultPortions || {};
    const newDistribution = {};
    
    // Use default portions if available
    let remainingPortion = 1.0;
    
    proteinIds.forEach(proteinId => {
      const defaultPortion = defaultPortions[proteinId] || (1.0 / proteinIds.length);
      newDistribution[proteinId] = defaultPortion;
      remainingPortion -= defaultPortion;
    });
    
    // Adjust if portions don't add up to 1.0
    if (Math.abs(remainingPortion) > 0.01) {
      const adjustment = remainingPortion / proteinIds.length;
      proteinIds.forEach(proteinId => {
        newDistribution[proteinId] += adjustment;
      });
    }
    
    portionDistribution = newDistribution;
  }
  
  function getDefaultPortion(proteinId) {
    const config = combinationConfig();
    return config.defaultPortions?.[proteinId] || (1.0 / config.minPortions);
  }
  
  function validateAndNotify() {
    const isValid = isValidSelection();
    const pricing = totalPricing();
    
    dispatch('combinationChanged', {
      selectedProteins,
      portionDistribution,
      isValid,
      pricing,
      combinationType
    });
  }
  
  function getCombinationConfig(type) {
    // Return configuration for combination type
    const configs = {
      'ribs-chicken': {
        proteins: ['bbq-ribs', 'chicken'],
        defaultPortions: { 'bbq-ribs': 0.5, 'chicken': 0.5 },
        minPortions: 2,
        maxSelections: 2
      },
      'primo-smorgasbord': {
        proteins: ['bbq-ribs', 'chicken', 'hand-battered-shrimp', 'fish'],
        defaultPortions: { 
          'bbq-ribs': 0.3, 
          'chicken': 0.3, 
          'hand-battered-shrimp': 0.2, 
          'fish': 0.2 
        },
        minPortions: 2,
        maxSelections: 4
      }
      // ... other combinations
    };
    
    return configs[type] || configs['ribs-chicken'];
  }
</script>

<div class="combination-builder">
  <!-- Combination type header -->
  <div class="combination-header">
    <h3>Build Your {combinationType.replace('-', ' & ').toUpperCase()}</h3>
    <p>Select proteins and adjust portions to create your perfect combination</p>
  </div>
  
  <!-- Protein selection -->
  <div class="protein-selection-section">
    <h4>Select Proteins:</h4>
    <ProteinSelector
      {availableProteins}
      {combinationType}
      {selectedProteins}
      on:proteinSelectionChanged={handleProteinSelection}
    />
  </div>
  
  <!-- Portion balancing -->
  {#if Object.keys(selectedProteins).length > 0}
    <div class="portion-balancing-section">
      <h4>Adjust Portions:</h4>
      <PortionBalancer
        {selectedProteins}
        {portionDistribution}
        on:portionChanged={handlePortionChange}
      />
    </div>
    
    <!-- Visual representation -->
    <div class="visualization-section">
      <CombinationVisualizer
        {selectedProteins}
        {portionDistribution}
      />
    </div>
    
    <!-- Pricing breakdown -->
    <div class="pricing-section">
      <CombinationPricingEngine
        {selectedProteins}
        {portionDistribution}
        {basePrice}
        {combinationType}
        pricing={totalPricing()}
      />
    </div>
  {/if}
  
  <!-- Validation status -->
  {#if !isValidSelection()}
    <div class="validation-warning">
      <p>Please select the required proteins and ensure portions add up to 100%</p>
    </div>
  {/if}
</div>

<style>
  .combination-builder {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .combination-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .protein-selection-section,
  .portion-balancing-section,
  .visualization-section,
  .pricing-section {
    margin-bottom: 2rem;
  }
  
  .validation-warning {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    color: #856404;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
  }
</style>
```

#### PortionBalancer Component
```svelte
<!-- /src/lib/components/menu/combinations/PortionBalancer.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  let { 
    selectedProteins = {},
    portionDistribution = {},
  } = $props();
  
  const dispatch = createEventDispatcher();
  
  // Calculate total portion (should be 1.0)
  const totalPortion = $derived(() => {
    return Object.values(portionDistribution).reduce((sum, portion) => sum + portion, 0);
  });
  
  // Check if portions are balanced
  const isBalanced = $derived(() => {
    return Math.abs(totalPortion() - 1.0) < 0.01;
  });
  
  function updatePortion(proteinId, newPortion) {
    const clampedPortion = Math.max(0.1, Math.min(0.8, newPortion));
    
    // Update the changed portion
    const updatedDistribution = {
      ...portionDistribution,
      [proteinId]: clampedPortion
    };
    
    // Auto-adjust other portions to maintain balance
    const otherProteins = Object.keys(selectedProteins).filter(id => id !== proteinId);
    const remainingPortion = 1.0 - clampedPortion;
    const portionPerOther = otherProteins.length > 0 ? remainingPortion / otherProteins.length : 0;
    
    otherProteins.forEach(otherId => {
      updatedDistribution[otherId] = portionPerOther;
    });
    
    dispatch('portionChanged', {
      proteinId,
      newPortion: clampedPortion,
      fullDistribution: updatedDistribution
    });
  }
  
  function resetToDefaults() {
    const proteinIds = Object.keys(selectedProteins);
    const equalPortion = 1.0 / proteinIds.length;
    
    const resetDistribution = {};
    proteinIds.forEach(id => {
      resetDistribution[id] = equalPortion;
    });
    
    dispatch('portionsReset', { distribution: resetDistribution });
  }
  
  function getProteinDisplayName(proteinId) {
    const names = {
      'bbq-ribs': 'BBQ Ribs',
      'chicken': 'Chicken',
      'hand-battered-shrimp': 'Shrimp',
      'fish': 'Fish',
      'frog-legs': 'Frog Legs'
    };
    return names[proteinId] || proteinId;
  }
</script>

<div class="portion-balancer">
  <!-- Portion sliders -->
  <div class="portion-controls">
    {#each Object.keys(selectedProteins) as proteinId}
      <div class="portion-control">
        <label class="portion-label">
          <span class="protein-name">
            {getProteinDisplayName(proteinId)}
          </span>
          <span class="portion-percentage">
            {Math.round((portionDistribution[proteinId] || 0) * 100)}%
          </span>
        </label>
        
        <input
          type="range"
          min="0.1"
          max="0.8"
          step="0.05"
          value={portionDistribution[proteinId] || 0}
          oninput={(e) => updatePortion(proteinId, parseFloat(e.target.value))}
          class="portion-slider"
        />
        
        <div class="portion-visual">
          <div 
            class="portion-bar"
            style="width: {(portionDistribution[proteinId] || 0) * 100}%"
          ></div>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Balance status -->
  <div class="balance-status">
    <div class="total-portion" class:balanced={isBalanced()}>
      Total: {Math.round(totalPortion() * 100)}%
      {#if !isBalanced()}
        <span class="balance-warning">
          (Should be 100%)
        </span>
      {/if}
    </div>
    
    <button 
      class="btn-secondary"
      onclick={resetToDefaults}
    >
      Reset to Equal Portions
    </button>
  </div>
  
  <!-- Visual portion pie chart -->
  <div class="portion-visualization">
    <!-- SVG pie chart representation -->
    <svg viewBox="0 0 200 200" class="portion-pie">
      <!-- Pie chart segments for each protein -->
      {#each Object.entries(portionDistribution) as [proteinId, portion], index}
        <!-- Calculate SVG path for pie segment -->
        <!-- Implementation would include proper pie chart math -->
      {/each}
    </svg>
  </div>
</div>

<style>
  .portion-balancer {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
  }
  
  .portion-controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .portion-control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .portion-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
  }
  
  .protein-name {
    color: var(--primos-blue-500);
  }
  
  .portion-percentage {
    font-weight: 600;
    color: var(--primos-red-600);
  }
  
  .portion-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    appearance: none;
  }
  
  .portion-slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primos-blue-500);
    cursor: pointer;
  }
  
  .portion-visual {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .portion-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primos-blue-500), var(--primos-gold-500));
    border-radius: 4px;
    transition: width 0.2s ease;
  }
  
  .balance-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
  
  .total-portion {
    font-weight: 600;
    font-size: 1.1em;
  }
  
  .total-portion.balanced {
    color: #28a745;
  }
  
  .balance-warning {
    color: #dc3545;
    font-size: 0.875rem;
    margin-left: 0.5rem;
  }
  
  .portion-visualization {
    display: flex;
    justify-content: center;
  }
  
  .portion-pie {
    width: 150px;
    height: 150px;
  }
</style>
```

## Implementation Steps

### Phase 1: Foundation and Architecture (Days 1-2)

1. **Create Component Structure**
   ```bash
   mkdir -p src/lib/components/menu/combinations
   mkdir -p src/lib/types/combinations
   mkdir -p src/lib/utils/combinations
   mkdir -p src/lib/stores/combinations
   ```

2. **Define Complex Type System**
   ```typescript
   // Complete type definitions for combination plates
   // Protein coordination interfaces
   // Complex pricing calculation types
   // Validation rule definitions
   ```

3. **Create Base Combination Infrastructure**
   - CombinationPlatesPage component
   - Base combination configuration system
   - Protein compatibility matrix

### Phase 2: Core Combination Logic (Days 3-5)

4. **Implement Protein Selection System**
   - ProteinSelector component
   - Protein compatibility validation
   - Dynamic protein loading

5. **Build Portion Management System**
   - PortionBalancer component
   - Real-time portion calculation
   - Auto-balancing algorithms

6. **Create Combination Builder**
   - Main CombinationBuilder component
   - Integration of all subsystems
   - Real-time validation

### Phase 3: Advanced Features (Days 6-8)

7. **Implement Complex Pricing Engine**
   ```typescript
   export class CombinationPricingCalculator {
     static calculateCombinationPrice(
       selectedProteins: Record<string, ProteinSelection>,
       portionDistribution: Record<string, number>,
       basePrice: number,
       combinationType: CombinationType
     ): CombinationPricingCalculation {
       const proteinPricing = this.calculateProteinPricing(
         selectedProteins, 
         portionDistribution
       );
       
       const combinationDiscount = this.calculateCombinationDiscount(
         proteinPricing,
         combinationType
       );
       
       const sharedSidesCost = this.calculateSharedSidesCost(
         selectedProteins
       );
       
       return {
         proteinPricing,
         combinationDiscount,
         sharedSidesCost,
         subtotal: proteinPricing.total - combinationDiscount + sharedSidesCost,
         tax: (proteinPricing.total - combinationDiscount + sharedSidesCost) * 0.06,
         total: this.calculateFinalTotal(proteinPricing, combinationDiscount, sharedSidesCost),
         breakdown: this.generateDetailedBreakdown(/* ... */),
         proteinBreakdown: this.generateProteinBreakdown(selectedProteins, portionDistribution)
       };
     }
   }
   ```

8. **Create Visual Components**
   - CombinationVisualizer component
   - Interactive portion pie charts
   - Protein preview system

9. **Build Validation System**
   - Complex combination validation
   - Cooking time coordination
   - Portion balance validation

### Phase 4: Integration and Polish (Days 9-12)

10. **Enhanced Cart Integration**
    ```typescript
    interface CombinationCartItem extends CartItem {
      combinationCustomization: {
        combinationType: CombinationType;
        selectedProteins: Record<string, ProteinSelection>;
        portionDistribution: Record<string, number>;
        sharedSides: string[];
        cookingPreferences: Record<string, CookingPreference>;
      };
      combinationPricing: CombinationPricingCalculation;
    }
    ```

11. **Advanced Cooking Coordination**
    - Cooking time estimation
    - Preparation sequence planning
    - Kitchen coordination system

12. **Quality Assurance and Testing**
    - Comprehensive testing suite
    - Edge case validation
    - Performance optimization

## Testing Strategy

### Unit Tests (35+ test cases)

```javascript
// /src/lib/components/menu/combinations/CombinationBuilder.test.js
describe('CombinationBuilder', () => {
  test('validates combination types correctly', () => {
    // Test combination type validation
  });
  
  test('balances portions automatically', () => {
    // Test auto-balancing algorithm
  });
  
  test('calculates complex pricing correctly', () => {
    // Test complex pricing scenarios
  });
  
  test('handles protein compatibility', () => {
    // Test protein compatibility validation
  });
  
  test('coordinates cooking preferences', () => {
    // Test cooking coordination
  });
});
```

### Integration Tests (20+ test cases)

```javascript
describe('Combination Integration', () => {
  test('complete combination customization flow', () => {
    // Test end-to-end combination building
  });
  
  test('cart integration with complex combinations', () => {
    // Test cart persistence of complex combinations
  });
  
  test('pricing accuracy across all combination types', () => {
    // Test pricing accuracy
  });
});
```

## POS Integration

### Combination DTO Structure

```typescript
interface CombinationPOSDTO {
  category: 'combination-plates';
  combinationType: CombinationType;
  itemId: string;
  quantity: number;
  
  customizations: {
    proteins: Record<string, {
      type: string;
      portion: number;
      customizations: any;
      cookingPreference?: string;
    }>;
    sharedSides: string[];
    instructions?: string;
  };
  
  pricing: {
    proteinPricing: Record<string, number>;
    combinationDiscount: number;
    sharedSidesCost: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  
  kitchenCoordination: {
    cookingSequence: string[];
    estimatedPrepTime: number;
    specialInstructions: string[];
  };
  
  posTracker: {
    categoryCode: 'COMBO';
    combinationCode: string;
    proteinCodes: Record<string, string>;
    modifiers: string[];
  };
}
```

## Success Criteria

### Functional Requirements
- [ ] All combination types implemented and working
- [ ] Protein selection system functions correctly
- [ ] Portion balancing works accurately
- [ ] Complex pricing calculations are correct
- [ ] Cooking coordination system works
- [ ] Cart integration preserves all data
- [ ] POS DTO generation works correctly

### Performance Requirements
- [ ] Combination pages load in <3 seconds
- [ ] Portion adjustments respond in <100ms
- [ ] Complex pricing updates in <200ms
- [ ] Visual updates render smoothly

### Quality Requirements
- [ ] Unit test coverage >95%
- [ ] Integration tests pass
- [ ] Complex combinations work correctly
- [ ] Accessibility compliance verified
- [ ] Mobile responsive design

---

**Command Maintained by**: Claude Code Implementation System  
**Last Updated**: July 2025  
**Version**: 1.0 - Combination Plates Implementation