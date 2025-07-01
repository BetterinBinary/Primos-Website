<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import type { CombinationPlateMenuItem, CombinationPlateOptions } from '$lib/types/menu';

  interface Props {
    item: CombinationPlateMenuItem;
    selectedOptions: CombinationPlateOptions;
    quantity: number;
    onOptionsChange: (options: CombinationPlateOptions) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedOptions,
    quantity,
    onOptionsChange,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available cooking preferences for proteins
  const cookingPreferences = [
    { value: 'regular', label: 'Regular Cooking', description: 'Standard preparation for all proteins' },
    { value: 'well-done', label: 'Well Done', description: 'All proteins cooked longer' },
    { value: 'extra-crispy', label: 'Extra Crispy', description: 'Fried items cooked extra crispy' }
  ];

  // Available side substitutions
  const availableSideSubstitutions = [
    'Substitute Onion Rings for Fries (+$1.50)',
    'Substitute Deep Fried Mushrooms for Fries (+$1.50)',
    'Extra Slaw (Half Pint) (+$1.00)',
    'Extra Rolls (+$0.50)',
    'No Slaw',
    'No Fries'
  ];

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const totalPrice = $derived(() => {
    return basePrice() * quantity;
  });

  const getCombinationDisplayName = $derived(() => {
    const combinationNames = {
      'ribs-chicken': 'Ribs & Chicken',
      'ribs-shrimp': 'Ribs & Shrimp',
      'chicken-fish': 'Chicken & Fish',
      'ribs-fish': 'Ribs & Fish',
      'shrimp-frog-legs': 'Shrimp & Frog Legs',
      'primo-smorgasbord': 'Primo Smorgasbord'
    };
    return combinationNames[item.combinationType] || item.name;
  });

  const getCombinationDescription = $derived(() => {
    const descriptions = {
      'ribs-chicken': 'Tender BBQ ribs paired with our famous broasted chicken',
      'ribs-shrimp': 'BBQ ribs and crispy fried shrimp - surf and turf perfection',
      'chicken-fish': 'Classic combination of broasted chicken and fresh fish',
      'ribs-fish': 'BBQ ribs and fish - a hearty land and sea combination',
      'shrimp-frog-legs': 'Premium fried shrimp and tender frog legs',
      'primo-smorgasbord': 'The ultimate feast: chicken, shrimp, ribs, and frog legs'
    };
    return descriptions[item.combinationType] || item.description;
  });

  const getProteinDetails = $derived(() => {
    const proteinDetails = {
      'ribs-chicken': ['BBQ Ribs (3-4 bones)', 'Broasted Chicken (2-3 pieces)'],
      'ribs-shrimp': ['BBQ Ribs (3-4 bones)', 'Fried Shrimp (6-8 pieces)'],
      'chicken-fish': ['Broasted Chicken (2-3 pieces)', 'Fresh Fish (1 fillet)'],
      'ribs-fish': ['BBQ Ribs (3-4 bones)', 'Fresh Fish (1 fillet)'],
      'shrimp-frog-legs': ['Fried Shrimp (6-8 pieces)', 'Frog Legs (4-6 pieces)'],
      'primo-smorgasbord': ['Broasted Chicken (2 pieces)', 'Fried Shrimp (4-6 pieces)', 'BBQ Ribs (2-3 bones)', 'Frog Legs (3-4 pieces)']
    };
    return proteinDetails[item.combinationType] || item.proteins || [];
  });

  function handleCookingPreferenceChange(preference: string) {
    const newOptions = { ...selectedOptions, cookingPreference: preference };
    onOptionsChange(newOptions);
  }

  function handleSideSubstitutionToggle(substitution: string) {
    const currentSubs = selectedOptions.sideSubstitutions || [];
    let newSubs: string[];
    
    if (currentSubs.includes(substitution)) {
      newSubs = currentSubs.filter(s => s !== substitution);
    } else {
      newSubs = [...currentSubs, substitution];
    }
    
    const newOptions = { ...selectedOptions, sideSubstitutions: newSubs };
    onOptionsChange(newOptions);
  }

  function isSubstitutionSelected(substitution: string): boolean {
    return selectedOptions.sideSubstitutions?.includes(substitution) || false;
  }
</script>

<div class="combination-plates-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Combination Info -->
  <div class="bg-purple-50 rounded-lg p-3">
    <h4 class="font-medium text-purple-900 mb-1">Combination Plate</h4>
    <p class="text-sm text-purple-800 font-medium">{getCombinationDisplayName()}</p>
    <p class="text-sm text-purple-700">{getCombinationDescription()}</p>
  </div>

  <!-- Protein Details -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">What's Included</h4>
    <div class="bg-gray-50 rounded-lg p-3">
      <div class="grid grid-cols-1 gap-2">
        {#each getProteinDetails() as protein}
          <div class="flex items-center">
            <span class="w-2 h-2 bg-primos-red-600 rounded-full mr-3"></span>
            <span class="text-sm text-gray-700">{protein}</span>
          </div>
        {/each}
      </div>
      
      {#if item.includes && item.includes.length > 0}
        <hr class="my-3 border-gray-200" />
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">Served with:</p>
          <div class="grid grid-cols-2 gap-1">
            {#each item.includes as included}
              <div class="flex items-center">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                <span class="text-xs text-gray-600">{included}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Cooking Preferences -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Cooking Preference</h4>
    <div class="space-y-3">
      {#each cookingPreferences as preference}
        <label class="flex items-start cursor-pointer">
          <input
            type="radio"
            name="cooking-preference"
            value={preference.value}
            checked={selectedOptions.cookingPreference === preference.value}
            onchange={() => handleCookingPreferenceChange(preference.value)}
            class="mr-3 mt-1 text-primos-red-600 focus:ring-primos-red-500"
          />
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-700">{preference.label}</span>
            <p class="text-xs text-gray-500">{preference.description}</p>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Side Substitutions -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Side Substitutions & Extras</h4>
    <div class="space-y-2">
      {#each availableSideSubstitutions as substitution}
        <label class="flex items-center justify-between cursor-pointer">
          <div class="flex items-center">
            <input
              type="checkbox"
              checked={isSubstitutionSelected(substitution)}
              onchange={() => handleSideSubstitutionToggle(substitution)}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <span class="text-sm text-gray-700">{substitution}</span>
          </div>
          {#if substitution.includes('(+')}
            <span class="text-xs text-primos-red-600 font-medium">
              {substitution.match(/\(\+[^)]+\)/)?.[0] || ''}
            </span>
          {/if}
        </label>
      {/each}
    </div>
    {#if selectedOptions.sideSubstitutions && selectedOptions.sideSubstitutions.length > 0}
      <p class="text-xs text-gray-500 mt-2">
        Selected: {selectedOptions.sideSubstitutions.join(', ')}
      </p>
    {/if}
  </div>

  <!-- Special Notes -->
  <div class="bg-amber-50 rounded-lg p-3">
    <h5 class="font-medium text-amber-900 mb-2">🍽️ Combination Notes</h5>
    <ul class="text-sm text-amber-800 space-y-1">
      <li>• All proteins are cooked fresh to order</li>
      <li>• Allow extra time for combination plates</li>
      <li>• Perfect for sharing or hearty appetites</li>
      {#if item.combinationType === 'primo-smorgasbord'}
        <li>• Primo Smorgasbord serves 2-3 people</li>
      {/if}
    </ul>
  </div>

  <!-- Quantity Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Quantity</h4>
    <div class="flex items-center space-x-3">
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        onclick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        -
      </button>
      <span class="w-8 text-center font-medium">{quantity}</span>
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        onclick={() => onQuantityChange(quantity + 1)}
      >
        +
      </button>
    </div>
  </div>

  <!-- Price Summary -->
  <div class="bg-[#F4F2EB] rounded-lg p-3 relative overflow-hidden">
    <!-- Noise overlay -->
    <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
    <!-- Content wrapper -->
    <div class="relative z-10">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">{getCombinationDisplayName()} × {quantity}</span>
        <span class="text-sm text-gray-900">${(basePrice() * quantity).toFixed(2)}</span>
      </div>
      <hr class="my-2 border-gray-200" />
      <div class="flex justify-between items-center font-medium">
        <span class="text-gray-900">Total</span>
        <span class="text-lg text-primos-red-600">${totalPrice().toFixed(2)}</span>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex space-x-3">
    <Button
      variant="primary"
      class="flex-1"
      onclick={onAddToCart}
    >
      Add to Cart - ${totalPrice().toFixed(2)}
    </Button>
    <Button
      variant="ghost"
      class="flex-1"
      onclick={onCancel}
    >
      Cancel
    </Button>
  </div>
</div>

<style>
  .combination-plates-customizer {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>