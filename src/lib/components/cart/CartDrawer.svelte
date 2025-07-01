<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { 
    cartItems, 
    cartSummary, 
    isCartOpen, 
    closeCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    validateCart
  } from '$lib/stores/cart-store.svelte.js';
  import Cart from './Cart.svelte';
  import Button from '../ui/Button.svelte';

  // Handle backdrop click to close cart
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeCart();
    }
  }

  // Handle escape key to close cart
  function handleKeydown(event) {
    if (event.key === 'Escape' && isCartOpen()) {
      closeCart();
    }
  }

  // Prevent body scroll when cart is open
  $effect(() => {
    if (isCartOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  });

  async function handleClearCart() {
    await clearCart();
  }

  async function handleUpdateQuantity(itemId, quantity) {
    updateCartItemQuantity(itemId, quantity);
  }

  async function handleRemoveItem(itemId) {
    removeFromCart(itemId);
  }

  async function handleProceedToCheckout() {
    const validation = validateCart();
    
    if (!validation.isValid) {
      console.warn('Cart validation failed:', validation.errors);
      return;
    }
    
    if (validation.warnings.length > 0) {
      console.warn('Cart validation warnings:', validation.warnings);
    }
    
    // Navigate to checkout page (to be implemented)
    console.log('Proceeding to checkout...');
    closeCart();
  }

  // Get cart validation for display
  const validation = $derived(() => validateCart());
</script>

<!-- Add global keydown listener -->
<svelte:window on:keydown={handleKeydown} />

{#if isCartOpen()}
  <!-- Backdrop -->
  <div
    class="cart-backdrop"
    onclick={handleBackdropClick}
    transition:fade={{ duration: 200, easing: quintOut }}
  >
    <!-- Cart Drawer -->
    <div
      class="cart-drawer"
      transition:fly={{ x: 400, duration: 300, easing: quintOut }}
    >
      <!-- Cart Header -->
      <div class="cart-drawer-header">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            Shopping Cart
            {#if cartSummary().itemCount > 0}
              <span class="text-sm font-normal text-gray-600 ml-2">
                ({cartSummary().itemCount} {cartSummary().itemCount === 1 ? 'item' : 'items'})
              </span>
            {/if}
          </h2>
          
          <button
            type="button"
            onclick={closeCart}
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primos-blue-500 focus:ring-offset-2 rounded-md"
            aria-label="Close cart"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Content -->
      <div class="cart-drawer-content">
        {#if cartSummary().isEmpty}
          <!-- Empty Cart State -->
          <div class="empty-cart-state">
            <div class="text-center py-12">
              <div class="mb-4">
                <svg 
                  class="w-16 h-16 text-gray-300 mx-auto" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="1.5" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              
              <p class="text-gray-600 mb-6">
                Add some delicious items from our menu!
              </p>
              
              <Button 
                variant="primary" 
                onclick={() => {
                  closeCart();
                  window.location.href = '/menu';
                }}
              >
                Browse Menu
              </Button>
            </div>
          </div>
        {:else}
          <!-- Cart Items -->
          <div class="cart-items-list">
            {#each cartItems() as item (item.id)}
              <div class="cart-item">
                <!-- Item Image -->
                <div class="item-image">
                  <img
                    src="/images/menu/{item.menuItem.image || 'placeholder.jpg'}"
                    alt={item.menuItem.name}
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                </div>

                <!-- Item Details -->
                <div class="item-details">
                  <h4 class="font-medium text-gray-900">{item.menuItem.name}</h4>
                  
                  <!-- Item Modifiers -->
                  {#if item.selectedSize || item.selectedToppings?.length || item.selectedAddOns?.length}
                    <div class="text-sm text-gray-600 mt-1">
                      {#if item.selectedSize}
                        <span class="modifier">{item.selectedSize.name}</span>
                      {/if}
                      {#if item.selectedToppings?.length}
                        <span class="modifier">+{item.selectedToppings.map(t => t.name).join(', ')}</span>
                      {/if}
                      {#if item.selectedAddOns?.length}
                        <span class="modifier">Extras: {item.selectedAddOns.map(a => a.name).join(', ')}</span>
                      {/if}
                    </div>
                  {/if}

                  <!-- Price and Quantity Controls -->
                  <div class="flex items-center justify-between mt-2">
                    <div class="quantity-controls">
                      <button
                        type="button"
                        onclick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        class="quantity-btn"
                        aria-label="Decrease quantity"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span class="quantity-display">{item.quantity}</span>
                      
                      <button
                        type="button"
                        onclick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        class="quantity-btn"
                        aria-label="Increase quantity"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    <div class="item-price">
                      <span class="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</span>
                      <button
                        type="button"
                        onclick={() => handleRemoveItem(item.id)}
                        class="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label="Remove item"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Cart Summary -->
          <div class="cart-drawer-summary">
            <!-- Validation Messages -->
            {#if validation().errors.length > 0 || validation().warnings.length > 0}
              <div class="validation-messages">
                <!-- Errors -->
                {#if validation().errors.length > 0}
                  <div class="validation-errors">
                    {#each validation().errors as error}
                      <div class="error-message">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    {/each}
                  </div>
                {/if}
                
                <!-- Warnings -->
                {#if validation().warnings.length > 0}
                  <div class="validation-warnings">
                    {#each validation().warnings as warning}
                      <div class="warning-message">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {warning}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}

            <div class="summary-line">
              <span>Subtotal:</span>
              <span>${cartSummary().subtotal.toFixed(2)}</span>
            </div>
            
            <div class="summary-line">
              <span>Tax:</span>
              <span>${cartSummary().tax.toFixed(2)}</span>
            </div>
            
            <div class="summary-line total">
              <span>Total:</span>
              <span>${cartSummary().total.toFixed(2)}</span>
            </div>

            <!-- Minimum Order Notice -->
            {#if !validation().summary?.meetsMinimum}
              <div class="minimum-order-notice">
                <span class="text-amber-600 text-sm">
                  Add ${(15.00 - cartSummary().total).toFixed(2)} more to meet $15.00 minimum order
                </span>
              </div>
            {/if}

            <!-- Action Buttons -->
            <div class="action-buttons">
              <Button
                variant="outline"
                size="small"
                onclick={handleClearCart}
                class="flex-1"
              >
                Clear Cart
              </Button>
              
              <Button
                variant="primary"
                onclick={handleProceedToCheckout}
                disabled={!validation().isValid}
                class="flex-1"
              >
                {validation().isValid ? 'Checkout' : 'Fix Issues to Checkout'}
              </Button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .cart-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end;
  }

  .cart-drawer {
    @apply bg-white w-full max-w-md h-full flex flex-col shadow-xl;
  }

  .cart-drawer-header {
    @apply p-4 border-b border-gray-200 flex-shrink-0;
  }

  .cart-drawer-content {
    @apply flex-1 overflow-y-auto flex flex-col;
  }

  .empty-cart-state {
    @apply flex-1 flex items-center justify-center p-4;
  }

  .cart-items-list {
    @apply flex-1 p-4 space-y-4;
  }

  .cart-item {
    @apply flex gap-4 p-3 bg-gray-50 rounded-lg;
  }

  .item-image {
    @apply flex-shrink-0;
  }

  .item-details {
    @apply flex-1 min-w-0;
  }

  .modifier {
    @apply inline-block mr-2;
  }

  .modifier:not(:last-child)::after {
    @apply content-['•'] ml-2 text-gray-400;
  }

  .quantity-controls {
    @apply flex items-center gap-2;
  }

  .quantity-btn {
    @apply w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
  }

  .quantity-display {
    @apply px-2 text-sm font-medium;
  }

  .item-price {
    @apply flex items-center;
  }

  .cart-drawer-summary {
    @apply p-4 border-t border-gray-200 flex-shrink-0 space-y-3;
  }

  .summary-line {
    @apply flex justify-between items-center text-sm;
  }

  .summary-line.total {
    @apply text-lg font-bold border-t border-gray-200 pt-3;
  }

  .action-buttons {
    @apply flex gap-3 mt-4;
  }

  .validation-messages {
    @apply mb-4 space-y-2;
  }

  .validation-errors .error-message {
    @apply flex items-start text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200;
  }

  .validation-warnings .warning-message {
    @apply flex items-start text-amber-600 text-sm bg-amber-50 p-2 rounded border border-amber-200;
  }

  .minimum-order-notice {
    @apply mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-center;
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .cart-drawer {
      @apply max-w-full;
    }
  }

  /* Accessibility improvements */
  .cart-drawer:focus-within {
    @apply outline-none;
  }

  /* Ensure proper contrast for high contrast mode */
  @media (prefers-contrast: high) {
    .cart-drawer-header,
    .cart-drawer-summary {
      @apply border-gray-900;
    }
  }
</style>