<script>
  let { 
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    label = '',
    error = '',
    disabled = false,
    required = false,
    class: className = '',
    id = '',
    name = ''
  } = $props();

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primos-blue-500 focus:border-primos-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error 
      ? 'border-primos-red-500 focus:ring-primos-red-500 focus:border-primos-red-500' 
      : 'border-gray-300'
    }
    ${className}
  `;
</script>

<div class="space-y-1">
  {#if label}
    <label 
      for={inputId}
      class="block text-sm font-medium text-gray-700"
      class:text-primos-red-700={error}
    >
      {label}
      {#if required}
        <span class="text-primos-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}

  {#if type === 'textarea'}
    <textarea
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      bind:value
      class={inputClasses}
      rows="4"
      aria-describedby={error ? `${inputId}-error` : undefined}
      aria-invalid={error ? 'true' : 'false'}
    ></textarea>
  {:else if type === 'select'}
    <select
      {id}
      {name}
      {disabled}
      {required}
      bind:value
      class={inputClasses}
      aria-describedby={error ? `${inputId}-error` : undefined}
      aria-invalid={error ? 'true' : 'false'}
    >
      <option value="" disabled>{placeholder || 'Select an option'}</option>
      <slot></slot>
    </select>
  {:else}
    <input
      {type}
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      bind:value
      class={inputClasses}
      aria-describedby={error ? `${inputId}-error` : undefined}
      aria-invalid={error ? 'true' : 'false'}
    />
  {/if}

  {#if error}
    <p 
      id="{inputId}-error"
      class="text-sm text-primos-red-600"
      role="alert"
    >
      {error}
    </p>
  {/if}
</div>