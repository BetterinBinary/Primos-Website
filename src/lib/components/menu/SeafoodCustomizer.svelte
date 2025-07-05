<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import PieceSelector from './PieceSelector.svelte';
  import type { SeafoodMenuItem, SeafoodPreparation, SeafoodSauceOption } from '$lib/types/menu';

  interface Props {
    item: SeafoodMenuItem;
    selectedPreparation: SeafoodPreparation | null;
    selectedSauces: SeafoodSauceOption[];
    selectedOrderType: 'only' | 'dinner';
    selectedPieces: Record<string, number>;
    selectedSides: string[];
    quantity: number;
    onPreparationChange: (preparation: SeafoodPreparation) => void;
    onSauceToggle: (sauce: SeafoodSauceOption) => void;
    onOrderTypeChange: (type: 'only' | 'dinner') => void;
    onPieceChange: (pieceId: string, quantity: number) => void;
    onSideToggle: (side: string) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedPreparation,
    selectedSauces,
    selectedOrderType,
    selectedPieces,
    selectedSides,
    quantity,
    onPreparationChange,
    onSauceToggle,
    onOrderTypeChange,
    onPieceChange,
    onSideToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available preparation styles
  const preparationStyles: { value: SeafoodPreparation; label: string; description: string }[] = [
    { value: 'regular', label: 'Regular', description: 'Traditional preparation' },
    { value: 'cajun', label: 'Cajun Style', description: 'Spicy Cajun seasoning' }
  ];

  // Seafood piece options based on POS specification
  const seafoodPieces = [
    { id: 'fish', name: 'Fish', price: 2.85, description: 'Fresh lake fish, beer battered' },
    { id: 'perch', name: 'Lake Perch', price: 2.05, description: 'Local lake perch, lightly battered' },
    { id: 'frog-legs', name: 'Frog Legs', price: 3.60, description: 'Tender frog legs (sold in pairs)' }
  ];

  // Available sauces for seafood
  const availableSauceOptions: SeafoodSauceOption[] = [
    { id: 'bbq', name: 'BBQ', available: true },
    { id: 'hot-sauce', name: 'Hot Sauce', spiceLevel: 3, available: true },
    { id: 'ranch', name: 'Ranch', available: true },
    { id: 'honey-mustard', name: 'Honey Mustard', available: true },
    { id: 'blue-cheese', name: 'Blue Cheese', available: true },
    { id: 'cocktail', name: 'Cocktail', available: true },
    { id: 'tartar', name: 'Tartar', available: true },
    { id: 'garlic-cheese-dip', name: 'Garlic Cheese Dip', available: true }
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

  // Calculate total pieces selected
  const totalPieces = $derived(
    Object.values(selectedPieces).reduce((sum, qty) => sum + qty, 0)
  );
  
  // Calculate piece price
  const piecePrice = $derived(
    seafoodPieces.reduce((sum, piece) => {
      const qty = selectedPieces[piece.id] || 0;
      return sum + (piece.price * qty);
    }, 0)
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
  
  // Calculate total price
  const totalPrice = $derived(() => {
    const base = (piecePrice || 0) - (onlyDiscount || 0) + (sideUpcharge || 0);
    return Math.max(0, base * (quantity || 1));
  });

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const isHandBatteredShrimp = $derived(() => {
    return item.category === 'hand-battered-shrimp';
  });

  const allowsCajunPreparation = $derived(() => {
    return isHandBatteredShrimp && item.allowsCajunStyle !== false;
  });

  const requiresSauceSelection = $derived(() => {
    return selectedSauces.length === 0;
  });

  function handleSauceChange(sauce: SeafoodSauceOption, checked: boolean) {
    onSauceToggle(sauce);
  }

  function isSauceSelected(sauce: SeafoodSauceOption): boolean {
    return selectedSauces.some(s => s.id === sauce.id);
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

  function getCategoryDisplayName(): string {
    if (isHandBatteredShrimp) return 'Hand-Battered Shrimp';
    return 'Seafood';
  }

  function getItemDetails(): string {
    if (item.pieceCount) {
      return `${item.pieceCount} piece${item.pieceCount > 1 ? 's' : ''}`;
    }
    if (item.weight) {
      return item.weight;
    }
    return '';
  }

  function formatPreparation(prep: SeafoodPreparation): string {
    return prep === 'cajun' ? 'Cajun Style' : 'Regular';
  }
</script>

<div class="seafood-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Header -->
  <div class="border-b border-gray-200 pb-3">
    <h3 class="text-lg font-semibold text-gray-900">{item.name} Customization</h3>
    <p class="text-sm text-gray-600 mt-1">Build your perfect seafood order with individual pieces</p>
  </div>
  
  <!-- Order Type Selection -->
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
            <p class="text-sm text-gray-600">Just the seafood, save $2.00</p>
          </div>
        </div>
        <span class="text-sm font-medium text-green-600">-$2.00</span>
      </label>
    </div>
  </div>
  
  <!-- Individual Piece Selection -->
  <div>
    <PieceSelector
      pieces={seafoodPieces}
      selectedPieces={selectedPieces}
      maxPieces={24}
      showCombinations={true}
      onPieceChange={onPieceChange}
    />
  </div>

  <!-- Preparation Style Selection (for hand-battered shrimp) -->
  {#if allowsCajunPreparation}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Preparation Style</h4>
      <div class="space-y-2">
        {#each preparationStyles as style}
          <label class="flex items-start cursor-pointer">
            <input
              type="radio"
              name="preparation-style"
              value={style.value}
              checked={selectedPreparation === style.value}
              onchange={() => onPreparationChange(style.value)}
              class="mr-3 mt-1 text-primos-red-600 focus:ring-primos-red-500"
            />
            <div class="flex flex-col">
              <span class="text-sm text-gray-700">{style.label}</span>
              <span class="text-xs text-gray-500">{style.description}</span>
              {#if style.value === 'cajun'}
                <span class="text-xs text-red-500 mt-1">🌶️ Spicy</span>
              {/if}
            </div>
          </label>
        {/each}
      </div>
      {#if selectedPreparation && selectedPreparation !== 'regular'}
        <p class="text-xs text-green-600 mt-2">
          Selected: {formatPreparation(selectedPreparation)}
        </p>
      {/if}
    </div>
  {/if}

  <!-- Sauces Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Dipping Sauces</h4>
    <div class="grid grid-cols-2 gap-2">
      {#each availableSauceOptions as sauce}
        <label class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSauceSelected(sauce)}
            onchange={(e) => handleSauceChange(sauce, e.target.checked)}
            class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
          />
          <span class="text-sm text-gray-700">{sauce.name}</span>
          {#if sauce.spiceLevel && sauce.spiceLevel > 2}
            <span class="ml-1 text-xs text-red-500">🌶️</span>
          {/if}
        </label>
      {/each}
    </div>
  </div>
  
  <!-- Sides Selection (for dinner orders) -->
  {#if selectedOrderType === 'dinner'}
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
                +${(side.upcharge || 0).toFixed(2)}
              </span>
            {/if}
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Cooking Preferences Note -->
  <div class="bg-yellow-50 rounded-lg p-3">
    <h5 class="font-medium text-yellow-900 mb-2">🍤 Cooking Notes</h5>
    <ul class="text-sm text-yellow-800 space-y-1">
      <li>• All seafood is cooked fresh to order</li>
      <li>• Please allow extra time for proper preparation</li>
      {#if isHandBatteredShrimp}
        <li>• Hand-battered for extra crispiness</li>
      {/if}
      <li>• Let us know if you have any seafood allergies</li>
    </ul>
  </div>

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
  {#if totalPieces > 0}
    <div class="bg-[#F4F2EB] p-4 rounded-lg relative overflow-hidden">
      <!-- Noise overlay -->
      <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
      
      <!-- Content wrapper -->
      <div class="relative z-10 space-y-2">
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
        
        {#if quantity > 1}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Quantity × {quantity}</span>
            <span class="text-sm text-gray-900">${(((piecePrice || 0) - (onlyDiscount || 0) + (sideUpcharge || 0)) * (quantity || 1)).toFixed(2)}</span>
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
      disabled={totalPieces === 0}
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
  .seafood-customizer {
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