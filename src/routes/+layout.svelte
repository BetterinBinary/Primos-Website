<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/layout/Header.svelte";
  import CartDrawer from "$lib/components/cart/CartDrawer.svelte";
  // @ts-ignore - SvelteKit 5 import issue
  import { page } from '$app/stores';

  // Determine current page for header navigation
  const currentPage = $derived(() => $page.route?.id?.split('/')[1] || 'home');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HeaderWithIgnore: any = Header;
</script>

<div class="min-h-screen bg-primos-blue-500 relative z-0">
  <!-- Noise overlay -->
  <div class="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-30 mix-blend-multiply"></div>
  
  <!-- Content wrapper -->
  <div class="relative z-10">
  <HeaderWithIgnore currentPage={currentPage()} />
  
  <main>
    <slot />
  </main>

  <!-- Cart Drawer - always present but only visible when isCartOpen is true -->
  <CartDrawer />
  </div>
</div>
