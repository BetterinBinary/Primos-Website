import type { MenuData, MenuCategory, RestaurantInfo, Topping, Sauce, Coupon } from '../types/menu.js';
import { validateMenuData } from './menu-validation.js';

// Import JSON data
import restaurantInfoData from '../data/restaurant-info.json';
import toppingsData from '../data/toppings.json';
import saucesData from '../data/sauces.json';
import couponsData from '../data/coupons.json';
import categoriesData from '../data/menu-categories.json';

export class MenuLoader {
  private static _instance: MenuLoader;
  private _menuData: MenuData | null = null;

  private constructor() {}

  public static getInstance(): MenuLoader {
    if (!MenuLoader._instance) {
      MenuLoader._instance = new MenuLoader();
    }
    return MenuLoader._instance;
  }

  public async loadMenuData(): Promise<MenuData> {
    if (this._menuData) {
      console.log('📁 Using cached menu data');
      return this._menuData;
    }

    try {
      console.log('🔄 Loading raw menu data from JSON files...');
      
      const menuData: MenuData = {
        restaurant: restaurantInfoData as RestaurantInfo,
        categories: categoriesData as MenuCategory[],
        toppings: toppingsData as Topping[],
        sauces: saucesData as Sauce[],
        coupons: couponsData as Coupon[]
      };

      console.log('📋 Raw data loaded:', {
        restaurant: menuData.restaurant?.name,
        categories: menuData.categories?.length,
        toppings: menuData.toppings?.length,
        sauces: menuData.sauces?.length,
        coupons: menuData.coupons?.length
      });

      console.log('🔍 Validating menu data...');
      // Validate the loaded data
      this._menuData = validateMenuData(menuData);
      console.log('✅ Menu data validation completed successfully');
      
      return this._menuData;
    } catch (error) {
      console.error('❌ Failed to load menu data:', error);
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      throw new Error(`Menu data loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public getMenuData(): MenuData | null {
    return this._menuData;
  }

  public getCategoryById(categoryId: string): MenuCategory | undefined {
    return this._menuData?.categories.find(category => category.id === categoryId);
  }

  public getMenuItemById(itemId: string): any | undefined {
    if (!this._menuData) return undefined;

    for (const category of this._menuData.categories) {
      const item = category.items.find(item => item.id === itemId);
      if (item) return item;
    }
    return undefined;
  }

  public getToppingsForCategory(category: string): Topping[] {
    if (!this._menuData) return [];
    
    // For now, return all toppings. In the future, you might want to filter by category
    return this._menuData.toppings.filter(topping => topping.available);
  }

  public getAvailableSauces(): Sauce[] {
    if (!this._menuData) return [];
    return this._menuData.sauces.filter(sauce => sauce.available);
  }

  public getActiveCoupons(): Coupon[] {
    if (!this._menuData) return [];
    
    // Filter out expired coupons (you might want to implement proper date checking)
    return this._menuData.coupons;
  }

  public searchMenuItems(query: string): any[] {
    if (!this._menuData || !query.trim()) return [];

    const results: any[] = [];
    const lowercaseQuery = query.toLowerCase();

    for (const category of this._menuData.categories) {
      for (const item of category.items) {
        if (
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.description?.toLowerCase().includes(lowercaseQuery)
        ) {
          results.push({ ...item, categoryName: category.name });
        }
      }
    }

    return results;
  }

  public getMenuItemsByCategory(categoryId: string): any[] {
    const category = this.getCategoryById(categoryId);
    return category ? category.items.filter(item => item.available) : [];
  }

  public refreshMenuData(): void {
    this._menuData = null;
  }
}

// Export singleton instance
export const menuLoader = MenuLoader.getInstance();