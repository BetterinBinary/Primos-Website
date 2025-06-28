# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based website for Primo's Pizza, a restaurant in Livonia, MI. The site displays the restaurant's menu, contact information, and hours of operation.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Architecture

### Tech Stack
- **Framework**: SvelteKit
- **Build Tool**: Vite
- **Adapter**: @sveltejs/adapter-auto
- **Language**: JavaScript (ES modules)

### Project Structure
- `src/routes/+page.svelte` - Main page with navigation between Menu and Info sections
- `src/components/Menu.svelte` - Displays menu images in responsive grid layout
- `src/components/Info.svelte` - Shows restaurant contact info and hours
- `src/app.html` - HTML template
- `static/` - Contains menu images (primos-menu-1.png through primos-menu-6.png) and favicon

### Key Implementation Details

#### Responsive Design
The Menu component implements responsive behavior:
- Desktop: Menu images displayed in 2-column grid (3 rows of 2 images)
- Mobile (< 768px): Single column layout with full-width images
- Uses window resize listener and reactive statements for breakpoint detection

#### State Management
- Main page uses simple component state for navigation (`selected` variable)
- Navigation between 'menu', 'info', and home views
- Color scheme: Blue background (#253a80) with gold accents (#e3b212)

#### Static Assets
Menu is displayed via 6 PNG images (primos-menu-1.png to primos-menu-6.png) stored in the static directory.

## Development Notes

- No testing framework is currently configured
- No linting or formatting tools are set up
- Uses standard SvelteKit file-based routing
- CSS is component-scoped using Svelte's style blocks
- Restaurant info and hours are hardcoded in the Info component