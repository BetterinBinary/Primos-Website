<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Button } from '../ui/index.js';
  import { ENABLE_ORDERING, ENABLE_CUSTOMIZATION } from '$lib/config/features.js';
  import BBQRibsCustomizer from './BBQRibsCustomizer.svelte';
  import CombinationPlatesCustomizer from './CombinationPlatesCustomizer.svelte';
  import SeafoodCustomizer from './SeafoodCustomizer.svelte';
  import ChickenCustomizer from './ChickenCustomizer.svelte';
  import type { 
    MenuItem, 
    Size, 
    Topping, 
    AddOn,
    BBQSauceLevel,
    RibDoneness,
    BBQSauceOption,
    CombinationPlateOptions,
    SeafoodPreparation,
    SeafoodSauceOption,
    ChickenMeatSelection,
    ChickenSauceOption
  } from '$lib/types/menu';

  interface Props {
    item: MenuItem;
    onAddToCart: (item: MenuItem, options: {
      selectedSize: Size | null;
      selectedToppings: Topping[];
      selectedAddOns: AddOn[];
      selectedOptions: string[];
      quantity: number;
      specialInstructions: string;
    }) => void;
  }

  let { item, onAddToCart }: Props = $props();
  let selectedSize = $state<Size | null>(item.sizes?.[0] || null);
  let selectedToppings = $state<Topping[]>([]);
  let selectedAddOns = $state<AddOn[]>([]);
  let quantity = $state(1);
  let showCustomizer = $state(false);
  let imageError = $state(false);
  
  // BBQ Ribs specific state
  let selectedSauceLevel = $state<BBQSauceLevel>('regular');
  let selectedDoneness = $state<RibDoneness>('fall-off-bone');
  let selectedSauces = $state<BBQSauceOption[]>([]);
  
  // Combination Plates specific state
  let combinationOptions = $state<CombinationPlateOptions>({
    cookingPreference: 'regular',
    sideSubstitutions: [],
    specialInstructions: ''
  });
  
  // Seafood specific state
  let selectedPreparation = $state<SeafoodPreparation>('regular');
  let selectedSeafoodSauces = $state<SeafoodSauceOption[]>([]);
  let selectedSeafoodOrderType = $state<'only' | 'dinner'>('dinner');
  let selectedSeafoodPieces = $state<Record<string, number>>({});
  let selectedSeafoodSides = $state<string[]>(['ff', 'slaw', 'roll']);
  
  // Chicken specific state
  let selectedMeatSelection = $state<ChickenMeatSelection>('mixed');
  let isBBQStyle = $state(false);
  let selectedChickenSauces = $state<ChickenSauceOption[]>([]);
  let selectedChickenOrderType = $state<'only' | 'dinner'>('dinner');
  let selectedChickenPieces = $state<Record<string, number>>({});
  let selectedChickenSides = $state<string[]>(['ff', 'slaw', 'roll']);
  let useChickenPieceSelection = $state(false);
  
  // Determine if item has customization options and customization is enabled
  const hasCustomizations = $derived(() => {
    return ENABLE_CUSTOMIZATION && (
      (item.sizes && item.sizes.length > 1) || 
      (item.toppings?.extraItems && item.toppings.extraItems.length > 0) ||
      (item.category === 'bbq-ribs') ||
      (item.category === 'combination-plates') ||
      (item.category === 'seafood') ||
      (item.category === 'hand-battered-shrimp') ||
      (item.category === 'chicken') ||
      (item.category === 'chicken-tenderloins') ||
      (item.category === 'wing-dings')
    );
  });

  const basePrice = $derived(
    selectedSize ? selectedSize.price : item.basePrice || 0
  );

  const toppingsPrice = $derived(
    selectedToppings.reduce((sum, topping) => sum + 0, 0)
  );

  const addOnsPrice = $derived(
    selectedAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0)
  );

  const totalPrice = $derived(
    (basePrice + toppingsPrice + addOnsPrice) * quantity
  );

  function toggleTopping(topping: Topping) {
    const index = selectedToppings.findIndex((t) => t.id === topping.id);
    if (index > -1) {
      selectedToppings.splice(index, 1);
    } else {
      selectedToppings.push(topping);
    }
  }

  function handleQuantityChange(newQuantity: number) {
    quantity = newQuantity;
  }

  // BBQ Ribs handlers
  function handleSauceLevelChange(level: BBQSauceLevel) {
    selectedSauceLevel = level;
  }

  function handleDonenessChange(doneness: RibDoneness) {
    selectedDoneness = doneness;
  }

  function handleSauceToggle(sauce: BBQSauceOption) {
    const index = selectedSauces.findIndex(s => s.id === sauce.id);
    if (index > -1) {
      selectedSauces.splice(index, 1);
    } else {
      selectedSauces.push(sauce);
    }
  }

  // Combination Plates handlers
  function handleCombinationOptionsChange(options: CombinationPlateOptions) {
    combinationOptions = options;
  }
  
  // Seafood handlers
  function handleSeafoodPreparationChange(prep: SeafoodPreparation) {
    selectedPreparation = prep;
  }
  
  function handleSeafoodSauceToggle(sauce: SeafoodSauceOption) {
    const index = selectedSeafoodSauces.findIndex(s => s.id === sauce.id);
    if (index > -1) {
      selectedSeafoodSauces.splice(index, 1);
    } else {
      selectedSeafoodSauces.push(sauce);
    }
  }
  
  function handleSeafoodOrderTypeChange(type: 'only' | 'dinner') {
    selectedSeafoodOrderType = type;
  }
  
  function handleSeafoodPieceChange(pieceId: string, quantity: number) {
    if (quantity === 0) {
      delete selectedSeafoodPieces[pieceId];
    } else {
      selectedSeafoodPieces[pieceId] = quantity;
    }
  }
  
  function handleSeafoodSideToggle(side: string) {
    const index = selectedSeafoodSides.indexOf(side);
    if (index > -1) {
      selectedSeafoodSides.splice(index, 1);
    } else {
      selectedSeafoodSides.push(side);
    }
  }
  
  // Chicken handlers
  function handleChickenMeatSelectionChange(selection: ChickenMeatSelection) {
    selectedMeatSelection = selection;
  }
  
  function handleChickenBBQStyleToggle(bbqStyle: boolean) {
    isBBQStyle = bbqStyle;
  }
  
  function handleChickenSauceToggle(sauce: ChickenSauceOption) {
    const index = selectedChickenSauces.findIndex(s => s.id === sauce.id);
    if (index > -1) {
      selectedChickenSauces.splice(index, 1);
    } else {
      selectedChickenSauces.push(sauce);
    }
  }
  
  function handleChickenOrderTypeChange(type: 'only' | 'dinner') {
    selectedChickenOrderType = type;
  }
  
  function handleChickenPieceChange(pieceId: string, quantity: number) {
    if (quantity === 0) {
      delete selectedChickenPieces[pieceId];
    } else {
      selectedChickenPieces[pieceId] = quantity;
    }
  }
  
  function handleChickenSideToggle(side: string) {
    const index = selectedChickenSides.indexOf(side);
    if (index > -1) {
      selectedChickenSides.splice(index, 1);
    } else {
      selectedChickenSides.push(side);
    }
  }
  
  function handleChickenPieceSelectionToggle(usePieces: boolean) {
    useChickenPieceSelection = usePieces;
  }

  function handleQuickAdd() {
    // Quick add with default selections - pass properly structured options
    const options = {
      selectedSize: item.sizes?.[0] || null,
      selectedToppings: [],
      selectedAddOns: [],
      selectedOptions: [],
      quantity: 1,
      specialInstructions: ''
    };
    
    onAddToCart(item, options);
  }

  function handleCustomize() {
    showCustomizer = true;
  }

  function handleImageError() {
    imageError = true;
  }

  /**
   * Format price display for the price area
   * Returns object with all individual prices for vertical display
   * Null-safe to handle malformed price data
   */
  function formatPriceDisplay(item: MenuItem): { single: string | null, allPrices: string[], fallback: string | null } {
    if (item.sizes && item.sizes.length > 0) {
      if (item.sizes.length === 1) {
        const price = item.sizes[0]?.price;
        if (price != null && !isNaN(price)) {
          return { single: `$${price.toFixed(2)}`, allPrices: [], fallback: null };
        }
      } else {
        // Get all valid prices with their size info, maintain original order
        const allPrices = item.sizes
          .filter(size => size?.price != null && !isNaN(size.price))
          .map(size => `$${size.price.toFixed(2)}`);
        
        if (allPrices.length === 0) {
          return { single: null, allPrices: [], fallback: 'Price varies' };
        }
        
        if (allPrices.length === 1) {
          return { single: allPrices[0], allPrices: [], fallback: null };
        } else {
          return { single: null, allPrices: allPrices, fallback: null };
        }
      }
    } else if (item.basePrice != null && !isNaN(item.basePrice)) {
      return { single: `$${item.basePrice.toFixed(2)}`, allPrices: [], fallback: null };
    }
    
    return { single: null, allPrices: [], fallback: 'Price varies' };
  }

  function handleCustomizedAdd() {
    // Pass customized selections properly structured 
    const customOptions = [];
    
    if (item.category === 'bbq-ribs') {
      // BBQ ribs specific options
      customOptions.push(`Sauce Level: ${selectedSauceLevel}`);
      customOptions.push(`Doneness: ${selectedDoneness}`);
      if (selectedSauces.length > 0) {
        customOptions.push(`Extra Sauces: ${selectedSauces.map(s => s.name).join(', ')}`);
      }
    } else if (item.category === 'combination-plates') {
      // Combination plates specific options
      if (combinationOptions.cookingPreference && combinationOptions.cookingPreference !== 'regular') {
        customOptions.push(`Cooking: ${combinationOptions.cookingPreference}`);
      }
      if (combinationOptions.sideSubstitutions && combinationOptions.sideSubstitutions.length > 0) {
        customOptions.push(`Sides: ${combinationOptions.sideSubstitutions.join(', ')}`);
      }
    } else if (item.category === 'seafood' || item.category === 'hand-battered-shrimp') {
      // Seafood specific options
      customOptions.push(`Order Type: ${selectedSeafoodOrderType}`);
      
      if (selectedPreparation !== 'regular') {
        customOptions.push(`Preparation: ${selectedPreparation}`);
      }
      
      const totalSeafoodPieces = Object.values(selectedSeafoodPieces).reduce((sum, qty) => sum + qty, 0);
      if (totalSeafoodPieces > 0) {
        customOptions.push(`Individual Pieces: ${totalSeafoodPieces}`);
      }
      
      if (selectedSeafoodSauces.length > 0) {
        customOptions.push(`Sauces: ${selectedSeafoodSauces.map(s => s.name).join(', ')}`);
      }
      
      if (selectedSeafoodOrderType === 'dinner' && selectedSeafoodSides.length > 3) {
        const extraSides = selectedSeafoodSides.filter(side => !['ff', 'slaw', 'roll'].includes(side));
        if (extraSides.length > 0) {
          customOptions.push(`Extra Sides: ${extraSides.join(', ')}`);
        }
      }
    } else if (item.category === 'chicken' || item.category === 'chicken-tenderloins' || item.category === 'wing-dings') {
      // Chicken specific options
      if (useChickenPieceSelection) {
        customOptions.push(`Order Type: ${selectedChickenOrderType}`);
        
        const totalChickenPieces = Object.values(selectedChickenPieces).reduce((sum, qty) => sum + qty, 0);
        if (totalChickenPieces > 0) {
          customOptions.push(`Individual Pieces: ${totalChickenPieces}`);
        }
      } else {
        if (selectedMeatSelection && selectedMeatSelection !== 'mixed') {
          customOptions.push(`Meat Selection: ${selectedMeatSelection}`);
        }
      }
      
      if (isBBQStyle) {
        customOptions.push('BBQ Style');
      }
      
      if (selectedChickenSauces.length > 0) {
        customOptions.push(`Sauces: ${selectedChickenSauces.map(s => s.name).join(', ')}`);
      }
      
      if ((useChickenPieceSelection || item.category === 'chicken-tenderloins' || item.category === 'wing-dings') && selectedChickenOrderType === 'dinner' && selectedChickenSides.length > 3) {
        const extraSides = selectedChickenSides.filter(side => !['ff', 'slaw', 'roll'].includes(side));
        if (extraSides.length > 0) {
          customOptions.push(`Extra Sides: ${extraSides.join(', ')}`);
        }
      }
    } else {
      // Generic customization for other items
      if (selectedSize && item.sizes && item.sizes.length > 1) {
        customOptions.push(`Size: ${selectedSize.name}`);
      }
      
      if (selectedToppings.length > 0) {
        customOptions.push(`Toppings: ${selectedToppings.map(t => t.name).join(', ')}`);
      }
    }
    
    const options = {
      selectedSize,
      selectedToppings,
      selectedAddOns,
      selectedOptions: customOptions,
      quantity,
      specialInstructions: ''
    };
    
    onAddToCart(item, options);
    showCustomizer = false;
  }

</script>

<article
  class="menu-item bg-[#F4F2EB] p-6 flex flex-col relative transition-all duration-300 ease-in-out h-full"
  style={showCustomizer ? 'min-height: auto;' : ''}
>
  <!-- Noise overlay -->
  <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
  
  <!-- Content wrapper -->
  <div class="relative z-10 flex flex-col h-full">
  <!-- Top content that can expand -->
  <div class="flex-1 flex flex-col">
  <!-- Top section: Name, Description, and Price -->
  <div class="flex justify-between items-start gap-4 mb-4">
    <div class="flex-1">
      <!-- Item title -->
      <h3 class="text-lg font-bold text-black mb-3 font-sans">
        {item.name}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm leading-relaxed">
        {item.description}
      </p>
    </div>

    <!-- Price display (right side, top aligned) -->
    <div class="flex-shrink-0 flex flex-col items-end justify-start">
      {#if formatPriceDisplay(item).single}
        <span class="text-lg font-bold text-black font-sans leading-tight">
          {formatPriceDisplay(item).single}
        </span>
      {:else if formatPriceDisplay(item).allPrices.length > 0}
        {#each formatPriceDisplay(item).allPrices as price}
          <span class="text-lg font-bold text-black font-sans leading-tight">
            {price}
          </span>
        {/each}
      {:else if formatPriceDisplay(item).fallback}
        <span class="text-sm font-bold text-black font-sans leading-tight">
          {formatPriceDisplay(item).fallback}
        </span>
      {/if}
    </div>
  </div>

  <!-- Customization Options (hidden when customization disabled) -->
  {#if showCustomizer && ENABLE_CUSTOMIZATION}
    <div transition:slide={{ duration: 300 }}>
    {#if item.category === 'bbq-ribs'}
      <!-- BBQ Ribs Customizer -->
      <BBQRibsCustomizer
        item={item}
        selectedSauceLevel={selectedSauceLevel}
        selectedDoneness={selectedDoneness}
        selectedSauces={selectedSauces}
        quantity={quantity}
        onSauceLevelChange={handleSauceLevelChange}
        onDonenessChange={handleDonenessChange}
        onSauceToggle={handleSauceToggle}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleCustomizedAdd}
        onCancel={() => showCustomizer = false}
      />
    {:else if item.category === 'combination-plates'}
      <!-- Combination Plates Customizer -->
      <CombinationPlatesCustomizer
        item={item}
        selectedOptions={combinationOptions}
        quantity={quantity}
        onOptionsChange={handleCombinationOptionsChange}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleCustomizedAdd}
        onCancel={() => showCustomizer = false}
      />
    {:else if item.category === 'seafood' || item.category === 'hand-battered-shrimp'}
      <!-- Seafood Customizer -->
      <SeafoodCustomizer
        item={item}
        selectedPreparation={selectedPreparation}
        selectedSauces={selectedSeafoodSauces}
        selectedOrderType={selectedSeafoodOrderType}
        selectedPieces={selectedSeafoodPieces}
        selectedSides={selectedSeafoodSides}
        quantity={quantity}
        onPreparationChange={handleSeafoodPreparationChange}
        onSauceToggle={handleSeafoodSauceToggle}
        onOrderTypeChange={handleSeafoodOrderTypeChange}
        onPieceChange={handleSeafoodPieceChange}
        onSideToggle={handleSeafoodSideToggle}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleCustomizedAdd}
        onCancel={() => showCustomizer = false}
      />
    {:else if item.category === 'chicken' || item.category === 'chicken-tenderloins' || item.category === 'wing-dings'}
      <!-- Chicken Customizer -->
      <ChickenCustomizer
        item={item}
        selectedMeatSelection={selectedMeatSelection}
        isBBQStyle={isBBQStyle}
        selectedSauces={selectedChickenSauces}
        selectedOrderType={selectedChickenOrderType}
        selectedPieces={selectedChickenPieces}
        selectedSides={selectedChickenSides}
        usePieceSelection={useChickenPieceSelection}
        quantity={quantity}
        onMeatSelectionChange={handleChickenMeatSelectionChange}
        onBBQStyleToggle={handleChickenBBQStyleToggle}
        onSauceToggle={handleChickenSauceToggle}
        onOrderTypeChange={handleChickenOrderTypeChange}
        onPieceChange={handleChickenPieceChange}
        onSideToggle={handleChickenSideToggle}
        onPieceSelectionToggle={handleChickenPieceSelectionToggle}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleCustomizedAdd}
        onCancel={() => showCustomizer = false}
      />
    {:else}
      <!-- Generic Customizer for other items -->
      <div class="space-y-4 mb-4 border-t border-gray-200 pt-4">
      <!-- Size Selection -->
      {#if item.sizes && item.sizes.length > 0}
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Size</h4>
          <div class="space-y-2">
            {#each item.sizes as size}
              <label class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center">
                  <input
                    type="radio"
                    bind:group={selectedSize}
                    value={size}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
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

      <!-- Toppings Selection -->
      {#if item.toppings && item.toppings.extraItems && item.toppings.extraItems.length > 0}
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Add Toppings</h4>
          <div class="space-y-2">
            {#each item.toppings.extraItems as topping}
              <label class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedToppings.some((t) => t.name === topping.name)}
                    onchange={() => toggleTopping({ id: topping.name, name: topping.name, category: 'meat', available: true })}
                    class="mr-2 text-primos-red-600 focus:ring-primos-red-500"
                  />
                  <span class="text-sm text-gray-700">{topping.name}</span>
                </div>
                <span class="text-sm font-medium text-primos-red-600">
                  +${topping.price.toFixed(2)}
                </span>
              </label>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Quantity Selection -->
      <div>
        <h4 class="font-medium text-gray-900 mb-2">Quantity</h4>
        <div class="flex items-center space-x-3">
          <button
            type="button"
            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            onclick={() => handleQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span class="w-8 text-center font-medium">{quantity}</span>
          <button
            type="button"
            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            onclick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <!-- Price Summary -->
      <div class="bg-[#F4F2EB] p-3 relative overflow-hidden">
        <!-- Noise overlay -->
        <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
        <!-- Content wrapper -->
        <div class="relative z-10">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Base Price × {quantity}</span>
          <span class="text-sm text-gray-900">${(basePrice * quantity).toFixed(2)}</span>
        </div>
        {#if toppingsPrice > 0}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Toppings</span>
            <span class="text-sm text-gray-900">+${toppingsPrice.toFixed(2)}</span>
          </div>
        {/if}
        <hr class="my-2 border-gray-200" />
        <div class="flex justify-between items-center font-medium">
          <span class="text-gray-900">Total</span>
          <span class="text-lg text-primos-red-600">${totalPrice.toFixed(2)}</span>
        </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 mt-4">
        <Button
          variant="primary"
          class="flex-1"
          onclick={handleCustomizedAdd}
        >
          Add to Cart - ${totalPrice.toFixed(2)}
        </Button>
        <Button
          variant="ghost"
          class="flex-1"
          onclick={() => showCustomizer = false}
        >
          Cancel
        </Button>
      </div>
    </div>
    {/if}
    </div>
  {/if}

  <!-- Additional Info -->
  {#if item.allergens && item.allergens.length > 0}
    <div class="space-y-2">
      <p class="text-xs text-yellow-600">
        ⚠️ Contains: {item.allergens.join(", ")}
      </p>
    </div>
  {/if}
  </div> <!-- End of flex-1 top content -->

  <!-- Bottom section: Price and Add to Cart -->
  <div class="mt-auto">
    <!-- Price and availability section -->
    {#if !item.available}
      <div class="flex justify-center mb-4">
        <span class="text-red-500 text-sm font-medium">
          Currently Unavailable
        </span>
      </div>
    {/if}

    <!-- Action buttons (hidden when ordering disabled) -->
    {#if item.available && ENABLE_ORDERING}
      {#if !showCustomizer}
        <!-- Quick Add / Customize Options -->
        {#if hasCustomizations()}
          <div class="space-y-3">
            <!-- Quick Add Button -->
            <Button
              variant="primary"
              class="w-full"
              onclick={handleQuickAdd}
            >
              Quick Add - ${(item.sizes?.[0]?.price || item.basePrice || 0).toFixed(2)}
            </Button>
            
            <!-- Customize Button -->
            <Button
              variant="outline"
              class="w-full"
              onclick={handleCustomize}
            >
              Customize
            </Button>
          </div>
        {:else}
          <!-- Simple Add to Cart -->
          <Button
            variant="primary"
            class="w-full"
            onclick={handleQuickAdd}
          >
            Add to Cart
          </Button>
        {/if}
      {:else}
        <!-- Customizer Action Buttons -->
        <div class="space-y-2">
          <Button
            variant="primary"
            class="w-full"
            onclick={handleCustomizedAdd}
          >
            Add to Cart - ${totalPrice.toFixed(2)}
          </Button>
          
          <Button
            variant="ghost"
            class="w-full"
            onclick={() => showCustomizer = false}
          >
            Cancel
          </Button>
        </div>
      {/if}
    {/if}
  </div>
  </div>
</article>
