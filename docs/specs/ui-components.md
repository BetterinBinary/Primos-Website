# UI Components Specification

## Overview

This document defines the component architecture for the Primos Pizza website, focusing on reusability, accessibility, and maintainability using SvelteKit 5 and Tailwind CSS.

## Design System

### Brand Colors
```css
/* Primary Colors */
--primos-blue-500: #253a80;    /* Main brand blue */
--primos-gold-500: #e3b212;    /* Accent gold */
--primos-red-600: #dc2626;     /* CTAs and alerts */

/* Supporting Colors */
--gray-50: #f9fafb;            /* Light backgrounds */
--gray-900: #111827;           /* Dark text */
```

### Typography
```css
/* Font Families */
font-display: 'Playfair Display', serif;  /* Headers */
font-body: 'Inter', sans-serif;           /* Body text */

/* Scale */
text-xs: 0.75rem;     /* 12px */
text-sm: 0.875rem;    /* 14px */
text-base: 1rem;      /* 16px */
text-lg: 1.125rem;    /* 18px */
text-xl: 1.25rem;     /* 20px */
text-2xl: 1.5rem;     /* 24px */
text-3xl: 1.875rem;   /* 30px */
text-4xl: 2.25rem;    /* 36px */
```

## Component Architecture

### Layout Components

#### Header.svelte
```svelte
<!-- Main navigation header -->
<header class="bg-primos-blue-500 text-white">
  <nav class="container mx-auto px-4">
    <!-- Logo, navigation links, cart icon -->
  </nav>
</header>
```

**Props:**
- `currentPage: string` - Active page indicator
- `cartItemCount: number` - Items in cart

#### Footer.svelte
```svelte
<!-- Site footer with contact info -->
<footer class="bg-gray-900 text-white">
  <!-- Contact info, hours, social links -->
</footer>
```

### Menu Components

#### MenuItem.svelte
**Primary menu item display component**

**Props:**
```typescript
interface MenuItemProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
}
```

**Features:**
- Size selection (radio buttons)
- Topping selection (checkboxes)
- Quantity adjustment
- Real-time price calculation
- Availability status
- Allergen information display

**Responsive Design:**
- Mobile: Single column, stacked layout
- Tablet: Two column grid
- Desktop: Multi-column grid with hover effects

#### MenuCategory.svelte
**Category section wrapper**

**Props:**
```typescript
interface MenuCategoryProps {
  category: MenuCategory;
  items: MenuItem[];
  onAddToCart: (item: CartItem) => void;
}
```

**Features:**
- Category header with description
- Collapsible item list
- Item filtering within category
- Loading states

#### MenuGrid.svelte
**Responsive grid layout for menu items**

**Props:**
```typescript
interface MenuGridProps {
  items: MenuItem[];
  searchQuery: string;
  selectedCategory: string;
}
```

**Grid Breakpoints:**
- `xs`: 1 column (mobile)
- `sm`: 2 columns (tablet)
- `lg`: 3 columns (desktop)
- `xl`: 4 columns (large desktop)

### UI Components

#### Button.svelte
**Reusable button component**

**Variants:**
```typescript
type ButtonVariant = 
  | 'primary'     // primos-blue background
  | 'secondary'   // primos-gold background
  | 'danger'      // primos-red background
  | 'outline'     // bordered with transparent bg
  | 'ghost';      // minimal styling
```

**Sizes:**
```typescript
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
```

#### Input.svelte
**Form input component**

**Types:**
- Text input
- Email input
- Phone input
- Textarea
- Select dropdown

**Features:**
- Built-in validation
- Error state styling
- Loading state
- Accessible labels

#### Modal.svelte
**Overlay modal component**

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose: () => void;
}
```

**Features:**
- Focus management
- Escape key handling
- Backdrop click to close
- Animation transitions

#### LoadingSpinner.svelte
**Loading indicator component**

**Variants:**
- Small (16px) - Inline loading
- Medium (24px) - Button loading
- Large (48px) - Page loading

### Cart Components

#### CartItem.svelte
**Individual cart item display**

**Features:**
- Item details and customizations
- Quantity adjustment
- Remove item action
- Price display

#### CartSummary.svelte
**Order total and checkout**

**Features:**
- Subtotal calculation
- Tax calculation
- Delivery fee (if applicable)
- Coupon code application
- Checkout button

#### CartDrawer.svelte
**Slide-out cart panel**

**Features:**
- Smooth slide animation
- Mobile-optimized layout
- Quick add/remove actions
- Checkout navigation

## State Management with Svelte 5 Runes

### Menu Store
```typescript
export function createMenuStore() {
  let categories = $state([]);
  let items = $state([]);
  let searchQuery = $state("");
  let selectedCategory = $state("all");
  
  const filteredItems = $derived(() => {
    // Filter logic
  });
  
  return {
    get categories() { return categories; },
    get items() { return items; },
    get searchQuery() { return searchQuery; },
    set searchQuery(value) { searchQuery = value; },
    get filteredItems() { return filteredItems; }
  };
}
```

### Cart Store
```typescript
export function createCartStore() {
  let items = $state([]);
  
  const total = $derived(() => 
    items.reduce((sum, item) => sum + item.totalPrice, 0)
  );
  
  function addItem(item: CartItem) {
    // Add logic with duplicate checking
  }
  
  return {
    get items() { return items; },
    get total() { return total; },
    addItem,
    removeItem: (id) => { /* remove logic */ },
    clearCart: () => { items = []; }
  };
}
```

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Skip links for main content
- Escape key for modals/dropdowns

#### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Alternative text for images

#### Color and Contrast
- 4.5:1 contrast ratio minimum
- Color not sole means of communication
- Focus indicators clearly visible

### Implementation Guidelines

#### Focus Management
```svelte
<script>
  let menuItemRef;
  
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      addToCart(item);
    }
  }
</script>

<article 
  bind:this={menuItemRef}
  tabindex="0"
  role="button"
  aria-label="Add {item.name} to cart"
  onkeydown={handleKeydown}
>
  <!-- Content -->
</article>
```

#### ARIA Labels
```svelte
<button
  aria-label="Add {item.name} to cart for ${totalPrice.toFixed(2)}"
  aria-describedby="item-{item.id}-description"
>
  Add to Cart
</button>

<div id="item-{item.id}-description" class="sr-only">
  {item.description}
  {#if item.allergens?.length}
    Contains: {item.allergens.join(', ')}
  {/if}
</div>
```

## Performance Optimization

### Image Handling
```svelte
<script>
  import { enhancedImages } from '@sveltejs/enhanced-img';
</script>

<enhanced:img
  src="./images/menu/{item.image}"
  alt="{item.name} from Primos Pizza"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  class="w-full h-48 object-cover rounded-lg"
/>
```

### Lazy Loading
- Images loaded on intersection
- Menu categories loaded on demand
- Progressive enhancement

### Bundle Optimization
- Component code splitting
- Dynamic imports for large features
- Minimal runtime overhead

## Testing Strategy

### Component Tests
```javascript
import { render, screen, fireEvent } from '@testing-library/svelte';
import MenuItem from './MenuItem.svelte';

test('displays item information correctly', () => {
  const mockItem = {
    id: 'test-pizza',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella and basil',
    basePrice: 14.99,
    available: true
  };
  
  render(MenuItem, { props: { item: mockItem } });
  
  expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
  expect(screen.getByText('$14.99')).toBeInTheDocument();
});
```

### Visual Regression Tests
- Chromatic for component screenshots
- Cross-browser compatibility
- Mobile responsiveness validation

## Style Guide

### Spacing Scale
```css
/* Tailwind spacing scale */
spacing-1: 0.25rem;   /* 4px */
spacing-2: 0.5rem;    /* 8px */
spacing-4: 1rem;      /* 16px */
spacing-6: 1.5rem;    /* 24px */
spacing-8: 2rem;      /* 32px */
spacing-12: 3rem;     /* 48px */
```

### Border Radius
```css
rounded-sm: 0.125rem;  /* 2px */
rounded: 0.25rem;      /* 4px */
rounded-md: 0.375rem;  /* 6px */
rounded-lg: 0.5rem;    /* 8px */
rounded-xl: 0.75rem;   /* 12px */
```

### Shadows
```css
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

## Future Enhancements

### Progressive Web App Features
- Service worker implementation
- Offline menu caching
- Push notifications for order updates

### Advanced Interactions
- Drag and drop cart management
- Voice ordering integration
- Gesture-based navigation

### Personalization
- User preference storage
- Order history
- Recommended items based on past orders