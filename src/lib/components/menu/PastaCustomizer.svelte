<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import type { PastaMenuItem, PastaType, RavioliFilling, PastaSauce, PastaAddOn, PastaExtra, Size } from '$lib/types/menu';

  interface Props {
    item: PastaMenuItem;
    selectedSize: Size | null;
    selectedPastaType: PastaType | null;
    selectedRavioliFilling: RavioliFilling | null;
    selectedSauce: PastaSauce | null;
    selectedAddOns: PastaAddOn[];
    selectedExtras: PastaExtra[];
    quantity: number;
    onSizeChange: (size: Size) => void;
    onPastaTypeChange: (pastaType: PastaType) => void;
    onRavioliFillingChange: (filling: RavioliFilling) => void;
    onSauceChange: (sauce: PastaSauce) => void;
    onAddOnToggle: (addOn: PastaAddOn) => void;
    onExtraToggle: (extra: PastaExtra) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedSize,
    selectedPastaType,
    selectedRavioliFilling,
    selectedSauce,
    selectedAddOns,
    selectedExtras,
    quantity,
    onSizeChange,
    onPastaTypeChange,
    onRavioliFillingChange,
    onSauceChange,
    onAddOnToggle,
    onExtraToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available pasta types
  const pastaTypes: PastaType[] = ['spaghetti', 'mostaccioli'];

  // Available ravioli fillings
  const ravioliFillings: RavioliFilling[] = ['meat', 'cheese'];

  // Available sauces
  const availableSauces: PastaSauce[] = ['meatsauce', 'marinara'];

  // Available add-ons with size-based pricing
  const availableAddOns: PastaAddOn[] = [
    {
      id: 'mushrooms',
      name: 'Mushrooms',
      sizes: [
        { size: 'pint', name: 'Pint', price: 0.70 },
        { size: 'quart', name: 'Quart', price: 1.23 },
        { size: 'bucket', name: 'Bucket', price: 2.26 }
      ]
    },
    {
      id: 'meatballs',
      name: 'Meatballs',
      sizes: [
        { size: 'pint', name: 'Pint', price: 1.27 },
        { size: 'quart', name: 'Quart', price: 1.94 },
        { size: 'bucket', name: 'Bucket', price: 4.10 }
      ]
    }
  ];

  // Available extras
  const availableExtras: PastaExtra[] = [
    {
      id: 'small-salad',
      name: 'Add a Small Tossed Salad',
      price: 2.45
    },
    {
      id: 'baked-cheese',
      name: 'Add Baked Cheese',
      sizes: [
        { size: 'pint', name: 'Pint', price: 2.31 },
        { size: 'quart', name: 'Quart', price: 3.16 },
        { size: 'bucket', name: 'Bucket', price: 4.95 }
      ]
    },
    {
      id: 'extra-meatballs',
      name: 'Add Meatballs (4)',
      price: 4.10
    },
    {
      id: 'extra-mushrooms',
      name: 'Add Extra Mushrooms',
      price: 2.26
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

  const extraPrice = $derived(() => {
    return selectedExtras.reduce((sum, extra) => {
      if (extra.sizes && selectedSize) {
        const sizePrice = extra.sizes.find(s => s.size === selectedSize.size);
        return sum + (sizePrice?.price || 0);
      }
      return sum + (extra.price || 0);
    }, 0);
  });

  const totalPrice = $derived(() => {
    return (basePrice + addOnPrice + extraPrice) * quantity;
  });

  const isRavioli = $derived(() => {
    return item.isRavioli || item.name.toLowerCase().includes('ravioli');
  });

  const requiresPastaType = $derived(() => {
    return item.name.toLowerCase().includes('spaghetti') || item.name.toLowerCase().includes('mostaccioli');
  });

  function handleAddOnChange(addOn: PastaAddOn, checked: boolean) {
    onAddOnToggle(addOn);
  }

  function handleExtraChange(extra: PastaExtra, checked: boolean) {
    onExtraToggle(extra);
  }

  function isAddOnSelected(addOn: PastaAddOn): boolean {
    return selectedAddOns.some(a => a.id === addOn.id);
  }

  function isExtraSelected(extra: PastaExtra): boolean {
    return selectedExtras.some(e => e.id === extra.id);
  }

  function getAddOnPriceForSize(addOn: PastaAddOn): number {
    if (!selectedSize) return 0;
    const sizePrice = addOn.sizes.find(s => s.size === selectedSize.size);
    return sizePrice?.price || 0;
  }

  function getExtraPriceForSize(extra: PastaExtra): number {
    if (extra.sizes && selectedSize) {
      const sizePrice = extra.sizes.find(s => s.size === selectedSize.size);
      return sizePrice?.price || 0;
    }
    return extra.price || 0;
  }

  function formatPastaType(type: PastaType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  function formatRavioliFilling(filling: RavioliFilling): string {
    return filling.charAt(0).toUpperCase() + filling.slice(1);
  }

  function formatSauce(sauce: PastaSauce): string {
    return sauce === 'meatsauce' ? 'Meat Sauce' : 'Marinara Sauce';
  }
</script>

<div class="pasta-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
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
                name="pasta-size"
                value={size.size}
                checked={selectedSize?.size === size.size}
                onchange={() => onSizeChange(size)}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <div class="flex flex-col">
                <span class="text-sm text-gray-700">{size.name}</span>
                <span class="text-xs text-gray-500">
                  {size.size === 'pint' ? '1 Serving' : 
                   size.size === 'quart' ? '1-2 Servings' : 
                   'Serves 3-5'}
                </span>
              </div>
            </div>
            <span class="text-sm font-medium text-primos-red-600">
              ${size.price.toFixed(2)}
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Pasta Type Selection -->
  {#if requiresPastaType}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Pasta Type</h4>
      <div class="space-y-2">
        {#each pastaTypes as pastaType}
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="pasta-type"
              value={pastaType}
              checked={selectedPastaType === pastaType}
              onchange={() => onPastaTypeChange(pastaType)}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <span class="text-sm text-gray-700">{formatPastaType(pastaType)}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Ravioli Filling Selection -->
  {#if isRavioli}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Ravioli Filling</h4>
      <div class="space-y-2">
        {#each ravioliFillings as filling}
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="ravioli-filling"
              value={filling}
              checked={selectedRavioliFilling === filling}
              onchange={() => onRavioliFillingChange(filling)}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <span class="text-sm text-gray-700">{formatRavioliFilling(filling)}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Sauce Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Sauce</h4>
    <div class="space-y-2">
      {#each availableSauces as sauce}
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            name="pasta-sauce"
            value={sauce}
            checked={selectedSauce === sauce}
            onchange={() => onSauceChange(sauce)}
            class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
          />
          <span class="text-sm text-gray-700">{formatSauce(sauce)}</span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Add-Ons Selection -->
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
    </div>
  {/if}

  <!-- Extras Selection -->
  {#if availableExtras.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Extras</h4>
      <div class="space-y-2">
        {#each availableExtras as extra}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="checkbox"
                checked={isExtraSelected(extra)}
                onchange={(e) => handleExtraChange(extra, e.target.checked)}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{extra.name}</span>
            </div>
            <span class="text-sm font-medium text-primos-red-600">
              +${getExtraPriceForSize(extra).toFixed(2)}
            </span>
          </label>
        {/each}
      </div>
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

  <!-- Includes Notice -->
  <div class="bg-blue-50 rounded-lg p-3">
    <p class="text-sm text-blue-800">
      <strong>Includes:</strong> Roll, hard breadsticks & Romano cheese
    </p>
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
    {#if extraPrice > 0}
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Extras × {quantity}</span>
        <span class="text-sm text-gray-900">+${(extraPrice * quantity).toFixed(2)}</span>
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
      disabled={!selectedSize || !selectedSauce}
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
  .pasta-customizer {
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