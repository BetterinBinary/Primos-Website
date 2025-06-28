<script>
    let { item, onAddToCart } = $props();
    let selectedModifiers = $state([]);
    let quantity = $state(1);

    const totalPrice = $derived(
        (item.basePrice || 0) * quantity +
            selectedModifiers.reduce((sum, mod) => sum + (mod.price || 0), 0),
    );
</script>

<article
    class="menu-item bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full"
>
    <!-- Top section: Name, Description, and Image -->
    <div class="flex justify-between items-start gap-4 mb-4">
        <div class="flex-1">
            <!-- Item title -->
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
                {item.name}
            </h3>

            <!-- Description -->
            <p class="text-gray-600 text-sm leading-relaxed">
                {item.description}
            </p>
        </div>

        <!-- Item image -->
        <div
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
        >
            {#if item.image}
                <img
                    src="/images/menu/{item.image}"
                    alt="{item.name} from Primos Pizza"
                    class="w-full h-full object-cover rounded-lg"
                />
            {:else}
                <span class="text-gray-400 text-xl">🍕</span>
            {/if}
        </div>
    </div>

    <!-- Bottom section: Allergens, Price, and Add to Cart -->
    <div class="mt-auto">
        <!-- <!-1- Allergen tags -1-> -->
        <!-- {#if item.allergens?.length > 0} -->
        <!--     <div class="flex flex-wrap gap-2 mb-4"> -->
        <!--         {#each item.allergens as allergen} -->
        <!--             <span -->
        <!--                 class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md" -->
        <!--             > -->
        <!--                 {allergen} -->
        <!--             </span> -->
        <!--         {/each} -->
        <!--     </div> -->
        <!-- {/if} -->

        <!-- Price and availability section -->
        <div class="flex flex-row items-center justify-center mb-4">
            <span class="text-primos-red-600 font-bold text-xl">
                ${totalPrice.toFixed(2)}
            </span>

            {#if !item.available}
                <span class="text-red-500 text-sm font-medium">
                    Currently Unavailable
                </span>
            {/if}
        </div>

        <!-- Add to cart button -->
        {#if item.available}
            <button
                class="w-full btn-primary"
                on:click={() =>
                    onAddToCart({
                        ...item,
                        modifiers: selectedModifiers,
                        quantity,
                    })}
            >
                Add to Cart
            </button>
        {/if}
    </div>
</article>
