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
