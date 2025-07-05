/**
 * Navigation Store with Svelte 5 Runes
 * Manages scroll state, active categories, and intersection observer for enhanced menu navigation
 */

// Scroll state management
let scrollY = $state(0);
let isScrolled = $derived(scrollY > 100);

// Active category detection
let activeCategory = $state('pizza');
let visibleSections = $state(new Set());

// Navigation state
let stickyNavVisible = $derived(isScrolled);
let categoryElements = $state(new Map());

// Intersection observer management
let observer = $state(null);

// Debounced scroll handling
let scrollTimeout = $state(null);

/**
 * Update scroll position with debouncing for 60fps performance
 */
export function updateScrollPosition() {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  
  scrollTimeout = setTimeout(() => {
    scrollY = window.scrollY;
  }, 16); // 60fps
}

/**
 * Set the active category and update visibility state
 * @param {string} categoryId - The category ID to set as active
 */
export function setActiveCategory(categoryId) {
  activeCategory = categoryId;
}

/**
 * Smooth scroll to a specific category section
 * @param {string} categoryId - The category ID to scroll to
 */
export function scrollToCategory(categoryId) {
  const element = categoryElements.get(categoryId);
  if (element) {
    const headerOffset = 120; // Account for sticky nav and spacing
    const elementPosition = element.offsetTop - headerOffset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Register a category element for intersection observation
 * @param {string} categoryId - The category ID
 * @param {HTMLElement} element - The DOM element for the category section
 */
export function registerCategoryElement(categoryId, element) {
  categoryElements.set(categoryId, element);
  
  // Add to observer if it exists
  if (observer && element) {
    observer.observe(element);
  }
}

/**
 * Unregister a category element
 * @param {string} categoryId - The category ID to unregister
 */
export function unregisterCategoryElement(categoryId) {
  const element = categoryElements.get(categoryId);
  if (observer && element) {
    observer.unobserve(element);
  }
  categoryElements.delete(categoryId);
}

/**
 * Setup intersection observer for automatic section detection
 */
export function setupIntersectionObserver() {
  if (typeof window === 'undefined') return;
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const categoryId = entry.target.dataset.category;
        if (!categoryId) return;
        
        if (entry.isIntersecting) {
          visibleSections.add(categoryId);
          // Set the first visible section as active
          const visibleArray = Array.from(visibleSections);
          if (visibleArray.length > 0) {
            setActiveCategory(visibleArray[0]);
          }
        } else {
          visibleSections.delete(categoryId);
        }
      });
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
      rootMargin: '-100px 0px -100px 0px' // Trigger before fully in view
    }
  );
  
  // Observe all currently registered elements
  categoryElements.forEach(element => {
    if (element) observer.observe(element);
  });
}

/**
 * Scroll a category button into view in the horizontal navigation
 * @param {string} categoryId - The category ID to scroll into view
 * @param {HTMLElement} navElement - The horizontal navigation container
 */
export function scrollCategoryIntoView(categoryId, navElement) {
  if (!navElement) return;
  
  const categoryButton = navElement.querySelector(`[data-category="${categoryId}"]`);
  
  if (categoryButton) {
    categoryButton.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
}

/**
 * Check if horizontal scroll indicators should be visible
 * @param {HTMLElement} navElement - The horizontal navigation container
 * @returns {{showLeft: boolean, showRight: boolean}} Indicator visibility state
 */
export function getScrollIndicators(navElement) {
  if (!navElement) return { showLeft: false, showRight: false };
  
  const { scrollLeft, scrollWidth, clientWidth } = navElement;
  
  return {
    showLeft: scrollLeft > 10,
    showRight: scrollLeft < scrollWidth - clientWidth - 10
  };
}

/**
 * Cleanup intersection observer and timeouts
 */
export function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }
  
  categoryElements.clear();
  visibleSections.clear();
}

// Reactive exports for component consumption
export const navigationState = {
  get scrollY() { return scrollY; },
  get isScrolled() { return isScrolled; },
  get activeCategory() { return activeCategory; },
  get visibleSections() { return visibleSections; },
  get stickyNavVisible() { return stickyNavVisible; },
  get categoryElements() { return categoryElements; }
};

// Initialize browser-specific functionality
if (typeof window !== 'undefined') {
  // Setup scroll listener
  window.addEventListener('scroll', updateScrollPosition, { passive: true });
  
  // Setup intersection observer
  setupIntersectionObserver();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
}