<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import type { ChickenMenuItem, ChickenMeatSelection, ChickenSauceOption, ChickenSauce } from '$lib/types/menu';

  interface Props {
    item: ChickenMenuItem;
    selectedMeatSelection: ChickenMeatSelection | null;
    isBBQStyle: boolean;
    selectedSauces: ChickenSauceOption[];
    quantity: number;
    onMeatSelectionChange: (selection: ChickenMeatSelection) => void;
    onBBQStyleToggle: (bbqStyle: boolean) => void;
    onSauceToggle: (sauce: ChickenSauceOption) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedMeatSelection,
    isBBQStyle,
    selectedSauces,
    quantity,
    onMeatSelectionChange,
    onBBQStyleToggle,
    onSauceToggle,
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

  // Available sauces for tenderloins and wing dings
  const availableSauceOptions: ChickenSauceOption[] = [
    { id: 'bbq', name: 'BBQ', available: true },
    { id: 'hot-sauce', name: 'Hot Sauce', spiceLevel: 3, available: true },
    { id: 'ranch', name: 'Ranch', available: true },
    { id: 'honey-mustard', name: 'Honey Mustard', available: true },
    { id: 'blue-cheese', name: 'Blue Cheese', available: true }
  ];

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const bbqSurcharge = $derived(() => {
    if (!isBBQStyle || !item.allowsBBQStyle || !item.pieceCount) return 0;
    return item.pieceCount * 0.10; // 10¢ per piece for BBQ style
  });

  const totalPrice = $derived(() => {
    return (basePrice + bbqSurcharge) * quantity;
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
</script>

<div class="chicken-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Item Info -->
  <div class="bg-blue-50 rounded-lg p-3">
    <h4 class="font-medium text-blue-900 mb-1">{getCategoryDisplayName()}</h4>
    {#if item.pieceCount}
      <p class="text-sm text-blue-800">{getPieceCountText()}</p>
    {/if}
    {#if item.includes && item.includes.length > 0}
      <p class="text-sm text-blue-700 mt-1">
        <strong>Includes:</strong> {item.includes.join(', ')}
      </p>
    {/if}
  </div>

  <!-- Meat Selection for Broasted Chicken -->
  {#if isBroastedChicken && item.allowsMeatSelection}
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

  <!-- BBQ Style Option for Broasted Chicken -->
  {#if isBroastedChicken && item.allowsBBQStyle}
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
            <span class="text-xs text-gray-500">Grilled with BBQ sauce</span>
          </div>
        </div>
        <span class="text-sm font-medium text-primos-red-600">
          +${bbqSurcharge.toFixed(2)}
        </span>
      </label>
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
  <div class="bg-gray-50 rounded-lg p-3">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Base Price × {quantity}</span>
      <span class="text-sm text-gray-900">${(basePrice * quantity).toFixed(2)}</span>
    </div>
    {#if bbqSurcharge > 0}
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">BBQ Style × {quantity}</span>
        <span class="text-sm text-gray-900">+${(bbqSurcharge * quantity).toFixed(2)}</span>
      </div>
    {/if}
    <hr class="my-2 border-gray-200" />
    <div class="flex justify-between items-center font-medium">
      <span class="text-gray-900">Total</span>
      <span class="text-lg text-primos-red-600">${totalPrice.toFixed(2)}</span>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex space-x-3">
    <Button
      variant="primary"
      class="flex-1"
      onclick={onAddToCart}
      disabled={requiresSauceSelection}
    >
      Add to Cart - ${totalPrice.toFixed(2)}
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