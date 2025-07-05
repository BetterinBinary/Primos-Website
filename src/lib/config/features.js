/**
 * Feature Flags Configuration for Primos Pizza Website
 * 
 * This file controls which features are enabled/disabled in the application.
 * All ordering functionality is preserved in the codebase but can be hidden
 * from the user interface by setting these flags to false.
 */

// Core ordering system features
export const ENABLE_ORDERING = false;       // Show/hide add to cart buttons and ordering workflow
export const ENABLE_CART = false;           // Show/hide cart icon, drawer, and cart functionality  
export const ENABLE_CUSTOMIZATION = false;  // Show/hide customize buttons and customization interfaces

// Advanced ordering features (for future use)
export const ENABLE_CHECKOUT = false;       // Show/hide checkout process
export const ENABLE_USER_ACCOUNTS = false;  // Show/hide user registration and login
export const ENABLE_ORDER_TRACKING = false; // Show/hide order status and tracking
export const ENABLE_FAVORITES = false;      // Show/hide favorite items functionality

// Digital menu features (always enabled for viewing experience)
export const ENABLE_SEARCH = true;          // Search functionality
export const ENABLE_FILTERING = true;       // Category filtering
export const ENABLE_VIEW_MODES = true;      // Grid/list view toggle
export const ENABLE_ITEM_DETAILS = true;    // Item descriptions and images

// Development and admin features
export const ENABLE_DEBUG_MODE = false;     // Show debug information
export const ENABLE_ADMIN_PANEL = false;    // Show admin controls (future)

/**
 * Helper functions for feature flag checks
 */

// Check if any ordering functionality should be visible
export function isOrderingEnabled() {
  return ENABLE_ORDERING || ENABLE_CART || ENABLE_CUSTOMIZATION;
}

// Check if full menu functionality (viewing only) is enabled
export function isMenuViewingEnabled() {
  return ENABLE_SEARCH || ENABLE_FILTERING || ENABLE_VIEW_MODES || ENABLE_ITEM_DETAILS;
}

// Get feature flags for debugging
export function getFeatureFlags() {
  return {
    ENABLE_ORDERING,
    ENABLE_CART,
    ENABLE_CUSTOMIZATION,
    ENABLE_CHECKOUT,
    ENABLE_USER_ACCOUNTS,
    ENABLE_ORDER_TRACKING,
    ENABLE_FAVORITES,
    ENABLE_SEARCH,
    ENABLE_FILTERING,
    ENABLE_VIEW_MODES,
    ENABLE_ITEM_DETAILS,
    ENABLE_DEBUG_MODE,
    ENABLE_ADMIN_PANEL
  };
}

/**
 * Instructions for enabling ordering functionality:
 * 
 * When ready to enable ordering, update the flags above:
 * 1. Set ENABLE_ORDERING = true
 * 2. Set ENABLE_CART = true  
 * 3. Set ENABLE_CUSTOMIZATION = true
 * 
 * All ordering code is preserved and will instantly become functional.
 */