# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Primos Pizza website is a sophisticated SvelteKit 5 application currently in migration from static menu images to a dynamic, POS-ready ordering system. The project leverages modern Svelte 5 runes for state management, comprehensive TypeScript typing, and is architected for seamless integration with existing POS systems.

**Current Status**: Migration in progress on `migration` branch with enhanced component architecture and testing infrastructure completed.

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

## Architecture Overview

### Component Structure
- **Layout Components** (`src/lib/components/layout/`): Header, Footer with Primos branding
- **UI Components** (`src/lib/components/ui/`): Reusable Button, Input, LoadingSpinner with consistent styling
- **Menu Components** (`src/lib/components/menu/`): MenuItem, MenuCategory with Svelte 5 runes for dynamic pricing

### State Management
Uses modern Svelte 5 runes pattern:
- `$state()` for reactive variables
- `$derived()` for computed values
- `$props()` for component properties
- `$effect()` for side effects

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
The project is in active migration from static menu images to dynamic components. Key accomplishments:
- ✅ SvelteKit 5 project structure with enhanced-img integration
- ✅ Comprehensive component architecture with TypeScript
- ✅ Tailwind CSS with Primos brand integration
- ✅ Testing infrastructure with Vitest and Svelte Testing Library
- ✅ Pricing calculation system with tax and delivery fee logic

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
<!-- Use enhanced:img for automatic optimization -->
<enhanced:img
  src="/images/menu/{item.image}"
  alt="{item.name} from Primos Pizza"
  sizes="(max-width: 640px) 100vw, 320px"
/>
```

## Troubleshooting

### Common Issues
- **TypeScript Errors**: Run `npm run typecheck` for detailed validation
- **Svelte 5 Runes**: Ensure using `$state()`, `$derived()`, `$props()` pattern
- **Test Failures**: Check imports from '@testing-library/svelte/svelte5'
- **Build Errors**: Verify enhanced-img plugin configuration in vite.config.js

### ESLint Configuration
Uses simplified configuration without TypeScript conflicts. Override rules in `.eslintrc.cjs` for project-specific requirements.