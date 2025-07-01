<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import type { AppetizerMenuItem, CookingPreference, DippingSauce } from '$lib/types/menu';

  interface Props {
    item: AppetizerMenuItem;
    selectedCookingPreference: CookingPreference;
    selectedDippingSauces: DippingSauce[];
    quantity: number;
    onCookingPreferenceChange: (preference: CookingPreference) => void;
    onDippingSauceToggle: (sauce: DippingSauce) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedCookingPreference,
    selectedDippingSauces,
    quantity,
    onCookingPreferenceChange,
    onDippingSauceToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Get available dipping sauces from category data
  const availableDippingSauces = $derived(() => {
    if (!item.availableDippingSauces) return [];
    
    // This would normally come from the menu store/category data
    const allSauces: DippingSauce[] = [
      { id: 'ranch', name: 'Ranch', category: 'creamy', available: true },
      { id: 'marinara', name: 'Marinara', category: 'tangy', available: true },
      { id: 'garlic-butter', name: 'Garlic Butter', category: 'creamy', available: true },
      { id: 'cheese-sauce', name: 'Cheese Sauce', category: 'creamy', available: true, extraCost: 0.50 },
      { id: 'buffalo', name: 'Buffalo Sauce', category: 'spicy', available: true },
      { id: 'bbq', name: 'BBQ Sauce', category: 'sweet', available: true },
      { id: 'honey-mustard', name: 'Honey Mustard', category: 'sweet', available: true }
    ];
    
    return allSauces.filter(sauce => 
      item.availableDippingSauces?.some(availableSauce => availableSauce.id === sauce.id)
    );
  });

  const totalExtraCost = $derived(() => {
    return selectedDippingSauces.reduce((sum, sauce) => 
      sum + (sauce.extraCost || 0), 0
    );
  });

  const totalPrice = $derived(() => {
    const basePrice = item.basePrice || 0;
    const extraCost = totalExtraCost();
    return (basePrice * quantity) + extraCost;
  });

  function handleDippingSauceChange(sauce: DippingSauce, checked: boolean) {
    if (checked) {
      onDippingSauceToggle(sauce);
    } else {
      onDippingSauceToggle(sauce);
    }
  }

  function isSauceSelected(sauce: DippingSauce): boolean {
    return selectedDippingSauces.some(s => s.id === sauce.id);
  }
</script>

<div class="appetizer-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Cooking Preferences -->
  {#if item.availableCookingPreferences && item.availableCookingPreferences.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Cooking Preference</h4>
      <div class="space-y-2">
        {#each item.availableCookingPreferences as preference}
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="cooking-preference"
              value={preference}
              checked={selectedCookingPreference === preference}
              onchange={() => onCookingPreferenceChange(preference)}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <span class="text-sm text-gray-700 capitalize">
              {preference === 'well-done' ? 'Well Done' : 
               preference === 'extra-crispy' ? 'Extra Crispy' :
               preference === 'light-cooked' ? 'Light Cooked' : 'Regular'}
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Dipping Sauces -->
  {#if availableDippingSauces().length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Dipping Sauces</h4>
      <div class="space-y-2">
        {#each availableDippingSauces() as sauce}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="checkbox"
                checked={isSauceSelected(sauce)}
                onchange={(e) => {
                  const target = e.target;
                  if (target && 'checked' in target) {
                    handleDippingSauceChange(sauce, Boolean(target.checked));
                  }
                }}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{sauce.name}</span>
              {#if sauce.category === 'spicy'}
                <span class="ml-2 text-xs text-red-500">🌶️</span>
              {/if}
            </div>
            {#if sauce.extraCost}
              <span class="text-sm font-medium text-primos-red-600">
                +${sauce.extraCost.toFixed(2)}
              </span>
            {/if}
          </label>
        {/each}
      </div>
      {#if selectedDippingSauces.length > 0}
        <p class="text-xs text-gray-500 mt-2">
          Selected: {selectedDippingSauces.map(s => s.name).join(', ')}
        </p>
      {/if}
    </div>
  {/if}

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
      <span class="text-sm text-gray-600">Base Price × {quantity}</span>
      <span class="text-sm text-gray-900">${((item.basePrice || 0) * quantity).toFixed(2)}</span>
    </div>
    {#if totalExtraCost() > 0}
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Sauce Extras</span>
        <span class="text-sm text-gray-900">+${totalExtraCost().toFixed(2)}</span>
      </div>
    {/if}
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
  .appetizer-customizer {
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