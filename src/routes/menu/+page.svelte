<script>
  import MenuItem from "$lib/components/menu/MenuItem.svelte";
  import MenuCategory from "$lib/components/menu/MenuCategory.svelte";
  import menuData from "$lib/data/menu.json";

  let searchQuery = $state("");
  let selectedCategory = $state("all");
  let viewMode = $state("grid"); // "grid" or "categories"

  // Get all items from all categories
  const allItems = menuData.categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryId: category.id,
      categoryName: category.name,
    }))
  );

  // Filter items based on search and category
  const filteredItems = $derived(() => {
    let items = allItems;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  });

  // Get filtered categories for category view
  const filteredCategories = $derived(() => {
    if (searchQuery.trim() || selectedCategory !== "all") {
      // If there's a search or category filter, use filtered items grouped back into categories
      const categoryMap = new Map();

      filteredItems().forEach((item) => {
        if (!categoryMap.has(item.categoryId)) {
          const originalCategory = menuData.categories.find(
            (c) => c.id === item.categoryId
          );
          categoryMap.set(item.categoryId, {
            ...originalCategory,
            items: [],
          });
        }
        categoryMap.get(item.categoryId).items.push(item);
      });

      return Array.from(categoryMap.values()).sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
    } else {
      // Show all categories
      return menuData.categories.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
    }
  });

  function addToCart(item) {
    console.log("Adding to cart:", item);
    // TODO: Implement cart functionality
  }
</script>

<svelte:head>
  <title>Menu - Primos Pizza</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">
      {menuData.restaurant.name}
    </h1>
    <p class="text-gray-600">{menuData.restaurant.description}</p>
  </header>

  <!-- Search and Category Filter -->
  <div class="mb-8 space-y-4">
    <!-- Search Bar -->
    <div>
      <input
        type="text"
        placeholder="Search menu items..."
        bind:value={searchQuery}
        class="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primos-red-500 focus:border-transparent"
      />
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap justify-center gap-2">
      <button
        class="px-4 py-2 rounded-lg transition-colors {selectedCategory ===
        'all'
          ? 'bg-primos-red-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
        on:click={() => (selectedCategory = "all")}
      >
        All Items
      </button>
      {#each menuData.categories as category}
        <button
          class="px-4 py-2 rounded-lg transition-colors {selectedCategory ===
          category.id
            ? 'bg-primos-red-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
          on:click={() => (selectedCategory = category.id)}
        >
          {category.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Results Info -->
  <div class="text-center mb-6">
    <p class="text-gray-600">
      Showing {filteredItems().length} item{filteredItems().length !== 1
        ? "s"
        : ""}
      {#if selectedCategory !== "all"}
        from {menuData.categories.find((c) => c.id === selectedCategory)?.name}
      {/if}
    </p>
  </div>

  <!-- Menu Grid -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    {#each filteredItems() as item (item.id)}
      <MenuItem {item} onAddToCart={addToCart} />
    {/each}
  </div>

  {#if filteredItems().length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500 text-lg">
        {#if searchQuery.trim()}
          No menu items found matching "{searchQuery}"
        {:else}
          No items available in this category
        {/if}
      </p>
      <div class="mt-4 space-x-4">
        {#if searchQuery.trim()}
          <button
            class="mt-4 text-primos-red-600 hover:text-primos-red-700"
            onclick={() => (searchQuery = "")}
          >
            Clear search
          </button>
        {/if}
        {#if selectedCategory !== "all"}
          <button
            class="text-primos-red-600 hover:text-primos-red-700"
            on:click={() => (selectedCategory = "all")}
          >
            Show all categories
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
