<script lang="ts">
  import { onMount } from "svelte";
  import MenuItem from "$lib/components/menu/MenuItem.svelte";
  import SearchBar from "$lib/components/ui/SearchBar.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";
  import {
    menuData,
    loading,
    error,
    searchQuery,
    selectedCategory,
    viewMode,
    filteredMenuItems,
    availableCategories,
    menuStats,
    updateSearchQuery,
    selectCategory,
    setViewMode,
    resetFilters,
    initializeMenuData
  } from "$lib/stores/menu-store.svelte.js";
  import {
    addToCart,
    cartSummary,
    isCartOpen,
    toggleCart
  } from "$lib/stores/cart-store.svelte.js";
  import type { MenuItem as MenuItemType } from "$lib/types/menu";

  onMount(async () => {
    console.log('🚀 Menu page mounted, checking menu data...');
    
    // Initialize menu data if not already loaded
    if (!menuData()) {
      console.log('📝 Menu data not found, initializing...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Menu loading timeout - data took too long to load')), 10000);
      });
      
      try {
        await Promise.race([initializeMenuData(), timeoutPromise]);
        console.log('🎉 Menu initialization completed in onMount');
      } catch (err) {
        console.error('💥 Menu initialization failed in onMount:', err);
      }
    } else {
      console.log('✨ Menu data already available');
    }
  });

  function handleAddToCart(item: MenuItemType) {
    // For now, add with default options - this will be enhanced later
    const success = addToCart(item, {
      selectedSize: item.sizes?.[0] || null,
      selectedToppings: [],
      selectedAddOns: [],
      quantity: 1
    });
    
    if (success) {
      // Optional: Show success feedback or auto-open cart
      console.log(`Added ${item.name} to cart`);
    }
  }

  function handleSearchInput(event) {
    updateSearchQuery(event.target.value);
  }

  function handleCategorySelect(categoryId) {
    selectCategory(categoryId);
  }

  function handleViewModeToggle() {
    setViewMode(viewMode() === 'grid' ? 'list' : 'grid');
  }

  function handleResetFilters() {
    resetFilters();
  }
</script>

<svelte:head>
  <title>Menu - Primos Pizza</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  {#if loading()}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primos-red-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading menu...</p>
    </div>
  {:else if error()}
    <div class="text-center py-12">
      <p class="text-red-600 text-lg">Error loading menu: {error()}</p>
      <button 
        class="mt-4 px-4 py-2 bg-primos-red-600 text-white rounded-lg hover:bg-primos-red-700"
        onclick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  {:else if menuData()}
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">
        {menuData().restaurant.name}
      </h1>
      <p class="text-gray-600">Our signature hand-tossed pizzas and more</p>
      
      <!-- Cart Toggle Button -->
      <div class="mt-4">
        <Button
          variant="secondary"
          onclick={toggleCart}
          class="relative"
        >
          🛒 Cart
          {#if cartSummary().itemCount > 0}
            <span class="absolute -top-2 -right-2 bg-primos-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartSummary().itemCount}
            </span>
          {/if}
        </Button>
      </div>
    </header>

    <!-- Enhanced Search and Filter Controls -->
    <div class="mb-8 space-y-6">
      <!-- Search Bar with enhanced functionality -->
      <div class="max-w-2xl mx-auto">
        <SearchBar
          searchQuery={searchQuery()}
          placeholder="Search pizzas, appetizers, desserts..."
          onSearch={(query) => updateSearchQuery(query)}
          debounceMs={300}
          autofocus={false}
          showClearButton={true}
        />
      </div>

      <!-- View Controls and Stats -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <!-- View Mode Toggle -->
          <Button
            variant="outline"
            size="sm"
            onclick={handleViewModeToggle}
          >
            {viewMode() === 'grid' ? '📋 List View' : '⊞ Grid View'}
          </Button>
          
          <!-- Reset Filters -->
          {#if selectedCategory() !== 'all' || searchQuery().trim()}
            <Button
              variant="ghost"
              size="sm"
              onclick={handleResetFilters}
            >
              Clear Filters
            </Button>
          {/if}
        </div>
        
        <!-- Menu Stats -->
        <div class="text-sm text-gray-600">
          Showing {menuStats().filteredItems} of {menuStats().totalItems} items
        </div>
      </div>

      <!-- Category Filter with improved design -->
      <div class="flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory() === 'all' ? 'primary' : 'outline'}
          size="sm"
          onclick={() => handleCategorySelect('all')}
        >
          All Items ({menuStats().totalItems})
        </Button>
        {#each availableCategories() as category}
          <Button
            variant={selectedCategory() === category.id ? 'primary' : 'outline'}
            size="sm"
            onclick={() => handleCategorySelect(category.id)}
          >
            {category.name} ({category.items.filter(item => item.available).length})
          </Button>
        {/each}
      </div>
    </div>

    <!-- Enhanced Menu Display -->
    <div class="min-h-[400px]">
      {#if viewMode() === 'grid'}
        <!-- Grid View -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300"
        >
          {#each filteredMenuItems() as item (item.id)}
            <div class="transform transition-transform duration-200 hover:scale-[1.02]">
              <MenuItem {item} onAddToCart={handleAddToCart} />
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View -->
        <div class="space-y-4">
          {#each filteredMenuItems() as item (item.id)}
            <div class="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <img
                    src="/images/menu/{item.image}"
                    alt="{item.name} from Primos Pizza"
                    class="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                <div class="flex-grow">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold text-lg text-gray-900">{item.name}</h3>
                      <p class="text-sm text-gray-600 mb-2">{item.categoryName}</p>
                      <p class="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div class="text-right ml-4">
                      <p class="font-bold text-lg text-primos-blue-600">
                        ${item.basePrice || item.sizes?.[0]?.price || 0}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onclick={() => handleAddToCart(item)}
                        class="mt-2"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Enhanced Empty State -->
      {#if filteredMenuItems().length === 0}
        <div class="text-center py-16">
          <div class="mb-4">
            <span class="text-6xl">🍕</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {#if searchQuery().trim()}
              No items found for "{searchQuery()}"
            {:else if selectedCategory() !== "all"}
              No items in this category
            {:else}
              No menu items available
            {/if}
          </h3>
          <p class="text-gray-500 mb-6">
            {#if searchQuery().trim()}
              Try adjusting your search terms or browse our categories
            {:else}
              Check back later for more delicious options
            {/if}
          </p>
          <div class="space-x-4">
            {#if searchQuery().trim() || selectedCategory() !== "all"}
              <Button
                variant="primary"
                onclick={handleResetFilters}
              >
                Show All Items
              </Button>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
