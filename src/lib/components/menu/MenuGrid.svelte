<script lang="ts">
  import MenuItemComponent from './MenuItem.svelte';
  import LoadingSpinner from '../ui/LoadingSpinner.svelte';
  import type { MenuItem, Size, Topping, AddOn } from '$lib/types/menu';
  
  interface Props {
    items?: MenuItem[];
    searchQuery?: string;
    selectedCategory?: string;
    loading?: boolean;
    onAddToCart: (item: MenuItem, options: {
      selectedSize: Size | null;
      selectedToppings: Topping[];
      selectedAddOns: AddOn[];
      selectedOptions: string[];
      quantity: number;
      specialInstructions: string;
    }) => void;
  }
  
  let { 
    items = [], 
    searchQuery = '',
    selectedCategory = '',
    loading = false,
    onAddToCart 
  }: Props = $props();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MenuItemWithIgnore: any = MenuItemComponent;

  // Filter items based on search query and category
  const filteredItems = $derived(() => {
    let filtered = items;
    
    // Filter by category if selected
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.allergens && item.allergens.some((allergen: string) => 
          allergen.toLowerCase().includes(query)
        ))
      );
    }
    
    // Only show available items
    return filtered.filter(item => item.available);
  });

  // Group items by category for better organization
  const groupedItems = $derived(() => {
    const groups = new Map<string, MenuItem[]>();
    
    filteredItems().forEach((item: MenuItem) => {
      if (!groups.has(item.category)) {
        groups.set(item.category, []);
      }
      groups.get(item.category)!.push(item);
    });
    
    return groups;
  });

  // Calculate grid columns based on number of items
  const gridCols = $derived(() => {
    const itemCount = filteredItems().length;
    if (itemCount === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (itemCount === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  });
</script>

<section class="menu-grid py-8">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>
  {:else if filteredItems().length === 0}
    <!-- Empty state -->
    <div class="text-center py-12">
      <div class="mb-4">
        <span class="text-6xl text-primos-gold-500">🍽️</span>
      </div>
      
      {#if searchQuery.trim()}
        <h3 class="text-xl font-semibold text-white mb-2">
          No items found
        </h3>
        <p class="text-primos-gold-500 mb-4">
          No menu items match "<strong>{searchQuery}</strong>"
          {#if selectedCategory && selectedCategory !== 'all'}
            in the {selectedCategory} category
          {/if}
        </p>
        <button
          class="text-primos-gold-500 hover:text-white font-medium px-4 py-2 border border-primos-gold-500 rounded-lg hover:bg-primos-gold-500 transition-colors duration-200"
          onclick={() => {
            searchQuery = '';
            selectedCategory = 'all';
          }}
        >
          Clear filters
        </button>
      {:else if selectedCategory && selectedCategory !== 'all'}
        <h3 class="text-xl font-semibold text-white mb-2">
          No items available
        </h3>
        <p class="text-primos-gold-500 mb-4">
          No items are currently available in the {selectedCategory} category
        </p>
      {:else}
        <h3 class="text-xl font-semibold text-white mb-2">
          No items available
        </h3>
        <p class="text-primos-gold-500">
          Please check back later for menu updates
        </p>
      {/if}
    </div>
  {:else}
    <!-- Menu items grid -->
    {#if selectedCategory === 'all' || !selectedCategory}
      <!-- Show grouped by categories when viewing all -->
      {#each [...groupedItems().entries()] as [category, categoryItems]}
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-6 capitalize">
            {category.replace('-', ' ')}
          </h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-gray-300 overflow-hidden bg-[#F4F2EB] mb-8 mx-4">
            {#each categoryItems as item (item.id)}
              <div class="relative border-r border-b border-gray-300 last:border-r-0 last:border-b-0 sm:last:border-r-0 sm:last:border-b-0 lg:last:border-r-0 lg:last:border-b-0 xl:last:border-r-0 xl:last:border-b-0">
                <MenuItemWithIgnore item={item} onAddToCart={onAddToCart} />
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {:else}
      <!-- Show flat grid when viewing specific category -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-gray-300 overflow-hidden bg-[#F4F2EB] mx-4">
        {#each filteredItems() as item (item.id)}
          <div class="relative border-r border-b border-gray-300 last:border-r-0 last:border-b-0 sm:last:border-r-0 sm:last:border-b-0 lg:last:border-r-0 lg:last:border-b-0 xl:last:border-r-0 xl:last:border-b-0">
            <MenuItemWithIgnore item={item} onAddToCart={onAddToCart} />
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Results count -->
    <div class="mt-8 text-center">
      <p class="text-sm text-white">
        Showing {filteredItems().length} 
        {filteredItems().length === 1 ? 'item' : 'items'}
        {#if searchQuery.trim()}
          matching "{searchQuery}"
        {/if}
        {#if selectedCategory && selectedCategory !== 'all'}
          in {selectedCategory}
        {/if}
      </p>
    </div>
  {/if}
</section>

<style>
  .menu-grid {
    @apply container mx-auto px-4;
  }
  
  /* Ensure consistent card heights in grid */
  .grid > * {
    @apply flex;
  }
  
  .grid > * > :global(.menu-item) {
    @apply flex-1;
  }
</style>