<script lang="ts">
  import type { Snippet } from 'svelte';

  type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
  type ButtonType = 'button' | 'submit' | 'reset';

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    href?: string | null;
    type?: ButtonType;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    children: Snippet;
  }

  let { 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    loading = false,
    href = null,
    type = 'button',
    class: className = '',
    onclick = null,
    children
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primos-blue-500 text-white hover:bg-primos-blue-600 focus:ring-primos-blue-500',
    secondary: 'bg-primos-gold-500 text-primos-blue-900 hover:bg-primos-gold-600 focus:ring-primos-gold-500',
    danger: 'bg-primos-red-600 text-white hover:bg-primos-red-700 focus:ring-primos-red-500',
    outline: 'border-2 border-primos-blue-500 text-primos-blue-500 hover:bg-primos-blue-500 hover:text-white focus:ring-primos-blue-500',
    ghost: 'text-primos-blue-500 hover:bg-primos-blue-50 focus:ring-primos-blue-500'
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  function handleClick(event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    if (onclick) {
      onclick(event);
    }
  }
</script>

{#if href}
  <a 
    {href}
    class={classes}
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled}
    onclick={handleClick}
  >
    {#if loading}
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children()}
  </a>
{:else}
  <button
    {type}
    class={classes}
    {disabled}
    onclick={handleClick}
  >
    {#if loading}
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children()}
  </button>
{/if}