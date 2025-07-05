<!--
  Enhanced Background Component for Primos Pizza Website
  
  Uses @sveltejs/enhanced-img for optimized background textures:
  - Automatic WebP/AVIF generation
  - Responsive image loading
  - Performance optimization for repeated patterns
-->

<script>
  // Import enhanced images for static assets
  import backgroundImg from '../../../static/background.png?enhanced';
  import noiseImg from '../../../static/noise.png?enhanced';
  
  export let type = 'background'; // 'background' | 'noise'
  export let className = '';
  export let opacity = type === 'noise' ? 0.15 : 1;
  export let mixBlendMode = type === 'noise' ? 'mix-blend-multiply' : 'normal';
  
  // Select the appropriate enhanced image
  $: enhancedImg = type === 'noise' ? noiseImg : backgroundImg;
</script>

<!-- Enhanced background with automatic optimization -->
<div 
  class="enhanced-background {className}"
  style:background-image="url({enhancedImg.sources.webp?.[0]?.src || enhancedImg.sources.fallback?.src || enhancedImg.img.src})"
  style:opacity={opacity}
  style:mix-blend-mode={mixBlendMode}
  role="presentation"
  aria-hidden="true"
></div>

<style>
  .enhanced-background {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    pointer-events: none;
    z-index: 0;
  }
  
  /* Optimize for repeated patterns like noise */
  .enhanced-background {
    background-size: auto;
    background-repeat: repeat;
  }
  
  /* Performance optimizations */
  .enhanced-background {
    will-change: auto;
    transform: translateZ(0); /* Create compositing layer */
  }
  
  /* Ensure proper stacking */
  .enhanced-background {
    z-index: -1;
  }
</style>