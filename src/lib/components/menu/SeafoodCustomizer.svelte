<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import type { SeafoodMenuItem, SeafoodPreparation, SeafoodSauceOption } from '$lib/types/menu';

  interface Props {
    item: SeafoodMenuItem;
    selectedPreparation: SeafoodPreparation | null;
    selectedSauces: SeafoodSauceOption[];
    quantity: number;
    onPreparationChange: (preparation: SeafoodPreparation) => void;
    onSauceToggle: (sauce: SeafoodSauceOption) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedPreparation,
    selectedSauces,
    quantity,
    onPreparationChange,
    onSauceToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available preparation styles
  const preparationStyles: { value: SeafoodPreparation; label: string; description: string }[] = [
    { value: 'regular', label: 'Regular', description: 'Traditional preparation' },
    { value: 'cajun', label: 'Cajun Style', description: 'Spicy Cajun seasoning' }
  ];

  // Available sauces for seafood
  const availableSauceOptions: SeafoodSauceOption[] = [
    { id: 'bbq', name: 'BBQ', available: true },
    { id: 'hot-sauce', name: 'Hot Sauce', spiceLevel: 3, available: true },
    { id: 'ranch', name: 'Ranch', available: true },
    { id: 'honey-mustard', name: 'Honey Mustard', available: true },
    { id: 'blue-cheese', name: 'Blue Cheese', available: true }
  ];

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const totalPrice = $derived(() => {
    return basePrice * quantity;
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
  <!-- Item Info -->
  <div class="bg-blue-50 rounded-lg p-3">
    <h4 class="font-medium text-blue-900 mb-1">{getCategoryDisplayName()}</h4>
    <p class="text-sm text-blue-800">{item.name}</p>
    {#if getItemDetails()}
      <p class="text-sm text-blue-700 mt-1">{getItemDetails()}</p>
    {/if}
    {#if item.includes && item.includes.length > 0}
      <p class="text-sm text-blue-700 mt-1">
        <strong>Includes:</strong> {item.includes.join(', ')}
      </p>
    {/if}
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

  <!-- Sauce Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Sauce Selection</h4>
    <p class="text-sm text-gray-600 mb-3">
      Choose your favorite sauces to accompany your seafood
    </p>
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
        Select at least one sauce for the best experience
      </p>
    {/if}
  </div>

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
  <div class="bg-gray-50 rounded-lg p-3">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Price × {quantity}</span>
      <span class="text-sm text-gray-900">${(basePrice * quantity).toFixed(2)}</span>
    </div>
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