<script>
  import MenuItem from "$lib/components/menu/MenuItem.svelte";
  import menuData from "$lib/data/menu.json";

  let searchQuery = $state("");
  let selectedCategory = $state("all");

  // Get all items from all categories
  const allItems = menuData.categories.flatMap(category => 
    category.items.map(item => ({ ...item, categoryId: category.id, categoryName: category.name }))
  );

  // Filter items based on search and category
  const filteredItems = $derived(() => {
    let items = allItems;
    
    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter(item => item.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items;
  });

  function addToCart(item) {
    console.log("Adding to cart:", item);
    // TODO: Implement cart functionality
  }
</script>

<svelte:head>
  <title>Menu - Primos Pizza</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 bg-red-500">
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">{pizzaData.name}</h1>
    <p class="text-gray-600">{pizzaData.description}</p>
  </header>

  <!-- Search Bar -->
  <div class="mb-6">
    <input
      type="text"
      placeholder="Search menu items..."
      bind:value={searchQuery}
      class="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primos-red-500 focus:border-transparent"
    />
  </div>

  <!-- Menu Grid -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    {#each filteredItems as item (item.id)}
      <MenuItem {item} onAddToCart={addToCart} />
    {/each}
  </div>

  {#if filteredItems.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500 text-lg">
        No menu items found matching "{searchQuery}"
      </p>
      <button
        class="mt-4 text-primos-red-600 hover:text-primos-red-700"
        on:click={() => (searchQuery = "")}
      >
        Clear search
      </button>
    </div>
  {/if}
</div>
