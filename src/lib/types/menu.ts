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

// Cooking preferences for fried items
export type CookingPreference = 'regular' | 'well-done' | 'extra-crispy' | 'light-cooked';

// Dipping sauces for appetizers
export interface DippingSauce {
  id: string;
  name: string;
  category: 'creamy' | 'tangy' | 'spicy' | 'sweet';
  available: boolean;
  extraCost?: number;
}

// Appetizer customization options
export interface AppetizerCustomization {
  cookingPreference?: CookingPreference;
  dippingSauces?: DippingSauce[];
  extraPortions?: boolean;
  specialInstructions?: string;
}

// Enhanced MenuItem for appetizers
export interface AppetizerMenuItem extends MenuItem {
  category: 'appetizers';
  availableCookingPreferences?: CookingPreference[];
  availableDippingSauces?: DippingSauce[];
  servingSize?: string;
}

// Pizza-specific types
export type PizzaCrust = 'regular' | 'thin' | 'thick' | 'garlic-crust';
export type PizzaSauce = 'pizza-sauce' | 'bbq-sauce' | 'ranch' | 'no-sauce' | 'light-sauce' | 'extra-sauce';
export type CheeseOption = 'regular' | 'extra-cheese' | 'light-cheese' | 'no-cheese';
export type ToppingPosition = 'whole' | 'left-half' | 'right-half';

// Pizza topping with comprehensive details
export interface PizzaTopping {
  id: string;
  name: string;
  category: 'meat' | 'vegetable' | 'cheese' | 'premium' | 'specialty';
  available: boolean;
  isPremium?: boolean;
  pricingBySize: {
    small: number;
    medium: number;
    large: number;
    xlarge?: number;
  };
  description?: string;
  allergens?: string[];
}

// Pizza topping selection with position
export interface PizzaToppingSelection {
  topping: PizzaTopping;
  position: ToppingPosition;
  quantity?: number; // For multiple of same topping
}

// Pizza customization options
export interface PizzaCustomization {
  crust?: PizzaCrust;
  sauce?: PizzaSauce;
  cheese?: CheeseOption;
  toppings?: PizzaToppingSelection[];
  specialInstructions?: string;
}

// Enhanced MenuItem for pizzas
export interface PizzaMenuItem extends MenuItem {
  category: 'pizza';
  shape?: 'round' | 'square';
  availableCrusts?: PizzaCrust[];
  availableSauces?: PizzaSauce[];
  availableCheeseOptions?: CheeseOption[];
  allowHalfToppings?: boolean;
  maxToppings?: number;
}

// Salad-specific types
export type SaladDressing = 'Ranch' | 'Creamy Italian' | 'Italian' | 'French' | '1,000 Island' | 'Greek' | 'Blue Cheese';

// Salad add-on with size-based pricing
export interface SaladAddOn {
  name: string;
  sizes: Size[];
}

// Salad customization options
export interface SaladCustomization {
  selectedDressing?: SaladDressing;
  addOns?: SaladAddOn[];
  specialInstructions?: string;
}

// Enhanced MenuItem for salads
export interface SaladMenuItem extends MenuItem {
  category: 'salads';
  sizes: Size[];
}

// Pasta-specific types
export type PastaType = 'spaghetti' | 'mostaccioli';
export type RavioliFilling = 'meat' | 'cheese';
export type PastaSauce = 'meatsauce' | 'marinara';

// Pasta add-ons with size-based pricing
export interface PastaAddOn {
  id: string;
  name: string;
  sizes: Size[];
}

// Pasta extras with size-based pricing
export interface PastaExtra {
  id: string;
  name: string;
  price?: number;
  sizes?: Size[];
}

// Pasta customization options
export interface PastaCustomization {
  pastaType?: PastaType;
  ravioliFilling?: RavioliFilling;
  sauce?: PastaSauce;
  addOns?: PastaAddOn[];
  extras?: PastaExtra[];
  specialInstructions?: string;
}

// Enhanced MenuItem for pasta
export interface PastaMenuItem extends MenuItem {
  category: 'pasta';
  sizes: Size[];
  pastaType?: PastaType;
  isRavioli?: boolean;
  availableSauces?: PastaSauce[];
}

// Chicken-specific types
export type ChickenMeatSelection = 'all-white' | 'all-dark' | 'mixed';
export type ChickenSauce = 'bbq' | 'hot-sauce' | 'ranch' | 'honey-mustard' | 'blue-cheese';
export type ChickenCategory = 'chicken' | 'chicken-tenderloins' | 'wing-dings';

// Chicken sauce with spice level
export interface ChickenSauceOption {
  id: ChickenSauce;
  name: string;
  spiceLevel?: number;
  available: boolean;
}

// Chicken customization options
export interface ChickenCustomization {
  meatSelection?: ChickenMeatSelection;
  isBBQStyle?: boolean;
  selectedSauces?: ChickenSauceOption[];
  specialInstructions?: string;
}

// Enhanced MenuItem for chicken
export interface ChickenMenuItem extends MenuItem {
  category: ChickenCategory;
  pieceCount?: number;
  includes?: string[];
  availableSauces?: ChickenSauce[];
  allowsBBQStyle?: boolean;
  allowsMeatSelection?: boolean;
}

// Sandwich-specific types
export type SandwichCategory = 'submarines' | 'sandwiches';
export type BreadType = 'sub-roll' | 'burger-bun' | 'whole-wheat' | 'italian';

// Sandwich add-on with pricing
export interface SandwichAddOn {
  id: string;
  name: string;
  price: number;
  category: 'cheese' | 'meat' | 'vegetable' | 'condiment';
}

// Sandwich ingredient (for display and removal options)
export interface SandwichIngredient {
  id: string;
  name: string;
  category: 'meat' | 'cheese' | 'vegetable' | 'condiment';
  removable: boolean;
}

// Sandwich customization options
export interface SandwichCustomization {
  breadType?: BreadType;
  addOns?: SandwichAddOn[];
  removedIngredients?: string[];
  specialInstructions?: string;
}

// Enhanced MenuItem for sandwiches
export interface SandwichMenuItem extends MenuItem {
  category: SandwichCategory;
  ingredientsList?: string[];
  baseIngredients?: SandwichIngredient[];
  availableAddOns?: SandwichAddOn[];
  isDeluxe?: boolean;
}

// Seafood-specific types
export type SeafoodCategory = 'seafood' | 'hand-battered-shrimp';
export type SeafoodPreparation = 'regular' | 'cajun';
export type SeafoodSauce = 'bbq' | 'hot-sauce' | 'ranch' | 'honey-mustard' | 'blue-cheese';

// Seafood sauce option with spice level
export interface SeafoodSauceOption {
  id: SeafoodSauce;
  name: string;
  spiceLevel?: number;
  available: boolean;
}

// Seafood customization options
export interface SeafoodCustomization {
  preparation?: SeafoodPreparation;
  selectedSauces?: SeafoodSauceOption[];
  specialInstructions?: string;
}

// Enhanced MenuItem for seafood
export interface SeafoodMenuItem extends MenuItem {
  category: SeafoodCategory;
  includes?: string[];
  allowsCajunStyle?: boolean;
  pieceCount?: number;
  weight?: string;
}