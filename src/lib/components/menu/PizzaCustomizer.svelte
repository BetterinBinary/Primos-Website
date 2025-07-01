<script lang="ts">
  import { slide } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import type { 
    PizzaMenuItem, 
    PizzaCrust, 
    PizzaSauce, 
    CheeseOption, 
    PizzaTopping,
    PizzaToppingSelection,
    ToppingPosition,
    Size
  } from '$lib/types/menu';

  interface Props {
    item: PizzaMenuItem;
    selectedSize: Size | null;
    selectedCrust: PizzaCrust;
    selectedSauce: PizzaSauce;
    selectedCheese: CheeseOption;
    selectedToppings: PizzaToppingSelection[];
    quantity: number;
    onSizeChange: (size: Size) => void;
    onCrustChange: (crust: PizzaCrust) => void;
    onSauceChange: (sauce: PizzaSauce) => void;
    onCheeseChange: (cheese: CheeseOption) => void;
    onToppingToggle: (topping: PizzaTopping, position: ToppingPosition) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCancel: () => void;
  }

  let {
    item,
    selectedSize,
    selectedCrust,
    selectedSauce,
    selectedCheese,
    selectedToppings,
    quantity,
    onSizeChange,
    onCrustChange,
    onSauceChange,
    onCheeseChange,
    onToppingToggle,
    onQuantityChange,
    onAddToCart,
    onCancel
  }: Props = $props();

  // Load pizza toppings data (in real app, this would come from store)
  const pizzaToppings = {
    meat: [
      { id: 'pepperoni', name: 'Pepperoni', category: 'meat', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'italian-sausage', name: 'Italian Sausage', category: 'meat', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'ham', name: 'Ham', category: 'meat', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'bacon', name: 'Bacon', category: 'meat', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'hamburger', name: 'Ground Beef', category: 'meat', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'chicken', name: 'Grilled Chicken', category: 'meat', available: true, isPremium: true, pricingBySize: { small: 1.75, medium: 2.12, large: 2.50, xlarge: 2.85 } }
    ],
    vegetable: [
      { id: 'mushrooms', name: 'Mushrooms', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'green-peppers', name: 'Green Peppers', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'onions', name: 'Onions', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'red-onions', name: 'Red Onions', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'black-olives', name: 'Black Olives', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'hot-peppers', name: 'Hot Peppers', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'pineapple', name: 'Pineapple', category: 'vegetable', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } }
    ],
    cheese: [
      { id: 'extra-mozzarella', name: 'Extra Mozzarella', category: 'cheese', available: true, pricingBySize: { small: 1.27, medium: 1.60, large: 1.84, xlarge: 2.12 } },
      { id: 'provolone', name: 'Provolone', category: 'cheese', available: true, pricingBySize: { small: 1.50, medium: 1.85, large: 2.15, xlarge: 2.45 } },
      { id: 'cheddar', name: 'Cheddar', category: 'cheese', available: true, pricingBySize: { small: 1.50, medium: 1.85, large: 2.15, xlarge: 2.45 } }
    ]
  };

  const crustOptions = [
    { id: 'regular', name: 'Regular Crust', extraCost: 0 },
    { id: 'thin', name: 'Thin Crust', extraCost: 0 },
    { id: 'thick', name: 'Thick Crust', extraCost: 1.50 },
    { id: 'garlic-crust', name: 'Garlic Crust', extraCost: 1.00 }
  ];

  const sauceOptions = [
    { id: 'pizza-sauce', name: 'Pizza Sauce', extraCost: 0 },
    { id: 'bbq-sauce', name: 'BBQ Sauce', extraCost: 0 },
    { id: 'light-sauce', name: 'Light Sauce', extraCost: 0 },
    { id: 'extra-sauce', name: 'Extra Sauce', extraCost: 0.50 },
    { id: 'no-sauce', name: 'No Sauce', extraCost: 0 }
  ];

  const cheeseOptions = [
    { id: 'regular', name: 'Regular Cheese', extraCost: 0 },
    { id: 'extra-cheese', name: 'Extra Cheese', extraCost: 1.50 },
    { id: 'light-cheese', name: 'Light Cheese', extraCost: 0 },
    { id: 'no-cheese', name: 'No Cheese', extraCost: 0 }
  ];

  const basePrice = $derived(() => {
    return selectedSize ? selectedSize.price : item.basePrice || 0;
  });

  const toppingsPrice = $derived(() => {
    if (!selectedToppings || !selectedSize) return 0;
    
    return selectedToppings.reduce((sum, selection) => {
      const sizeKey = selectedSize.size as keyof typeof selection.topping.pricingBySize;
      const toppingPrice = selection.topping.pricingBySize[sizeKey] || 0;
      return sum + toppingPrice;
    }, 0);
  });

  const extrasPrice = $derived(() => {
    let extras = 0;
    
    // Crust extra cost
    const crust = crustOptions.find(c => c.id === selectedCrust);
    if (crust) extras += crust.extraCost;
    
    // Sauce extra cost
    const sauce = sauceOptions.find(s => s.id === selectedSauce);
    if (sauce) extras += sauce.extraCost;
    
    // Cheese extra cost
    const cheese = cheeseOptions.find(c => c.id === selectedCheese);
    if (cheese) extras += cheese.extraCost;
    
    return extras;
  });

  const totalPrice = $derived(() => {
    return (basePrice + toppingsPrice + extrasPrice) * quantity;
  });

  function isToppingSelected(topping: PizzaTopping, position: ToppingPosition): boolean {
    return selectedToppings.some(selection => 
      selection.topping.id === topping.id && selection.position === position
    );
  }

  function getToppingPrice(topping: PizzaTopping): number {
    if (!selectedSize) return 0;
    const sizeKey = selectedSize.size as keyof typeof topping.pricingBySize;
    return topping.pricingBySize[sizeKey] || 0;
  }

  function handleToppingChange(topping: PizzaTopping, position: ToppingPosition, checked: boolean) {
    if (checked) {
      onToppingToggle(topping, position);
    } else {
      onToppingToggle(topping, position);
    }
  }
</script>

<div class="pizza-customizer space-y-6 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
  <!-- Size Selection -->
  {#if item.sizes && item.sizes.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Size</h4>
      <div class="space-y-2">
        {#each item.sizes as size}
          <label class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center">
              <input
                type="radio"
                name="pizza-size"
                value={size}
                checked={selectedSize?.size === size.size}
                onchange={() => onSizeChange(size)}
                class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-sm text-gray-700">{size.name}</span>
            </div>
            <span class="text-sm font-medium text-primos-red-600">
              ${size.price.toFixed(2)}
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Crust Selection -->
  {#if item.availableCrusts && item.availableCrusts.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Crust</h4>
      <div class="space-y-2">
        {#each crustOptions as crust}
          {#if item.availableCrusts.includes(crust.id)}
            <label class="flex items-center justify-between cursor-pointer">
              <div class="flex items-center">
                <input
                  type="radio"
                  name="pizza-crust"
                  value={crust.id}
                  checked={selectedCrust === crust.id}
                  onchange={() => onCrustChange(crust.id)}
                  class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
                />
                <span class="text-sm text-gray-700">{crust.name}</span>
              </div>
              {#if crust.extraCost > 0}
                <span class="text-sm font-medium text-primos-red-600">
                  +${crust.extraCost.toFixed(2)}
                </span>
              {/if}
            </label>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Sauce Selection -->
  {#if item.availableSauces && item.availableSauces.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Sauce</h4>
      <div class="space-y-2">
        {#each sauceOptions as sauce}
          {#if item.availableSauces.includes(sauce.id)}
            <label class="flex items-center justify-between cursor-pointer">
              <div class="flex items-center">
                <input
                  type="radio"
                  name="pizza-sauce"
                  value={sauce.id}
                  checked={selectedSauce === sauce.id}
                  onchange={() => onSauceChange(sauce.id)}
                  class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
                />
                <span class="text-sm text-gray-700">{sauce.name}</span>
              </div>
              {#if sauce.extraCost > 0}
                <span class="text-sm font-medium text-primos-red-600">
                  +${sauce.extraCost.toFixed(2)}
                </span>
              {/if}
            </label>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Cheese Selection -->
  {#if item.availableCheeseOptions && item.availableCheeseOptions.length > 0}
    <div>
      <h4 class="font-medium text-gray-900 mb-3">Cheese</h4>
      <div class="space-y-2">
        {#each cheeseOptions as cheese}
          {#if item.availableCheeseOptions.includes(cheese.id)}
            <label class="flex items-center justify-between cursor-pointer">
              <div class="flex items-center">
                <input
                  type="radio"
                  name="pizza-cheese"
                  value={cheese.id}
                  checked={selectedCheese === cheese.id}
                  onchange={() => onCheeseChange(cheese.id)}
                  class="mr-3 text-primos-red-600 focus:ring-primos-red-500"
                />
                <span class="text-sm text-gray-700">{cheese.name}</span>
              </div>
              {#if cheese.extraCost > 0}
                <span class="text-sm font-medium text-primos-red-600">
                  +${cheese.extraCost.toFixed(2)}
                </span>
              {/if}
            </label>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Toppings Selection -->
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Toppings</h4>
    
    <!-- Meat Toppings -->
    <div class="mb-4">
      <h5 class="text-sm font-medium text-gray-700 mb-2">🥩 Meat Toppings</h5>
      <div class="space-y-2">
        {#each pizzaToppings.meat as topping}
          <div class="border rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">{topping.name}</span>
              <span class="text-sm text-primos-red-600">
                +${getToppingPrice(topping).toFixed(2)}
                {#if topping.isPremium}
                  <span class="text-xs text-yellow-600">⭐</span>
                {/if}
              </span>
            </div>
            
            {#if item.allowHalfToppings}
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={isToppingSelected(topping, 'whole')}
                    onchange={(e) => handleToppingChange(topping, 'whole', e.target.checked)}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-xs text-gray-600">Whole</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={isToppingSelected(topping, 'left-half')}
                    onchange={(e) => handleToppingChange(topping, 'left-half', e.target.checked)}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-xs text-gray-600">Left Half</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={isToppingSelected(topping, 'right-half')}
                    onchange={(e) => handleToppingChange(topping, 'right-half', e.target.checked)}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-xs text-gray-600">Right Half</span>
                </label>
              </div>
            {:else}
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={isToppingSelected(topping, 'whole')}
                  onchange={(e) => handleToppingChange(topping, 'whole', e.target.checked)}
                  class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                />
                <span class="text-xs text-gray-600">Add to pizza</span>
              </label>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Vegetable Toppings -->
    <div class="mb-4">
      <h5 class="text-sm font-medium text-gray-700 mb-2">🥬 Vegetable Toppings</h5>
      <div class="space-y-2">
        {#each pizzaToppings.vegetable as topping}
          <div class="border rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">{topping.name}</span>
              <span class="text-sm text-primos-red-600">+${getToppingPrice(topping).toFixed(2)}</span>
            </div>
            
            {#if item.allowHalfToppings}
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={isToppingSelected(topping, 'whole')}
                    onchange={(e) => handleToppingChange(topping, 'whole', e.target.checked)}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-xs text-gray-600">Whole</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={isToppingSelected(topping, 'left-half')}
                    onchange={(e) => handleToppingChange(topping, 'left-half', e.target.checked)}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-xs text-gray-600">Left Half</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={isToppingSelected(topping, 'right-half')}
                    onchange={(e) => handleToppingChange(topping, 'right-half', e.target.checked)}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-xs text-gray-600">Right Half</span>
                </label>
              </div>
            {:else}
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={isToppingSelected(topping, 'whole')}
                  onchange={(e) => handleToppingChange(topping, 'whole', e.target.checked)}
                  class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                />
                <span class="text-xs text-gray-600">Add to pizza</span>
              </label>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Cheese Toppings -->
    <div class="mb-4">
      <h5 class="text-sm font-medium text-gray-700 mb-2">🧀 Additional Cheese</h5>
      <div class="space-y-2">
        {#each pizzaToppings.cheese as topping}
          <div class="border rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">{topping.name}</span>
              <span class="text-sm text-primos-red-600">+${getToppingPrice(topping).toFixed(2)}</span>
            </div>
            
            <label class="flex items-center">
              <input
                type="checkbox"
                checked={isToppingSelected(topping, 'whole')}
                onchange={(e) => handleToppingChange(topping, 'whole', e.target.checked)}
                class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
              />
              <span class="text-xs text-gray-600">Add to pizza</span>
            </label>
          </div>
        {/each}
      </div>
    </div>
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
  <div class="bg-gray-50 rounded-lg p-4">
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Base Price × {quantity}</span>
        <span class="text-sm text-gray-900">${(basePrice * quantity).toFixed(2)}</span>
      </div>
      {#if toppingsPrice > 0}
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Toppings × {quantity}</span>
          <span class="text-sm text-gray-900">+${(toppingsPrice * quantity).toFixed(2)}</span>
        </div>
      {/if}
      {#if extrasPrice > 0}
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Extras × {quantity}</span>
          <span class="text-sm text-gray-900">+${(extrasPrice * quantity).toFixed(2)}</span>
        </div>
      {/if}
      <hr class="border-gray-200" />
      <div class="flex justify-between items-center font-medium">
        <span class="text-gray-900">Total</span>
        <span class="text-lg text-primos-red-600">${totalPrice.toFixed(2)}</span>
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
      Add to Cart - ${totalPrice.toFixed(2)}
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
  .pizza-customizer {
    animation: slideIn 0.3s ease-out;
    max-height: 70vh;
    overflow-y: auto;
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