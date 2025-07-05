import { menuLoader } from '../utils/menu-loader.js';
import { 
  POS_CATEGORIES, 
  getPOSCategory, 
  getItemsForPOSCategory, 
  isPOSCategory,
  convertToPOSCategories 
} from '../utils/pos-category-mapping.js';

/**
 * @typedef {import('../types/menu.js').MenuData} MenuData
 * @typedef {import('../types/menu.js').MenuItem} MenuItem
 * @typedef {import('../types/menu.js').MenuCategory} MenuCategory
 */

/**
 * Menu Store using Svelte 5 runes for reactive state management
 * Handles menu data, search, filtering, and category selection
 */

// Create the menu store
function createMenuStore() {
  // Core menu data state
  let menuData = $state(null);
  let loading = $state(true);
  let error = $state(null);

  // Search and filter state
  let searchQuery = $state('');
  let selectedCategory = $state('all');
  let viewMode = $state('grid');
  let usePOSCategories = $state(true); // Enable POS category view by default

  // Debounced search query for performance
  let debouncedSearchQuery = $state('');
  let searchTimeout;

  // Initialize menu data with enhanced logging
  async function initializeMenuData() {
    try {
      console.log('🍕 Starting menu data initialization...');
      loading = true;
      error = null;
      
      console.log('📊 Loading menu data from menuLoader...');
      menuData = await menuLoader.loadMenuData();
      console.log('✅ Menu data loaded successfully:', {
        categories: menuData?.categories?.length || 0,
        restaurant: menuData?.restaurant?.name || 'Unknown'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load menu data';
      error = errorMessage;
      console.error('❌ Menu data initialization error:', err);
      console.error('Error details:', {
        message: errorMessage,
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
    } finally {
      loading = false;
      console.log('🏁 Menu initialization completed. Loading:', loading, 'Error:', error);
    }
  }

  // Search functionality - no debouncing (SearchBar handles it)
  function updateSearchQuery(query) {
    console.log('📝 Menu Store: updateSearchQuery called with:', query);
    searchQuery = query;
    debouncedSearchQuery = query; // Update immediately since SearchBar already debounced
    console.log('📝 Menu Store: Updated searchQuery to:', searchQuery, 'debouncedSearchQuery to:', debouncedSearchQuery);
  }

  // Category selection
  function selectCategory(categoryId) {
    selectedCategory = categoryId;
  }

  // View mode toggle
  function setViewMode(mode) {
    viewMode = mode;
  }

  // POS category mode toggle
  function togglePOSCategories(enabled) {
    usePOSCategories = enabled;
    // Reset category selection when switching modes
    selectedCategory = 'all';
  }

  // Derived state for all menu items with category info
  const allMenuItems = $derived(() => {
    if (!menuData) return [];
    
    return menuData.categories.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
      }))
    );
  });

  // Derived state for available categories (original or POS)
  const availableCategories = $derived(() => {
    console.log('🏪 availableCategories: menuData =', menuData);
    console.log('🏪 availableCategories: usePOSCategories =', usePOSCategories);
    
    if (!menuData) {
      console.log('🏪 availableCategories: No menuData, returning empty array');
      return [];
    }
    
    if (usePOSCategories) {
      // For POS categories, we need to include items for the filter count
      const allItems = allMenuItems();
      console.log('🏪 availableCategories: All items count =', allItems.length);
      
      const categories = POS_CATEGORIES.map(category => {
        const items = getItemsForPOSCategory(allItems, category.id);
        console.log(`🏪 availableCategories: ${category.name} has ${items.length} items`);
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          items: items
        };
      });
      
      console.log('🏪 availableCategories: Final POS categories =', categories);
      return categories;
    } else {
      const originalCategories = menuData.categories.filter((category) => 
        category.items.some((item) => item.available)
      );
      console.log('🏪 availableCategories: Original categories =', originalCategories);
      return originalCategories;
    }
  });

  // Derived state for filtered menu items
  const filteredMenuItems = $derived(() => {
    console.log('🔄 Filtering: Starting with debouncedSearchQuery:', debouncedSearchQuery, 'selectedCategory:', selectedCategory);
    
    if (!menuData) return [];
    
    let items = allMenuItems();
    console.log('🔄 Filtering: Starting with', items.length, 'total items');
    
    // Filter by category (handle both original and POS categories)
    if (selectedCategory !== 'all') {
      if (usePOSCategories && isPOSCategory(selectedCategory)) {
        // Filter by POS category
        items = getItemsForPOSCategory(items, selectedCategory);
        console.log('🔄 Filtering: After POS category filter:', items.length, 'items');
      } else {
        // Filter by original category
        items = items.filter((item) => item.categoryId === selectedCategory);
        console.log('🔄 Filtering: After original category filter:', items.length, 'items');
      }
    }
    
    // Filter by search query (debounced)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      console.log('🔄 Filtering: Applying search filter for query:', query);
      
      const beforeSearch = items.length;
      items = items.filter((item) => {
        const matches = item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.categoryName.toLowerCase().includes(query);
        
        if (matches) {
          console.log('✅ Match found:', item.name);
        }
        return matches;
      });
      console.log('🔄 Filtering: After search filter:', items.length, 'items (was', beforeSearch, ')');
    } else {
      console.log('🔄 Filtering: No search query, skipping search filter');
    }
    
    // Only return available items
    const finalItems = items.filter((item) => item.available);
    console.log('🔄 Filtering: Final result:', finalItems.length, 'available items');
    
    return finalItems;
  });


  // Derived state for filtered categories (for category view)
  const filteredCategories = $derived(() => {
    if (!menuData) return [];
    
    if (debouncedSearchQuery.trim() || selectedCategory !== 'all') {
      // Group filtered items back into categories
      const categoryMap = new Map();
      
      filteredMenuItems().forEach((item) => {
        if (!categoryMap.has(item.categoryId)) {
          const originalCategory = menuData.categories.find(
            (c) => c.id === item.categoryId
          );
          categoryMap.set(item.categoryId, {
            ...originalCategory,
            items: [],
          });
        }
        categoryMap.get(item.categoryId).items.push(item);
      });
      
      return Array.from(categoryMap.values());
    } else {
      // Show all categories with available items
      return availableCategories();
    }
  });

  // Search suggestions based on menu items
  const searchSuggestions = $derived(() => {
    if (!menuData || !searchQuery.trim() || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set();
    
    menuData.categories.forEach((category) => {
      category.items.forEach((item) => {
        if (item.available) {
          // Add item name if it matches
          if (item.name.toLowerCase().includes(query)) {
            suggestions.add(item.name);
          }
          
          // Add category name if it matches
          if (category.name.toLowerCase().includes(query)) {
            suggestions.add(category.name);
          }
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  });

  // Statistics derived state
  const menuStats = $derived(() => {
    if (!menuData) return { totalItems: 0, totalCategories: 0, filteredItems: 0 };
    
    return {
      totalItems: allMenuItems().length,
      totalCategories: availableCategories().length,
      filteredItems: filteredMenuItems().length,
    };
  });

  // Utility functions
  function getMenuItemById(itemId) {
    if (!menuData) return null;
    return menuLoader.getMenuItemById(itemId);
  }

  function getCategoryById(categoryId) {
    if (!menuData) return null;
    return menuLoader.getCategoryById(categoryId);
  }

  function resetFilters() {
    selectedCategory = 'all';
    searchQuery = '';
    debouncedSearchQuery = '';
  }

  function getItemsByCategory(categoryId) {
    if (!menuData) return [];
    return menuLoader.getMenuItemsByCategory(categoryId);
  }

  return {
    // State getters
    get menuData() { return menuData; },
    get loading() { return loading; },
    get error() { return error; },
    get searchQuery() { return searchQuery; },
    get selectedCategory() { return selectedCategory; },
    get viewMode() { return viewMode; },
    get usePOSCategories() { return usePOSCategories; },
    get debouncedSearchQuery() { return debouncedSearchQuery; },
    get allMenuItems() { return allMenuItems(); },
    get filteredMenuItems() { return filteredMenuItems(); },
    get availableCategories() { return availableCategories(); },
    get filteredCategories() { return filteredCategories(); },
    get searchSuggestions() { return searchSuggestions(); },
    get menuStats() { return menuStats(); },
    
    // Actions
    initializeMenuData,
    updateSearchQuery,
    selectCategory,
    setViewMode,
    togglePOSCategories,
    getMenuItemById,
    getCategoryById,
    resetFilters,
    getItemsByCategory
  };
}

// Export the menu store instance
export const menu = createMenuStore();

// Export reactive properties - all as functions for consistent reactivity
export const menuData = () => menu.menuData;
export const loading = () => menu.loading;
export const error = () => menu.error;
export const searchQuery = () => menu.searchQuery;
export const selectedCategory = () => menu.selectedCategory;
export const viewMode = () => menu.viewMode;
export const usePOSCategories = () => menu.usePOSCategories;
export const debouncedSearchQuery = () => menu.debouncedSearchQuery;
export const allMenuItems = () => menu.allMenuItems;
export const filteredMenuItems = () => menu.filteredMenuItems;
export const availableCategories = () => menu.availableCategories;
export const filteredCategories = () => menu.filteredCategories;
export const searchSuggestions = () => menu.searchSuggestions;
export const menuStats = () => menu.menuStats;

// Export action functions directly
export const {
  initializeMenuData,
  updateSearchQuery,
  selectCategory,
  setViewMode,
  togglePOSCategories,
  getMenuItemById,
  getCategoryById,
  resetFilters,
  getItemsByCategory
} = menu;

// Note: Initialization is now handled by components to avoid race conditions