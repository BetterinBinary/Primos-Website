<script>
  import { availableCategories, selectedCategory, selectCategory } from '$lib/stores/menu-store.svelte.js';
  import { navigationState, scrollToCategory } from '$lib/stores/navigation-store.svelte.js';

  /**
   * Multi-line Category Navigation Component
   * Displays categories in a responsive grid layout:
   * - Desktop: 2 rows with 6 categories each (11 total, last row has 5)
   * - Mobile: Single horizontal scrollable row
   */

  // Get categories for display
  const categories = $derived(() => {
    const cats = availableCategories();
    return cats || [];
  });

  // Handle category selection
  function handleCategoryClick(categoryId) {
    selectCategory(categoryId);
    scrollToCategory(categoryId);
  }

  // Get category display info
  function getCategoryInfo(category) {
    return {
      id: category.id,
      name: category.name,
      count: category.items?.length || 0
    };
  }
</script>

<!-- Desktop Multi-line Layout -->
<nav class="category-nav-desktop" aria-label="Menu categories">
  <div class="category-grid">
    {#each categories as category (category.id)}
      {@const categoryInfo = getCategoryInfo(category)}
      <button
        type="button"
        class="category-button"
        class:active={selectedCategory === category.id}
        data-category={category.id}
        onclick={() => handleCategoryClick(category.id)}
        aria-pressed={selectedCategory === category.id}
        aria-label="View {categoryInfo.name} menu items ({categoryInfo.count} items)"
      >
        <span class="category-name">{categoryInfo.name}</span>
        <span class="category-count">({categoryInfo.count})</span>
      </button>
    {/each}
  </div>
</nav>

<!-- Mobile Horizontal Scroll Layout -->
<nav class="category-nav-mobile" aria-label="Menu categories">
  <div class="category-scroll-container">
    {#each categories as category (category.id)}
      {@const categoryInfo = getCategoryInfo(category)}
      <button
        type="button"
        class="category-button-mobile"
        class:active={selectedCategory === category.id}
        data-category={category.id}
        onclick={() => handleCategoryClick(category.id)}
        aria-pressed={selectedCategory === category.id}
        aria-label="View {categoryInfo.name} menu items ({categoryInfo.count} items)"
      >
        <span class="category-name">{categoryInfo.name}</span>
        <span class="category-count">({categoryInfo.count})</span>
      </button>
    {/each}
  </div>
</nav>

<style>
  /* Desktop Multi-line Layout */
  .category-nav-desktop {
    display: block;
    width: 100%;
    margin-bottom: 2rem;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: auto auto;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Make last 5 items span the second row */
  .category-button:nth-child(n+7) {
    grid-row: 2;
  }

  .category-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 0.75rem;
    min-height: 4rem;
    background: linear-gradient(135deg, #f4f2eb 0%, #ebe9dc 100%);
    border: 2px solid #d1d5db;
    border-radius: 0.75rem;
    color: #374151;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.2;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .category-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/noise.png') repeat;
    opacity: 0.05;
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .category-button:hover {
    border-color: #dc2626;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
    transform: translateY(-2px);
  }

  .category-button.active {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    border-color: #991b1b;
    color: white;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  .category-button.active::before {
    opacity: 0.1;
  }

  .category-name {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .category-count {
    font-size: 0.75rem;
    opacity: 0.8;
    font-weight: 500;
  }

  /* Mobile Horizontal Scroll Layout */
  .category-nav-mobile {
    display: none;
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .category-scroll-container {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0 1rem;
    scroll-padding: 1rem;
  }

  .category-scroll-container::-webkit-scrollbar {
    display: none;
  }

  .category-button-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    min-width: 7rem;
    min-height: 3.5rem;
    background: linear-gradient(135deg, #f4f2eb 0%, #ebe9dc 100%);
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    color: #374151;
    font-weight: 600;
    font-size: 0.8rem;
    line-height: 1.2;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .category-button-mobile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/noise.png') repeat;
    opacity: 0.05;
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .category-button-mobile:hover {
    border-color: #dc2626;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
  }

  .category-button-mobile.active {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    border-color: #991b1b;
    color: white;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  }

  .category-button-mobile.active::before {
    opacity: 0.1;
  }

  .category-button-mobile .category-name {
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.125rem;
  }

  .category-button-mobile .category-count {
    font-size: 0.7rem;
    opacity: 0.8;
    font-weight: 500;
  }

  /* Responsive Breakpoints */
  @media (max-width: 768px) {
    .category-nav-desktop {
      display: none;
    }

    .category-nav-mobile {
      display: block;
    }
  }

  @media (min-width: 769px) {
    .category-nav-desktop {
      display: block;
    }

    .category-nav-mobile {
      display: none;
    }
  }

  /* Accessibility and High Contrast Support */
  @media (prefers-contrast: high) {
    .category-button,
    .category-button-mobile {
      border-width: 3px;
      border-color: #000;
    }

    .category-button.active,
    .category-button-mobile.active {
      background: #000;
      border-color: #000;
      color: #fff;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .category-button,
    .category-button-mobile {
      transition: none;
    }

    .category-scroll-container {
      scroll-behavior: auto;
    }
  }

  /* Focus States for Keyboard Navigation */
  .category-button:focus,
  .category-button-mobile:focus {
    outline: 3px solid #dc2626;
    outline-offset: 2px;
    border-color: #dc2626;
  }

  .category-button:focus:not(:focus-visible),
  .category-button-mobile:focus:not(:focus-visible) {
    outline: none;
  }

  /* Fine-tune grid layout for different screen sizes */
  @media (min-width: 1024px) {
    .category-grid {
      max-width: 1400px;
      gap: 1.25rem;
    }

    .category-button {
      padding: 1.25rem 1rem;
      min-height: 4.5rem;
      font-size: 0.9rem;
    }

    .category-name {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 640px) {
    .category-scroll-container {
      gap: 0.5rem;
      padding: 0 0.75rem;
    }

    .category-button-mobile {
      min-width: 6rem;
      min-height: 3rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
    }

    .category-button-mobile .category-name {
      font-size: 0.75rem;
    }

    .category-button-mobile .category-count {
      font-size: 0.65rem;
    }
  }
</style>