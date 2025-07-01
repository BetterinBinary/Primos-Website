<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import type { 
    MenuItem, 
    Size, 
    Topping, 
    AddOn
  } from '$lib/types/menu';

  interface Props {
    item: MenuItem;
    onAddToCart: (item: MenuItem, options: {
      selectedSize: Size | null;
      selectedToppings: Topping[];
      selectedAddOns: AddOn[];
      selectedOptions: string[];
      quantity: number;
      specialInstructions: string;
    }) => void;
  }

  let { item, onAddToCart }: Props = $props();
  let selectedSize = $state<Size | null>(item.sizes?.[0] || null);
  let selectedToppings = $state<Topping[]>([]);
  let selectedAddOns = $state<AddOn[]>([]);
  let quantity = $state(1);
  let showCustomizer = $state(false);
  
  // Determine if item has customization options
  const hasCustomizations = $derived(() => {
    return (item.sizes && item.sizes.length > 1) || 
           (item.toppings?.extraItems && item.toppings.extraItems.length > 0);
  });

  const basePrice = $derived(
    selectedSize ? selectedSize.price : item.basePrice || 0
  );

  const toppingsPrice = $derived(
    selectedToppings.reduce((sum, topping) => sum + 0, 0)
  );

  const addOnsPrice = $derived(
    selectedAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0)
  );

  const totalPrice = $derived(
    (basePrice + toppingsPrice + addOnsPrice) * quantity
  );

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
    // Quick add with default selections - pass properly structured options
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

  function handleCustomize() {
    showCustomizer = true;
  }

  function handleCustomizedAdd() {
    // Pass customized selections properly structured 
    const customOptions = [];
    
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

<article
  class="menu-item bg-[#F4F2EB] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full relative overflow-hidden border-2 border-black"
>
  <!-- Noise overlay -->
  <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
  
  <!-- Content wrapper -->
  <div class="relative z-10">
  <!-- Top section: Name, Description, and Image -->
  <div class="flex justify-between items-start gap-4 mb-4">
    <div class="flex-1">
      <!-- Item title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-3">
        {item.name}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm leading-relaxed">
        {item.description}
      </p>
    </div>

    <!-- Item image -->
    <div
      class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
    >
      {#if item.image}
        <img
          src="/images/menu/{item.image}"
          alt="{item.name} from Primos Pizza"
          class="w-full h-full object-cover rounded-lg"
        />
      {:else}
        <span class="text-gray-400 text-xl">🍕</span>
      {/if}
    </div>
  </div>

  <!-- Customization Options -->
  {#if showCustomizer}
    <div class="space-y-4 mb-4 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
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
      <div class="bg-gray-50 rounded-lg p-3">
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

      <!-- Action Buttons -->
      <div class="flex space-x-3">
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
  {/if}

  <!-- Additional Info -->
  <div class="mb-4 space-y-2">
    <!-- Allergen Warning -->
    {#if item.allergens && item.allergens.length > 0}
      <p class="text-xs text-yellow-600">
        ⚠️ Contains: {item.allergens.join(", ")}
      </p>
    {/if}
  </div>

  <!-- Bottom section: Price and Add to Cart -->
  <div class="mt-auto">
    <!-- Price and availability section -->
    <div class="flex flex-row items-center justify-center mb-4">
      <span class="text-primos-red-600 font-bold text-xl">
        {#if !showCustomizer}
          ${(item.sizes?.[0]?.price || item.basePrice || 0).toFixed(2)}
        {:else}
          ${totalPrice.toFixed(2)}
        {/if}
      </span>

      {#if !item.available}
        <span class="text-red-500 text-sm font-medium ml-2">
          Currently Unavailable
        </span>
      {/if}
    </div>

    <!-- Action buttons -->
    {#if item.available}
      {#if !showCustomizer}
        <!-- Quick Add / Customize Options -->
        {#if hasCustomizations()}
          <div class="space-y-2">
            <!-- Quick Add Button -->
            <Button
              variant="primary"
              class="w-full"
              onclick={handleQuickAdd}
            >
              Quick Add - ${(item.sizes?.[0]?.price || item.basePrice || 0).toFixed(2)}
            </Button>
            
            <!-- Customize Button -->
            <Button
              variant="outline"
              class="w-full"
              onclick={handleCustomize}
            >
              Customize
            </Button>
          </div>
        {:else}
          <!-- Simple Add to Cart -->
          <Button
            variant="primary"
            class="w-full"
            onclick={handleQuickAdd}
          >
            Add to Cart
          </Button>
        {/if}
      {:else}
        <!-- Customizer Action Buttons -->
        <div class="space-y-2">
          <Button
            variant="primary"
            class="w-full"
            onclick={handleCustomizedAdd}
          >
            Add to Cart - ${totalPrice.toFixed(2)}
          </Button>
          
          <Button
            variant="ghost"
            class="w-full"
            onclick={() => showCustomizer = false}
          >
            Cancel
          </Button>
        </div>
      {/if}
    {/if}
  </div>
  </div>
</article>
