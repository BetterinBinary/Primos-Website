<script>
  import restaurantInfo from '$lib/data/restaurant-info.json';
</script>

<footer class="bg-gray-900 text-white">
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Restaurant Info -->
      <div class="space-y-4">
        <h3 class="text-lg font-display font-semibold text-primos-gold-500">
          {restaurantInfo.name}
        </h3>
        <div class="space-y-2 text-gray-300">
          <p class="text-sm">{restaurantInfo.established}</p>
          <p class="text-sm">
            <a
              href="tel:{restaurantInfo.phone}"
              class="hover:text-primos-gold-500 transition-colors duration-200"
            >
              {restaurantInfo.phone}
            </a>
          </p>
          <address class="text-sm not-italic leading-relaxed">
            {restaurantInfo.address}<br />
            {restaurantInfo.location}
          </address>
        </div>
      </div>

      <!-- Hours -->
      <div class="space-y-4">
        <h3 class="text-lg font-display font-semibold text-primos-gold-500">Hours</h3>
        <div class="space-y-2 text-gray-300 text-sm">
          {#each Object.entries(restaurantInfo.hours) as [days, hours]}
            <div class="flex justify-between">
              <span class="font-medium">{days}:</span>
              <span>{hours}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Services -->
      <div class="space-y-4">
        <h3 class="text-lg font-display font-semibold text-primos-gold-500">Services</h3>
        <ul class="space-y-2 text-gray-300 text-sm">
          {#each restaurantInfo.services as service}
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-primos-gold-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {service}
            </li>
          {/each}
        </ul>
      </div>

      <!-- Awards & Recognition -->
      <div class="space-y-4">
        <h3 class="text-lg font-display font-semibold text-primos-gold-500">Awards</h3>
        <div class="space-y-2 text-gray-300 text-sm">
          {#each restaurantInfo.awards as award}
            <p class="leading-relaxed">{award}</p>
          {/each}
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="mt-8 pt-8 border-t border-gray-800">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="mb-4 sm:mb-0">
          <h4 class="text-sm font-medium text-gray-400 mb-2">We Accept</h4>
          <div class="flex items-center space-x-3 text-gray-300">
            {#each restaurantInfo.paymentMethods as method}
              <span class="text-xs bg-gray-800 px-2 py-1 rounded">{method}</span>
            {/each}
          </div>
        </div>
        
        <div class="text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {restaurantInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </div>

    <!-- Website Credit -->
    <div class="mt-4 pt-4 border-t border-gray-800 text-center">
      <p class="text-xs text-gray-500">
        Website built with 
        <a 
          href="https://kit.svelte.dev" 
          class="text-primos-gold-500 hover:text-primos-gold-400 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          SvelteKit
        </a>
      </p>
    </div>
  </div>
</footer>