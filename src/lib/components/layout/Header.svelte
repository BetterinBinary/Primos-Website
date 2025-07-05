<script>
  import { slide } from 'svelte/transition';
  import { 
    cartSummary, 
    isCartOpen, 
    toggleCart 
  } from '$lib/stores/cart-store.svelte.js';
  import { CartIcon } from '$lib/components/icons/index.js';
  import { ENABLE_CART } from '$lib/config/features.js';

  let { currentPage = '' } = $props();
  let isMobileMenuOpen = $state(false);

  const navItems = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Menu', href: '/menu', id: 'menu' },
    { name: 'About', href: '/about', id: 'about' },
    { name: 'Contact', href: '/contact', id: 'contact' }
  ];

  // Get real-time cart item count from store
  const cartItemCount = $derived(() => cartSummary().itemCount);

  function handleCartToggle() {
    toggleCart();
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
</script>

<header class="bg-primos-blue-500 text-white shadow-lg relative z-50 sticky top-0">
  <div class="container mx-auto px-8">
    <nav class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <a href="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-primos-gold-500 rounded-full flex items-center justify-center">
            <span class="text-primos-blue-500 font-bold text-xl">P</span>
          </div>
          <span class="font-display text-xl font-bold">Primo's Pizza</span>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-8">
          {#each navItems as item}
            <a
              href={item.href}
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {
                currentPage === item.id
                  ? 'bg-primos-blue-700 text-white'
                  : 'text-primos-blue-100 hover:bg-primos-blue-600 hover:text-white'
              }"
              aria-current={currentPage === item.id ? 'page' : undefined}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>

      <!-- Cart and Mobile Menu -->
      <div class="flex items-center space-x-4">
        <!-- Cart Icon (hidden when ordering disabled) -->
        {#if ENABLE_CART}
          <button
            type="button"
            onclick={handleCartToggle}
            class="relative p-2 text-primos-blue-100 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primos-blue-500"
            aria-label="Shopping cart with {cartItemCount()} items"
          >
            <CartIcon class="w-6 h-6" size={24} />
            {#if cartItemCount() > 0}
              <span
                class="absolute -top-1 -right-1 bg-primos-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse"
              >
                {cartItemCount()}
              </span>
            {/if}
          </button>
        {/if}

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            type="button"
            onclick={toggleMobileMenu}
            class="bg-primos-blue-600 inline-flex items-center justify-center p-2 rounded-md text-primos-blue-100 hover:text-white hover:bg-primos-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primos-blue-600"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span class="sr-only">{isMobileMenuOpen ? 'Close' : 'Open'} main menu</span>
            {#if isMobileMenuOpen}
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    {#if isMobileMenuOpen}
      <div class="md:hidden" id="mobile-menu" transition:slide>
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {#each navItems as item}
            <a
              href={item.href}
              onclick={closeMobileMenu}
              class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {
                currentPage === item.id
                  ? 'bg-primos-blue-700 text-white'
                  : 'text-primos-blue-100 hover:bg-primos-blue-600 hover:text-white'
              }"
              aria-current={currentPage === item.id ? 'page' : undefined}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>

</header>