<script>
  import { availableCategories, selectedCategory, selectCategory } from '$lib/stores/menu-store.svelte.js';
  import { navigationState, scrollToCategory, scrollCategoryIntoView, getScrollIndicators } from '$lib/stores/navigation-store.svelte.js';
  import { onMount } from 'svelte';

  /**
   * Horizontal Sticky Navigation Component
   * Appears when scrolled down, provides horizontal scrolling category navigation
   */

  let navElement = $state();
  let scrollIndicators = $state({ showLeft: false, showRight: false });

  // Get categories for display
  const categories = $derived(() => {
    const cats = availableCategories();
    return cats || [];
  });

  // Check if navigation should be visible based on scroll position
  const isVisible = $derived(() => navigationState.stickyNavVisible);

  // Handle category selection
  function handleCategoryClick(categoryId) {
    selectCategory(categoryId);
    scrollToCategory(categoryId);
  }

  // Update scroll indicators when navigation scrolls
  function updateScrollIndicators() {
    if (navElement) {
      scrollIndicators = getScrollIndicators(navElement);
    }
  }

  // Scroll to active category when it changes
  $effect(() => {
    if (navigationState.activeCategory && navElement) {
      scrollCategoryIntoView(navigationState.activeCategory, navElement);
    }
  });

  onMount(() => {
    // Update scroll indicators on mount
    updateScrollIndicators();

    // Listen for scroll events on the navigation
    if (navElement) {
      navElement.addEventListener('scroll', updateScrollIndicators, { passive: true });
    }

    return () => {
      if (navElement) {
        navElement.removeEventListener('scroll', updateScrollIndicators);
      }
    };
  });

  // Get category display info
  function getCategoryInfo(category) {
    return {
      id: category.id,
      name: category.name,
      count: category.items?.length || 0
    };
  }
</script>

<!-- Sticky Horizontal Navigation -->
<nav 
  class="sticky-nav"
  class:visible={isVisible}
  aria-label="Sticky menu categories"
>
  <div class="nav-container">
    <!-- Left fade indicator -->
    {#if scrollIndicators.showLeft}
      <div class="fade-left" aria-hidden="true">
        <div class="scroll-arrow scroll-arrow-left">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 9L4.5 6l3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    {/if}

    <!-- Category buttons container -->
    <div 
      bind:this={navElement}
      class="category-scroll"
      onscroll={updateScrollIndicators}
    >
      {#each categories as category (category.id)}
        {@const categoryInfo = getCategoryInfo(category)}
        <button
          type="button"
          class="category-button"
          class:active={selectedCategory === category.id}
          class:current={navigationState.activeCategory === category.id}
          data-category={category.id}
          onclick={() => handleCategoryClick(category.id)}
          aria-pressed={selectedCategory === category.id}
          aria-current={navigationState.activeCategory === category.id ? 'page' : false}
          aria-label="View {categoryInfo.name} menu items ({categoryInfo.count} items)"
        >
          <span class="category-name">{categoryInfo.name}</span>
          <span class="category-count">({categoryInfo.count})</span>
        </button>
      {/each}
    </div>

    <!-- Right fade indicator -->
    {#if scrollIndicators.showRight}
      <div class="fade-right" aria-hidden="true">
        <div class="scroll-arrow scroll-arrow-right">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 3L7.5 6l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  .sticky-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(244, 242, 235, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(209, 213, 219, 0.5);
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .sticky-nav.visible {
    transform: translateY(0);
  }

  .nav-container {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    padding: 0.75rem 0;
  }

  .category-scroll {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0 1rem;
    scroll-padding: 1rem;
  }

  .category-scroll::-webkit-scrollbar {
    display: none;
  }

  .category-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.875rem;
    min-width: 6rem;
    height: 2.75rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border: 1.5px solid #d1d5db;
    border-radius: 0.5rem;
    color: #374151;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.1;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .category-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/noise.png') repeat;
    opacity: 0.03;
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .category-button:hover {
    border-color: #dc2626;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
    transform: translateY(-1px);
  }

  .category-button.active {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    border-color: #991b1b;
    color: white;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  }

  .category-button.current {
    border-color: #fbbf24;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
  }

  .category-button.active.current {
    border-color: #fbbf24;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.5), 0 2px 8px rgba(220, 38, 38, 0.3);
  }

  .category-button.active::before {
    opacity: 0.08;
  }

  .category-name {
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.125rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .category-count {
    font-size: 0.65rem;
    opacity: 0.8;
    font-weight: 500;
  }

  /* Fade indicators */
  .fade-left,
  .fade-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2.5rem;
    pointer-events: none;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fade-left {
    left: 0;
    background: linear-gradient(90deg, rgba(244, 242, 235, 1) 0%, rgba(244, 242, 235, 0.8) 70%, transparent 100%);
  }

  .fade-right {
    right: 0;
    background: linear-gradient(-90deg, rgba(244, 242, 235, 1) 0%, rgba(244, 242, 235, 0.8) 70%, transparent 100%);
  }

  .scroll-arrow {
    color: #6b7280;
    opacity: 0.7;
    animation: pulse 2s infinite;
  }

  .scroll-arrow-left {
    margin-left: 0.25rem;
  }

  .scroll-arrow-right {
    margin-right: 0.25rem;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .nav-container {
      padding: 0.5rem 0;
    }

    .category-scroll {
      gap: 0.5rem;
      padding: 0 0.75rem;
    }

    .category-button {
      min-width: 5rem;
      height: 2.5rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.7rem;
    }

    .category-name {
      font-size: 0.7rem;
    }

    .category-count {
      font-size: 0.6rem;
    }

    .fade-left,
    .fade-right {
      width: 2rem;
    }
  }

  /* Accessibility and High Contrast Support */
  @media (prefers-contrast: high) {
    .sticky-nav {
      background: #fff;
      border-bottom-color: #000;
    }

    .category-button {
      border-width: 2px;
      border-color: #000;
      background: #fff;
      color: #000;
    }

    .category-button.active {
      background: #000;
      border-color: #000;
      color: #fff;
    }

    .fade-left {
      background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 70%, transparent 100%);
    }

    .fade-right {
      background: linear-gradient(-90deg, #fff 0%, rgba(255, 255, 255, 0.8) 70%, transparent 100%);
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .sticky-nav {
      transition: none;
    }

    .category-button {
      transition: none;
    }

    .category-scroll {
      scroll-behavior: auto;
    }

    .scroll-arrow {
      animation: none;
      opacity: 0.7;
    }
  }

  /* Focus States */
  .category-button:focus {
    outline: 3px solid #dc2626;
    outline-offset: 2px;
    border-color: #dc2626;
  }

  .category-button:focus:not(:focus-visible) {
    outline: none;
  }

  /* Safari backdrop-filter support */
  @supports (backdrop-filter: blur(8px)) {
    .sticky-nav {
      backdrop-filter: blur(8px);
    }
  }

  @supports not (backdrop-filter: blur(8px)) {
    .sticky-nav {
      background: rgba(244, 242, 235, 0.98);
    }
  }
</style>