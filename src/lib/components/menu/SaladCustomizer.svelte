<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import type { SaladMenuItem, SaladDressing, SaladAddOn, Size } from '$lib/types/menu';

  interface Props {
    item: SaladMenuItem;
    selectedSize: Size | null;
    selectedDressing: SaladDressing | null;
    selectedAddOns: SaladAddOn[];
    quantity: number;
    onSizeChange: (size: Size) => void;
    onDressingChange: (dressing: SaladDressing) => void;
    onAddOnToggle: (addOn: SaladAddOn) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedSize,
    selectedDressing,
    selectedAddOns,
    quantity,
    onSizeChange,
    onDressingChange,
    onAddOnToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available dressings from menu data
  const availableDressings: SaladDressing[] = [
    'Ranch', 'Creamy Italian', 'Italian', 'French', '1,000 Island', 'Greek', 'Blue Cheese'
  ];

  // Available add-ons from menu data
  const availableAddOns: SaladAddOn[] = [
    {
      name: 'Add Chicken to Any Salad',
      sizes: [
        { size: 'small', name: 'Small', price: 1.75 },
        { size: 'medium', name: 'Medium', price: 2.03 },
        { size: 'large', name: 'Large', price: 2.22 }
      ]
    }
  ];

  const basePrice = $derived(() => {
    if (!selectedSize) return 0;
    return selectedSize.price;
  });

  const addOnPrice = $derived(() => {
    if (!selectedSize || selectedAddOns.length === 0) return 0;
    
    return selectedAddOns.reduce((sum, addOn) => {
      const sizePrice = addOn.sizes.find(s => s.size === selectedSize.size);
      return sum + (sizePrice?.price || 0);
    }, 0);
  });

  const totalPrice = $derived(() => {
    return (basePrice + addOnPrice) * quantity;
  });

  function handleAddOnChange(addOn: SaladAddOn, checked: boolean) {
    onAddOnToggle(addOn);
  }

  function isAddOnSelected(addOn: SaladAddOn): boolean {
    return selectedAddOns.some(a => a.name === addOn.name);
  }

  function getAddOnPriceForSize(addOn: SaladAddOn): number {
    if (!selectedSize) return 0;
    const sizePrice = addOn.sizes.find(s => s.size === selectedSize.size);
    return sizePrice?.price || 0;
  }
</script>

<div class="salad-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Size Selection -->
  {#if item.sizes && item.sizes.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Size</h4>
      <div class="space-y-2">
        {#each item.sizes as size}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="radio"
                name="salad-size"
                value={size.size}
                checked={selectedSize?.size === size.size}
                onchange={() => onSizeChange(size)}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{size.name}</span>
            </div>
            <span class="text-sm font-medium text-primos-red-600">
              ${size.price.toFixed(2)}
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Dressing Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Dressing</h4>
    <div class="space-y-2">
      {#each availableDressings as dressing}
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            name="salad-dressing"
            value={dressing}
            checked={selectedDressing === dressing}
            onchange={() => onDressingChange(dressing)}
            class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
          />
          <span class="text-sm text-gray-700">{dressing}</span>
        </label>
      {/each}
    </div>
    {#if selectedDressing}
      <p class="text-xs text-gray-500 mt-2">
        Selected: {selectedDressing} (served on the side)
      </p>
    {/if}
  </div>

  <!-- Add-Ons -->
  {#if availableAddOns.length > 0 && selectedSize}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Add-Ons</h4>
      <div class="space-y-2">
        {#each availableAddOns as addOn}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="checkbox"
                checked={isAddOnSelected(addOn)}
                onchange={(e) => handleAddOnChange(addOn, e.target.checked)}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{addOn.name}</span>
            </div>
            <span class="text-sm font-medium text-primos-red-600">
              +${getAddOnPriceForSize(addOn).toFixed(2)}
            </span>
          </label>
        {/each}
      </div>
      {#if selectedAddOns.length > 0}
        <p class="text-xs text-gray-500 mt-2">
          Selected: {selectedAddOns.map(a => a.name).join(', ')}
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
    {#if addOnPrice > 0}
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Add-ons × {quantity}</span>
        <span class="text-sm text-gray-900">+${(addOnPrice * quantity).toFixed(2)}</span>
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
      disabled={!selectedSize || !selectedDressing}
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
  .salad-customizer {
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