<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import PieceSelector from './PieceSelector.svelte';
  import type { ChickenMenuItem, ChickenMeatSelection, ChickenSauceOption, ChickenSauce } from '$lib/types/menu';

  interface Props {
    item: ChickenMenuItem;
    selectedMeatSelection: ChickenMeatSelection | null;
    isBBQStyle: boolean;
    selectedSauces: ChickenSauceOption[];
    selectedOrderType: 'only' | 'dinner';
    selectedPieces: Record<string, number>;
    selectedSides: string[];
    usePieceSelection: boolean;
    quantity: number;
    onMeatSelectionChange: (selection: ChickenMeatSelection) => void;
    onBBQStyleToggle: (bbqStyle: boolean) => void;
    onSauceToggle: (sauce: ChickenSauceOption) => void;
    onOrderTypeChange: (type: 'only' | 'dinner') => void;
    onPieceChange: (pieceId: string, quantity: number) => void;
    onSideToggle: (side: string) => void;
    onPieceSelectionToggle: (usePieces: boolean) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedMeatSelection,
    isBBQStyle,
    selectedSauces,
    selectedOrderType,
    selectedPieces,
    selectedSides,
    usePieceSelection,
    quantity,
    onMeatSelectionChange,
    onBBQStyleToggle,
    onSauceToggle,
    onOrderTypeChange,
    onPieceChange,
    onSideToggle,
    onPieceSelectionToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available meat selections for broasted chicken
  const meatSelections: { value: ChickenMeatSelection; label: string; description: string }[] = [
    { value: 'mixed', label: 'Mixed', description: 'Combination of white and dark meat' },
    { value: 'all-white', label: 'All White Meat', description: 'Breast and wing pieces only' },
    { value: 'all-dark', label: 'All Dark Meat', description: 'Thigh and leg pieces only' }
  ];

  // Chicken piece options based on POS specification
  const chickenPieces = [
    { id: 'breast', name: 'Breast', price: 4.15, description: 'Premium white meat piece' },
    { id: 'thigh', name: 'Thigh', price: 3.00, description: 'Juicy dark meat piece' },
    { id: 'leg', name: 'Leg', price: 2.60, description: 'Tender dark meat piece' },
    { id: 'wing', name: 'Wing', price: 2.10, description: 'Crispy white meat piece' }
  ];

  // Tender piece options
  const tenderPieces = [
    { id: 'tender', name: 'Chicken Tender', price: 1.90, description: 'Hand-breaded tender strip' }
  ];

  // Wing ding piece options
  const wingDingPieces = [
    { id: 'wing-ding', name: 'Wing Ding', price: 1.50, description: 'Crispy wing section' }
  ];

  // Available sauces for chicken items
  const availableSauceOptions: ChickenSauceOption[] = [
    { id: 'bbq', name: 'BBQ', available: true },
    { id: 'hot-sauce', name: 'Hot Sauce', spiceLevel: 3, available: true },
    { id: 'ranch', name: 'Ranch', available: true },
    { id: 'honey-mustard', name: 'Honey Mustard', available: true },
    { id: 'blue-cheese', name: 'Blue Cheese', available: true }
  ];

  // Available sides for dinner orders
  const availableSides = [
    { id: 'ff', name: 'French Fries', included: true },
    { id: 'slaw', name: 'Coleslaw', included: true },
    { id: 'roll', name: 'Roll', included: true },
    { id: 'spw', name: 'Spicy Potato Wedges', upcharge: 1.55 },
    { id: 'or', name: 'Onion Rings', upcharge: 1.95 },
    { id: 'dfm', name: 'Deep Fried Mushrooms', upcharge: 2.05 },
    { id: 'dfs', name: 'Deep Fried Cheese Sticks', upcharge: 2.50 }
  ];

  // Get piece options based on item category
  const pieceOptions = $derived(() => {
    switch (item.category) {
      case 'chicken': return chickenPieces;
      case 'chicken-tenderloins': return tenderPieces;
      case 'wing-dings': return wingDingPieces;
      default: return chickenPieces;
    }
  });

  // Calculate total pieces selected
  const totalPieces = $derived(
    usePieceSelection ? Object.values(selectedPieces).reduce((sum, qty) => sum + qty, 0) : 0
  );
  
  // Calculate piece price
  const piecePrice = $derived(
    usePieceSelection ? pieceOptions.reduce((sum, piece) => {
      const qty = selectedPieces[piece.id] || 0;
      return sum + (piece.price * qty);
    }, 0) : 0
  );
  
  // Calculate side upcharges
  const sideUpcharge = $derived(
    selectedSides.reduce((sum, sideId) => {
      const side = availableSides.find(s => s.id === sideId);
      return sum + (side?.upcharge || 0);
    }, 0)
  );
  
  // Apply "Only" discount (-$2.00)
  const onlyDiscount = selectedOrderType === 'only' ? 2.00 : 0;

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const bbqSurcharge = $derived(() => {
    if (!isBBQStyle || !item.allowsBBQStyle) return 0;
    if (usePieceSelection) {
      return (totalPieces || 0) * 0.10; // 10¢ per piece for BBQ style
    }
    return (item.pieceCount || 0) * 0.10;
  });

  const totalPrice = $derived(() => {
    if (usePieceSelection) {
      const base = (piecePrice || 0) - (onlyDiscount || 0) + (sideUpcharge || 0) + (bbqSurcharge || 0);
      return Math.max(0, base * (quantity || 1));
    }
    const base = (basePrice || 0) + (bbqSurcharge || 0);
    return Math.max(0, base * (quantity || 1));
  });

  const isBroastedChicken = $derived(() => {
    return item.category === 'chicken';
  });

  const allowsSauceSelection = $derived(() => {
    return item.category === 'chicken-tenderloins' || item.category === 'wing-dings';
  });

  const requiresSauceSelection = $derived(() => {
    return allowsSauceSelection && selectedSauces.length === 0;
  });

  const canAddToCart = $derived(() => {
    if (usePieceSelection) {
      return totalPieces > 0;
    }
    return !requiresSauceSelection;
  });

  function handleSauceChange(sauce: ChickenSauceOption, checked: boolean) {
    onSauceToggle(sauce);
  }

  function isSauceSelected(sauce: ChickenSauceOption): boolean {
    return selectedSauces.some(s => s.id === sauce.id);
  }

  function formatMeatSelection(selection: ChickenMeatSelection): string {
    const option = meatSelections.find(m => m.value === selection);
    return option?.label || selection;
  }

  function getCategoryDisplayName(): string {
    switch (item.category) {
      case 'chicken': return 'Broasted Chicken';
      case 'chicken-tenderloins': return 'Chicken Tenderloins';
      case 'wing-dings': return 'Wing Dings';
      default: return 'Chicken';
    }
  }

  function getPieceCountText(): string {
    if (!item.pieceCount) return '';
    return `${item.pieceCount} piece${item.pieceCount > 1 ? 's' : ''}`;
  }

  function toggleSide(sideId: string) {
    // For "only" orders, don't allow standard sides
    if (selectedOrderType === 'only') {
      const side = availableSides.find(s => s.id === sideId);
      if (side?.included) return;
    }
    
    onSideToggle(sideId);
  }
  
  function handleOrderTypeChange(type: 'only' | 'dinner') {
    onOrderTypeChange(type);
    
    // Adjust sides based on order type
    if (type === 'dinner') {
      // Add standard sides if not present
      ['ff', 'slaw', 'roll'].forEach(sideId => {
        if (!selectedSides.includes(sideId)) {
          onSideToggle(sideId);
        }
      });
    } else {
      // Remove standard sides for "only" orders
      ['ff', 'slaw', 'roll'].forEach(sideId => {
        if (selectedSides.includes(sideId)) {
          onSideToggle(sideId);
        }
      });
    }
  }

  function handlePieceSelectionToggle(usePieces: boolean) {
    onPieceSelectionToggle(usePieces);
    
    // If switching to piece selection for chicken, default to dinner mode
    if (usePieces && item.category === 'chicken' && selectedOrderType === 'only') {
      handleOrderTypeChange('dinner');
    }
  }
</script>

<div class="chicken-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Header -->
  <div class="border-b border-gray-200 pb-3">
    <h3 class="text-lg font-semibold text-gray-900">{item.name} Customization</h3>
    <p class="text-sm text-gray-600 mt-1">Choose portions or build with individual pieces</p>
  </div>
  
  <!-- Selection Mode Toggle (for chicken items) -->
  {#if item.category === 'chicken'}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Selection Mode</h4>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="radio"
            bind:group={usePieceSelection}
            value={false}
            onchange={() => handlePieceSelectionToggle(false)}
            class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
          />
          <div>
            <span class="font-medium text-gray-900">Standard Portions</span>
            <p class="text-sm text-gray-600">Choose from pre-made combinations</p>
          </div>
        </label>
        
        <label class="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="radio"
            bind:group={usePieceSelection}
            value={true}
            onchange={() => handlePieceSelectionToggle(true)}
            class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
          />
          <div>
            <span class="font-medium text-gray-900">Individual Pieces</span>
            <p class="text-sm text-gray-600">Build your order piece by piece</p>
          </div>
        </label>
      </div>
    </div>
  {/if}
  
  <!-- Order Type Selection (for individual pieces or always show for tenders/wing dings) -->
  {#if usePieceSelection || item.category === 'chicken-tenderloins' || item.category === 'wing-dings'}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Order Type</h4>
      <div class="space-y-2">
        <label class="flex items-center justify-between cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div class="flex items-center">
            <input
              type="radio"
              bind:group={selectedOrderType}
              value="dinner"
              onchange={() => handleOrderTypeChange('dinner')}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <div>
              <span class="font-medium text-gray-900">Dinner</span>
              <p class="text-sm text-gray-600">Includes fries, coleslaw, and roll</p>
            </div>
          </div>
        </label>
        
        <label class="flex items-center justify-between cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div class="flex items-center">
            <input
              type="radio"
              bind:group={selectedOrderType}
              value="only"
              onchange={() => handleOrderTypeChange('only')}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <div>
              <span class="font-medium text-gray-900">Only</span>
              <p class="text-sm text-gray-600">Just the chicken, save $2.00</p>
            </div>
          </div>
          <span class="text-sm font-medium text-green-600">-$2.00</span>
        </label>
      </div>
    </div>
  {/if}
  
  <!-- Individual Piece Selection -->
  {#if usePieceSelection}
    <div>
      <PieceSelector
        pieces={pieceOptions}
        selectedPieces={selectedPieces}
        maxPieces={24}
        showCombinations={item.category === 'chicken'}
        onPieceChange={onPieceChange}
      />
    </div>
  {/if}

  <!-- Meat Selection for Standard Portions -->
  {#if !usePieceSelection && isBroastedChicken && (item as any).allowsMeatSelection}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Meat Selection</h4>
      <div class="space-y-2">
        {#each meatSelections as selection}
          <label class="flex items-start cursor-pointer">
            <input
              type="radio"
              name="meat-selection"
              value={selection.value}
              checked={selectedMeatSelection === selection.value}
              onchange={() => onMeatSelectionChange(selection.value)}
              class="mr-3 mt-1 text-primos-red-600 focus:ring-primos-red-500"
            />
            <div class="flex flex-col">
              <span class="text-sm text-gray-700">{selection.label}</span>
              <span class="text-xs text-gray-500">{selection.description}</span>
            </div>
          </label>
        {/each}
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Note: No extra charge for meat preference
      </p>
    </div>
  {/if}

  <!-- BBQ Style Option -->
  {#if isBroastedChicken && (item as any).allowsBBQStyle}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Cooking Style</h4>
      <label class="flex items-center justify-between cursor-pointer">
        <div class="flex items-center">
          <input
            type="checkbox"
            checked={isBBQStyle}
            onchange={(e) => onBBQStyleToggle(e.target.checked)}
            class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
          />
          <div class="flex flex-col">
            <span class="text-sm text-gray-700">BBQ Style</span>
            <span class="text-xs text-gray-500">Grilled with BBQ sauce (+10¢ per piece)</span>
          </div>
        </div>
        <span class="text-sm font-medium text-primos-red-600">
          +${bbqSurcharge.toFixed(2)}
        </span>
      </label>
    </div>
  {/if}
  
  <!-- Sides Selection (for dinner orders) -->
  {#if (usePieceSelection || item.category === 'chicken-tenderloins' || item.category === 'wing-dings') && selectedOrderType === 'dinner'}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Sides</h4>
      <div class="space-y-2">
        {#each availableSides as side}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="checkbox"
                checked={selectedSides.includes(side.id)}
                onchange={() => toggleSide(side.id)}
                class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                disabled={side.included && selectedOrderType === 'dinner'}
              />
              <span class="text-sm text-gray-700">{side.name}</span>
              {#if side.included}
                <span class="ml-2 text-xs text-green-600">(Included)</span>
              {/if}
            </div>
            {#if side.upcharge}
              <span class="text-sm font-medium text-primos-red-600">
                +${side.upcharge.toFixed(2)}
              </span>
            {/if}
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Sauce Selection for Tenderloins and Wing Dings -->
  {#if allowsSauceSelection}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Sauce Selection</h4>
      <div class="space-y-2">
        {#each availableSauceOptions as sauce}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="checkbox"
                checked={isSauceSelected(sauce)}
                onchange={(e) => handleSauceChange(sauce, e.target.checked)}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{sauce.name}</span>
              {#if sauce.spiceLevel && sauce.spiceLevel > 2}
                <span class="ml-2 text-xs text-red-500">🌶️ Spicy</span>
              {/if}
            </div>
          </label>
        {/each}
      </div>
      {#if selectedSauces.length > 0}
        <p class="text-xs text-gray-500 mt-2">
          Selected: {selectedSauces.map(s => s.name).join(', ')}
        </p>
      {:else}
        <p class="text-xs text-amber-600 mt-2">
          Select at least one sauce
        </p>
      {/if}
    </div>
  {/if}

  <!-- Quantity Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Quantity</h4>
    <div class="flex items-center space-x-3">
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        onclick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        -
      </button>
      <span class="w-8 text-center font-medium">{quantity}</span>
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        onclick={() => onQuantityChange(quantity + 1)}
      >
        +
      </button>
    </div>
  </div>

  <!-- Price Summary -->
  {#if (usePieceSelection && totalPieces > 0) || !usePieceSelection}
    <div class="bg-[#F4F2EB] p-4 rounded-lg relative overflow-hidden">
      <!-- Noise overlay -->
      <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
      
      <!-- Content wrapper -->
      <div class="relative z-10 space-y-2">
        {#if usePieceSelection}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Pieces ({totalPieces})</span>
            <span class="text-sm text-gray-900">${(piecePrice || 0).toFixed(2)}</span>
          </div>
          
          {#if selectedOrderType === 'only'}
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">"Only" Discount</span>
              <span class="text-sm text-green-600">-${(onlyDiscount || 0).toFixed(2)}</span>
            </div>
          {/if}
          
          {#if sideUpcharge > 0}
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Premium Sides</span>
              <span class="text-sm text-gray-900">+${(sideUpcharge || 0).toFixed(2)}</span>
            </div>
          {/if}
        {:else}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Base Price × {quantity}</span>
            <span class="text-sm text-gray-900">${((basePrice || 0) * (quantity || 1)).toFixed(2)}</span>
          </div>
        {/if}
        
        {#if bbqSurcharge > 0}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">BBQ Style {usePieceSelection ? `(${totalPieces} pieces)` : ''}</span>
            <span class="text-sm text-gray-900">+${((bbqSurcharge || 0) * (quantity || 1)).toFixed(2)}</span>
          </div>
        {/if}
        
        {#if quantity > 1}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Quantity × {quantity}</span>
            <span class="text-sm text-gray-900">${(totalPrice || 0).toFixed(2)}</span>
          </div>
        {/if}
        
        <hr class="border-gray-200" />
        
        <div class="flex justify-between items-center font-medium">
          <span class="text-gray-900">Total</span>
          <span class="text-lg text-primos-red-600">${(totalPrice || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Action Buttons -->
  <div class="flex space-x-3">
    <Button
      variant="primary"
      class="flex-1"
      onclick={onAddToCart}
      disabled={!canAddToCart}
    >
      Add to Cart - ${(totalPrice || 0).toFixed(2)}
    </Button>
    <Button
      variant="ghost"
      class="flex-1"
      onclick={onCancel}
    >
      Cancel
    </Button>
  </div>
</div>

<style>
  .chicken-customizer {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>