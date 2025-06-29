<script>
  import CartItem from './CartItem.svelte';
  import CartSummary from './CartSummary.svelte';
  import Button from '../ui/Button.svelte';
  
  let { 
    cartItems = [],
    orderType = 'pickup',
    onUpdateQuantity = null,
    onRemoveItem = null,
    onClearCart = null,
    onProceedToCheckout = null,
    onApplyPromo = null,
    onRemovePromo = null,
    appliedPromo = null,
    isCheckingOut = false,
    editable = true,
    showCheckoutButton = true
  } = $props();

  let isClearing = $state(false);

  // Check if cart is empty
  const isEmpty = $derived(() => cartItems.length === 0);
  
  // Calculate total quantity
  const totalItems = $derived(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );

  async function handleClearCart() {
    if (!onClearCart || isClearing || isEmpty) return;
    
    const confirmed = confirm('Are you sure you want to clear your cart?');
    if (!confirmed) return;
    
    isClearing = true;
    try {
      await onClearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      isClearing = false;
    }
  }

  async function handleProceedToCheckout() {
    if (!onProceedToCheckout || isCheckingOut || isEmpty) return;
    
    try {
      await onProceedToCheckout();
    } catch (error) {
      console.error('Failed to proceed to checkout:', error);
    }
  }
</script>

<div class="cart-container">
  
  <!-- Cart Header -->
  <div class="cart-header">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">
        Your Cart
        {#if !isEmpty}
          <span class="text-sm font-normal text-gray-600 ml-2">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        {/if}
      </h2>
      
      {#if !isEmpty && editable}
        <button
          type="button"
          onclick={handleClearCart}
          disabled={isClearing}
          class="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isClearing}
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Clearing...</span>
            </div>
          {:else}
            Clear Cart
          {/if}
        </button>
      {/if}
    </div>
  </div>

  <!-- Cart Content -->
  <div class="cart-content">
    {#if isEmpty}
      <!-- Empty Cart State -->
      <div class="empty-cart">
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
            Add some delicious items from our menu to get started!
          </p>
          
          <Button 
            variant="primary" 
            onclick={() => window.location.href = '/menu'}
          >
            Browse Menu
          </Button>
        </div>
      </div>
    {:else}
      <!-- Cart Items and Summary -->
      <div class="grid lg:grid-cols-3 gap-8">
        
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div class="space-y-3">
            {#each cartItems as item (item.id || item.cartId)}
              <CartItem 
                cartItem={item}
                {onUpdateQuantity}
                onRemove={onRemoveItem}
                {editable}
              />
            {/each}
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-4">
            <CartSummary 
              {cartItems}
              {orderType}
              {onApplyPromo}
              {onRemovePromo}
              {appliedPromo}
              {editable}
            />
            
            <!-- Checkout Button -->
            {#if showCheckoutButton && editable}
              <div class="mt-6">
                <Button
                  variant="primary"
                  size="large"
                  onclick={handleProceedToCheckout}
                  disabled={isEmpty || isCheckingOut}
                  class="w-full"
                >
                  {#if isCheckingOut}
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  {:else}
                    Proceed to Checkout
                  {/if}
                </Button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .cart-container {
    @apply max-w-7xl mx-auto px-4 py-8;
  }

  .cart-header {
    @apply mb-8 pb-4 border-b border-gray-200;
  }

  .cart-content {
    @apply min-h-[400px];
  }

  .empty-cart {
    @apply bg-gray-50 rounded-lg;
  }

  /* Mobile optimizations */
  @media (max-width: 1024px) {
    .cart-container {
      @apply px-4 py-6;
    }
    
    .cart-content .grid {
      @apply grid-cols-1 gap-6;
    }
    
    .sticky {
      @apply static;
    }
  }

  /* Loading animations */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Accessibility improvements */
  .cart-container:focus-within {
    @apply outline-none;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .cart-header {
      @apply border-b-2 border-gray-900;
    }
  }
</style>