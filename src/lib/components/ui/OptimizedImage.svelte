<!--
  OptimizedImage Component for Primos Pizza Website
  
  A performance-optimized image component that provides:
  - Lazy loading with intersection observer
  - Proper fallback handling for missing images
  - Loading states and error handling
  - Accessibility improvements
  - Performance monitoring
-->

<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Props {
    src: string;
    alt: string;
    class?: string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
    placeholder?: string;
    fallback?: string;
  }
  
  let {
    src,
    alt,
    class: className = '',
    loading = 'lazy',
    priority = false,
    placeholder = '🍕',
    fallback = '/images/placeholder-food.png'
  }: Props = $props();
  
  let imageElement: HTMLImageElement;
  let imageState = $state<'loading' | 'loaded' | 'error' | 'placeholder'>('loading');
  let currentSrc = $state(src);
  let intersectionObserver: IntersectionObserver | undefined;
  
  /**
   * Handle successful image load
   */
  function handleLoad() {
    imageState = 'loaded';
  }
  
  /**
   * Handle image load error - try fallback if available
   */
  function handleError() {
    if (currentSrc !== fallback && fallback) {
      console.warn(`Failed to load image: ${currentSrc}, trying fallback: ${fallback}`);
      currentSrc = fallback;
      imageState = 'loading';
    } else {
      console.warn(`Failed to load image and fallback: ${currentSrc}`);
      imageState = 'error';
    }
  }
  
  /**
   * Set up intersection observer for performance monitoring
   */
  onMount(() => {
    if (loading === 'lazy' && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Image is visible, start performance timing
              const startTime = performance.now();
              
              const handleLoadComplete = () => {
                const loadTime = performance.now() - startTime;
                
                // Log performance data for monitoring (can be sent to analytics)
                if (loadTime > 1000) {
                  console.warn(`Slow image load detected: ${src} (${loadTime.toFixed(0)}ms)`);
                }
                
                imageElement.removeEventListener('load', handleLoadComplete);
                imageElement.removeEventListener('error', handleLoadComplete);
              };
              
              imageElement.addEventListener('load', handleLoadComplete);
              imageElement.addEventListener('error', handleLoadComplete);
              
              // Stop observing once visible
              intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        { 
          rootMargin: '50px', // Start loading 50px before visible
          threshold: 0.1 
        }
      );
      
      if (imageElement) {
        intersectionObserver.observe(imageElement);
      }
    }
    
    return () => {
      intersectionObserver?.disconnect();
    };
  });
</script>

<!-- Image container with loading states -->
<div class=\"optimized-image-container {className}\" role=\"img\" aria-label={alt}>
  {#if imageState === 'loading'}
    <!-- Loading state -->
    <div class=\"image-loading\" aria-hidden=\"true\">
      <div class=\"loading-placeholder\">
        <span class=\"loading-emoji\">{placeholder}</span>
        <div class=\"loading-spinner\"></div>
      </div>
    </div>
  {/if}
  
  {#if imageState === 'error'}
    <!-- Error state with fallback -->
    <div class=\"image-error\" aria-hidden=\"true\">
      <span class=\"error-emoji\">🍕</span>
      <span class=\"error-text\">Image unavailable</span>
    </div>
  {:else}
    <!-- Actual image with optimized loading -->
    <img
      bind:this={imageElement}
      src={currentSrc}
      {alt}
      {loading}
      fetchpriority={priority ? 'high' : 'auto'}
      decoding=\"async\"
      class=\"optimized-image {imageState === 'loaded' ? 'loaded' : ''}\"
      on:load={handleLoad}
      on:error={handleError}
    />
  {/if}
</div>

<style>
  .optimized-image-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .optimized-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .optimized-image.loaded {
    opacity: 1;
  }
  
  .image-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
  }
  
  .loading-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }
  
  .loading-emoji {
    font-size: 2rem;
    opacity: 0.6;
  }
  
  .loading-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1rem;
    text-align: center;
    color: #6b7280;
  }
  
  .error-emoji {
    font-size: 1.5rem;
    opacity: 0.5;
  }
  
  .error-text {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .optimized-image {
      transition: none;
    }
    
    .loading-spinner {
      animation: none;
      border-top-color: #9ca3af;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .optimized-image-container {
      border: 1px solid #374151;
    }
    
    .loading-spinner {
      border-color: currentColor;
      border-top-color: transparent;
    }
  }
</style>