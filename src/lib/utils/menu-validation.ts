import type { MenuData, MenuItem, MenuCategory, RestaurantInfo, Topping, Sauce, Coupon } from '../types/menu.js';

export class MenuValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'MenuValidationError';
  }
}

export function validateRestaurantInfo(data: unknown): RestaurantInfo {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Restaurant info must be an object');
  }

  const info = data as Record<string, unknown>;

  if (!info.name || typeof info.name !== 'string') {
    throw new MenuValidationError('Restaurant name is required', 'name');
  }

  if (!info.phone || typeof info.phone !== 'string') {
    throw new MenuValidationError('Restaurant phone is required', 'phone');
  }

  if (!info.address || typeof info.address !== 'string') {
    throw new MenuValidationError('Restaurant address is required', 'address');
  }

  return info as unknown as RestaurantInfo;
}

export function validateMenuItem(data: unknown): MenuItem {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Menu item must be an object');
  }

  const item = data as Record<string, unknown>;

  if (!item.id || typeof item.id !== 'string') {
    throw new MenuValidationError('Menu item ID is required', 'id');
  }

  if (!item.name || typeof item.name !== 'string') {
    throw new MenuValidationError('Menu item name is required', 'name');
  }

  if (!item.category || typeof item.category !== 'string') {
    throw new MenuValidationError('Menu item category is required', 'category');
  }

  if (typeof item.available !== 'boolean') {
    throw new MenuValidationError('Menu item availability must be boolean', 'available');
  }

  return item as unknown as MenuItem;
}

export function validateMenuCategory(data: unknown): MenuCategory {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Menu category must be an object');
  }

  const category = data as Record<string, unknown>;

  if (!category.id || typeof category.id !== 'string') {
    throw new MenuValidationError('Category ID is required', 'id');
  }

  if (!category.name || typeof category.name !== 'string') {
    throw new MenuValidationError('Category name is required', 'name');
  }

  if (!Array.isArray(category.items)) {
    throw new MenuValidationError('Category items must be an array', 'items');
  }

  // Validate each menu item
  category.items.forEach((item, index) => {
    try {
      validateMenuItem(item);
    } catch (error) {
      throw new MenuValidationError(
        `Invalid menu item at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `items[${index}]`
      );
    }
  });

  return category as unknown as MenuCategory;
}

export function validateTopping(data: unknown): Topping {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Topping must be an object');
  }

  const topping = data as Record<string, unknown>;

  if (!topping.id || typeof topping.id !== 'string') {
    throw new MenuValidationError('Topping ID is required', 'id');
  }

  if (!topping.name || typeof topping.name !== 'string') {
    throw new MenuValidationError('Topping name is required', 'name');
  }

  const validCategories = ['meat', 'vegetable', 'cheese', 'fruit', 'seafood'];
  if (!topping.category || !validCategories.includes(topping.category as string)) {
    throw new MenuValidationError('Topping category must be one of: ' + validCategories.join(', '), 'category');
  }

  if (typeof topping.available !== 'boolean') {
    throw new MenuValidationError('Topping availability must be boolean', 'available');
  }

  return topping as unknown as Topping;
}

export function validateSauce(data: unknown): Sauce {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Sauce must be an object');
  }

  const sauce = data as Record<string, unknown>;

  if (!sauce.id || typeof sauce.id !== 'string') {
    throw new MenuValidationError('Sauce ID is required', 'id');
  }

  if (!sauce.name || typeof sauce.name !== 'string') {
    throw new MenuValidationError('Sauce name is required', 'name');
  }

  if (typeof sauce.available !== 'boolean') {
    throw new MenuValidationError('Sauce availability must be boolean', 'available');
  }

  return sauce as unknown as Sauce;
}

export function validateCoupon(data: unknown): Coupon {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Coupon must be an object');
  }

  const coupon = data as Record<string, unknown>;

  if (!coupon.id || typeof coupon.id !== 'string') {
    throw new MenuValidationError('Coupon ID is required', 'id');
  }

  if (!coupon.deal || typeof coupon.deal !== 'string') {
    throw new MenuValidationError('Coupon deal is required', 'deal');
  }

  if (!coupon.restrictions || typeof coupon.restrictions !== 'string') {
    throw new MenuValidationError('Coupon restrictions are required', 'restrictions');
  }

  return coupon as unknown as Coupon;
}

export function validateMenuData(data: unknown): MenuData {
  if (!data || typeof data !== 'object') {
    throw new MenuValidationError('Menu data must be an object');
  }

  const menu = data as Record<string, unknown>;

  // Validate restaurant info
  if (!menu.restaurant) {
    throw new MenuValidationError('Restaurant info is required', 'restaurant');
  }
  const restaurant = validateRestaurantInfo(menu.restaurant);

  // Validate categories
  if (!Array.isArray(menu.categories)) {
    throw new MenuValidationError('Categories must be an array', 'categories');
  }
  const categories = menu.categories.map((category, index) => {
    try {
      return validateMenuCategory(category);
    } catch (error) {
      throw new MenuValidationError(
        `Invalid category at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `categories[${index}]`
      );
    }
  });

  // Validate toppings
  if (!Array.isArray(menu.toppings)) {
    throw new MenuValidationError('Toppings must be an array', 'toppings');
  }
  const toppings = menu.toppings.map((topping, index) => {
    try {
      return validateTopping(topping);
    } catch (error) {
      throw new MenuValidationError(
        `Invalid topping at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `toppings[${index}]`
      );
    }
  });

  // Validate sauces
  if (!Array.isArray(menu.sauces)) {
    throw new MenuValidationError('Sauces must be an array', 'sauces');
  }
  const sauces = menu.sauces.map((sauce, index) => {
    try {
      return validateSauce(sauce);
    } catch (error) {
      throw new MenuValidationError(
        `Invalid sauce at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `sauces[${index}]`
      );
    }
  });

  // Validate coupons
  if (!Array.isArray(menu.coupons)) {
    throw new MenuValidationError('Coupons must be an array', 'coupons');
  }
  const coupons = menu.coupons.map((coupon, index) => {
    try {
      return validateCoupon(coupon);
    } catch (error) {
      throw new MenuValidationError(
        `Invalid coupon at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `coupons[${index}]`
      );
    }
  });

  return {
    restaurant,
    categories,
    toppings,
    sauces,
    coupons
  };
}