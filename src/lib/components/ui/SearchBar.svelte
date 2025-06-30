<script lang="ts">
  interface Props {
    searchQuery?: string;
    placeholder?: string;
    debounceMs?: number;
    onSearch?: (query: string) => void;
    autofocus?: boolean;
    showClearButton?: boolean;
  }

  let { 
    searchQuery = '',
    placeholder = 'Search menu items...',
    debounceMs = 300,
    onSearch,
    autofocus = false,
    showClearButton = true
  }: Props = $props();

  let searchInput: HTMLInputElement;
  let debounceTimer: ReturnType<typeof setTimeout>;
  let internalQuery = $state(searchQuery);
  let isFocused = $state(false);

  // Debounced search effect - watches internalQuery changes
  $effect(() => {
    console.log('🔍 SearchBar: internalQuery changed to:', internalQuery);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new debounced callback for user input
    debounceTimer = setTimeout(() => {
      console.log('⏰ SearchBar: Debounce complete, calling onSearch with:', internalQuery);
      if (onSearch) {
        onSearch(internalQuery);
        console.log('✅ SearchBar: onSearch callback executed');
      } else {
        console.log('❌ SearchBar: No onSearch callback provided');
      }
    }, debounceMs);
  });

  function clearSearch() {
    internalQuery = '';
    if (searchInput) {
      searchInput.focus();
    }
    if (onSearch) {
      onSearch('');
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      clearSearch();
    }
  }

  function handleFocus() {
    isFocused = true;
  }

  function handleBlur() {
    isFocused = false;
  }
</script>

<div class="search-bar-container">
  <div class="relative">
    <!-- Search input -->
    <div class="relative">
      <!-- Search icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          class="h-5 w-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input field -->
      <input
        bind:this={searchInput}
        bind:value={internalQuery}
        type="text"
        {placeholder}
        {autofocus}
        onkeydown={handleKeydown}
        onfocus={handleFocus}
        onblur={handleBlur}
        class="search-input"
        class:focused={isFocused}
        class:has-content={internalQuery.length > 0}
      />

      <!-- Clear button -->
      {#if showClearButton && internalQuery.length > 0}
        <button
          type="button"
          onclick={clearSearch}
          class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <svg 
            class="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      {/if}
    </div>

    <!-- Search suggestions (if query is provided but could be enhanced) -->
    {#if internalQuery.length > 0 && isFocused}
      <div class="search-suggestions">
        <div class="px-3 py-2 text-xs text-gray-500 border-b">
          Search tips:
        </div>
        <div class="px-3 py-2 text-sm text-gray-600">
          • Try searching by item name, ingredient, or dietary restriction
        </div>
        <div class="px-3 py-2 text-sm text-gray-600">
          • Use terms like "vegetarian", "spicy", or "gluten-free"
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .search-bar-container {
    @apply w-full max-w-md mx-auto;
  }

  .search-input {
    @apply w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
           text-gray-900 placeholder-gray-500
           focus:outline-none focus:ring-2 focus:ring-primos-red-500 focus:border-transparent
           transition-all duration-200 ease-in-out
           bg-white shadow-sm;
  }

  .search-input:hover {
    @apply border-gray-400 shadow-md;
  }

  .search-input.focused {
    @apply ring-2 ring-primos-red-500 border-transparent shadow-md;
  }

  .search-input.has-content {
    @apply pr-10;
  }

  .search-suggestions {
    @apply absolute top-full left-0 right-0 mt-1 
           bg-white border border-gray-200 rounded-lg shadow-lg
           z-10 max-h-48 overflow-y-auto;
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .search-bar-container {
      @apply max-w-none;
    }
    
    .search-input {
      @apply text-base; /* Prevent zoom on iOS */
    }
  }

  /* Focus-within for accessibility */
  .search-bar-container:focus-within .search-suggestions {
    @apply block;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .search-input {
      @apply border-2 border-gray-900;
    }
    
    .search-input:focus {
      @apply ring-4 ring-blue-600;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .search-input {
      @apply transition-none;
    }
  }
</style>