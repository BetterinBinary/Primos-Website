<script>
  import { PricingCalculator } from '$lib/utils/pricing.js';
  
  let { 
    cartItems = [],
    orderType = 'pickup', // 'pickup' or 'delivery'
    promoCode = '',
    onApplyPromo = null,
    onRemovePromo = null,
    appliedPromo = null,
    showPromoInput = true,
    editable = true
  } = $props();

  let promoInput = $state('');
  let isApplyingPromo = $state(false);
  let promoError = $state('');

  // Calculate pricing breakdown
  const pricing = $derived(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.totalPrice || (item.quantity * (item.selectedSize?.price || item.basePrice || 0)));
    }, 0);

    const deliveryFee = orderType === 'delivery' ? PricingCalculator.DELIVERY_FEE : 0;
    
    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        discount = subtotal * (appliedPromo.value / 100);
      } else if (appliedPromo.type === 'fixed') {
        discount = appliedPromo.value;
      }
      // Cap discount at subtotal
      discount = Math.min(discount, subtotal);
    }

    const subtotalAfterDiscount = subtotal - discount;
    const tax = PricingCalculator.calculateTax(subtotalAfterDiscount + deliveryFee);
    const total = subtotalAfterDiscount + deliveryFee + tax;

    return {
      subtotal,
      discount,
      subtotalAfterDiscount,
      deliveryFee,
      tax,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  });

  async function handleApplyPromo() {
    if (!onApplyPromo || !promoInput.trim() || isApplyingPromo) return;
    
    isApplyingPromo = true;
    promoError = '';
    
    try {
      const result = await onApplyPromo(promoInput.trim());
      if (result.success) {
        promoInput = '';
      } else {
        promoError = result.error || 'Invalid promo code';
      }
    } catch (error) {
      promoError = 'Failed to apply promo code';
    } finally {
      isApplyingPromo = false;
    }
  }

  async function handleRemovePromo() {
    if (!onRemovePromo || !appliedPromo) return;
    
    try {
      await onRemovePromo();
    } catch (error) {
      console.error('Failed to remove promo:', error);
    }
  }

  function handlePromoKeydown(event) {
    if (event.key === 'Enter') {
      handleApplyPromo();
    }
  }

  // Clear promo error when input changes
  $effect(() => {
    if (promoInput !== promoCode) {
      promoError = '';
    }
  });
</script>

<div class="cart-summary bg-gray-50 rounded-lg p-6 space-y-4">
  
  <!-- Order Summary Header -->
  <div class="flex items-center justify-between border-b border-gray-200 pb-3">
    <h3 class="text-lg font-semibold text-gray-900">
      Order Summary
    </h3>
    <span class="text-sm text-gray-600">
      {pricing.itemCount} {pricing.itemCount === 1 ? 'item' : 'items'}
    </span>
  </div>

  <!-- Order Type -->
  <div class="flex items-center justify-between text-sm">
    <span class="text-gray-600">Order Type:</span>
    <span class="font-medium capitalize">{orderType}</span>
  </div>

  <!-- Pricing Breakdown -->
  <div class="space-y-2">
    
    <!-- Subtotal -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600">Subtotal:</span>
      <span class="font-medium">${pricing.subtotal.toFixed(2)}</span>
    </div>

    <!-- Applied Promo -->
    {#if appliedPromo && pricing.discount > 0}
      <div class="flex items-center justify-between text-sm text-green-600">
        <div class="flex items-center gap-2">
          <span>Discount ({appliedPromo.code}):</span>
          {#if editable && onRemovePromo}
            <button
              type="button"
              onclick={handleRemovePromo}
              class="text-xs text-red-500 hover:text-red-700"
              aria-label="Remove promo code"
            >
              ✕
            </button>
          {/if}
        </div>
        <span class="font-medium">-${pricing.discount.toFixed(2)}</span>
      </div>
    {/if}

    <!-- Delivery Fee -->
    {#if pricing.deliveryFee > 0}
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Delivery Fee:</span>
        <span class="font-medium">${pricing.deliveryFee.toFixed(2)}</span>
      </div>
    {/if}

    <!-- Tax -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600">Tax (6%):</span>
      <span class="font-medium">${pricing.tax.toFixed(2)}</span>
    </div>
  </div>

  <!-- Promo Code Input -->
  {#if showPromoInput && editable && !appliedPromo}
    <div class="border-t border-gray-200 pt-4">
      <div class="space-y-2">
        <label for="promo-code" class="text-sm font-medium text-gray-700">
          Promo Code
        </label>
        
        <div class="flex gap-2">
          <input
            id="promo-code"
            type="text"
            bind:value={promoInput}
            onkeydown={handlePromoKeydown}
            placeholder="Enter code"
            disabled={isApplyingPromo}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm
                   focus:outline-none focus:ring-2 focus:ring-primos-red-500 focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <button
            type="button"
            onclick={handleApplyPromo}
            disabled={!promoInput.trim() || isApplyingPromo}
            class="px-4 py-2 bg-primos-red-600 text-white text-sm font-medium rounded-md
                   hover:bg-primos-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
          >
            {#if isApplyingPromo}
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {:else}
              Apply
            {/if}
          </button>
        </div>
        
        {#if promoError}
          <p class="text-xs text-red-600">{promoError}</p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Total -->
  <div class="border-t border-gray-200 pt-4">
    <div class="flex items-center justify-between">
      <span class="text-lg font-semibold text-gray-900">Total:</span>
      <span class="text-xl font-bold text-primos-red-600">
        ${pricing.total.toFixed(2)}
      </span>
    </div>
    
    <!-- Savings indicator -->
    {#if pricing.discount > 0}
      <div class="text-right">
        <span class="text-sm text-green-600">
          You saved ${pricing.discount.toFixed(2)}!
        </span>
      </div>
    {/if}
  </div>

  <!-- Minimum Order Notice -->
  {#if orderType === 'delivery' && pricing.total < PricingCalculator.MINIMUM_DELIVERY_ORDER}
    <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm font-medium text-yellow-800">
            Minimum delivery order: ${PricingCalculator.MINIMUM_DELIVERY_ORDER.toFixed(2)}
          </p>
          <p class="text-xs text-yellow-700 mt-1">
            Add ${(PricingCalculator.MINIMUM_DELIVERY_ORDER - pricing.total).toFixed(2)} more to qualify for delivery
          </p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Estimated Time -->
  <div class="text-center text-sm text-gray-600">
    <p>Estimated {orderType === 'delivery' ? 'delivery' : 'pickup'} time: 25-35 minutes</p>
  </div>
</div>

<style>
  /* Loading spinner animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .cart-summary {
      @apply p-4;
    }
  }
</style>