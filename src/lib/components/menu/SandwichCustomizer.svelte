<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import type { SandwichMenuItem, SandwichAddOn, SandwichIngredient, BreadType } from '$lib/types/menu';

  interface Props {
    item: SandwichMenuItem;
    selectedBreadType: BreadType | null;
    selectedAddOns: SandwichAddOn[];
    removedIngredients: string[];
    quantity: number;
    onBreadTypeChange: (breadType: BreadType) => void;
    onAddOnToggle: (addOn: SandwichAddOn) => void;
    onIngredientToggle: (ingredient: string) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedBreadType,
    selectedAddOns,
    removedIngredients,
    quantity,
    onBreadTypeChange,
    onAddOnToggle,
    onIngredientToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available bread types (could be expanded from menu data later)
  const breadTypes: { value: BreadType; label: string }[] = [
    { value: 'sub-roll', label: 'Sub Roll' },
    { value: 'whole-wheat', label: 'Whole Wheat' },
    { value: 'italian', label: 'Italian Bread' }
  ];

  // Available add-ons based on menu data
  const availableAddOns: SandwichAddOn[] = [
    { id: 'extra-cheese', name: 'Add Cheese', price: 0.90, category: 'cheese' },
    { id: 'extra-meat', name: 'Extra Meat', price: 2.50, category: 'meat' },
    { id: 'bacon', name: 'Add Bacon', price: 1.50, category: 'meat' },
    { id: 'mushrooms', name: 'Add Mushrooms', price: 1.00, category: 'vegetable' },
    { id: 'peppers', name: 'Add Peppers', price: 0.75, category: 'vegetable' },
    { id: 'onions', name: 'Add Onions', price: 0.50, category: 'vegetable' },
    { id: 'mayo', name: 'Add Mayo', price: 0.25, category: 'condiment' },
    { id: 'mustard', name: 'Add Mustard', price: 0.25, category: 'condiment' }
  ];

  // Parse base ingredients from item description
  const baseIngredients = $derived(() => {
    if (!item.description) return [];
    
    const ingredientMap: Record<string, SandwichIngredient> = {
      'lettuce': { id: 'lettuce', name: 'Lettuce', category: 'vegetable', removable: true },
      'tomato': { id: 'tomato', name: 'Tomato', category: 'vegetable', removable: true },
      'onions': { id: 'onions', name: 'Onions', category: 'vegetable', removable: true },
      'cheese': { id: 'cheese', name: 'Cheese', category: 'cheese', removable: false },
      'ham': { id: 'ham', name: 'Ham', category: 'meat', removable: false },
      'turkey': { id: 'turkey', name: 'Turkey', category: 'meat', removable: false },
      'chicken': { id: 'chicken', name: 'Chicken', category: 'meat', removable: false },
      'meatballs': { id: 'meatballs', name: 'Meatballs', category: 'meat', removable: false },
      'mushrooms': { id: 'mushrooms', name: 'Mushrooms', category: 'vegetable', removable: true },
      'marinara': { id: 'marinara', name: 'Marinara Sauce', category: 'condiment', removable: true },
      'creamy italian': { id: 'italian-dressing', name: 'Italian Dressing', category: 'condiment', removable: true }
    };

    const description = item.description.toLowerCase();
    const foundIngredients: SandwichIngredient[] = [];

    Object.entries(ingredientMap).forEach(([key, ingredient]) => {
      if (description.includes(key)) {
        foundIngredients.push(ingredient);
      }
    });

    return foundIngredients;
  });

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const addOnPrice = $derived(() => {
    return selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  });

  const totalPrice = $derived(() => {
    return (basePrice() + addOnPrice()) * quantity;
  });

  const isSubmarine = $derived(() => {
    return item.category === 'submarines';
  });

  const isBurger = $derived(() => {
    return item.name.toLowerCase().includes('burger');
  });

  function handleAddOnChange(addOn: SandwichAddOn, checked: boolean) {
    onAddOnToggle(addOn);
  }

  function handleIngredientRemoval(ingredient: string, remove: boolean) {
    onIngredientToggle(ingredient);
  }

  function isAddOnSelected(addOn: SandwichAddOn): boolean {
    return selectedAddOns.some(a => a.id === addOn.id);
  }

  function isIngredientRemoved(ingredientId: string): boolean {
    return removedIngredients.includes(ingredientId);
  }

  function formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  function getDefaultBreadType(): BreadType {
    if (isBurger()) return 'burger-bun';
    return 'sub-roll';
  }

  function getCategoryDisplayName(): string {
    if (isSubmarine()) return 'Submarine Sandwich';
    if (isBurger()) return 'Burger';
    return 'Sandwich';
  }

  // Group add-ons by category
  const addOnsByCategory = $derived(() => {
    const grouped: Record<string, SandwichAddOn[]> = {};
    availableAddOns.forEach(addOn => {
      if (!grouped[addOn.category]) {
        grouped[addOn.category] = [];
      }
      grouped[addOn.category].push(addOn);
    });
    return grouped;
  });
</script>

<div class="sandwich-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Item Info -->
  <div class="bg-blue-50 rounded-lg p-3">
    <h4 class="font-medium text-blue-900 mb-1">{getCategoryDisplayName()}</h4>
    <p class="text-sm text-blue-800">{item.name}</p>
    {#if item.isDeluxe}
      <p class="text-sm text-blue-700 mt-1">
        <strong>Deluxe includes:</strong> Slaw & Fries
      </p>
    {/if}
  </div>

  <!-- Bread Selection (if available) -->
  {#if isSubmarine()}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Bread Choice</h4>
      <div class="space-y-2">
        {#each breadTypes as bread}
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="bread-type"
              value={bread.value}
              checked={selectedBreadType === bread.value || (!selectedBreadType && bread.value === getDefaultBreadType())}
              onchange={() => onBreadTypeChange(bread.value)}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <span class="text-sm text-gray-700">{bread.label}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Base Ingredients -->
  {#if baseIngredients.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Included Ingredients</h4>
      <div class="space-y-2">
        {#each baseIngredients() as ingredient}
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-sm text-gray-700">{ingredient.name}</span>
              <span class="ml-2 text-xs text-gray-500 capitalize">({ingredient.category})</span>
            </div>
            {#if ingredient.removable}
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isIngredientRemoved(ingredient.id)}
                  onchange={(e) => {
                    const target = e.target;
                    if (target && 'checked' in target) {
                      handleIngredientRemoval(ingredient.id, Boolean(target.checked));
                    }
                  }}
                  class="mr-2 text-red-600 focus:ring-red-500"
                />
                <span class="text-xs text-red-600">Remove</span>
              </label>
            {:else}
              <span class="text-xs text-gray-400">Required</span>
            {/if}
          </div>
        {/each}
      </div>
      {#if removedIngredients.length > 0}
        <p class="text-xs text-red-600 mt-2">
          Removed: {removedIngredients.join(', ')}
        </p>
      {/if}
    </div>
  {/if}

  <!-- Add-Ons by Category -->
  {#each Object.entries(addOnsByCategory) as [category, addOns]}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Add {formatCategory(category)}</h4>
      <div class="space-y-2">
        {#each addOns as addOn}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="checkbox"
                checked={isAddOnSelected(addOn)}
                onchange={(e) => {
                  const target = e.target;
                  if (target && 'checked' in target) {
                    handleAddOnChange(addOn, Boolean(target.checked));
                  }
                }}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{addOn.name}</span>
            </div>
            <span class="text-sm font-medium text-primos-red-600">
              +${addOn.price.toFixed(2)}
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/each}

  <!-- Selected Add-ons Summary -->
  {#if selectedAddOns.length > 0}
    <div class="bg-green-50 rounded-lg p-3">
      <h5 class="font-medium text-green-900 mb-2">Selected Add-ons</h5>
      <ul class="text-sm text-green-800 space-y-1">
        {#each selectedAddOns as addOn}
          <li class="flex justify-between">
            <span>{addOn.name}</span>
            <span>+${addOn.price.toFixed(2)}</span>
          </li>
        {/each}
      </ul>
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
      <span class="text-sm text-gray-900">${(basePrice() * quantity).toFixed(2)}</span>
    </div>
    {#if addOnPrice() > 0}
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Add-ons × {quantity}</span>
        <span class="text-sm text-gray-900">+${(addOnPrice() * quantity).toFixed(2)}</span>
      </div>
    {/if}
    <hr class="my-2 border-gray-200" />
    <div class="flex justify-between items-center font-medium">
      <span class="text-gray-900">Total</span>
      <span class="text-lg text-primos-red-600">${totalPrice().toFixed(2)}</span>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex space-x-3">
    <Button
      variant="primary"
      class="flex-1"
      onclick={onAddToCart}
    >
      Add to Cart - ${totalPrice().toFixed(2)}
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
  .sandwich-customizer {
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