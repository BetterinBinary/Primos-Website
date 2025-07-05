/**
 * Image Accessibility Utilities for Primos Pizza Website
 * 
 * Provides comprehensive accessibility enhancements for images:
 * - Automatic alt text generation for menu items
 * - ARIA label management
 * - Screen reader optimizations
 * - High contrast mode support
 * - Reduced motion preferences
 */

/**
 * Generate descriptive alt text for menu items
 */
export function generateMenuItemAltText(item) {
  if (!item) return 'Menu item image';
  
  const parts = [];
  
  // Item name
  if (item.name) {
    parts.push(item.name);
  }
  
  // Category context
  if (item.category) {
    const categoryMap = {
      'appetizers': 'appetizer',
      'pizza': 'pizza',
      'pasta': 'pasta dish',
      'seafood': 'seafood dish',
      'chicken': 'chicken dish', 
      'bbq-ribs': 'BBQ ribs',
      'combination-plates': 'combination plate',
      'beverages': 'beverage',
      'desserts': 'dessert'
    };
    
    const categoryText = categoryMap[item.category] || 'menu item';
    parts.push(categoryText);
  }
  
  // Price information for screen readers
  if (item.price) {
    parts.push(`priced at $${item.price}`);
  } else if (item.basePrice) {
    parts.push(`starting at $${item.basePrice}`);
  }
  
  // Restaurant branding
  parts.push('from Primos Pizza');
  
  return parts.join(' - ');
}

/**
 * Generate ARIA labels for interactive image elements
 */
export function generateImageAriaLabel(item, context = 'view') {
  const baseAlt = generateMenuItemAltText(item);
  
  const actionMap = {
    'view': 'View details for',
    'customize': 'Customize',
    'add': 'Add to cart'
  };
  
  const actionText = actionMap[context] || 'Interact with';
  return `${actionText} ${baseAlt}`;
}

/**
 * Enhanced image component with accessibility features
 */
export class AccessibleImage {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      loadingText: 'Loading image...',
      errorText: 'Image unavailable', 
      retryText: 'Retry loading image',
      enableHighContrast: true,
      enableReducedMotion: true,
      ...options
    };
    
    this.setupAccessibility();
    this.setupLoadingStates();
    this.setupErrorHandling();
  }
  
  /**
   * Set up basic accessibility attributes
   */
  setupAccessibility() {
    const img = this.element;
    
    // Ensure proper role
    if (!img.getAttribute('role')) {
      img.setAttribute('role', 'img');
    }
    
    // Add aria-busy during loading
    if (img.loading === 'lazy' && !img.complete) {
      img.setAttribute('aria-busy', 'true');
    }
    
    // Handle keyboard focus for interactive images
    if (img.closest('button') || img.closest('a')) {
      img.setAttribute('aria-hidden', 'true'); // Let parent handle focus
    }
  }
  
  /**
   * Set up loading state announcements
   */
  setupLoadingStates() {
    const img = this.element;
    
    // Create screen reader status region
    const statusRegion = this.createStatusRegion();
    
    // Announce loading state
    if (!img.complete) {
      this.announceStatus(this.options.loadingText);
    }
    
    img.addEventListener('load', () => {
      img.removeAttribute('aria-busy');
      this.announceStatus('Image loaded successfully');
    });
  }
  
  /**
   * Set up error handling with recovery options
   */
  setupErrorHandling() {
    const img = this.element;
    
    img.addEventListener('error', () => {
      img.removeAttribute('aria-busy');
      img.setAttribute('aria-label', `${img.alt} - ${this.options.errorText}`);
      
      // Announce error to screen readers
      this.announceStatus(`${this.options.errorText}. ${this.options.retryText}`);
      
      // Add visual error indicator for all users
      this.addErrorIndicator();
    });
  }
  
  /**
   * Create ARIA live region for status announcements
   */
  createStatusRegion() {
    let region = document.getElementById('image-status-region');
    
    if (!region) {
      region = document.createElement('div');
      region.id = 'image-status-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }
    
    return region;
  }
  
  /**
   * Announce status to screen readers
   */
  announceStatus(message) {
    const region = this.createStatusRegion();
    region.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }
  
  /**
   * Add visual error indicator
   */
  addErrorIndicator() {
    const img = this.element;
    const container = img.parentElement;
    
    if (!container.querySelector('.image-error-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'image-error-indicator';
      indicator.innerHTML = `
        <span class="text-gray-400 text-sm">
          📸 ${this.options.errorText}
        </span>
      `;
      
      container.appendChild(indicator);
    }
  }
}

/**
 * Apply accessibility enhancements to all images in a container
 */
export function enhanceImageAccessibility(container = document) {
  const images = container.querySelectorAll('img');
  
  images.forEach(img => {
    // Skip if already enhanced
    if (img.dataset.accessibilityEnhanced) return;
    
    new AccessibleImage(img);
    img.dataset.accessibilityEnhanced = 'true';
  });
}

/**
 * Check user preferences and apply appropriate settings
 */
export function applyUserPreferences() {
  const preferences = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
  };
  
  // Apply reduced motion preferences
  if (preferences.reducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }
  
  // Apply high contrast preferences
  if (preferences.highContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  return preferences;
}

/**
 * Setup automatic accessibility enhancement for dynamically loaded images
 */
export function setupAutoAccessibility() {
  // Enhance existing images
  enhanceImageAccessibility();
  
  // Set up mutation observer for dynamic content
  if ('MutationObserver' in window) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            enhanceImageAccessibility(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Apply user preferences
  applyUserPreferences();
  
  // Listen for preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', applyUserPreferences);
  window.matchMedia('(prefers-contrast: high)').addEventListener('change', applyUserPreferences);
}