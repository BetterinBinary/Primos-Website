import { PricingCalculator } from '../utils/pricing.js';

/**
 * @typedef {import('../types/menu.js').CartItem} CartItem
 * @typedef {import('../types/menu.js').MenuItem} MenuItem
 * @typedef {import('../types/menu.js').Size} Size
 * @typedef {import('../types/menu.js').Topping} Topping
 * @typedef {import('../types/menu.js').AddOn} AddOn
 */

/**
 * Cart Store using Svelte 5 runes for reactive cart management
 * Handles cart items, totals, persistence, and checkout preparation
 */

// Persistence key for localStorage
const CART_STORAGE_KEY = 'primos-pizza-cart';

// Load cart from localStorage on initialization
function loadCartFromStorage() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
  }
  
  return [];
}

// Save cart to localStorage
function saveCartToStorage(items) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
}

// Create the cart store
function createCartStore() {
  // Core cart state
  let cartItems = $state(loadCartFromStorage());
  let isCartOpen = $state(false);
  let cartError = $state(null);

  // Note: localStorage persistence will be handled by components using this store

  // Derived state for cart calculations
  const cartSummary = $derived(() => {
    if (cartItems.length === 0) {
      return {
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
        isEmpty: true
      };
    }
    
    const summary = PricingCalculator.calculateCartTotal(cartItems);
    
    return {
      ...summary,
      isEmpty: false
    };
  });

  // Derived state for formatted prices
  const formattedCartSummary = $derived(() => {
    const summary = cartSummary();
    
    return {
      ...summary,
      subtotalFormatted: PricingCalculator.formatPrice(summary.subtotal),
      taxFormatted: PricingCalculator.formatPrice(summary.tax),
      totalFormatted: PricingCalculator.formatPrice(summary.total)
    };
  });

  // Add item to cart
  function addToCart(item, options = {}) {
    try {
      const {
        selectedSize = null,
        selectedToppings = [],
        selectedAddOns = [],
        selectedOptions = [],
        quantity = 1,
        specialInstructions = ''
      } = options;
      
      // Calculate price for this configuration
      const priceCalculation = PricingCalculator.calculateItemPrice(
        item,
        selectedSize?.size,
        selectedToppings.map(t => t.id),
        quantity
      );
      
      // Create cart item
      const cartItem = {
        id: generateCartItemId(item, selectedSize, selectedToppings, selectedAddOns),
        menuItem: item,
        quantity,
        selectedSize,
        selectedToppings,
        selectedAddOns,
        selectedOptions,
        specialInstructions,
        totalPrice: priceCalculation.total,
        priceBreakdown: priceCalculation,
        addedAt: new Date().toISOString()
      };
      
      // Check if identical item already exists in cart
      const existingItemIndex = cartItems.findIndex(existing => 
        existing.id === cartItem.id && 
        existing.specialInstructions === specialInstructions
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity and recalculate price
        const existingItem = cartItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        const updatedPriceCalculation = PricingCalculator.calculateItemPrice(
          item,
          selectedSize?.size,
          selectedToppings.map(t => t.id),
          newQuantity
        );
        
        cartItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: updatedPriceCalculation.total,
          priceBreakdown: updatedPriceCalculation
        };
      } else {
        // Add new item to cart
        cartItems = [...cartItems, cartItem];
      }
      
      // Save to localStorage after modification
      saveCartToStorage(cartItems);
      cartError = null;
      return true;
    } catch (error) {
      cartError = `Failed to add item to cart: ${error.message}`;
      console.error('Add to cart error:', error);
      return false;
    }
  }

  // Remove item from cart
  function removeFromCart(cartItemId) {
    cartItems = cartItems.filter(item => item.id !== cartItemId);
    saveCartToStorage(cartItems);
    cartError = null;
  }

  // Update item quantity
  function updateCartItemQuantity(cartItemId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
    if (itemIndex >= 0) {
      const item = cartItems[itemIndex];
      
      // Recalculate price with new quantity
      const updatedPriceCalculation = PricingCalculator.calculateItemPrice(
        item.menuItem,
        item.selectedSize?.size,
        item.selectedToppings?.map(t => t.id) || [],
        newQuantity
      );
      
      cartItems[itemIndex] = {
        ...item,
        quantity: newQuantity,
        totalPrice: updatedPriceCalculation.total,
        priceBreakdown: updatedPriceCalculation
      };
      saveCartToStorage(cartItems);
    }
  }

  // Update special instructions for cart item
  function updateCartItemInstructions(cartItemId, instructions) {
    const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
    if (itemIndex >= 0) {
      cartItems[itemIndex] = {
        ...cartItems[itemIndex],
        specialInstructions: instructions
      };
      saveCartToStorage(cartItems);
    }
  }

  // Clear entire cart
  function clearCart() {
    cartItems = [];
    saveCartToStorage(cartItems);
    cartError = null;
  }

  // Cart visibility controls
  function openCart() {
    isCartOpen = true;
  }

  function closeCart() {
    isCartOpen = false;
  }

  function toggleCart() {
    isCartOpen = !isCartOpen;
  }

  // Generate unique cart item ID based on configuration
  function generateCartItemId(item, selectedSize, selectedToppings, selectedAddOns) {
    const sizeId = selectedSize?.size || 'none';
    const toppingIds = selectedToppings.map(t => t.id).sort().join(',') || 'none';
    const addOnIds = selectedAddOns.map(a => a.name).sort().join(',') || 'none';
    
    return `${item.id}-${sizeId}-${toppingIds}-${addOnIds}`;
  }

  // Get cart item by ID
  function getCartItem(cartItemId) {
    return cartItems.find(item => item.id === cartItemId);
  }

  // Check if item is in cart (with specific configuration)
  function isItemInCart(item, selectedSize = null, selectedToppings = [], selectedAddOns = []) {
    const itemId = generateCartItemId(item, selectedSize, selectedToppings, selectedAddOns);
    return cartItems.some(cartItem => cartItem.id === itemId);
  }

  // Get quantity of specific item configuration in cart
  function getItemQuantityInCart(item, selectedSize = null, selectedToppings = [], selectedAddOns = []) {
    const itemId = generateCartItemId(item, selectedSize, selectedToppings, selectedAddOns);
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }

  // Prepare cart data for checkout
  function prepareForCheckout() {
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }
    
    const summary = cartSummary();
    
    return {
      items: cartItems.map(item => ({
        id: item.id,
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedToppings: item.selectedToppings,
        selectedAddOns: item.selectedAddOns,
        selectedOptions: item.selectedOptions,
        specialInstructions: item.specialInstructions,
        unitPrice: item.priceBreakdown.subtotal / item.quantity,
        totalPrice: item.totalPrice
      })),
      summary: {
        itemCount: summary.itemCount,
        subtotal: summary.subtotal,
        tax: summary.tax,
        total: summary.total
      },
      timestamp: new Date().toISOString()
    };
  }

  // Enhanced cart validation with business rules
  function validateCart() {
    const errors = [];
    const warnings = [];
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    
    // Basic validation
    if (cartItems.length === 0) {
      errors.push('Cart is empty');
      return { isValid: false, errors, warnings };
    }
    
    // Item-level validation
    cartItems.forEach((item, index) => {
      const itemName = item.menuItem?.name || `Item ${index + 1}`;
      
      // Availability checks
      if (!item.menuItem || !item.menuItem.available) {
        errors.push(`${itemName} is no longer available`);
      }
      
      // Quantity validation
      if (item.quantity <= 0) {
        errors.push(`${itemName} has invalid quantity`);
      } else if (item.quantity > 10) {
        warnings.push(`Large quantity for ${itemName} (${item.quantity}). Please call for bulk orders.`);
      }
      
      // Price validation
      if (item.totalPrice <= 0) {
        errors.push(`${itemName} has invalid price`);
      }
      
      // Special item validation
      if (item.menuItem?.categoryName?.toLowerCase().includes('pizza')) {
        if (item.selectedSize && !item.selectedSize.size) {
          errors.push(`${itemName} requires a valid size selection`);
        }
      }
    });
    
    // Business rule validation
    const summary = cartSummary();
    
    // Minimum order validation
    const minimumOrder = 15.00;
    if (summary.total < minimumOrder) {
      warnings.push(`Minimum order is $${minimumOrder.toFixed(2)}. Add $${(minimumOrder - summary.total).toFixed(2)} more to meet minimum.`);
    }
    
    // Store hours validation (example hours)
    const storeHours = {
      0: { open: 16, close: 24 }, // Sunday: 4pm-12am
      1: { open: 16, close: 22 }, // Monday: 4pm-10pm
      2: { open: 16, close: 22 }, // Tuesday: 4pm-10pm
      3: { open: 16, close: 24 }, // Wednesday: 4pm-12am
      4: { open: 16, close: 24 }, // Thursday: 4pm-12am
      5: { open: 16, close: 2 },  // Friday: 4pm-2am (next day)
      6: { open: 16, close: 2 }   // Saturday: 4pm-2am (next day)
    };
    
    const todayHours = storeHours[currentDay];
    const isAfterMidnight = currentHour < 4; // Handle late night hours
    const effectiveHour = isAfterMidnight ? currentHour + 24 : currentHour;
    
    if (effectiveHour < todayHours.open || effectiveHour > todayHours.close) {
      const openTime = todayHours.open > 12 ? `${todayHours.open - 12}pm` : `${todayHours.open}am`;
      const closeTime = todayHours.close > 24 ? `${todayHours.close - 24}am` : 
                       todayHours.close > 12 ? `${todayHours.close - 12}pm` : `${todayHours.close}am`;
      warnings.push(`Store is currently closed. Hours today: ${openTime} - ${closeTime}`);
    }
    
    // Large order validation
    if (summary.itemCount > 20) {
      warnings.push('Large order detected. Please call ahead for faster preparation: (248) 476-4260');
    }
    
    // Special dietary warnings
    const hasAllergens = cartItems.some(item => 
      item.menuItem?.allergens && item.menuItem.allergens.length > 0
    );
    if (hasAllergens) {
      warnings.push('Cart contains items with allergens. Please inform us of any allergies when ordering.');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        itemCount: summary.itemCount,
        subtotal: summary.subtotal,
        total: summary.total,
        meetsMinimum: summary.total >= minimumOrder
      }
    };
  }

  // Clear any cart errors
  function clearCartError() {
    cartError = null;
  }

  return {
    // State getters
    get cartItems() { return cartItems; },
    get isCartOpen() { return isCartOpen; },
    get cartError() { return cartError; },
    get cartSummary() { return cartSummary(); },
    get formattedCartSummary() { return formattedCartSummary(); },
    
    // Actions
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    updateCartItemInstructions,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    getCartItem,
    isItemInCart,
    getItemQuantityInCart,
    prepareForCheckout,
    validateCart,
    clearCartError
  };
}

// Export the cart store instance
export const cart = createCartStore();

// Export reactive properties - all as functions for consistent reactivity
export const cartItems = () => cart.cartItems;
export const isCartOpen = () => cart.isCartOpen;
export const cartError = () => cart.cartError;
export const cartSummary = () => cart.cartSummary;
export const formattedCartSummary = () => cart.formattedCartSummary;

// Export action functions directly
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemInstructions,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  getCartItem,
  isItemInCart,
  getItemQuantityInCart,
  prepareForCheckout,
  validateCart,
  clearCartError
} = cart;