import { expect, test, describe } from 'vitest';
import { PricingCalculator } from './pricing.ts';

describe('PricingCalculator', () => {
  test('calculates basic item price correctly', () => {
    const item = {
      id: 'test-item',
      name: 'Test Pizza',
      basePrice: 10.00,
      category: 'pizza',
      available: true
    };

    const result = PricingCalculator.calculateItemPrice(item, null, [], 1);
    
    expect(result.basePrice).toBe(10.00);
    expect(result.toppingsPrice).toBe(0);
    expect(result.subtotal).toBe(10.00);
    expect(result.tax).toBe(0.60); // 6% tax
    expect(result.total).toBe(10.60);
  });

  test('calculates size-based pricing correctly', () => {
    const item = {
      id: 'pizza',
      name: 'Cheese Pizza',
      category: 'pizza',
      sizes: [
        { size: 'small', name: 'Small', price: 10.00 },
        { size: 'large', name: 'Large', price: 16.00 }
      ],
      available: true
    };

    const result = PricingCalculator.calculateItemPrice(item, 'large', [], 1);
    
    expect(result.basePrice).toBe(16.00);
    expect(result.subtotal).toBe(16.00);
    expect(result.total).toBe(16.96); // 16.00 + 6% tax
  });

  test('calculates toppings price correctly', () => {
    const item = {
      id: 'pizza',
      name: 'Pizza',
      category: 'pizza',
      basePrice: 10.00,
      toppings: {
        extraItems: [
          { size: 'small', price: 1.50 }
        ]
      },
      available: true
    };

    const toppings = ['pepperoni', 'mushrooms'];
    const result = PricingCalculator.calculateItemPrice(item, 'small', toppings, 1);
    
    expect(result.toppingsPrice).toBe(3.00); // 2 toppings × $1.50
    expect(result.subtotal).toBe(13.00); // $10 base + $3 toppings
  });

  test('calculates quantity correctly', () => {
    const item = {
      id: 'test-item',
      name: 'Test Item',
      basePrice: 5.00,
      category: 'appetizers',
      available: true
    };

    const result = PricingCalculator.calculateItemPrice(item, null, [], 3);
    
    expect(result.basePrice).toBe(15.00); // 3 × $5
    expect(result.subtotal).toBe(15.00);
    expect(result.total).toBe(15.90); // 15.00 + 6% tax
  });

  test('formats price correctly', () => {
    expect(PricingCalculator.formatPrice(10)).toBe('$10.00');
    expect(PricingCalculator.formatPrice(10.5)).toBe('$10.50');
    expect(PricingCalculator.formatPrice(10.123)).toBe('$10.12');
  });

  test('calculates cart total correctly', () => {
    const cartItems = [
      { totalPrice: 10.00, quantity: 2 },
      { totalPrice: 15.50, quantity: 1 }
    ];

    const result = PricingCalculator.calculateCartTotal(cartItems);
    
    expect(result.subtotal).toBe(25.50);
    expect(result.tax).toBe(1.53); // 6% of 25.50
    expect(result.total).toBe(27.03);
    expect(result.itemCount).toBe(3);
  });

  test('calculates delivery fee correctly', () => {
    // Free delivery over $25
    expect(PricingCalculator.calculateDeliveryFee(30.00)).toBe(0);
    
    // Base fee under $25
    expect(PricingCalculator.calculateDeliveryFee(20.00)).toBe(3.50);
    
    // Distance-based fee
    expect(PricingCalculator.calculateDeliveryFee(20.00, 7)).toBe(4.50); // 3.50 + (7-5)*0.50
    
    // Capped at $8
    expect(PricingCalculator.calculateDeliveryFee(15.00, 15)).toBe(8.00);
  });

  test('estimates preparation time correctly', () => {
    const cartItems = [
      { menuItem: { category: 'pizza' }, quantity: 2 },
      { menuItem: { category: 'appetizers' }, quantity: 1 }
    ];

    const time = PricingCalculator.estimatePreparationTime(cartItems, 'pickup');
    
    // 15 base + (2×12 pizza + 1×5 appetizer) = 44 minutes, rounded to 45
    expect(time).toBe(45);
  });
});