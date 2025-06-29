<script>
  let { 
    cartItem, 
    onUpdateQuantity, 
    onRemove,
    editable = true 
  } = $props();

  let isUpdating = $state(false);

  // Calculate item total price
  const itemTotal = $derived(() => {
    return cartItem.totalPrice || (cartItem.quantity * (cartItem.selectedSize?.price || cartItem.basePrice || 0));
  });

  // Format modifiers for display
  const modifiersText = $derived(() => {
    const modifiers = [];
    
    if (cartItem.selectedSize && cartItem.selectedSize.name) {
      modifiers.push(cartItem.selectedSize.name);
    }
    
    if (cartItem.selectedToppings && cartItem.selectedToppings.length > 0) {
      const toppings = cartItem.selectedToppings.map(t => t.name).join(', ');
      modifiers.push(`Add: ${toppings}`);
    }
    
    if (cartItem.selectedAddOns && cartItem.selectedAddOns.length > 0) {
      const addOns = cartItem.selectedAddOns.map(a => a.name).join(', ');
      modifiers.push(`Extras: ${addOns}`);
    }
    
    return modifiers.join(' • ');
  });

  async function updateQuantity(newQuantity) {
    if (!editable || isUpdating) return;
    
    isUpdating = true;
    try {
      await onUpdateQuantity(cartItem.id || cartItem.cartId, newQuantity);
    } finally {
      isUpdating = false;
    }
  }

  async function removeItem() {
    if (!editable || isUpdating) return;
    
    isUpdating = true;
    try {
      await onRemove(cartItem.id || cartItem.cartId);
    } finally {
      isUpdating = false;
    }
  }
</script>

<div class="cart-item" class:updating={isUpdating}>
  <div class="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
    
    <!-- Item Image -->
    <div class="flex-shrink-0">
      <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {#if cartItem.image}
          <img
            src="/images/menu/{cartItem.image}"
            alt="{cartItem.name} from Primos Pizza"
            class="w-full h-full object-cover"
          />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <span class="text-2xl">🍕</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Item Details -->
    <div class="flex-1 min-w-0">
      <!-- Item Name -->
      <h3 class="font-medium text-gray-900 text-sm leading-tight mb-1">
        {cartItem.name}
      </h3>

      <!-- Modifiers -->
      {#if modifiersText}
        <p class="text-xs text-gray-600 mb-2 leading-relaxed">
          {modifiersText}
        </p>
      {/if}

      <!-- Special Instructions -->
      {#if cartItem.specialInstructions}
        <p class="text-xs text-blue-600 mb-2 italic">
          Note: {cartItem.specialInstructions}
        </p>
      {/if}

      <!-- Quantity and Controls -->
      <div class="flex items-center justify-between">
        
        <!-- Quantity Controls -->
        {#if editable}
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="quantity-btn"
              onclick={() => updateQuantity(Math.max(1, cartItem.quantity - 1))}
              disabled={cartItem.quantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            
            <span class="text-sm font-medium w-8 text-center" class:opacity-50={isUpdating}>
              {cartItem.quantity}
            </span>
            
            <button
              type="button"
              class="quantity-btn"
              onclick={() => updateQuantity(cartItem.quantity + 1)}
              disabled={isUpdating}
              aria-label="Increase quantity"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        {:else}
          <span class="text-sm text-gray-600">Qty: {cartItem.quantity}</span>
        {/if}

        <!-- Price -->
        <div class="text-right">
          <div class="font-semibold text-primos-red-600">
            ${itemTotal.toFixed(2)}
          </div>
          {#if cartItem.quantity > 1}
            <div class="text-xs text-gray-500">
              ${(itemTotal / cartItem.quantity).toFixed(2)} each
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Remove Button -->
    {#if editable}
      <div class="flex-shrink-0">
        <button
          type="button"
          class="remove-btn"
          onclick={removeItem}
          disabled={isUpdating}
          aria-label="Remove item from cart"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .cart-item.updating {
    @apply opacity-75 pointer-events-none;
  }

  .quantity-btn {
    @apply w-7 h-7 rounded-full border border-gray-300 
           flex items-center justify-center
           hover:bg-gray-50 hover:border-gray-400
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-colors duration-200;
  }

  .quantity-btn:disabled {
    @apply hover:bg-white hover:border-gray-300;
  }

  .remove-btn {
    @apply p-1 text-gray-400 hover:text-red-500
           transition-colors duration-200
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* Accessibility improvements */
  .cart-item:focus-within {
    @apply ring-2 ring-primos-red-500 ring-opacity-50;
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .cart-item .flex {
      @apply gap-3;
    }
    
    .cart-item h3 {
      @apply text-sm;
    }
    
    .cart-item p {
      @apply text-xs;
    }
  }
</style>