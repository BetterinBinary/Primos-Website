<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import type { MenuItem, Size, Topping, AddOn } from '$lib/types/menu';

  export let item: MenuItem;
  export let onAddToCart: (item: MenuItem, options: {
    selectedSize: Size | null;
    selectedToppings: Topping[];
    selectedAddOns: AddOn[];
    selectedOptions: string[];
    quantity: number;
    specialInstructions: string;
  }) => void;

  let showCustomizer = false;
  let selectedSize: Size | null = item.sizes?.[0] || null;
  let selectedToppings: Topping[] = [];
  let selectedAddOns: AddOn[] = [];
  let quantity = 1;

  const hasCustomizations = (item.sizes && item.sizes.length > 1) || (item.toppings?.extraItems && item.toppings.extraItems.length > 0);

  const basePrice = selectedSize ? selectedSize.price : item.basePrice || 0;
  const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + 0, 0);
  const addOnsPrice = selectedAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0);
  const totalPrice = (basePrice + toppingsPrice + addOnsPrice) * quantity;

  function toggleTopping(topping: Topping) {
    const index = selectedToppings.findIndex((t) => t.id === topping.id);
    if (index > -1) {
      selectedToppings.splice(index, 1);
    } else {
      selectedToppings.push(topping);
    }
  }

  function handleQuantityChange(newQuantity: number) {
    quantity = newQuantity;
  }

  function handleQuickAdd() {
    const options = {
      selectedSize: item.sizes?.[0] || null,
      selectedToppings: [],
      selectedAddOns: [],
      selectedOptions: [],
      quantity: 1,
      specialInstructions: ''
    };
    onAddToCart(item, options);
  }

  function handleCustomizedAdd() {
    const customOptions: string[] = [];
    if (selectedSize && item.sizes && item.sizes.length > 1) {
      customOptions.push(`Size: ${selectedSize.name}`);
    }
    if (selectedToppings.length > 0) {
      customOptions.push(`Toppings: ${selectedToppings.map(t => t.name).join(', ')}`);
    }
    const options = {
      selectedSize,
      selectedToppings,
      selectedAddOns,
      selectedOptions: customOptions,
      quantity,
      specialInstructions: ''
    };
    onAddToCart(item, options);
    showCustomizer = false;
  }
</script>

<div class="relative flex items-start gap-4 px-4 py-6">
  <!-- Noise overlay -->
  <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
  <div class="relative z-10 flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-200">
    {#if item.image}
      <img src="/images/menu/{item.image}" alt="{item.name} from Primos Pizza" class="w-full h-full object-cover" />
    {:else}
      <span class="text-gray-400 text-2xl">🍕</span>
    {/if}
  </div>
  <div class="relative z-10 flex-1 flex flex-col min-w-0">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
        <p class="text-xs text-gray-600 mb-1 truncate">{item.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
        <p class="text-gray-800 text-sm leading-relaxed line-clamp-2">{item.description}</p>
      </div>
      <div class="flex flex-col sm:flex-col sm:items-end gap-2 sm:ml-4">
        <span class="font-bold text-lg text-primos-red-600 text-center sm:text-right">${item.basePrice || item.sizes?.[0]?.price || 0}</span>
        <div class="flex flex-col sm:flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            class="w-full sm:w-auto"
            onclick={handleQuickAdd}
          >
            Add to Cart
          </Button>
          {#if hasCustomizations}
            <Button
              variant="outline"
              size="sm"
              class="w-full sm:w-auto"
              onclick={() => showCustomizer = !showCustomizer}
              aria-expanded={showCustomizer}
              aria-controls="customizer-{item.id}"
            >
              {showCustomizer ? 'Hide Options' : 'Customize'}
            </Button>
          {/if}
        </div>
      </div>
    </div>
    {#if showCustomizer}
      <div id="customizer-{item.id}" class="mt-4" transition:slide>
        <div class="space-y-4 border-t border-gray-200 pt-4">
          <!-- Size Selection -->
          {#if item.sizes && item.sizes.length > 0}
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Size</h4>
              <div class="space-y-2">
                {#each item.sizes as size}
                  <label class="flex items-center justify-between cursor-pointer">
                    <div class="flex items-center">
                      <input
                        type="radio"
                        bind:group={selectedSize}
                        value={size}
                        class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
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
          <!-- Toppings Selection -->
          {#if item.toppings && item.toppings.extraItems && item.toppings.extraItems.length > 0}
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Add Toppings</h4>
              <div class="space-y-2">
                {#each item.toppings.extraItems as topping}
                  <label class="flex items-center justify-between cursor-pointer">
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedToppings.some((t) => t.name === topping.name)}
                        onchange={() => toggleTopping({ id: topping.name, name: topping.name, category: 'meat', available: true })}
                        class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                      />
                      <span class="text-sm text-gray-700">{topping.name}</span>
                    </div>
                    <span class="text-sm font-medium text-primos-red-600">
                      +${topping.price.toFixed(2)}
                    </span>
                  </label>
                {/each}
              </div>
            </div>
          {/if}
          <!-- Quantity Selection -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Quantity</h4>
            <div class="flex items-center space-x-3">
              <button
                type="button"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                onclick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span class="w-8 text-center font-medium">{quantity}</span>
              <button
                type="button"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                onclick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          <!-- Price Summary -->
          <div class="bg-[#F4F2EB] p-3 relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
            <div class="relative z-10">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Base Price × {quantity}</span>
                <span class="text-sm text-gray-900">${(basePrice * quantity).toFixed(2)}</span>
              </div>
              {#if toppingsPrice > 0}
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Toppings</span>
                  <span class="text-sm text-gray-900">+${toppingsPrice.toFixed(2)}</span>
                </div>
              {/if}
              <hr class="my-2 border-gray-200" />
              <div class="flex justify-between items-center font-medium">
                <span class="text-gray-900">Total</span>
                <span class="text-lg text-primos-red-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <!-- Customizer Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="primary"
              class="flex-1"
              onclick={handleCustomizedAdd}
            >
              Add to Cart - ${totalPrice.toFixed(2)}
            </Button>
            <Button
              variant="ghost"
              class="flex-1"
              onclick={() => showCustomizer = false}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div> 