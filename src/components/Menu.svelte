
<script>
  import { onMount } from 'svelte';
  
  // Image data array
  const imageRows = [[1, 2], [3, 4], [5, 6]];
  
  // State for tracking window width
  let windowWidth;
  
  // Function to handle window resize
  function handleResize() {
    windowWidth = window.innerWidth;
  }
  
  // Set up resize listener when component mounts
  onMount(() => {
    windowWidth = window.innerWidth;
    window.addEventListener('resize', handleResize);
    
    // Clean up when component is destroyed
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  // Determine if we're on a small screen (e.g., mobile)
  $: isSmallScreen = windowWidth < 768;
</script>

<div class="col-container">
  {#if isSmallScreen}
    <!-- Small screen: display all images in a single column -->
    {#each imageRows as row}
      {#each row as image}
        <img src="primos-menu-{image}.png" class="menu menu-mobile" alt="Menu item {image}">
      {/each}
    {/each}
  {:else}
    <!-- Large screen: display images in rows of two -->
    {#each imageRows as row}
      <div class="row-container">
        <img src="primos-menu-{row[0]}.png" class="menu" alt="Menu item {row[0]}">
        <img src="primos-menu-{row[1]}.png" class="menu" alt="Menu item {row[1]}">
      </div>
    {/each}
  {/if}
</div>

<style>
  .menu {
    width: 50%;
  }
  
  .menu-mobile {
    width: 100%;
  }
  
  .col-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin: 0;
  }
  
  .row-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0;
  }
</style>
