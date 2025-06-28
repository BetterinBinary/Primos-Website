# Restaurant Website Upgrade Guide: Static to Dynamic Menu System

This comprehensive implementation guide provides a systematic approach to upgrading Primos Pizza's website from static menu images to a dynamic, interactive system designed for future POS integration using Claude Code, SvelteKit, and modern development practices.

## Phase 1: Project Foundation and Setup

### Initial Project Structure

**Recommended Directory Architecture:**

```
primos-pizza-website/
├── CLAUDE.md                    # AI assistant configuration
├── .claude/                     # Claude-specific configurations
│   ├── commands/               # Reusable command templates
│   │   ├── add-menu-item.md
│   │   ├── update-pricing.md
│   │   ├── optimize-images.md
│   │   └── deploy-changes.md
│   └── prompts/               # Development workflow prompts
├── docs/                      # Project documentation
│   ├── specs/                # Technical specifications
│   │   ├── menu-data-model.md
│   │   ├── pos-integration.md
│   │   └── ui-components.md
│   └── workflows/            # Development workflows
├── src/                      # SvelteKit source code
│   ├── lib/
│   │   ├── components/
│   │   │   ├── menu/        # Menu-specific components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # Reusable UI elements
│   │   ├── stores/          # State management
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript definitions
│   ├── routes/              # SvelteKit routes
│   │   ├── menu/
│   │   ├── api/
│   │   └── admin/
│   └── static/              # Static assets
├── data/                    # Menu and configuration data
│   ├── menu/               # Menu JSON files
│   └── images/             # Optimized food images
└── scripts/                # Build and deployment scripts
```

### CLAUDE.md Configuration

Create a comprehensive AI assistant configuration:

```markdown
# Primos Pizza Website Development Guide

## Project Overview

Transitioning Primos Pizza website from static menu images to dynamic, POS-ready ordering system using SvelteKit and Tailwind CSS.

## Build Commands

- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run test`: Run test suite
- `npm run typecheck`: TypeScript validation

## Code Style Guidelines

- Use SvelteKit 5 runes for reactive state
- Implement Tailwind CSS utility-first approach
- Component naming: PascalCase for components, kebab-case for files
- TypeScript required for all new code

## Menu Data Structure

- Categories: appetizers, pizza, pasta, beverages, desserts
- Items: name, description, basePrice, image, allergens, available
- Modifiers: size options, toppings, special instructions
- POS Integration: maintain compatibility with standard order APIs

## Repository Etiquette

- Branch naming: feature/menu-system, fix/pricing-display
- Commit messages: "feat(menu): add dynamic pricing display"
- All changes require testing before commits
- Document any POS integration considerations

## Common Issues and Solutions

- Image optimization: Use @sveltejs/enhanced-img for automatic processing
- State management: Prefer runes over stores for new components
- Performance: Implement lazy loading for menu images
- Accessibility: Maintain WCAG 2.1 AA compliance throughout
```

### Command Templates

**add-menu-item.md:**

```markdown
# Add Menu Item Command

Please add a new menu item to the Primos Pizza system following these steps:

1. **Data Entry**: Add item to appropriate category in `data/menu/[category].json`
2. **Image Processing**: Optimize and add food photo to `src/static/images/menu/`
3. **Component Update**: Ensure MenuItem.svelte displays new item correctly
4. **Testing**: Verify item appears in menu display and search results
5. **Documentation**: Update menu data model documentation

**Required Information:**

- Item name, description, base price
- Category assignment
- Available sizes/modifiers
- Allergen information
- High-quality food photograph

**Validation Checklist:**

- [ ] Item appears in correct category
- [ ] Pricing displays correctly
- [ ] Image loads with proper optimization
- [ ] Allergen information visible
- [ ] Mobile display formatting correct
```

**update-pricing.md:**

```markdown
# Update Menu Pricing Command

Execute pricing updates across the Primos Pizza menu system:

1. **Backup Current Pricing**: Create backup of current menu data
2. **Update JSON Files**: Modify pricing in relevant menu category files
3. **Component Verification**: Ensure price formatting displays correctly
4. **Cross-Reference Check**: Verify pricing consistency across all menu displays
5. **Testing**: Test cart calculations and order totals
6. **Documentation**: Log pricing changes with date and reasoning

**Price Update Types:**

- Individual item price changes
- Category-wide price adjustments
- Seasonal pricing modifications
- Size/modifier price updates

**Quality Assurance:**

- [ ] All prices display with consistent formatting
- [ ] Cart calculations update correctly
- [ ] No broken price displays
- [ ] Mobile pricing layout maintained
```

**build-pos-dtos.md:**

````markdown
# Build and Test POS Integration DTOs Command

Create and validate Data Transfer Objects for seamless POS system integration:

## Implementation Steps

1. **Analyze POS Data Structure**

   - Review existing POS menuContent.js structure
   - Map all item categories (pizza, pasta, seafood, etc.)
   - Document complex structures (pizzaToppings, tracker objects)
   - Identify edge cases and special pricing rules

2. **Create DTO Classes**

   - `WebOrderToPosDTO.js` - Transform website orders to POS format
   - `PosOrderToWebDTO.js` - Transform POS responses to website format
   - `PosMenuToWebDTO.js` - Convert POS menu data to website structure
   - `WebMenuToPosDTO.js` - Sync website menu changes back to POS

3. **Test Data Transformation**

   - Create test cases for each menu category
   - Validate pizza topping transformations (whole/first/second)
   - Test complex orders (twins, delivery, special instructions)
   - Verify pricing calculations match POS exactly

4. **Integration Testing**
   - Test order submission to actual POS API (http://192.168.0.75:8050)
   - Verify orders appear correctly in POS system
   - Test kitchen printer output matches expectations
   - Validate customer data synchronization

## Required Test Cases

**Pizza Orders:**

```javascript
// Test Case: Half-and-Half Pizza
const websiteOrder = {
  item: "Large Pizza",
  size: "large",
  toppings: {
    firstHalf: ["pepperoni", "mushrooms"],
    secondHalf: ["sausage", "peppers"],
  },
};

// Expected POS Output:
const expectedPOS = {
  category: "pizza",
  size: ["large"],
  type: ["round_square"],
  pizzaToppings: {
    whole: {},
    first: { pepperoni: 1, mushrooms: 1 },
    second: { sausage: 1, peppers: 1 },
  },
  numToppings: 4,
  tracker: {
    /* populated correctly */
  },
};
```
````

**Seafood Orders:**

```javascript
// Test Case: Quantity-based Seafood
const websiteOrder = {
  item: "Fish Dinner",
  quantity: 2,
  sides: ["fries", "coleslaw"],
};

// Expected POS Output:
const expectedPOS = {
  category: "seafood",
  type: ["hbs"],
  quantity: 2,
  special: ["fries", "coleslaw"],
  tracker: { type: { hbs: 2 } },
};
```

## Validation Checklist

**Order Structure Validation:**

- [ ] All POS required fields populated
- [ ] Array formats match POS expectations (size, type arrays)
- [ ] Pizza toppings use correct whole/first/second structure
- [ ] Tracker object populated for POS analytics
- [ ] Customer data matches POS customer schema

**Pricing Validation:**

- [ ] Twin pizza discounts calculated correctly
- [ ] Delivery fees added appropriately ($3.50)
- [ ] Topping prices match POS pricing rules
- [ ] Size-based pricing accurate across all categories

**Integration Testing:**

- [ ] Orders successfully POST to POS API
- [ ] POS staff can process orders without confusion
- [ ] Kitchen printer outputs correctly formatted receipts
- [ ] Order numbers sync between systems
- [ ] Customer lookup works for repeat customers

## Testing Commands

```bash
# Run DTO unit tests
npm run test:dtos

# Test against live POS (development)
npm run test:pos-integration

# Validate order transformation
npm run validate:order-format

# Test menu sync from POS
npm run test:menu-sync
```

## Common POS Integration Issues

**Array Format Mismatches:**

- Website: `selectedSize: "large"`
- POS Expects: `size: ["large"]`

**Pizza Topping Structure:**

- Website: `toppings: [{id: "pepperoni", placement: "whole"}]`
- POS Expects: `pizzaToppings: {whole: {"pepperoni": 1}}`

**Customer Data Fields:**

- Website: `customer.firstName, customer.lastName`
- POS Expects: `customer.first, customer.last`

## Success Criteria

- [ ] All test orders process successfully in POS
- [ ] Kitchen receives properly formatted order tickets
- [ ] Pricing matches POS calculations exactly
- [ ] Customer data syncs correctly
- [ ] Error handling gracefully falls back
- [ ] Performance meets requirements (<500ms transformation)

````

**test-pos-integration.md:**
```markdown
# Test POS Integration Command

Comprehensive testing workflow for POS system integration:

## Pre-Integration Setup

1. **Environment Preparation**
   - Ensure POS server running (http://192.168.0.75:8050)
   - Verify database connectivity
   - Check printer server status (port 8060)
   - Confirm test payment processing setup

2. **Test Data Preparation**
   - Create test customer accounts
   - Prepare sample orders for each menu category
   - Set up test payment methods
   - Configure test printer output

## Integration Test Scenarios

**Scenario 1: Simple Pizza Order**
```javascript
const testOrder = {
  customer: { first: "Test", last: "Customer", phone: "555-0123" },
  type: "pick-up",
  items: [{
    category: "pizza",
    size: ["small"],
    type: ["round_square"],
    quantity: 1,
    pizzaToppings: { whole: {"pepperoni": 1}, first: {}, second: {} },
    numToppings: 1,
    price: 13.85
  }],
  price: 13.85
};
````

**Scenario 2: Complex Multi-Item Order**

```javascript
const complexOrder = {
  customer: { first: "John", last: "Doe", phone: "555-0456" },
  type: "delivery",
  items: [
    // Twin pizzas (discount pricing)
    {
      /* Large Pepperoni */
    },
    {
      /* Large Sausage */
    },
    // Pasta dish
    {
      /* Spaghetti with Meatballs */
    },
    // Beverages
    {
      /* 2-Liter Coke */
    },
  ],
  price: 45.75, // Including delivery fee
};
```

## Testing Workflow

1. **Submit Test Orders**

   - Send orders via website API
   - Monitor POS order queue
   - Verify order appears correctly
   - Check kitchen printer output

2. **Validate Order Processing**

   - Confirm POS staff can read order details
   - Test order status updates
   - Verify payment processing integration
   - Check completion workflow

3. **Error Handling Tests**
   - Test invalid order data
   - Simulate POS server downtime
   - Test network connectivity issues
   - Verify graceful degradation

## Monitoring and Logging

**Order Tracking:**

- Log all API calls to POS system
- Monitor response times and errors
- Track successful order completions
- Document any data transformation issues

**Performance Metrics:**

- API response time (target: <500ms)
- Order processing success rate (target: >99%)
- Error recovery time
- Kitchen printer reliability

## Validation Checklist

**Order Data Integrity:**

- [ ] Customer information transfers correctly
- [ ] All menu items appear with proper formatting
- [ ] Pricing calculations match website display
- [ ] Special instructions preserved
- [ ] Order type (pickup/delivery) correctly set

**POS System Integration:**

- [ ] Orders appear in POS queue immediately
- [ ] Order numbers sync between systems
- [ ] Kitchen tickets print with correct details
- [ ] Staff can mark orders complete
- [ ] Order history updates both systems

**Error Recovery:**

- [ ] Failed orders retry automatically
- [ ] User receives appropriate error messages
- [ ] Fallback order processing available
- [ ] Data loss prevention measures work

## Success Metrics

- Zero order data loss
- 100% kitchen printer compatibility
- <2 second average API response time
- Seamless staff workflow integration

````

## Phase 2: Component Architecture Implementation

### Core Menu Components

**MenuItem.svelte Structure:**
```svelte
<script>
  // Using Svelte 5 runes for modern reactivity
  let { item, onAddToCart } = $props();
  let selectedModifiers = $state([]);
  let quantity = $state(1);

  // Derived pricing calculation
  const totalPrice = $derived(() => {
    let base = item.basePrice;
    selectedModifiers.forEach(mod => base += mod.price);
    return base * quantity;
  });

  // Real-time availability checking
  $effect(() => {
    // Future: integrate with POS for real-time availability
    checkItemAvailability(item.id);
  });
</script>

<article class="menu-item bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
  <div class="flex justify-between items-start">
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
      <p class="text-gray-600 text-sm mb-2">{item.description}</p>

      {#if item.allergens?.length > 0}
        <div class="flex flex-wrap gap-1 mb-2">
          {#each item.allergens as allergen}
            <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              {allergen}
            </span>
          {/each}
        </div>
      {/if}

      <div class="flex items-center gap-4">
        <span class="text-red-600 font-bold text-lg">${totalPrice.toFixed(2)}</span>
        {#if !item.available}
          <span class="text-red-500 text-sm">Currently Unavailable</span>
        {/if}
      </div>
    </div>

    <enhanced:img
      src="./images/menu/{item.image}"
      alt="{item.name} from Primos Pizza"
      class="w-20 h-20 object-cover rounded-lg ml-4"
      sizes="80px"
    />
  </div>

  {#if item.available}
    <button
      class="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      onclick={() => onAddToCart({ ...item, modifiers: selectedModifiers, quantity })}
    >
      Add to Cart
    </button>
  {/if}
</article>
````

### State Management Strategy

**Global Menu Store (menu-store.js):**

```javascript
// Modern Svelte 5 approach using runes
export function createMenuStore() {
  let categories = $state([]);
  let items = $state([]);
  let cart = $state([]);
  let loading = $state(false);
  let searchQuery = $state("");

  // Derived filtered items
  const filteredItems = $derived(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Cart calculations
  const cartTotal = $derived(() =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  // Auto-save cart to localStorage
  $effect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("primos-cart", JSON.stringify(cart));
    }
  });

  async function loadMenuData() {
    loading = true;
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      categories = data.categories;
      items = data.items;
    } catch (error) {
      console.error("Failed to load menu data:", error);
    } finally {
      loading = false;
    }
  }

  function addToCart(item) {
    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.modifiers) === JSON.stringify(item.modifiers)
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push({ ...item, cartId: crypto.randomUUID() });
    }
  }

  return {
    // State
    get categories() {
      return categories;
    },
    get items() {
      return items;
    },
    get cart() {
      return cart;
    },
    get loading() {
      return loading;
    },
    get searchQuery() {
      return searchQuery;
    },
    set searchQuery(value) {
      searchQuery = value;
    },

    // Derived
    get filteredItems() {
      return filteredItems;
    },
    get cartTotal() {
      return cartTotal;
    },

    // Actions
    loadMenuData,
    addToCart,
    removeFromCart: (cartId) => {
      cart = cart.filter((item) => item.cartId !== cartId);
    },
    clearCart: () => {
      cart = [];
    },
  };
}
```

## Phase 3: POS Integration Preparation

### Data Model Design (Using DTO Pattern)

**Website Menu Data (Customer-Facing):**

```json
{
  "categories": [
    {
      "id": "pizza",
      "name": "Pizza",
      "description": "Our signature hand-tossed pizzas",
      "sortOrder": 1,
      "available": true
    }
  ],
  "items": [
    {
      "id": "margherita_pizza",
      "name": "Margherita Pizza",
      "description": "Fresh mozzarella, tomato sauce, basil",
      "category": "pizza",
      "basePrice": 14.99,
      "image": "margherita-pizza.jpg",
      "allergens": ["dairy", "gluten"],
      "available": true,
      "sizes": [
        { "id": "small", "name": "Small (10\")", "price": 11.35 },
        { "id": "medium", "name": "Medium (12\")", "price": 14.99 },
        { "id": "large", "name": "Large (14\")", "price": 18.99 }
      ],
      "toppings": [
        { "id": "pepperoni", "name": "Pepperoni", "price": 2.5 },
        { "id": "mushrooms", "name": "Mushrooms", "price": 1.5 }
      ],
      "posMapping": {
        "category": "pizza",
        "type": "round_square",
        "sizeMap": {
          "small": "small",
          "medium": "medium",
          "large": "large"
        }
      }
    }
  ]
}
```

**POS Integration DTOs:**

```javascript
// Transform website order to POS format
class WebOrderToPosDTO {
  static transform(websiteOrder) {
    return {
      type: websiteOrder.orderType, // "pick-up" or "delivery"
      items: websiteOrder.items.map((item) => this.transformItem(item)),
      customer: this.transformCustomer(websiteOrder.customer),
      price: websiteOrder.total,
      note: websiteOrder.specialInstructions || "",
    };
  }

  static transformItem(websiteItem) {
    const posItem = {
      category: websiteItem.category,
      size: [websiteItem.selectedSize], // POS expects array
      type: [websiteItem.posMapping.type], // POS expects array
      quantity: websiteItem.quantity,
      price: websiteItem.calculatedPrice,
    };

    // Handle pizza toppings (POS-specific structure)
    if (websiteItem.category === "pizza") {
      posItem.pizzaToppings = {
        whole: {},
        first: {},
        second: {},
      };

      // Convert website toppings to POS format
      websiteItem.selectedToppings?.forEach((topping) => {
        if (websiteItem.toppingPlacement === "whole") {
          posItem.pizzaToppings.whole[topping.id] = 1;
        }
        // Handle half-pizza toppings if needed
      });

      posItem.numToppings = websiteItem.selectedToppings?.length || 0;
      posItem.displayToppings = this.createDisplayToppings(
        websiteItem.selectedToppings
      );
    } else {
      // Handle non-pizza items
      posItem.topping = websiteItem.selectedToppings?.map((t) => t.id) || [];
      posItem.special = websiteItem.specialPreparations || [];
      posItem.sauce = websiteItem.selectedSauces || [];
    }

    // POS tracker structure
    posItem.tracker = {
      size: { [websiteItem.selectedSize]: 1 },
      type: { [websiteItem.posMapping.type]: 1 },
      topping: {},
      sauce: {},
    };

    return posItem;
  }

  static transformCustomer(websiteCustomer) {
    return {
      first: websiteCustomer.firstName,
      last: websiteCustomer.lastName,
      phone: websiteCustomer.phone,
      address: websiteCustomer.address || "",
    };
  }
}
```

### API Design for POS Integration (Using DTOs)

**Order Processing API (+page.server.js):**

```javascript
import { fail } from "@sveltejs/kit";
import { WebOrderToPosDTO, PosOrderToWebDTO } from "$lib/dtos";

export const actions = {
  async placeOrder({ request }) {
    const data = await request.formData();
    const websiteOrder = JSON.parse(data.get("orderData"));

    // Validate website order structure
    const validationResult = validateWebsiteOrder(websiteOrder);
    if (!validationResult.valid) {
      return fail(400, {
        error: "Invalid order data",
        details: validationResult.errors,
      });
    }

    try {
      // Transform website order to POS format using DTO
      const posOrder = WebOrderToPosDTO.transform(websiteOrder);

      // Send to your existing POS API
      const response = await fetch("http://192.168.0.75:8050/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posOrder),
      });

      if (!response.ok) {
        throw new Error(`POS API error: ${response.status}`);
      }

      const posResult = await response.json();

      // Transform POS response back to website format
      const websiteResult = PosOrderToWebDTO.transform(posResult);

      return {
        success: true,
        orderId: websiteResult.orderId,
        orderNumber: websiteResult.orderNumber,
        estimatedTime: websiteResult.estimatedTime,
      };
    } catch (error) {
      console.error("POS integration error:", error);
      return fail(500, {
        error: "Order processing failed",
        fallback: true,
      });
    }
  },
};

// Load menu data from POS system
export async function load() {
  try {
    // Fetch raw menu data from your POS menuContent.js or API
    const posMenuData = await fetchPosMenuData();

    // Transform POS menu structure to website-friendly format
    const websiteMenu = PosMenuToWebDTO.transform(posMenuData);

    return {
      menu: websiteMenu,
    };
  } catch (error) {
    console.error("Failed to load menu from POS:", error);
    // Fallback to cached menu data
    return {
      menu: await loadCachedMenuData(),
    };
  }
}

// DTO Classes for transformation
class PosMenuToWebDTO {
  static transform(posMenuContent) {
    const categories = this.extractCategories(posMenuContent);
    const items = this.transformItems(posMenuContent);

    return { categories, items };
  }

  static extractCategories(posMenuContent) {
    const uniqueCategories = [
      ...new Set(posMenuContent.map((item) => item.Category)),
    ];

    return uniqueCategories.map((category) => ({
      id: category.toLowerCase(),
      name: this.formatCategoryName(category),
      description: this.getCategoryDescription(category),
      sortOrder: this.getCategorySortOrder(category),
      available: true,
    }));
  }

  static transformItems(posMenuContent) {
    const itemsMap = new Map();

    // Group POS menu items by category and type to create website items
    posMenuContent.forEach((posItem) => {
      const itemKey = `${posItem.Category}_${posItem.Type}`;

      if (!itemsMap.has(itemKey)) {
        itemsMap.set(itemKey, {
          id: itemKey.toLowerCase(),
          name: this.formatItemName(posItem.Category, posItem.Type),
          description: this.getItemDescription(posItem.Category, posItem.Type),
          category: posItem.Category.toLowerCase(),
          image: this.getItemImage(posItem.Category, posItem.Type),
          allergens: this.getItemAllergens(posItem.Category, posItem.Type),
          available: true,
          sizes: [],
          toppings: this.getAvailableToppings(posItem.Category),
          posMapping: {
            category: posItem.Category,
            type: posItem.Type,
          },
        });
      }

      // Add size option
      const item = itemsMap.get(itemKey);
      if (!item.sizes.find((s) => s.id === posItem.Size)) {
        item.sizes.push({
          id: posItem.Size,
          name: this.formatSizeName(posItem.Size),
          price: posItem.price,
        });
      }
    });

    return Array.from(itemsMap.values());
  }
}
```

## Phase 4: Modern UI Implementation

### Tailwind CSS Configuration

**tailwind.config.js:**

```javascript
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "primos-red": {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          900: "#7f1d1d",
        },
        "primos-green": {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
```

### Responsive Menu Layout

**MenuGrid.svelte:**

```svelte
<script>
  let { items, searchQuery } = $props();

  const filteredItems = $derived(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
</script>

<section class="menu-grid">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each filteredItems as item (item.id)}
      <MenuItem {item} onAddToCart={addToCart} />
    {/each}
  </div>

  {#if filteredItems.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500 text-lg">No menu items found matching "{searchQuery}"</p>
      <button
        class="mt-4 text-primos-red-600 hover:text-primos-red-700"
        onclick={() => searchQuery = ''}
      >
        Clear search
      </button>
    </div>
  {/if}
</section>

<style>
  .menu-grid {
    @apply container mx-auto px-4 py-8;
  }
</style>
```

## Phase 5: Development Workflow Implementation

### Step-by-Step Migration Process (Updated for POS Integration)

**Migration Spec Template (migration-spec.md):**

```markdown
# Primos Pizza Menu Migration Specification

## Overview

Convert static menu images to dynamic SvelteKit components using DTO pattern for seamless POS integration.

## Migration Steps

1. **POS Data Analysis**: Map existing POS menu structure from menuContent.js
2. **DTO Design**: Create transformation layer between website and POS formats
3. **Menu Data Extraction**: Transform POS menu data to website-friendly structure
4. **Component Development**: Build components using website data model
5. **Integration Layer**: Implement DTOs for order processing
6. **Testing Both Systems**: Ensure POS compatibility throughout development
7. **Performance Optimization**: Achieve target Lighthouse scores
8. **Production Integration**: Connect to live POS system

## Key Files for POS Integration

- `src/lib/dtos/WebOrderToPosDTO.js` - Website to POS order transformation
- `src/lib/dtos/PosOrderToWebDTO.js` - POS to website response transformation
- `src/lib/dtos/PosMenuToWebDTO.js` - POS menu to website menu transformation
- `src/routes/api/menu/sync/+server.js` - Sync menu data from POS
- `src/routes/api/orders/+server.js` - Order processing with POS integration
- `data/menu/pos-mapping.json` - Mapping configuration between systems

## POS Compatibility Requirements

- [ ] Order structure matches POS expectations exactly
- [ ] All POS item categories supported (pizza, pasta, seafood, etc.)
- [ ] Pizza topping structure (whole/first/second) preserved
- [ ] Tracker object populated correctly for POS analytics
- [ ] Twin pizza pricing rules maintained
- [ ] Customer data format matches POS customer schema
- [ ] Order numbering system integrated

## Success Criteria

- [ ] Website orders appear correctly in POS system
- [ ] POS staff can process website orders without confusion
- [ ] Pricing calculations match POS exactly
- [ ] All menu categories and items display properly
- [ ] Complex pizza configurations work (half-toppings, etc.)
- [ ] Order history syncs between systems
- [ ] Kitchen printer integration functions
```

### Automated Testing Strategy

**Testing Configuration (vitest.config.js):**

```javascript
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    setupFiles: ["./src/test-setup.js"],
  },
});
```

**Component Test Example (MenuItem.test.js):**

```javascript
import { render, screen } from "@testing-library/svelte";
import { expect, test } from "vitest";
import MenuItem from "../MenuItem.svelte";

test("displays menu item with correct information", () => {
  const mockItem = {
    id: "test-item",
    name: "Margherita Pizza",
    description: "Fresh mozzarella and basil",
    basePrice: 14.99,
    image: "margherita.jpg",
    available: true,
    allergens: ["dairy", "gluten"],
  };

  render(MenuItem, { props: { item: mockItem } });

  expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
  expect(screen.getByText("$14.99")).toBeInTheDocument();
  expect(screen.getByText("dairy")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /add to cart/i })
  ).toBeInTheDocument();
});

test("shows unavailable state correctly", () => {
  const unavailableItem = {
    id: "test-item",
    name: "Sold Out Pizza",
    basePrice: 12.99,
    available: false,
  };

  render(MenuItem, { props: { item: unavailableItem } });

  expect(screen.getByText("Currently Unavailable")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /add to cart/i })
  ).not.toBeInTheDocument();
});
```

## Phase 6: Deployment and Performance Optimization

### Production Build Configuration

**vite.config.js:**

```javascript
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";

export default {
  plugins: [enhancedImages(), sveltekit()],
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["svelte"],
          menu: ["./src/lib/components/menu"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["date-fns", "lodash-es"],
  },
};
```

### Progressive Web App Setup

**app.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#dc2626" />
    <meta
      name="description"
      content="Primos Pizza - Authentic Italian dining and online ordering"
    />

    <!-- PWA Configuration -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Primos Pizza" />

    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="font-body">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

### Monitoring and Analytics

**Analytics Implementation (+layout.svelte):**

```svelte
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  onMount(() => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_TRACKING_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }

    // Performance monitoring
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  });

  // Track page views
  $: if ($page.url.pathname) {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: $page.url.href
    });
  }
</script>
```

## Implementation Timeline and Next Steps

### Week 1-2: Foundation

- Set up SvelteKit project structure
- Configure Claude Code workflows
- Implement basic component architecture
- Create menu data extraction process

### Week 3-4: Core Features

- Build dynamic menu display components
- Implement search and filtering
- Add cart functionality
- Optimize images and performance

### Week 5-6: POS Integration Development

- **Build POS DTOs**: Use `build-pos-dtos.md` command to create transformation layer
- **Test Data Mapping**: Validate transformation between website and POS formats
- **Integration Testing**: Use `test-pos-integration.md` for comprehensive POS testing
- **Error Handling**: Implement fallback mechanisms for POS connectivity issues

### Week 7-8: POS Integration Validation & Launch

- **Live POS Testing**: Test orders through actual POS system workflow
- **Kitchen Integration**: Verify printer output and staff workflow
- **Performance Optimization**: Ensure <500ms API response times
- **Staff Training**: Train restaurant staff on website order processing
- **Production Deployment**: Launch with full POS integration

## POS Integration Command Usage

During development, you'll use these commands at specific phases:

**Phase 1 - DTO Development (Week 5):**

```bash
# Create and test basic DTO structure
claude "Use build-pos-dtos.md to create the WebOrderToPosDTO class. Start with pizza orders and test against our POS data structure."

# Validate transformations
claude "Test the DTO with a complex pizza order: large pizza, half pepperoni/half sausage, pickup order for customer John Doe."
```

**Phase 2 - Integration Testing (Week 6):**

```bash
# Test live POS connection
claude "Use test-pos-integration.md to set up comprehensive testing against our POS server at 192.168.0.75:8050."

# Validate specific scenarios
claude "Test twin pizza pricing and delivery fee calculation through the POS integration."
```

**Phase 3 - Production Validation (Week 7):**

```bash
# End-to-end testing
claude "Run complete integration test suite including kitchen printer validation and staff workflow testing."

# Performance optimization
claude "Optimize DTO transformation performance and implement error recovery mechanisms."
```

## Key Integration Checkpoints

**Checkpoint 1 - Data Transformation (End of Week 5):**

- All menu categories transform correctly
- Pizza topping structure matches POS expectations
- Customer data maps to POS format
- Pricing calculations are identical

**Checkpoint 2 - Live Testing (End of Week 6):**

- Orders successfully submit to POS
- Kitchen printer outputs correct information
- Staff can process website orders normally
- Error handling works for edge cases

**Checkpoint 3 - Production Ready (End of Week 7):**

- Performance meets requirements
- Zero data loss in order processing
- Seamless staff workflow integration
- Monitoring and logging operational

This comprehensive guide provides the structure and workflows needed to systematically upgrade Primos Pizza's website using modern tools while preparing for seamless POS integration. The modular approach ensures maintainability and scalability as the business grows.
