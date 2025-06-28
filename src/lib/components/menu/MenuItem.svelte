<script>
  let { item, onAddToCart } = $props();
  let selectedSize = $state(item.sizes?.[0] || null);
  let selectedToppings = $state([]);
  let selectedAddOns = $state([]);
  let quantity = $state(1);

  const basePrice = $derived(
    selectedSize ? selectedSize.price : item.basePrice || 0
  );

  const toppingsPrice = $derived(
    selectedToppings.reduce((sum, topping) => sum + (topping.price || 0), 0)
  );

  const addOnsPrice = $derived(
    selectedAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0)
  );

  const totalPrice = $derived(
    (basePrice + toppingsPrice + addOnsPrice) * quantity
  );

  function toggleTopping(topping) {
    const index = selectedToppings.findIndex((t) => t.id === topping.id);
    if (index > -1) {
      selectedToppings.splice(index, 1);
    } else {
      selectedToppings.push(topping);
    }
  }

  function toggleAddOn(addOn) {
    const index = selectedAddOns.findIndex((a) => a.id === addOn.id);
    if (index > -1) {
      selectedAddOns.splice(index, 1);
    } else {
      selectedAddOns.push(addOn);
    }
  }
</script>

<article
  class="menu-item bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full"
>
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
  <div class="space-y-4 mb-4">
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
    {#if item.toppings && item.toppings.length > 0}
      <div>
        <h4 class="font-medium text-gray-900 mb-2">Add Toppings</h4>
        <div class="space-y-2">
          {#each item.toppings as topping}
            <label class="flex items-center justify-between cursor-pointer">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedToppings.some((t) => t.id === topping.id)}
                  on:change={() => toggleTopping(topping)}
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

    <!-- Add-ons Selection -->
    {#if item.addOns && item.addOns.length > 0}
      <div>
        <h4 class="font-medium text-gray-900 mb-2">Add-ons</h4>
        <div class="space-y-2">
          {#each item.addOns as addOn}
            <label class="flex items-center justify-between cursor-pointer">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedAddOns.some((a) => a.id === addOn.id)}
                  on:change={() => toggleAddOn(addOn)}
                  class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
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
    {/if}

    <!-- Quantity Selection -->
    <div>
      <h4 class="font-medium text-gray-900 mb-2">Quantity</h4>
      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          on:click={() => (quantity = Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span class="w-8 text-center font-medium">{quantity}</span>
        <button
          type="button"
          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          on:click={() => (quantity += 1)}
        >
          +
        </button>
      </div>
    </div>
  </div>

  <!-- Additional Info -->
  <div class="mb-4 space-y-2">
    <!-- Dietary/Special Info -->
    {#if item.dietary && item.dietary.length > 0}
      <div class="flex flex-wrap gap-1">
        {#each item.dietary as diet}
          <span
            class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md"
          >
            {diet}
          </span>
        {/each}
      </div>
    {/if}

    <!-- Prep Time -->
    {#if item.prepTime}
      <p class="text-xs text-gray-500">
        🕒 Prep time: {item.prepTime}
      </p>
    {/if}

    <!-- Spice Level -->
    {#if item.spiceLevel}
      <p class="text-xs text-gray-500">
        🌶️ Spice level: {"🌶️".repeat(item.spiceLevel)}
      </p>
    {/if}

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
        ${totalPrice.toFixed(2)}
      </span>

      {#if !item.available}
        <span class="text-red-500 text-sm font-medium ml-2">
          Currently Unavailable
        </span>
      {/if}
    </div>

    <!-- Add to cart button -->
    {#if item.available}
      <button
        class="w-full btn-primary"
        onclick={() =>
          onAddToCart({
            ...item,
            selectedSize,
            selectedToppings,
            selectedAddOns,
            quantity,
            totalPrice,
          })}
      >
        Add to Cart
      </button>
    {/if}
  </div>
</article>
