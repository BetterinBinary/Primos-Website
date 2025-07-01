<script lang="ts">
  import { onMount } from "svelte";
  import MenuItem from "$lib/components/menu/MenuItem.svelte";
  import ListMenuItem from "$lib/components/menu/ListMenuItem.svelte";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MenuItemWithIgnore: any = MenuItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ListMenuItemWithIgnore: any = ListMenuItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SearchBarWithIgnore: any = SearchBar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ButtonWithIgnore: any = Button;

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

  function handleSearchInput(event: Event) {
    updateSearchQuery((event.target as HTMLInputElement).value);
  }

  function handleCategorySelect(categoryId: string) {
    selectCategory(categoryId);
  }

  function handleViewModeToggle() {
    setViewMode(viewMode() === 'grid' ? 'list' : 'grid');
  }

  function handleResetFilters() {
    resetFilters();
  }

  function handleSearch(query: string) {
    updateSearchQuery(query);
  }

  function isItemAvailable(item: any) {
    return item.available;
  }

  function getRestaurantName() {
    return (menuData() as any)?.restaurant?.name || 'Primos Pizza';
  }
</script>

<svelte:head>
  <title>Menu - Primos Pizza</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  {#if loading()}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primos-gold-500 mx-auto"></div>
      <p class="mt-4 text-white">Loading menu...</p>
    </div>
  {:else if error()}
    <div class="text-center py-12">
      <p class="text-red-600 text-lg">Error loading menu: {error()}</p>
      <button 
        class="mt-4 px-4 py-2 bg-primos-gold-500 text-primos-blue-900 rounded-lg hover:bg-primos-gold-600 font-medium"
        onclick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  {:else if menuData()}
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">
        {getRestaurantName()}
      </h1>
      <p class="text-primos-gold-500">Our signature hand-tossed pizzas and more</p>
      
      <!-- Cart Toggle Button -->
      <div class="mt-4">
        <ButtonWithIgnore
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
        </ButtonWithIgnore>
      </div>
    </header>

    <!-- Enhanced Search and Filter Controls -->
    <div class="mb-8 space-y-6">
      <!-- Search Bar with enhanced functionality -->
      <div class="max-w-2xl mx-auto">
        <SearchBarWithIgnore
          searchQuery={searchQuery()}
          placeholder="Search pizzas, appetizers, desserts..."
          onSearch={handleSearch}
          debounceMs={300}
          autofocus={false}
          showClearButton={true}
        />
      </div>

      <!-- View Controls and Stats -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <!-- View Mode Toggle -->
          <ButtonWithIgnore
            variant="outline"
            size="sm"
            class="!border-white !text-white hover:!bg-white hover:!text-primos-blue-500 focus:!ring-white"
            onclick={handleViewModeToggle}
          >
            {viewMode() === 'grid' ? '📋 List View' : '⊞ Grid View'}
          </ButtonWithIgnore>
          
          <!-- Reset Filters -->
          {#if selectedCategory() !== 'all' || searchQuery().trim()}
            <ButtonWithIgnore
              variant="ghost"
              size="sm"
              class="!text-white hover:!bg-white hover:!text-primos-blue-500 focus:!ring-white"
              onclick={handleResetFilters}
            >
              Clear Filters
            </ButtonWithIgnore>
          {/if}
        </div>
        
        <!-- Menu Stats -->
        <div class="text-sm text-white">
          Showing {menuStats().filteredItems} of {menuStats().totalItems} items
        </div>
      </div>

      <!-- Category Filter with improved design -->
      <div class="flex flex-wrap justify-center gap-2">
        <ButtonWithIgnore
          variant={selectedCategory() === 'all' ? 'secondary' : 'outline'}
          size="sm"
          class={selectedCategory() !== 'all' ? '!border-white !text-white hover:!bg-white hover:!text-primos-blue-500 focus:!ring-white' : ''}
          onclick={() => handleCategorySelect('all')}
        >
          All Items ({menuStats().totalItems})
        </ButtonWithIgnore>
        {#each availableCategories() as category}
          <ButtonWithIgnore
            variant={selectedCategory() === category.id ? 'secondary' : 'outline'}
            size="sm"
            class={selectedCategory() !== category.id ? '!border-white !text-white hover:!bg-white hover:!text-primos-blue-500 focus:!ring-white' : ''}
            onclick={() => handleCategorySelect(category.id)}
          >
            {category.name} ({category.items.filter(isItemAvailable).length})
          </ButtonWithIgnore>
        {/each}
      </div>
    </div>

    <!-- Enhanced Menu Display -->
    <div class="min-h-[400px]">
      {#if viewMode() === 'grid'}
        <!-- Grid View - Paper Menu Style -->
        <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-gray-300 rounded-lg overflow-hidden bg-[#F4F2EB]">
          {#each filteredMenuItems() as item, index (item.id)}
            <div class="relative border-r border-b border-gray-300 last:border-r-0 last:border-b-0 sm:last:border-r-0 sm:last:border-b-0 lg:last:border-r-0 lg:last:border-b-0 xl:last:border-r-0 xl:last:border-b-0">
              <MenuItemWithIgnore item={item} onAddToCart={handleAddToCart} />
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View -->
        <div class="max-w-6xl mx-auto bg-[#F4F2EB] border border-gray-300 overflow-hidden relative">
          <!-- Noise overlay -->
          <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none z-0"></div>
          <div class="relative z-10 divide-y divide-gray-300">
            {#each filteredMenuItems() as item (item.id)}
              <ListMenuItemWithIgnore item={item} onAddToCart={handleAddToCart} />
            {/each}
          </div>
        </div>
      {/if}

      <!-- Enhanced Empty State -->
      {#if filteredMenuItems().length === 0}
        <div class="text-center py-16">
          <div class="mb-4">
            <span class="text-6xl">🍕</span>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">
            {#if searchQuery().trim()}
              No items found for "{searchQuery()}"
            {:else if selectedCategory() !== "all"}
              No items in this category
            {:else}
              No menu items available
            {/if}
          </h3>
          <p class="text-primos-gold-500 mb-6">
            {#if searchQuery().trim()}
              Try adjusting your search terms or browse our categories
            {:else}
              Check back later for more delicious options
            {/if}
          </p>
          <div class="space-x-4">
            {#if searchQuery().trim() || selectedCategory() !== "all"}
              <ButtonWithIgnore
                variant="secondary"
                onclick={handleResetFilters}
              >
                Show All Items
              </ButtonWithIgnore>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>


