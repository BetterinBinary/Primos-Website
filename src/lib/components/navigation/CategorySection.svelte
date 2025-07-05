<script>
  import { registerCategoryElement, unregisterCategoryElement } from '$lib/stores/navigation-store.svelte.js';
  import { onMount, onDestroy } from 'svelte';

  /**
   * Category Section Header Component
   * Creates visual separation between menu categories with Primos red styling
   */

  let { category, children } = $props();
  
  let sectionElement = $state();

  // Register this section with the navigation store for intersection observation
  onMount(() => {
    if (sectionElement && category?.id) {
      registerCategoryElement(category.id, sectionElement);
    }
  });

  onDestroy(() => {
    if (category?.id) {
      unregisterCategoryElement(category.id);
    }
  });

  // Get category info for display
  const categoryInfo = $derived(() => {
    console.log('📁 CategorySection: received category =', category);
    const info = {
      id: category?.id || '',
      name: category?.name || 'Category',
      description: category?.description || '',
      itemCount: category?.items?.length || 0
    };
    console.log('📁 CategorySection: computed categoryInfo =', info);
    return info;
  });
</script>

<!-- Category Section Container -->
<section 
  bind:this={sectionElement}
  data-category={categoryInfo.id}
  class="category-section"
  aria-labelledby="category-header-{categoryInfo.id}"
>
  <!-- Category Header with Primos Red Styling -->
  <header 
    id="category-header-{categoryInfo.id}"
    class="category-section-header"
  >
    <div class="category-title-container">
      <h2 class="category-title">{categoryInfo.name}</h2>
      <span class="category-item-count" aria-label="{categoryInfo.itemCount} items">
        {categoryInfo.itemCount} items
      </span>
    </div>
  </header>

  <!-- Category Content -->
  <div class="category-content">
    {@render children()}
  </div>
</section>

<style>
  .category-section {
    scroll-margin-top: 8rem; /* Account for sticky navigation */
    margin-bottom: 3rem;
  }

  .category-section-header {
    position: relative;
    height: 4rem;
    background: linear-gradient(90deg, #b91c1c 0%, #dc2626 100%);
    display: flex;
    align-items: center;
    padding: 0 2rem;
    margin-bottom: 0;
    overflow: hidden;
  }

  /* Noise texture overlay */
  .category-section-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/noise.png') repeat;
    opacity: 0.15;
    mix-blend-mode: multiply;
    pointer-events: none;
    z-index: 1;
  }

  /* Dark gradient overlay */
  .category-section-header::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
    pointer-events: none;
    z-index: 2;
  }

  .category-title-container {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .category-title {
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    margin: 0;
    letter-spacing: 0.025em;
  }

  .category-item-count {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
  }

  .category-content {
    position: relative;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .category-section-header {
      height: 3.5rem;
      padding: 0 1rem;
      margin-bottom: 0;
    }

    .category-title {
      font-size: 1.25rem;
    }

    .category-item-count {
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
    }

    .category-section {
      scroll-margin-top: 6rem;
      margin-bottom: 0;
    }
  }

  @media (max-width: 480px) {
    .category-section-header {
      height: 3rem;
      padding: 0 0.75rem;
      margin-bottom: 0;
    }

    .category-title {
      font-size: 1.125rem;
    }

    .category-item-count {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
    }

    .category-title-container {
      gap: 0.75rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .category-section-header {
      background: #000;
      border: 2px solid #fff;
    }

    .category-section-header::before,
    .category-section-header::after {
      display: none;
    }

    .category-title {
      color: #fff;
      text-shadow: none;
    }

    .category-item-count {
      background: #fff;
      color: #000;
      border-color: #fff;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .category-section {
      scroll-margin-top: 6rem;
    }
  }

  /* Print styles */
  @media print {
    .category-section-header {
      background: #dc2626 !important;
      color: white !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .category-section-header::before,
    .category-section-header::after {
      display: none;
    }
  }

  /* Focus indicators for accessibility */
  .category-section:focus-within .category-section-header {
    outline: 3px solid #fbbf24;
    outline-offset: 2px;
  }

  /* Enhanced visual depth */
  .category-section-header {
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Smooth animations for modern browsers */
  @supports (backdrop-filter: blur(4px)) {
    .category-item-count {
      backdrop-filter: blur(4px);
    }
  }
</style>