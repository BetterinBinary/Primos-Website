<script lang="ts">
  import { onMount } from 'svelte';
  import "../app.css";
  import Header from "$lib/components/layout/Header.svelte";
  import CartDrawer from "$lib/components/cart/CartDrawer.svelte";
  import { ENABLE_CART } from "$lib/config/features.js";
  // @ts-ignore - SvelteKit 5 import issue
  import { page } from '$app/stores';
  import { preloadCriticalImages, setupImagePerformanceMonitoring } from '$lib/utils/image-preloader.js';
  import { setupAutoAccessibility } from '$lib/utils/image-accessibility.js';

  // Determine current page for header navigation
  const currentPage = $derived(() => $page.route?.id?.split('/')[1] || 'home');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HeaderWithIgnore: any = Header;

  onMount(() => {
    // Initialize image performance monitoring
    setupImagePerformanceMonitoring();
    
    // Setup automatic accessibility enhancements
    setupAutoAccessibility();
    
    // Preload critical images for better performance
    preloadCriticalImages().then(preloader => {
      // Log preloader stats in development
      if (import.meta.env.DEV) {
        setTimeout(() => {
          console.log('🖼️ Image preloader stats:', preloader.getStats());
        }, 5000);
      }
    });
  });
</script>

<div class="min-h-screen bg-primos-blue-500 relative z-0">
  <!-- Optimized noise overlay with responsive sizing -->
  <div class="absolute inset-0 bg-[url('/optimized/noise-tile.webp')] bg-repeat opacity-30 mix-blend-multiply" style="background-size: 256px 256px;"></div>
  
  <!-- Content wrapper -->
  <div class="relative z-10">
  <HeaderWithIgnore currentPage={currentPage()} />
  
  <main>
    <slot></slot>
  </main>

  <!-- Cart Drawer - hidden when ordering disabled but preserved for future use -->
  {#if ENABLE_CART}
    <CartDrawer />
  {/if}
  </div>
</div>
