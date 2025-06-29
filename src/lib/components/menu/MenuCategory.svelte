<script lang="ts">
  import MenuItem from './MenuItem.svelte';
  import type { MenuCategory, MenuItem as MenuItemType } from '$lib/types/menu';
  
  interface Props {
    category: MenuCategory;
    onAddToCart: (item: MenuItemType) => void;
  }
  
  let { category, onAddToCart }: Props = $props();
</script>

<section class="mb-12">
  <!-- Category Header -->
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-3">{category.name}</h2>
    <p class="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
  </div>

  <!-- Category Items Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each category.items as item (item.id)}
      <MenuItem {item} {onAddToCart} />
    {/each}
  </div>

  {#if category.items.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-500">No items available in this category at the moment.</p>
    </div>
  {/if}
</section>
