<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import type { BBQRibsMenuItem, BBQSauceLevel, RibDoneness, BBQSauceOption } from '$lib/types/menu';

  interface Props {
    item: BBQRibsMenuItem;
    selectedSauceLevel: BBQSauceLevel;
    selectedDoneness: RibDoneness;
    selectedSauces: BBQSauceOption[];
    quantity: number;
    onSauceLevelChange: (level: BBQSauceLevel) => void;
    onDonenessChange: (doneness: RibDoneness) => void;
    onSauceToggle: (sauce: BBQSauceOption) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedSauceLevel,
    selectedDoneness,
    selectedSauces,
    quantity,
    onSauceLevelChange,
    onDonenessChange,
    onSauceToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Available BBQ sauce levels
  const sauceLevels: { value: BBQSauceLevel; label: string; description: string }[] = [
    { value: 'light', label: 'Light BBQ Sauce', description: 'Just a touch of our signature BBQ sauce' },
    { value: 'regular', label: 'Regular BBQ Sauce', description: 'Our classic BBQ sauce application' },
    { value: 'extra', label: 'Extra BBQ Sauce', description: 'Generously basted with extra sauce' },
    { value: 'on-side', label: 'Sauce on the Side', description: 'BBQ sauce served separately' }
  ];

  // Available doneness preferences
  const donenessOptions: { value: RibDoneness; label: string; description: string }[] = [
    { value: 'tender', label: 'Tender', description: 'Perfectly cooked with a slight firmness' },
    { value: 'fall-off-bone', label: 'Fall-off-the-Bone', description: 'Ultra-tender, melts in your mouth' },
    { value: 'well-done', label: 'Well Done', description: 'Cooked longer for a firmer texture' }
  ];

  // Available additional sauces
  const availableSauces: BBQSauceOption[] = [
    { id: 'hot-sauce', name: 'Hot Sauce', spiceLevel: 3, available: true },
    { id: 'ranch', name: 'Ranch', available: true },
    { id: 'honey-mustard', name: 'Honey Mustard', available: true },
    { id: 'blue-cheese', name: 'Blue Cheese', available: true }
  ];

  const basePrice = $derived(() => {
    return item.basePrice || 0;
  });

  const totalPrice = $derived(() => {
    return basePrice() * quantity;
  });

  const getRibPortionDisplayName = $derived(() => {
    switch (item.ribPortion) {
      case 'whole-slab':
        return 'Whole Slab (for two)';
      case 'short-ends':
        return 'Short Ends (9 bones)';
      case 'long-ends':
        return 'Long Ends (9 bones)';
      case 'rib-snacks':
        return 'Rib Snacks (5 bones)';
      default:
        return item.name;
    }
  });

  const getRibPortionDescription = $derived(() => {
    switch (item.ribPortion) {
      case 'whole-slab':
        return 'A full slab of tender BBQ ribs perfect for sharing';
      case 'short-ends':
        return 'The meatier short end portion of our BBQ ribs';
      case 'long-ends':
        return 'The longer, leaner end portion of our ribs';
      case 'rib-snacks':
        return 'A smaller portion of our delicious BBQ ribs';
      default:
        return item.description;
    }
  });

  function handleSauceChange(sauce: BBQSauceOption, checked: boolean) {
    onSauceToggle(sauce);
  }

  function isSauceSelected(sauce: BBQSauceOption): boolean {
    return selectedSauces.some(s => s.id === sauce.id);
  }

  function getSpiceIndicator(spiceLevel?: number): string {
    if (!spiceLevel) return '';
    return '🌶️'.repeat(Math.min(spiceLevel, 3));
  }
</script>

<div class="bbq-ribs-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Rib Portion Info ---->
  <div class="bg-orange-50 rounded-lg p-3">
    <h4 class="font-medium text-orange-900 mb-1">BBQ Ribs</h4>
    <p class="text-sm text-orange-800 font-medium">{getRibPortionDisplayName()}</p>
    <p class="text-sm text-orange-700">{getRibPortionDescription()}</p>
    {#if item.includes && item.includes.length > 0}
      <p class="text-sm text-orange-700 mt-2">
        <strong>Includes:</strong> {item.includes.join(', ')}
      </p>
    {/if}
  </div>

  <!-- BBQ Sauce Level Selection ---->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">BBQ Sauce Level</h4>
    <div class="space-y-3">
      {#each sauceLevels as sauceLevel}
        <label class="flex items-start cursor-pointer">
          <input
            type="radio"
            name="sauce-level"
            value={sauceLevel.value}
            checked={selectedSauceLevel === sauceLevel.value}
            onchange={() => onSauceLevelChange(sauceLevel.value)}
            class="mr-3 mt-1 text-primos-red-600 focus:ring-primos-red-500"
          />
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-700">{sauceLevel.label}</span>
            <p class="text-xs text-gray-500">{sauceLevel.description}</p>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Doneness Preference ---->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Cooking Preference</h4>
    <div class="space-y-3">
      {#each donenessOptions as doneness}
        <label class="flex items-start cursor-pointer">
          <input
            type="radio"
            name="doneness"
            value={doneness.value}
            checked={selectedDoneness === doneness.value}
            onchange={() => onDonenessChange(doneness.value)}
            class="mr-3 mt-1 text-primos-red-600 focus:ring-primos-red-500"
          />
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-700">{doneness.label}</span>
            <p class="text-xs text-gray-500">{doneness.description}</p>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Additional Sauces ---->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Additional Dipping Sauces</h4>
    <div class="space-y-2">
      {#each availableSauces as sauce}
        <label class="flex items-center justify-between cursor-pointer">
          <div class="flex items-center">
            <input
              type="checkbox"
              checked={isSauceSelected(sauce)}
              onchange={(e) => {
                const target = e.target;
                if (target && 'checked' in target) {
                  handleSauceChange(sauce, Boolean(target.checked));
                }
              }}
              class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
            />
            <span class="text-sm text-gray-700">{sauce.name}</span>
            {#if sauce.spiceLevel}
              <span class="ml-2 text-xs" title="Spice Level {sauce.spiceLevel}">
                {getSpiceIndicator(sauce.spiceLevel)}
              </span>
            {/if}
          </div>
          <span class="text-xs text-gray-500">Free</span>
        </label>
      {/each}
    </div>
    {#if selectedSauces.length > 0}
      <p class="text-xs text-gray-500 mt-2">
        Selected: {selectedSauces.map(s => s.name).join(', ')}
      </p>
    {/if}
  </div>

  <!-- Cooking Notes ---->
  <div class="bg-amber-50 rounded-lg p-3">
    <h5 class="font-medium text-amber-900 mb-2">🍖 Cooking Notes</h5>
    <ul class="text-sm text-amber-800 space-y-1">
      <li>• All ribs are slow-cooked for maximum tenderness</li>
      <li>• BBQ sauce is our signature recipe with smoky flavor</li>
      <li>• Allow extra time during busy periods for best quality</li>
      {#if item.ribPortion === 'whole-slab'}
        <li>• Whole slab recommended for 2+ people</li>
      {/if}
    </ul>
  </div>

  <!-- Quantity Selection ---->
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

  <!-- Price Summary ---->
  <div class="bg-[#F4F2EB] rounded-lg p-3 relative overflow-hidden">
    <!-- Noise overlay ---->
    <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
    <!-- Content wrapper ---->
    <div class="relative z-10">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">{getRibPortionDisplayName()} × {quantity}</span>
        <span class="text-sm text-gray-900">${(basePrice() * quantity).toFixed(2)}</span>
      </div>
      <hr class="my-2 border-gray-200" />
      <div class="flex justify-between items-center font-medium">
        <span class="text-gray-900">Total</span>
        <span class="text-lg text-primos-red-600">${totalPrice().toFixed(2)}</span>
      </div>
    </div>
  </div>

  <!-- Action Buttons ---->
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
  .bbq-ribs-customizer {
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