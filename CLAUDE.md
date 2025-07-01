# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Primos Pizza website is a sophisticated SvelteKit 5 application currently in migration from static menu images to a dynamic, POS-ready ordering system. The project leverages modern Svelte 5 runes for state management, comprehensive TypeScript typing, and is architected for seamless integration with existing POS systems.

**Current Status**: Dynamic menu system completed on `migration` branch with comprehensive state management, cart functionality, and responsive UI. Core architecture stable and ready for POS integration phase.

## Build Commands

### Core Development
- `npm run dev`: Start development server (port 5173)
- `npm run build`: Production build with code splitting optimization
- `npm run preview`: Preview production build (port 4173)

### Testing and Quality
- `npm run test`: Run complete test suite
- `npm run test:watch`: Run tests in watch mode for development
- `npm run test:ui`: Launch Vitest UI for visual test management
- `npm run typecheck`: Full TypeScript validation with Svelte sync
- `npm run lint`: ESLint code quality check
- `npm run lint:fix`: Auto-fix linting issues
- `npm run format`: Prettier code formatting
- `npm run check`: Complete Svelte + TypeScript validation

### Single Test Execution
```bash
# Run specific test file
npm run test pricing.test.js

# Run tests matching pattern
npm run test:watch -- --grep "Button Component"
```

### Development Convenience Scripts
- `npm run dev:clean`: Clean build artifacts and start fresh dev server
- `npm run build:analyze`: Build and analyze output bundle size
- `npm run test:coverage`: Run tests with coverage reporting
- `npm run reset`: Full reset - reinstall dependencies and clean artifacts

## Workflow Automation

### NPM Workflow Scripts
Run `npm run workflow:help` to see all available workflows:

- `npm run workflow:debug` - Interactive debugging assistance
- `npm run workflow:add-item` - Add new menu items with validation
- `npm run workflow:pricing` - Update pricing system-wide
- `npm run workflow:deploy` - Deploy changes with testing
- `npm run workflow:images` - Optimize menu images
- `npm run workflow:pos-test` - Test POS integration
- `npm run workflow:pos-build` - Build POS data transfer objects

### Claude Command Usage
Each workflow is designed to work with claude commands:

```bash
# Debug issues with automatic doc research
claude debug "search functionality not working"

# Add new menu items with validation
claude add-menu-item

# Update pricing across the system
claude update-pricing

# Deploy with full testing pipeline
claude deploy-changes

# Optimize images for performance
claude optimize-images

# Test POS system integration
claude test-pos-integration

# Build POS data transfer objects
claude build-pos-dtos
```

### Workflow Command Files
Detailed workflow documentation available in `.claude/commands/`:
- `debug.md` - Systematic debugging with doc research
- `add-menu-item.md` - Menu item addition with TypeScript validation
- `update-pricing.md` - Comprehensive pricing updates
- `deploy-changes.md` - Full deployment pipeline
- `optimize-images.md` - Image optimization workflows
- `test-pos-integration.md` - POS system testing procedures
- `build-pos-dtos.md` - POS DTO generation and validation

## Architecture Overview

### Component Structure
- **Layout Components** (`src/lib/components/layout/`): Header, Footer with Primos branding
- **UI Components** (`src/lib/components/ui/`): Reusable Button, Input, LoadingSpinner with consistent styling
- **Menu Components** (`src/lib/components/menu/`): MenuItem, MenuCategory with Svelte 5 runes for dynamic pricing

### State Management
Uses modern Svelte 5 runes pattern with dedicated stores:
- **Menu Store** (`src/lib/stores/menu-store.svelte.js`): Search, filtering, category selection with debounced queries
- **Cart Store** (`src/lib/stores/cart-store.svelte.js`): Cart management with localStorage persistence
- `$state()` for reactive variables
- `$derived()` for computed values  
- `$props()` for component properties
- **Important**: Avoid `$effect()` in stores to prevent orphan errors; use manual persistence calls instead

### TypeScript Integration
- **Menu Types** (`src/lib/types/menu.ts`): Complete type definitions for MenuItem, Category, CartItem
- **Pricing System** (`src/lib/utils/pricing.ts`): PricingCalculator class with tax calculations, size adjustments, delivery fees
- **Menu Validation** (`src/lib/utils/menu-validation.ts`): Runtime validation for menu data integrity

### Testing Architecture
- **Framework**: Vitest with JSDOM environment
- **Component Testing**: @testing-library/svelte with Svelte 5 support
- **Test Setup**: Mock ResizeObserver and IntersectionObserver in `src/test-setup.js`
- **Coverage**: Unit tests for pricing calculations, component behavior, and UI interactions

## Svelte Framework Documentation

### Official Documentation Resources
For comprehensive Svelte and SvelteKit guidance, reference these official LLM-optimized documentation sources:

- **Complete Documentation**: https://svelte.dev/llms-full.txt
  - Full Svelte + SvelteKit documentation in LLM-friendly format
- **Core Svelte**: https://svelte.dev/docs/svelte/llms.txt
  - Svelte 5 runes, template syntax, styling, and runtime concepts
- **SvelteKit**: https://svelte.dev/docs/kit/llms.txt
  - Routing, loading data, form actions, deployment, and advanced patterns

### Interactive Learning
- **Svelte Tutorial**: https://svelte.dev/tutorial/svelte/
  - Basic and advanced Svelte concepts with interactive examples
- **SvelteKit Tutorial**: https://svelte.dev/tutorial/kit/
  - Routing, forms, and SvelteKit-specific patterns

### When to Reference
- **Complex Runes Patterns**: When implementing advanced `$state`, `$derived`, or `$effect` logic
- **SvelteKit Routing**: For advanced routing, load functions, or form actions
- **Performance Questions**: Official best practices for optimization and bundle splitting
- **Migration Issues**: Svelte 4 to 5 migration guidance and compatibility patterns

These resources complement the project-specific patterns documented in this file and should be consulted for framework-specific questions.

## Brand Guidelines

### Color Scheme
```css
/* Primary brand colors */
--primos-blue-500: #253a80;  /* Main brand blue */
--primos-gold-500: #e3b212;  /* Accent gold */
--primos-red-600: #dc2626;   /* Call-to-action red */
```

### Component Patterns
- Use `btn-primary` class for consistent button styling
- Apply Primos color variants in Tailwind (e.g., `bg-primos-blue-500`)
- Maintain hover states with color transitions
- Include responsive design with xs:, sm:, lg:, xl: breakpoints

## Menu Data Architecture

### Data Structure
- **Categories**: appetizers, pizza, pasta, seafood, chicken, beverages, desserts
- **Items**: Dynamic pricing with size options, toppings, add-ons
- **Modifiers**: Comprehensive size/topping system with price calculations

### POS Integration Preparation
- Menu data structured for DTO pattern transformation
- Support for complex pizza configurations (whole/half toppings)
- Customer data format compatibility
- Order tracking and validation systems

## Development Patterns

### Component Development
```svelte
<script>
  // Use Svelte 5 runes pattern
  let { item, onAddToCart } = $props();
  let selectedSize = $state(item.sizes?.[0] || null);
  let quantity = $state(1);
  
  const totalPrice = $derived(
    (selectedSize?.price || item.basePrice) * quantity
  );
</script>
```

### Store Import Pattern
```javascript
// Import from .svelte.js files for runes support
import {
  menuData,
  filteredMenuItems,
  updateSearchQuery,
  selectCategory
} from '$lib/stores/menu-store.svelte.js';

import {
  addToCart,
  cartSummary,
  toggleCart
} from '$lib/stores/cart-store.svelte.js';
```

### localStorage Persistence Pattern
```javascript
// Manual persistence to avoid $effect orphan errors
function addToCart(item, options = {}) {
  // ... cart logic
  cartItems = [...cartItems, cartItem];
  
  // Manual save call instead of $effect
  saveCartToStorage(cartItems);
  return true;
}

// Safe localStorage access with error handling
function saveCartToStorage(items) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
}
```

### Testing Pattern
```javascript
import { render, screen } from '@testing-library/svelte/svelte5';
import { expect, test } from 'vitest';

test('component renders correctly', () => {
  render(ComponentName, { props: { /* props */ } });
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## Migration Context

### Current Phase
Dynamic menu system migration completed successfully. Key accomplishments:
- ✅ SvelteKit 5 project structure with stable image handling
- ✅ Comprehensive component architecture with TypeScript
- ✅ Tailwind CSS with Primos brand integration
- ✅ Testing infrastructure with Vitest and Svelte Testing Library
- ✅ Pricing calculation system with tax and delivery fee logic
- ✅ Svelte 5 runes state management with menu and cart stores
- ✅ Dynamic menu display with search, filtering, and category navigation
- ✅ Cart functionality with localStorage persistence
- ✅ Responsive grid/list view with smooth transitions

### Next Phase Requirements
- POS system integration with DTO pattern
- Order processing workflow
- Real-time menu synchronization
- Kitchen printer integration
- Customer management system

## Common Development Tasks

### Adding New Menu Components
1. Create component in appropriate `src/lib/components/` subdirectory
2. Use Svelte 5 runes for state management
3. Apply Primos brand colors and styling patterns
4. Write component tests with @testing-library/svelte
5. Export from index.js files for clean imports

### Pricing System Updates
- Use `PricingCalculator` class in `src/lib/utils/pricing.ts`
- Test calculations with `pricing.test.js` patterns
- Maintain 6% Michigan sales tax rate
- Support size-based pricing and topping calculations

### Menu Data Updates
- Validate with `menu-validation.ts` utilities
- Maintain TypeScript type compliance
- Test data transformations for POS compatibility

## Performance Optimization

### Build Configuration
- Manual code splitting for vendor, menu, and utils chunks
- Enhanced image optimization with @sveltejs/enhanced-img
- ES2022 target for modern browser support
- PostCSS integration for Tailwind optimization

### Image Handling
```svelte
<!-- Use regular img tags for dynamic paths (enhanced:img conflicts with template strings) -->
<img
  src="/images/menu/{item.image}"
  alt="{item.name} from Primos Pizza"
  class="w-full h-full object-cover rounded-lg"
  loading="lazy"
/>
```

**Note**: Enhanced:img plugin conflicts with dynamic template string paths. Use regular img tags with loading="lazy" for menu items.

## Troubleshooting

### Common Issues
- **TypeScript Errors**: Run `npm run typecheck` for detailed validation
- **Svelte 5 Runes**: Ensure using `$state()`, `$derived()`, `$props()` pattern and `.svelte.js` file extensions for stores
- **$effect Orphan Errors**: Use manual persistence calls instead of $effect in stores
- **Test Failures**: Check imports from '@testing-library/svelte/svelte5'
- **Enhanced:img Template Errors**: Use regular img tags for dynamic paths with template strings
- **Import Errors**: Use `.svelte.js` extension when importing runes-based stores

### Systematic Debugging
Use the automated debug command for complex issues:
```bash
claude debug "Your error message or issue description here"
```

This command will automatically research Svelte documentation, analyze the error, create a fix specification, and implement the solution.

### ESLint Configuration
Uses simplified configuration without TypeScript conflicts. Override rules in `.eslintrc.cjs` for project-specific requirements.

## Claude Commands

The project includes automated workflows in `.claude/commands/` for common development tasks:

### Available Commands
- **debug.md**: Automated debugging with documentation research and systematic fixes
- **add-menu-item.md**: Guided workflow for adding new menu items with validation
- **update-pricing.md**: Price calculation updates with testing validation
- **optimize-images.md**: Image optimization and performance tuning
- **build-pos-dtos.md**: POS system DTO pattern implementation
- **test-pos-integration.md**: POS integration testing workflows
- **deploy-changes.md**: Deployment preparation and validation

### Usage Pattern
```bash
claude [command-name] "specific details or context"
```

These commands provide comprehensive, automated workflows that include research, planning, implementation, and testing phases for complex development tasks.