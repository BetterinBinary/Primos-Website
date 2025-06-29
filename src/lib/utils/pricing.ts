import type { MenuItem, CartItem, Size } from '../types/menu.js';

export interface PriceCalculation {
  basePrice: number;
  toppingsPrice: number;
  sizeAdjustment: number;
  subtotal: number;
  tax?: number;
  total: number;
}

export class PricingCalculator {
  private static TAX_RATE = 0.06; // 6% Michigan sales tax

  public static calculateItemPrice(
    item: MenuItem,
    selectedSize?: string,
    selectedToppings: string[] = [],
    quantity: number = 1
  ): PriceCalculation {
    let basePrice = item.basePrice || 0;
    let sizeAdjustment = 0;
    let toppingsPrice = 0;

    // Calculate size-based pricing
    if (selectedSize && item.sizes) {
      const sizeOption = item.sizes.find(size => size.size === selectedSize);
      if (sizeOption) {
        basePrice = sizeOption.price;
      }
    }

    // Calculate toppings pricing
    if (selectedToppings.length > 0 && item.toppings?.extraItems) {
      const toppingPricePerItem = this.getToppingPrice(item, selectedSize);
      toppingsPrice = toppingPricePerItem * selectedToppings.length;
    }

    const subtotal = (basePrice + sizeAdjustment + toppingsPrice) * quantity;
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + tax;

    return {
      basePrice: basePrice * quantity,
      toppingsPrice: toppingsPrice * quantity,
      sizeAdjustment: sizeAdjustment * quantity,
      subtotal,
      tax,
      total
    };
  }

  public static getToppingPrice(item: MenuItem, selectedSize?: string): number {
    if (!item.toppings?.extraItems) return 0;

    const toppingPricing = item.toppings.extraItems.find(
      pricing => pricing.size === selectedSize
    );

    return toppingPricing?.price || item.toppings.extraItems[0]?.price || 0;
  }

  public static calculateCartTotal(cartItems: CartItem[]): {
    subtotal: number;
    tax: number;
    total: number;
    itemCount: number;
  } {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + tax;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      tax,
      total,
      itemCount
    };
  }

  public static applyCouponDiscount(
    originalTotal: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number
  ): { discountAmount: number; newTotal: number } {
    let discountAmount = 0;

    if (discountType === 'percentage') {
      discountAmount = originalTotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
      discountAmount = Math.min(discountValue, originalTotal);
    }

    const newTotal = Math.max(0, originalTotal - discountAmount);

    return {
      discountAmount,
      newTotal
    };
  }

  public static formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  public static getSizeDisplayName(sizes: Size[] | undefined, sizeKey: string): string {
    if (!sizes) return sizeKey;
    
    const size = sizes.find(s => s.size === sizeKey);
    return size?.name || sizeKey;
  }

  public static getAvailableSizes(item: MenuItem): Size[] {
    return item.sizes || [];
  }

  public static isItemAvailable(item: MenuItem): boolean {
    return item.available === true;
  }

  public static calculateDeliveryFee(orderTotal: number, distance?: number): number {
    // Basic delivery fee calculation
    // You can customize this based on your business rules
    if (orderTotal >= 25) {
      return 0; // Free delivery over $25
    }
    
    let baseFee = 3.50;
    
    if (distance && distance > 5) {
      baseFee += (distance - 5) * 0.50; // $0.50 per additional mile
    }

    return Math.min(baseFee, 8.00); // Cap at $8.00
  }

  public static estimatePreparationTime(
    cartItems: CartItem[],
    orderType: 'delivery' | 'pickup' | 'dine-in' = 'pickup'
  ): number {
    // Base preparation time in minutes
    let baseTime = 15;
    
    // Add time based on item complexity
    const complexityTime = cartItems.reduce((time, item) => {
      const itemCategory = item.menuItem.category;
      
      switch (itemCategory) {
        case 'pizza':
          return time + 12; // 12 minutes per pizza
        case 'pasta':
          return time + 8; // 8 minutes per pasta dish
        case 'chicken':
        case 'seafood':
          return time + 15; // 15 minutes for fried items
        default:
          return time + 5; // 5 minutes for other items
      }
    }, 0);

    // Adjust for order type
    const orderTypeMultiplier = {
      'pickup': 1,
      'dine-in': 1.1,
      'delivery': 1.3
    };

    const totalTime = (baseTime + complexityTime) * orderTypeMultiplier[orderType];
    
    // Round to nearest 5 minutes
    return Math.ceil(totalTime / 5) * 5;
  }
}