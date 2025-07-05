import type { 
  MenuItem, 
  OrderBuilder, 
  PieceSelection, 
  OrderType, 
  POSOrderItem,
  PricingCalculation,
  CartItem
} from '$lib/types/menu';

/**
 * Builder pattern class for constructing complex menu orders
 * Handles individual piece selection, pricing calculations, and POS integration
 */
export class MenuOrderBuilder implements OrderBuilder {
  category: string;
  baseItem?: MenuItem;
  pieces: PieceSelection[] = [];
  orderType: OrderType = 'dinner';
  sides: string[] = [];
  sauces: string[] = [];
  customizations: Record<string, any> = {};
  quantity: number = 1;
  specialInstructions: string = '';

  constructor(category: string, baseItem?: MenuItem) {
    this.category = category;
    this.baseItem = baseItem;
  }

  /**
   * Add individual pieces to the order
   */
  addPiece(pieceId: string, quantity: number, price: number): this {
    const existingPiece = this.pieces.find(p => p.pieceId === pieceId);
    if (existingPiece) {
      existingPiece.quantity += quantity;
    } else {
      this.pieces.push({ pieceId, quantity, price });
    }
    return this;
  }

  /**
   * Remove pieces from the order
   */
  removePiece(pieceId: string, quantity?: number): this {
    const existingPiece = this.pieces.find(p => p.pieceId === pieceId);
    if (existingPiece) {
      if (quantity === undefined) {
        this.pieces = this.pieces.filter(p => p.pieceId !== pieceId);
      } else {
        existingPiece.quantity = Math.max(0, existingPiece.quantity - quantity);
        if (existingPiece.quantity === 0) {
          this.pieces = this.pieces.filter(p => p.pieceId !== pieceId);
        }
      }
    }
    return this;
  }

  /**
   * Set order type (only vs dinner)
   */
  setOrderType(type: OrderType): this {
    this.orderType = type;
    
    // Auto-adjust sides based on order type
    if (type === 'dinner') {
      this.addDefaultSides();
    } else {
      this.removeDefaultSides();
    }
    
    return this;
  }

  /**
   * Add default dinner sides
   */
  private addDefaultSides(): void {
    const defaultSides = ['ff', 'slaw', 'roll'];
    defaultSides.forEach(side => {
      if (!this.sides.includes(side)) {
        this.sides.push(side);
      }
    });
  }

  /**
   * Remove default dinner sides
   */
  private removeDefaultSides(): void {
    const defaultSides = ['ff', 'slaw', 'roll'];
    this.sides = this.sides.filter(side => !defaultSides.includes(side));
  }

  /**
   * Add sides to the order
   */
  addSide(sideId: string): this {
    if (!this.sides.includes(sideId)) {
      this.sides.push(sideId);
    }
    return this;
  }

  /**
   * Remove sides from the order
   */
  removeSide(sideId: string): this {
    this.sides = this.sides.filter(side => side !== sideId);
    return this;
  }

  /**
   * Add sauces to the order
   */
  addSauce(sauceId: string): this {
    if (!this.sauces.includes(sauceId)) {
      this.sauces.push(sauceId);
    }
    return this;
  }

  /**
   * Remove sauces from the order
   */
  removeSauce(sauceId: string): this {
    this.sauces = this.sauces.filter(sauce => sauce !== sauceId);
    return this;
  }

  /**
   * Set quantity for the entire order
   */
  setQuantity(quantity: number): this {
    this.quantity = Math.max(1, quantity);
    return this;
  }

  /**
   * Add custom properties to the order
   */
  setCustomization(key: string, value: any): this {
    this.customizations[key] = value;
    return this;
  }

  /**
   * Set special instructions
   */
  setSpecialInstructions(instructions: string): this {
    this.specialInstructions = instructions;
    return this;
  }

  /**
   * Calculate pricing with all discounts and upcharges
   */
  calculatePricing(): PricingCalculation {
    const breakdown: PricingCalculation['breakdown'] = [];
    
    // Calculate base piece price
    const piecePrice = this.pieces.reduce((sum, piece) => {
      return sum + (piece.price * piece.quantity);
    }, 0);
    
    if (piecePrice > 0) {
      breakdown.push({
        label: `Pieces (${this.getTotalPieces()})`,
        amount: piecePrice,
        type: 'addition'
      });
    }

    // Base price from menu item
    const basePrice = this.baseItem?.basePrice || 0;
    if (basePrice > 0 && this.pieces.length === 0) {
      breakdown.push({
        label: 'Base Price',
        amount: basePrice,
        type: 'addition'
      });
    }

    // Apply "Only" discount
    const onlyDiscount = this.orderType === 'only' ? 2.00 : 0;
    if (onlyDiscount > 0) {
      breakdown.push({
        label: '"Only" Discount',
        amount: -onlyDiscount,
        type: 'discount'
      });
    }

    // Calculate side upcharges
    const sideUpcharge = this.calculateSideUpcharge();
    if (sideUpcharge > 0) {
      breakdown.push({
        label: 'Premium Sides',
        amount: sideUpcharge,
        type: 'addition'
      });
    }

    // Calculate BBQ surcharge
    const bbqSurcharge = this.calculateBBQSurcharge();
    if (bbqSurcharge > 0) {
      breakdown.push({
        label: 'BBQ Style',
        amount: bbqSurcharge,
        type: 'addition'
      });
    }

    // Calculate subtotal
    const subtotal = Math.max(0, (piecePrice || basePrice) - onlyDiscount + sideUpcharge + bbqSurcharge);
    
    // Apply quantity multiplier (but only if quantity > 0)
    const total = this.quantity > 0 ? subtotal * this.quantity : 0;
    if (this.quantity > 1) {
      breakdown.push({
        label: `Quantity × ${this.quantity}`,
        amount: total,
        type: 'multiplier'
      });
    }

    // Calculate tax (6% Michigan sales tax) - only if total > 0
    const taxAmount = total > 0 ? total * 0.06 : 0;
    const finalTotal = total + taxAmount;

    return {
      basePrice: basePrice,
      piecePrice: piecePrice,
      onlyDiscount: onlyDiscount,
      sideUpcharge: sideUpcharge,
      bbqSurcharge: bbqSurcharge,
      taxAmount: taxAmount,
      finalTotal: finalTotal,
      breakdown: breakdown
    };
  }

  /**
   * Calculate side upcharges
   */
  private calculateSideUpcharge(): number {
    const sideUpcharges: Record<string, number> = {
      'spw': 1.55,
      'or': 1.95,
      'dfm': 2.05,
      'dfs': 2.50
    };

    return this.sides.reduce((sum, sideId) => {
      return sum + (sideUpcharges[sideId] || 0);
    }, 0);
  }

  /**
   * Calculate BBQ surcharge (10¢ per piece)
   */
  private calculateBBQSurcharge(): number {
    if (!this.customizations.bbqStyle) return 0;
    
    const totalPieces = this.getTotalPieces();
    if (totalPieces > 0) {
      return totalPieces * 0.10;
    }
    
    // For standard portions, use piece count from menu item (if available)
    return ((this.baseItem as any)?.pieceCount || 0) * 0.10;
  }

  /**
   * Get total pieces selected
   */
  getTotalPieces(): number {
    return this.pieces.reduce((sum, piece) => sum + piece.quantity, 0);
  }

  /**
   * Check if order is valid
   */
  isValid(): boolean {
    // Quantity must be positive
    if (this.quantity <= 0) return false;
    
    // Must have either pieces or base item
    if (this.pieces.length === 0 && !this.baseItem) return false;
    
    // If using pieces, must have at least one
    if (this.pieces.length > 0 && this.getTotalPieces() === 0) return false;
    
    return true;
  }

  /**
   * Convert to POS-compatible order format
   */
  toPOSFormat(): POSOrderItem {
    const tracker: POSOrderItem['tracker'] = {};
    
    // Handle piece tracking
    if (this.pieces.length > 0) {
      tracker.type = {};
      tracker.size = {};
      
      this.pieces.forEach(piece => {
        tracker.type![piece.pieceId] = piece.quantity;
        tracker.size![piece.quantity.toString()] = 1;
      });
    }
    
    // Handle topping tracking (for order type)
    tracker.topping = { [this.orderType]: 1 };
    
    // Handle sauce tracking
    if (this.sauces.length > 0) {
      tracker.sauce = {};
      this.sauces.forEach(sauce => {
        tracker.sauce![sauce] = 1;
      });
    }
    
    // Handle side tracking
    if (this.sides.length > 0) {
      tracker.side = {};
      this.sides.forEach(side => {
        tracker.side![side] = 1;
      });
    }

    const pricing = this.calculatePricing();

    return {
      category: this.category,
      type: this.pieces.map(p => p.pieceId),
      size: this.pieces.map(p => p.quantity),
      topping: [this.orderType],
      sauce: this.sauces,
      side: this.sides,
      quantity: this.quantity,
      price: pricing.finalTotal.toFixed(2),
      tracker: tracker
    };
  }

  /**
   * Convert to website cart item format
   */
  toCartItem(): CartItem {
    if (!this.baseItem) {
      throw new Error('Base item required for cart conversion');
    }

    const selectedPieces: Record<string, number> = {};
    this.pieces.forEach(piece => {
      selectedPieces[piece.pieceId] = piece.quantity;
    });

    const pricing = this.calculatePricing();

    return {
      id: `${this.baseItem.id}-${Date.now()}-${Math.random()}`,
      menuItem: this.baseItem,
      quantity: this.quantity,
      selectedPieces: Object.keys(selectedPieces).length > 0 ? selectedPieces : undefined,
      orderType: this.orderType,
      selectedSides: this.sides.length > 0 ? this.sides : undefined,
      selectedSauces: this.sauces.length > 0 ? this.sauces : undefined,
      usePieceSelection: this.pieces.length > 0,
      specialInstructions: this.specialInstructions || undefined,
      totalPrice: pricing.finalTotal,
      pricingBreakdown: pricing
    };
  }

  /**
   * Create a copy of this builder
   */
  clone(): MenuOrderBuilder {
    const clone = new MenuOrderBuilder(this.category, this.baseItem);
    clone.pieces = [...this.pieces];
    clone.orderType = this.orderType;
    clone.sides = [...this.sides];
    clone.sauces = [...this.sauces];
    clone.customizations = { ...this.customizations };
    clone.quantity = this.quantity;
    clone.specialInstructions = this.specialInstructions;
    return clone;
  }

  /**
   * Reset builder to initial state
   */
  reset(): this {
    this.pieces = [];
    this.orderType = 'dinner';
    this.sides = [];
    this.sauces = [];
    this.customizations = {};
    this.quantity = 1;
    this.specialInstructions = '';
    return this;
  }
}

/**
 * Factory functions for creating builders for specific categories
 */
export class OrderBuilderFactory {
  /**
   * Create a seafood order builder
   */
  static createSeafoodBuilder(baseItem?: MenuItem): MenuOrderBuilder {
    const builder = new MenuOrderBuilder('seafood', baseItem);
    builder.setOrderType('dinner'); // Default to dinner for seafood
    return builder;
  }

  /**
   * Create a chicken order builder
   */
  static createChickenBuilder(baseItem?: MenuItem): MenuOrderBuilder {
    const builder = new MenuOrderBuilder('fry', baseItem);
    builder.setOrderType('dinner'); // Default to dinner for chicken
    return builder;
  }

  /**
   * Create a combination plate builder
   */
  static createCombinationBuilder(baseItem?: MenuItem): MenuOrderBuilder {
    const builder = new MenuOrderBuilder('fry', baseItem);
    builder.setOrderType('dinner'); // Combination plates are always dinner
    return builder;
  }

  /**
   * Create a smorgasbord builder
   */
  static createSmorgasbordBuilder(baseItem?: MenuItem): MenuOrderBuilder {
    const builder = new MenuOrderBuilder('fry', baseItem);
    builder.setOrderType('dinner'); // Smorgasbord is always dinner
    builder.setCustomization('isSmorgasbord', true);
    return builder;
  }
}

/**
 * Utility functions for working with order builders
 */
export class OrderBuilderUtils {
  /**
   * Validate and clean up an order before submission
   */
  static validateOrder(builder: MenuOrderBuilder): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!builder.isValid()) {
      errors.push('Order must contain at least one item');
    }

    if (builder.pieces.length > 24) {
      errors.push('Cannot exceed 24 individual pieces per order');
    }

    if (builder.orderType === 'only' && builder.sides.some(side => ['ff', 'slaw', 'roll'].includes(side))) {
      errors.push('"Only" orders cannot include standard dinner sides');
    }

    const totalPieces = builder.getTotalPieces();
    if (totalPieces > 0 && totalPieces < 1) {
      errors.push('Must select at least one piece');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Calculate tax for an order
   */
  static calculateTax(subtotal: number, taxRate: number = 0.06): number {
    return subtotal * taxRate;
  }

  /**
   * Format pricing for display
   */
  static formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
}