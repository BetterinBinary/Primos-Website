/**
 * POS Category Mapping Utility
 * Maps existing menu categories to POS system consolidated categories
 * Maintains backward compatibility while providing consolidated view
 * @typedef {import('../types/menu.js').MenuItem} MenuItem
 * @typedef {import('../types/menu.js').MenuCategory} MenuCategory
 */

/**
 * POS category configuration in display order
 */
export const POS_CATEGORIES = [
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'All pizza varieties',
    originalCategories: ['pizza']
  },
  {
    id: 'chicken',
    name: 'Chicken',
    description: 'Fried chicken, tenderloins, and wing dings',
    originalCategories: ['chicken', 'chicken-tenderloins', 'wing-dings']
  },
  {
    id: 'ribs',
    name: 'Ribs',
    description: 'BBQ ribs and rib specialties',
    originalCategories: ['bbq']
  },
  {
    id: 'combo-plates',
    name: 'Combo Plates',
    description: 'Combination plates and dinner specials',
    originalCategories: ['combo']
  },
  {
    id: 'seafood',
    name: 'Seafood',
    description: 'Fresh seafood and hand-battered shrimp',
    originalCategories: ['seafood', 'hand-battered-shrimp']
  },
  {
    id: 'pasta',
    name: 'Pasta',
    description: 'Spaghetti, mostaccioli, and ravioli dishes',
    originalCategories: ['pasta']
  },
  {
    id: 'subs',
    name: 'Submarines',
    description: 'Submarine sandwiches and hoagies',
    originalCategories: ['sandwiches']
  },
  {
    id: 'salads',
    name: 'Salads',
    description: 'Fresh salads and healthy options',
    originalCategories: ['salads']
  },
  {
    id: 'sandwich/burger',
    name: 'Sandwiches & Burgers',
    description: 'Burger and non-submarine sandwich options',
    originalCategories: []
  },
  {
    id: 'dessert',
    name: 'Desserts',
    description: 'Sweet treats and desserts',
    originalCategories: ['desserts']
  },
  {
    id: 'sides',
    name: 'Sides & Appetizers',
    description: 'Appetizers and side orders',
    originalCategories: ['appetizers']
  }
];

/**
 * Create mapping from original category to POS category
 * @type {Record<string, string>}
 */
export const ORIGINAL_TO_POS_MAPPING = {};

// Build the mapping
POS_CATEGORIES.forEach(posCategory => {
  posCategory.originalCategories.forEach(originalCategory => {
    ORIGINAL_TO_POS_MAPPING[originalCategory] = posCategory.id;
  });
});

/**
 * Get POS category for an original category
 * @param {string} originalCategory - The original menu category
 * @returns {string} The corresponding POS category ID
 */
export function getPOSCategory(originalCategory) {
  return ORIGINAL_TO_POS_MAPPING[originalCategory] || 'sides';
}

/**
 * Get POS category details by ID
 * @param {string} posCategoryId - The POS category ID
 * @returns {Object|null} The POS category object or null if not found
 */
export function getPOSCategoryDetails(posCategoryId) {
  return POS_CATEGORIES.find(cat => cat.id === posCategoryId) || null;
}

/**
 * Group menu items by POS categories
 * @param {MenuItem[]} menuItems - Array of menu items
 * @returns {Record<string, MenuItem[]>} Object with POS category IDs as keys and arrays of items as values
 */
export function groupItemsByPOSCategory(menuItems) {
  const grouped = {};
  
  // Initialize all POS categories
  POS_CATEGORIES.forEach(category => {
    grouped[category.id] = [];
  });
  
  // Group items by their POS category
  menuItems.forEach(item => {
    const posCategory = getPOSCategory(item.category);
    if (grouped[posCategory]) {
      grouped[posCategory].push(item);
    }
  });
  
  return grouped;
}

/**
 * Get all menu items for a specific POS category
 * @param {MenuItem[]} menuItems - Array of all menu items
 * @param {string} posCategoryId - The POS category ID to filter by
 * @returns {MenuItem[]} Array of items in the specified POS category
 */
export function getItemsForPOSCategory(menuItems, posCategoryId) {
  if (posCategoryId === 'all') {
    return menuItems;
  }
  
  const posCategory = getPOSCategoryDetails(posCategoryId);
  if (!posCategory) {
    return [];
  }
  
  // Special handling for sandwich/burger category
  if (posCategoryId === 'sandwich/burger') {
    return menuItems.filter(item => 
      item.category === 'sandwiches' && 
      !item.name.toLowerCase().includes('sub')
    );
  }
  
  return menuItems.filter(item => 
    posCategory.originalCategories.includes(item.category)
  );
}

/**
 * Check if a category ID is a POS category
 * @param {string} categoryId - The category ID to check
 * @returns {boolean} True if it's a POS category
 */
export function isPOSCategory(categoryId) {
  return POS_CATEGORIES.some(cat => cat.id === categoryId);
}

/**
 * Get the display order index for a POS category
 * @param {string} posCategoryId - The POS category ID
 * @returns {number} The display order index (0-based)
 */
export function getPOSCategoryOrder(posCategoryId) {
  const index = POS_CATEGORIES.findIndex(cat => cat.id === posCategoryId);
  return index >= 0 ? index : 999; // Unknown categories go to the end
}

/**
 * Get POS categories sorted in display order
 * @returns {Array<Object>} Array of POS category objects in display order
 */
export function getPOSCategoriesInOrder() {
  return [...POS_CATEGORIES];
}

/**
 * Convert menu categories data structure to POS categories
 * @param {MenuCategory[]} originalCategories - Original menu categories with items
 * @returns {Array<Object>} POS categories with consolidated items
 */
export function convertToPOSCategories(originalCategories) {
  const posCategories = POS_CATEGORIES.map(posCategory => ({
    ...posCategory,
    items: []
  }));
  
  // Distribute items from original categories to POS categories
  originalCategories.forEach(originalCategory => {
    const posCategoryId = getPOSCategory(originalCategory.id);
    const posCategory = posCategories.find(cat => cat.id === posCategoryId);
    
    if (posCategory && originalCategory.items) {
      posCategory.items.push(...originalCategory.items);
    }
  });
  
  return posCategories;
}