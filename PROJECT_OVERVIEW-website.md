# Primos-Website Project Overview

## Project Summary
This is a customer-facing website for Primo's Pizza restaurant, built with SvelteKit. The site displays menu information and restaurant details to customers, serving as a digital storefront for the business.

## Technology Stack

### Frontend Framework
- **SvelteKit**: Modern full-stack web framework built on Svelte 4
- **Vite**: Fast build tool and development server
- **Adapter**: Auto-adapter for flexible deployment options

### Current Deployment
- Basic SvelteKit project with minimal configuration
- No backend integration yet (static website)
- No payment processing or ordering system

## Project Structure

```
src/
├── app.html                 # Main HTML template
├── routes/
│   └── +page.svelte        # Homepage with menu/info navigation
├── components/
│   ├── Menu.svelte         # Static menu image display
│   └── Info.svelte         # Restaurant contact info & hours
└── lib/
    └── index.js            # Empty utility file
```

## Current Features

### 1. Homepage (+page.svelte)
- **Restaurant branding**: Primo's Pizza title with location info
- **Contact display**: Phone number prominently displayed (248-476-4260)
- **Two-tab navigation**: Menu and Info sections
- **Responsive design**: Basic mobile-friendly layout
- **Color scheme**: Blue (#253a80) and gold (#e3b212) branding

### 2. Menu Component (Menu.svelte)
- **Static image display**: Shows 6 menu images (primos-menu-1.png through 6)
- **Responsive layout**: 
  - Desktop: 2 images per row (3 rows total)
  - Mobile: Single column layout
- **Image handling**: References static images in public directory
- **No interactive functionality**: Pure display component

### 3. Info Component (Info.svelte)
- **Contact information**: Phone and address display
- **Operating hours**: Complete weekly schedule
  - Sunday: 4pm - 12am
  - Monday-Tuesday: 4pm - 10pm  
  - Wednesday-Thursday: 4pm - 12am
  - Friday-Saturday: 4pm - 2am
- **Static content**: No dynamic data fetching

## Current Limitations

### No E-commerce Functionality
- No shopping cart system
- No order placement capability
- No payment processing
- No customer accounts
- No order tracking

### No Backend Integration
- No API connections to POS system
- No real-time menu updates
- No order management
- No customer data collection

### Basic Content Management
- Menu items are static images
- No searchable menu database
- No dynamic pricing
- No item customization options

### Missing Customer Features
- No online ordering
- No delivery/pickup selection
- No special requests handling
- No loyalty programs
- No promotions/deals system

## Integration Opportunities with POS System

### 1. Menu Synchronization
- **Dynamic menu loading**: Fetch menu data from POS API
- **Real-time pricing**: Display current prices from POS system
- **Item availability**: Show/hide items based on inventory
- **Category organization**: Match POS menu structure

### 2. Order Processing
- **Cart functionality**: Allow customers to build orders
- **POS integration**: Send orders directly to POS system
- **Order formatting**: Match POS item structure and pricing rules
- **Customer data**: Integrate with existing customer database

### 3. Real-time Features
- **Order status**: Track order progress through POS workflow
- **Wait times**: Display estimated preparation times
- **Store hours**: Dynamic display based on actual operating status
- **Special announcements**: Push notifications from POS system

## Development Recommendations

### Phase 1: Basic Integration
1. **API Configuration**: Set up connection to POS server (http://192.168.0.75:8050)
2. **Menu API**: Fetch and display dynamic menu from POS
3. **Basic cart**: Simple order building interface
4. **Order submission**: Send orders to POS system

### Phase 2: Enhanced Features
1. **Customer accounts**: Integration with POS customer database
2. **Order customization**: Support for pizza toppings, special requests
3. **Pricing engine**: Implement POS pricing rules (twins, delivery fees)
4. **Payment integration**: Connect to existing payment processing

### Phase 3: Advanced Features
1. **Real-time updates**: Order status and wait times
2. **Mobile optimization**: Progressive Web App features
3. **Marketing integration**: Promotions and loyalty programs
4. **Analytics**: Customer behavior and order patterns

## File Dependencies

### Required Static Assets
- `static/primos-menu-1.png` through `static/primos-menu-6.png`
- `static/favicon.png`

### Package Dependencies
- `@sveltejs/kit ^1.27.4`
- `@sveltejs/adapter-auto ^2.0.0`
- `svelte ^4.2.7`
- `vite ^4.4.2`

## Development Setup

### Prerequisites
- Node.js (latest LTS version)
- npm/pnpm/yarn package manager

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Key Files to Modify for POS Integration
1. **src/lib/**: Add API utilities for POS communication
2. **src/routes/+page.svelte**: Enhance with cart and ordering
3. **src/components/Menu.svelte**: Replace static images with dynamic menu
4. **src/components/**: Add Cart, Checkout, CustomerForm components
5. **package.json**: Add fetch utilities and form handling libraries

## Current Strengths
- Clean, simple design focused on restaurant branding
- Mobile-responsive layout
- Fast loading with minimal dependencies
- Easy to modify and extend
- Good foundation for e-commerce integration

## Next Development Priorities
1. **POS API Integration**: Connect to existing backend
2. **Dynamic Menu**: Replace static images with live data
3. **Cart System**: Enable order building
4. **Customer Flow**: Design ordering process
5. **Order Submission**: Send orders to POS system

This website serves as an excellent foundation for a full e-commerce ordering system that can seamlessly integrate with the existing Primos POS infrastructure.
