<script lang="ts">
  interface Props {
    class?: string;
    size?: number;
  }
  
  let { class: className = '', size = 24 }: Props = $props();
</script>

<svg 
  class={className}
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  aria-hidden="true"
>
  <!-- Grid: 2x2 squares layout -->
  <rect x="3" y="3" width="7" height="7" />
  <rect x="14" y="3" width="7" height="7" />
  <rect x="3" y="14" width="7" height="7" />
  <rect x="14" y="14" width="7" height="7" />
</svg>