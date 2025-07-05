<script lang="ts">
  import { Button } from '../ui/index.js';
  
  interface PieceOption {
    id: string;
    name: string;
    price: number;
    description?: string;
  }
  
  interface Props {
    pieces: PieceOption[];
    selectedPieces: Record<string, number>;
    maxPieces?: number;
    showCombinations?: boolean;
    onPieceChange: (pieceId: string, quantity: number) => void;
    onCombinationSelect?: (combination: string) => void;
  }
  
  let { 
    pieces, 
    selectedPieces, 
    maxPieces = 24, 
    showCombinations = false,
    onPieceChange,
    onCombinationSelect
  }: Props = $props();
  
  // Calculate total pieces selected
  const totalPieces = $derived(
    Object.values(selectedPieces).reduce((sum, qty) => sum + qty, 0)
  );
  
  // Calculate total price
  const totalPrice = $derived(
    pieces.reduce((sum, piece) => {
      const quantity = selectedPieces[piece.id] || 0;
      return sum + (piece.price * quantity);
    }, 0)
  );
  
  // Common piece combinations for different categories
  const combinations = {
    chicken: [
      { id: 'mixed-2pc', name: '2 pc Mixed', pieces: { breast: 1, thigh: 1 } },
      { id: 'mixed-4pc', name: '4 pc Mixed', pieces: { breast: 1, thigh: 1, leg: 1, wing: 1 } },
      { id: 'mixed-8pc', name: '8 pc Mixed', pieces: { breast: 2, thigh: 2, leg: 2, wing: 2 } },
      { id: 'all-white-4pc', name: '4 pc All White', pieces: { breast: 2, wing: 2 } },
      { id: 'all-dark-4pc', name: '4 pc All Dark', pieces: { thigh: 2, leg: 2 } }
    ],
    seafood: [
      { id: 'fish-dinner', name: 'Fish Dinner (4 pc)', pieces: { fish: 4 } },
      { id: 'fish-snack', name: 'Fish Snack (2 pc)', pieces: { fish: 2 } },
      { id: 'perch-dinner', name: 'Perch Dinner (8 pc)', pieces: { perch: 8 } }
    ]
  };
  
  function updatePieceQuantity(pieceId: string, change: number) {
    const currentQty = selectedPieces[pieceId] || 0;
    const newQty = Math.max(0, Math.min(maxPieces, currentQty + change));
    
    // Ensure total doesn't exceed maxPieces
    if (change > 0 && totalPieces >= maxPieces) return;
    
    onPieceChange(pieceId, newQty);
  }
  
  function selectCombination(combinationId: string) {
    const categoryKey = pieces[0]?.id.includes('breast') ? 'chicken' : 'seafood';
    const combination = combinations[categoryKey]?.find(c => c.id === combinationId);
    
    if (combination && onCombinationSelect) {
      // Clear current selection
      pieces.forEach(piece => onPieceChange(piece.id, 0));
      
      // Apply combination
      Object.entries(combination.pieces).forEach(([pieceId, qty]) => {
        onPieceChange(pieceId, qty);
      });
      
      onCombinationSelect(combinationId);
    }
  }
</script>

<div class="piece-selector space-y-4">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <h4 class="font-medium text-gray-900">Select Individual Pieces</h4>
    <div class="text-sm text-gray-600">
      {totalPieces} / {maxPieces} pieces
    </div>
  </div>
  
  <!-- Quick Combinations -->
  {#if showCombinations}
    <div class="border-b border-gray-200 pb-3">
      <h5 class="text-sm font-medium text-gray-700 mb-2">Quick Selections</h5>
      <div class="flex flex-wrap gap-2">
        {#each (pieces[0]?.id.includes('breast') ? combinations.chicken : combinations.seafood) as combo}
          <Button
            variant="outline"
            size="sm"
            onclick={() => selectCombination(combo.id)}
            class="text-xs"
          >
            {combo.name}
          </Button>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Individual Piece Selection -->
  <div class="space-y-3">
    {#each pieces as piece}
      {@const quantity = selectedPieces[piece.id] || 0}
      <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="font-medium text-gray-900">{piece.name}</span>
            <span class="text-sm font-medium text-primos-red-600">
              ${piece.price.toFixed(2)} each
            </span>
          </div>
          {#if piece.description}
            <p class="text-xs text-gray-600 mt-1">{piece.description}</p>
          {/if}
        </div>
        
        <div class="flex items-center space-x-3 ml-4">
          <!-- Quantity Controls -->
          <button
            type="button"
            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            onclick={() => updatePieceQuantity(piece.id, -1)}
            disabled={quantity <= 0}
          >
            -
          </button>
          
          <span class="w-8 text-center font-medium">{quantity}</span>
          
          <button
            type="button"
            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            onclick={() => updatePieceQuantity(piece.id, 1)}
            disabled={totalPieces >= maxPieces}
          >
            +
          </button>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Total Price Display -->
  {#if totalPieces > 0}
    <div class="bg-[#F4F2EB] p-3 rounded-lg relative overflow-hidden">
      <!-- Noise overlay -->
      <div class="absolute inset-0 bg-[url('/noise.png')] bg-fit bg-repeat opacity-15 mix-blend-multiply pointer-events-none"></div>
      
      <!-- Content wrapper -->
      <div class="relative z-10">
        <div class="flex justify-between items-center">
          <span class="font-medium text-gray-900">
            Total ({totalPieces} piece{totalPieces !== 1 ? 's' : ''})
          </span>
          <span class="text-lg font-bold text-primos-red-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        
        <!-- Breakdown -->
        <div class="mt-2 space-y-1">
          {#each pieces as piece}
            {@const quantity = selectedPieces[piece.id] || 0}
            {#if quantity > 0}
              <div class="flex justify-between text-sm text-gray-600">
                <span>{quantity}× {piece.name}</span>
                <span>${(piece.price * quantity).toFixed(2)}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .piece-selector {
    @apply max-w-lg;
  }
</style>