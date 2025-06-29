export interface RestaurantInfo {
  name: string;
  phone: string;
  address: string;
  location: string;
  established: string;
  website: string;
  hours: Record<string, string>;
  awards: string[];
  paymentMethods: string[];
  services: string[];
}

export interface Size {
  size: string;
  name: string;
  price: number;
}

export interface PriceBySize {
  small?: number;
  medium?: number;
  large?: number;
  xlarge?: number;
  pint?: number;
  quart?: number;
  bucket?: number;
}

export interface Topping {
  id: string;
  name: string;
  category: 'meat' | 'vegetable' | 'cheese' | 'fruit' | 'seafood';
  available: boolean;
}

export interface ToppingPricing {
  extraItems: Size[];
}

export interface Sauce {
  id: string;
  name: string;
  spiceLevel?: number;
  available: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice?: number;
  sizes?: Size[];
  toppings?: ToppingPricing;
  includes?: string[];
  options?: string[];
  allergens?: string[];
  available: boolean;
  image?: string;
}

export interface PizzaOptions {
  name: string;
  price: number;
}

export interface SpecialPizza extends MenuItem {
  sizes: Size[];
}

export interface UBakePizza {
  size: string;
  name: string;
  cheese: number;
  extraItems: number;
  primosSpecial: number;
  primosSupreme: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
  addOns?: AddOn[];
  extras?: Extra[];
  dressings?: string[];
}

export interface AddOn {
  name: string;
  price?: number;
  sizes?: Size[];
}

export interface Extra {
  name: string;
  price?: number;
  sizes?: PriceBySize[];
}

export interface Coupon {
  id: string;
  deal: string;
  price?: string;
  bonus?: string;
  sizes?: string;
  description?: string;
  restrictions: string;
  location: string;
  phone: string;
  expires: string;
}

export interface MenuData {
  restaurant: RestaurantInfo;
  categories: MenuCategory[];
  toppings: Topping[];
  sauces: Sauce[];
  coupons: Coupon[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: string;
  selectedToppings?: string[];
  selectedOptions?: string[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  couponApplied?: Coupon;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: CartItem[];
  orderType: 'delivery' | 'pickup' | 'dine-in';
  paymentMethod: 'cash' | 'card' | 'online';
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  tip?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: Date;
  estimatedReady?: Date;
  specialInstructions?: string;
  couponApplied?: Coupon;
}

export type CategoryId = 
  | 'appetizers' 
  | 'pizza' 
  | 'salads' 
  | 'pasta' 
  | 'bbq-ribs' 
  | 'chicken' 
  | 'chicken-tenderloins' 
  | 'wing-dings' 
  | 'seafood' 
  | 'hand-battered-shrimp' 
  | 'submarines' 
  | 'sandwiches' 
  | 'combination-plates' 
  | 'desserts';

export type PizzaSize = 'small' | 'medium' | 'large' | 'xlarge';
export type PastaSize = 'pint' | 'quart' | 'bucket';
export type SaladSize = 'small' | 'medium' | 'large';