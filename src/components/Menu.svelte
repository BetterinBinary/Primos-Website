
<script>
  import { onMount } from 'svelte';
  
  // Menu image configuration with optimized responsive variants
  const menuImages = [
    {
      id: 1,
      name: 'Menu Page 1',
      hasDesktop: true,
      priority: true // First image should load with high priority
    },
    {
      id: 2,
      name: 'Menu Page 2', 
      hasDesktop: false, // Some images don't have desktop variants
      priority: false
    },
    {
      id: 3,
      name: 'Menu Page 3',
      hasDesktop: true,
      priority: false
    },
    {
      id: 4,
      name: 'Menu Page 4',
      hasDesktop: false,
      priority: false
    },
    {
      id: 5,
      name: 'Menu Page 5',
      hasDesktop: true,
      priority: false
    },
    {
      id: 6,
      name: 'Menu Page 6',
      hasDesktop: false,
      priority: false
    }
  ];
  
  // Group images into rows for desktop layout
  const imageRows = [
    [menuImages[0], menuImages[1]], // Row 1: Menu 1, 2
    [menuImages[2], menuImages[3]], // Row 2: Menu 3, 4
    [menuImages[4], menuImages[5]]  // Row 3: Menu 5, 6
  ];
  
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
  
  /**
   * Generate responsive image sources based on available variants
   * Uses original-size images for desktop to maintain maximum quality
   */
  function getImageSources(imageId, hasDesktop) {
    const base = `/optimized/primos-menu-${imageId}`;
    
    // WebP sources with enhanced responsive breakpoints
    // Use original-size variants for desktop instead of scaled versions
    const webpSrcset = hasDesktop 
      ? `${base}-mobile.webp 400w, ${base}-tablet.webp 768w, ${base}-original.webp 1200w`
      : `${base}-mobile.webp 400w, ${base}-tablet.webp 768w`;
    
    // PNG fallback sources (using original-size for desktop)
    const pngSrcset = hasDesktop
      ? `${base}-mobile.png 400w, ${base}-tablet.png 768w, ${base}-original.png 1200w`
      : `${base}-mobile.png 400w, ${base}-tablet.png 768w`;
    
    return { webpSrcset, pngSrcset, fallbackSrc: `${base}-mobile.png` };
  }
</script>

<div class="col-container">
  {#if isSmallScreen}
    <!-- Mobile: Single column layout with optimized images -->
    {#each menuImages as image, index (image.id)}
      {@const { webpSrcset, pngSrcset, fallbackSrc } = getImageSources(image.id, image.hasDesktop)}
      <picture class="menu-picture menu-mobile">
        <source
          srcset={webpSrcset}
          sizes="100vw"
          type="image/webp"
        />
        <img
          src={fallbackSrc}
          srcset={pngSrcset}
          sizes="100vw"
          alt="{image.name} - Primos Pizza Menu"
          loading={image.priority ? 'eager' : 'lazy'}
          fetchpriority={image.priority ? 'high' : 'auto'}
          decoding="async"
          class="menu menu-mobile"
        />
      </picture>
    {/each}
  {:else}
    <!-- Desktop: Two-column row layout with optimized images -->
    {#each imageRows as row, rowIndex}
      <div class="row-container">
        {#each row as image, colIndex (image.id)}
          {@const { webpSrcset, pngSrcset, fallbackSrc } = getImageSources(image.id, image.hasDesktop)}
          <picture class="menu-picture">
            <source
              srcset={webpSrcset}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              type="image/webp"
            />
            <img
              src={fallbackSrc}
              srcset={pngSrcset}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              alt="{image.name} - Primos Pizza Menu"
              loading={image.priority ? 'eager' : 'lazy'}
              fetchpriority={image.priority ? 'high' : 'auto'}
              decoding="async"
              class="menu"
            />
          </picture>
        {/each}
      </div>
    {/each}
  {/if}
</div>

<style>
  .menu {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .menu-mobile {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .menu-picture {
    display: block;
    width: 50%;
    flex: 1;
  }
  
  .menu-picture.menu-mobile {
    width: 100%;
  }
  
  .col-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .row-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0;
    padding: 0;
    gap: 2px;
  }
  
  /* Ensure responsive images scale properly */
  .menu,
  .menu-mobile {
    object-fit: contain;
    max-width: 100%;
  }
  
  /* Loading state improvements */
  img[loading="lazy"] {
    transition: opacity 0.3s ease;
  }
  
  /* Ensure images don't cause layout shift */
  .menu-picture {
    aspect-ratio: auto;
  }
  
  /* Performance: Will-change for smooth scrolling */
  @media (prefers-reduced-motion: no-preference) {
    .menu-picture {
      will-change: transform;
    }
  }
</style>
