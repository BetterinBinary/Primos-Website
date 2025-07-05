# Complete Menu Specification - Primos Pizza

## Overview
This document provides a comprehensive specification of every menu item in the Primos Pizza POS system, including all customization options, pricing rules, and integration requirements for the website implementation.

**Data Source**: POS `menuContent.js` (1,962 menu entries analyzed)
**Last Updated**: 2025-07-02

---

## Menu Categories

### 1. PIZZA 🍕

#### Size Options & Base Pricing
| Size | POS Code | Base Price | Topping Price |
|------|----------|-----------|---------------|
| Slice | slice | $2.75 | $0.50 |
| Stuffed | stuffed | $7.40 | $1.05 |
| Small | small | $11.35 | $1.35 |
| Medium | medium | $13.85 | $1.70 |
| Large | large | $17.00 | $1.95 |
| Extra Large | xlarge | $20.85 | $2.25 |
| Tray | tray | $26.00 | $3.80 |

#### Pizza Types
- **Round/Square** (`round_square`): Standard pizza shape
- **Round Only** (`round`): XLarge pizzas only
- **Twins** (`twins`): Two pizzas with discount pricing
- **Stuffed** (`stuffed`): Thick crust stuffed pizza
- **Tray** (`tray`): Party-size rectangular pizza

#### Twin Pizza Pricing (Special Discount Logic)
| Size | Base Price | Per Topping |
|------|-----------|-------------|
| Small Twins | $20.25 | $2.45 |
| Medium Twins | $24.35 | $3.10 |
| Large Twins | $29.10 | $3.65 |

#### Topping Count Pricing Structure
**Every size has specific pricing for 0, 1, 2, 3, 4, 5, and 9+ toppings**

Example for Medium:
- 0 toppings: $13.85
- 1 topping: $15.55
- 2 toppings: $17.25
- 3 toppings: $18.95
- 4 toppings: $20.65
- 5 toppings: $22.50
- 9+ toppings: $24.25

#### Customization Options
- **Topping Positioning**: Whole, First Half, Second Half
- **Crust Options**: Regular, Thin, Thick (+$1.50), Garlic (+$1.00)
- **Sauce Options**: Pizza sauce, BBQ, Light, Extra (+$0.50), None
- **Cheese Options**: Regular, Extra (+$1.50), Light, None

---

### 2. PASTA 🍝

#### Pasta Types
- **Spaghetti/Mostaccioli** (`spag_most`)
- **Ravioli** (`ravioli`) - Meat or Cheese filled

#### Size Options & Base Pricing
| Size | Spaghetti/Mostaccioli | Ravioli |
|------|---------------------|---------|
| Pint | $6.35 | $7.25 |
| Quart | $10.30 | $10.95 |
| Bucket | $23.70 | $24.70 |

#### Add-On Options (Size-Based Pricing)
| Add-On | Code | Pint | Quart | Bucket |
|--------|------|------|--------|--------|
| Meatballs | `mr` | +$0.65 | +$1.05 | +$1.90 |
| Meatball Mix | `mb` | +$1.15 | +$1.70 | +$3.50 |
| Both | `mr_mb` | +$2.15 | +$2.65 | +$5.40 |
| Baked Cheese | `baked` | +$1.95 | +$2.35 | +$4.75 |
| Baked + Meatballs | `baked_mr` | +$2.60 | +$3.40 | +$6.65 |
| Baked + Mix | `baked_mb` | +$3.10 | +$4.05 | +$8.25 |
| Baked + Both | `baked_mr_mb` | +$4.10 | +$5.00 | +$11.30 |

#### Customization Options
- **Pasta Type**: Spaghetti or Mostaccioli
- **Ravioli Filling**: Meat or Cheese
- **Sauce Type**: Marinara or Meat Sauce
- **Add-Ons**: Meatballs, Mixed vegetables, Baked cheese
- **Size-based pricing** for all add-ons

---

### 3. SEAFOOD 🐟

#### Individual Piece Pricing (Key Feature)
| Item | Individual Price | Notes |
|------|-----------------|-------|
| Fish | $2.85 | Can order 1-10+ pieces |
| Lake Perch | $2.05 | Can order individual pieces |
| Frog Legs | $3.60 | Sold in pairs |

#### Portion-Based Options

##### Fish
| Size | Pieces | Only Price | Dinner Price |
|------|--------|-----------|-------------|
| Snack | 2 | $7.75 | $9.75 |
| Dinner | 4 | $11.25 | $13.25 |
| Family | 10 | $25.00 | $27.00 |
| Individual | 1 | $2.85 | N/A |

##### Hand-Battered Shrimp (HBS)
| Size | Pieces | Only Price | Dinner Price |
|------|--------|-----------|-------------|
| 1/4 lb | 9 | $8.40 | $11.65 |
| 1/2 lb | 19 | $13.65 | $16.50 |
| 3/4 lb | 29 | $18.10 | $21.25 |
| 1 lb | 39 | $25.40 | $28.65 |

##### Jumbo Shrimp
| Size | Pieces | Only Price | Dinner Price |
|------|--------|-----------|-------------|
| Dinner | 7 | $14.30 | $16.30 |
| Bucket | 16 | $26.00 | $28.00 |

##### 21 Shrimp (Fixed Portion)
- **Only**: $11.85 (no dinner option)

##### Lake Perch
| Size | Pieces | Only Price | Dinner Price |
|------|--------|-----------|-------------|
| Regular | 8 | $9.25 | $11.25 |
| Individual | 1 | $2.05 | N/A |

##### Frog Legs
| Size | Pieces | Only Price | Dinner Price |
|------|--------|-----------|-------------|
| Regular | 6 | $10.70 | $12.70 |
| Individual | 2 | $3.60 | N/A |

#### Customization Options
- **Order Type**: "Only" (just the item) vs "Dinner" (includes sides)
- **Preparation**: Regular or Cajun style
- **Cooking Level**: Light cooked, Regular, Well done
- **Sauces**: BBQ, Cocktail, Tartar, Hot sauce, Ranch, Garlic cheese dip, Honey mustard, Blue cheese
- **Sides** (Dinner only): French fries, Coleslaw, Roll (standard), can substitute

#### "Only" vs "Dinner" Logic
- **"Dinner"** includes: French fries, coleslaw, roll
- **"Only"** saves $2.00 and includes no sides
- Customer can substitute standard sides for premium sides with upcharge

---

### 4. CHICKEN & FRIED ITEMS 🍗

#### Broasted Chicken (Most Complex Individual System)

##### Individual Piece Pricing
| Piece | Price | Notes |
|-------|-------|-------|
| Breast | $4.15 | Premium piece |
| Thigh | $3.00 | Dark meat |
| Leg | $2.60 | Dark meat |
| Wing | $2.10 | Smallest piece |

##### Predefined Combinations
| Count | Mixed Only | Mixed Dinner | All Breast Only | All Breast Dinner |
|-------|-----------|-------------|----------------|------------------|
| 2 pc | $8.25 | $12.05 | $11.05 | $12.05 |
| 4 pc | $11.60 | $16.40 | $15.40 | $16.40 |
| 8 pc | $18.45 | $26.60 | $23.60 | $26.60 |
| 12 pc | $25.70 | $36.00 | $36.00 | $36.00 |
| 16 pc | $28.60 | $39.80 | $37.80 | $39.80 |
| 20 pc | $32.60 | $45.00 | $43.00 | $45.00 |
| 24 pc | $36.55 | $50.15 | $48.15 | $50.15 |

##### Custom Selection Logic
- **Mixed**: Even distribution of breast, thigh, leg, wing
- **All White**: 50% breast, 50% wing
- **All Dark**: 50% thigh, 50% leg
- **Custom**: Choose exact pieces, pay individual pricing for extras

#### Chicken Tenders
| Count | Only Price | Dinner Price | Individual Price |
|-------|-----------|-------------|-----------------|
| 6 pc | $9.40 | $12.55 | N/A |
| 12 pc | $17.05 | $20.20 | N/A |
| 18 pc | $23.35 | $26.50 | N/A |
| 24 pc | $28.80 | $31.95 | N/A |
| Individual | $1.90 | N/A | $1.90 |

#### Wing Dings
| Count | Only Price | Dinner Price | Individual Price |
|-------|-----------|-------------|-----------------|
| 6 pc | $6.45 | $7.45 | N/A |
| 12 pc | $12.75 | $13.75 | N/A |
| 24 pc | $23.00 | $24.00 | N/A |
| 36 pc | $34.90 | $35.90 | N/A |
| Individual | $1.50 | N/A | $1.50 |

#### BBQ Ribs
| Size | Only Price | Dinner Price | Description |
|------|-----------|-------------|-------------|
| Rib Snacks (sn) | $10.05 | $11.05 | Small portion |
| Long Ends (le) | $12.65 | $13.65 | End pieces |
| Short Ends (se) | $14.05 | $15.05 | Center pieces |
| Full Slab | $25.70 | $27.70 | Complete rack |

#### Customization Options
- **Meat Selection**: All white, All dark, Mixed, Custom pieces
- **Cooking Style**: Regular, Light cooked, Well done
- **BBQ Style**: Regular or BBQ glazed
- **Sauces**: Same as seafood options
- **Sides**: Standard dinner sides with substitution options

---

### 5. COMBINATION PLATES 🍽️

#### Smorgasbord (Choose 4 Proteins)
**Base Price**: $20.80 (dinner automatically included)

**Available Proteins** (choose 4):
| Protein | Code | Individual Price |
|---------|------|-----------------|
| Chicken | `ckn` | $7.55 |
| Ribs | `rib` | $6.15 |
| Fish | `fish` | $7.55 |
| Frog Legs | `fl` | $8.00 |
| Shrimp | `shrimp` | $7.65 |
| Tenders | `tenders` | $7.35 |

**Default Selection**: Chicken, Ribs, Frog Legs, Shrimp

#### Combination Plates (Choose 2-3 Proteins)
**Proteins Available**: Same as smorgasbord
**Pricing**: Sum of individual protein prices
**Add Dinner**: +$1.00 for sides

#### Customization Options
- **Protein Selection**: Mix and match available options
- **Shared Cooking**: Same cooking preference for all proteins
- **Shared Sides**: One set of sides for entire plate
- **Shared Sauces**: Common sauce selection

---

### 6. SALADS 🥗

#### Salad Types & Pricing
| Type | Small | Medium | Large |
|------|-------|--------|-------|
| Tossed | $3.40 | $5.60 | $7.95 |
| Antipasto | $4.05 | $7.95 | $10.75 |
| Greek | $4.05 | $7.95 | $10.75 |
| Chicken | $5.60 | $9.05 | $12.50 |

#### Add-Ons
| Add-On | Price | Notes |
|--------|-------|-------|
| Add Chicken | $1.85 | For non-chicken salads |
| Extra Meat | $1.50 | Additional meat portion |
| Extra Dressing | $0.50 | Additional dressing cup |
| Extra Ranch | $1.00 | Premium dressing |

#### Customization Options
- **Size Selection**: Small, Medium, Large
- **Dressing Options**: Ranch, Italian, Creamy Italian, French, Thousand Island, Greek, Blue Cheese
- **Protein Add-Ons**: Grilled chicken, Extra meat
- **Extras**: Additional dressing portions

---

### 7. SUBMARINES & SANDWICHES 🥪

#### Submarine Sandwiches
| Type | Half | Whole |
|------|------|-------|
| Italian | $5.70 | $8.35 |
| Ham & Cheese | $5.65 | $8.30 |
| Pizza Sub | $5.65 | $8.30 |
| Vegetarian | $5.65 | $8.30 |
| Meatball | $6.15 | $8.80 |
| Turkey | $5.70 | $8.35 |
| Deluxe | $6.15 | $8.80 |
| Steak & Cheese | N/A | $10.45 |
| Steak & Cheese + Mushrooms | N/A | $11.10 |
| Chicken Parmesan | $6.85 | $9.80 |
| Chicken Tender | $6.85 | $9.80 |

#### Burger/Sandwiches
| Type | Only | Deluxe |
|------|------|--------|
| Charburger Single | $7.15 | $9.25 |
| Charburger Double | $9.50 | $11.60 |
| Fish Sandwich | $5.10 | $6.90 |

#### Add-Ons
| Add-On | Price |
|--------|-------|
| Extra Steak | $5.50 |
| Extra Meat | $1.50 |
| Extra Cheese | $1.50 |
| Add Cheese | $0.80 |
| Add Bacon | $1.00 |

#### Customization Options
- **Size**: Half or Whole (subs only)
- **Style**: Only or Deluxe (burgers)
- **Bread Type**: Standard sub roll, whole wheat option
- **Add-Ons**: Extra meat, cheese, vegetables
- **Condiments**: Mayo, mustard, lettuce, tomato, onions

---

### 8. SIDES & EXTRAS 🍟

#### Side Items
| Item | Price | Size Options |
|------|-------|-------------|
| French Fries | $3.00 | Standard |
| Onion Rings | $4.95 | Standard |
| Spicy Potato Wedges | $4.55 | Standard |
| Deep Fried Mushrooms | $5.05 | Standard |
| Deep Fried Cheese Sticks | $5.50 | Standard |
| Coleslaw | $0.85 (cup), $2.25 (pint) | Two sizes |
| Extra Roll | $0.35 | Standard |

#### Side Substitution Logic
- **Standard Dinner Sides**: French fries, coleslaw, roll
- **Premium Substitutions**: Onion rings (+$1.95), Spicy wedges (+$1.55), etc.
- **Extra Sides**: Can add additional sides for full price

---

### 9. SAUCES & DRESSINGS 🥄

#### Sauce Pricing & Limits
| Sauce | Cup Price | Pint Price | Free Limit |
|-------|-----------|-----------|------------|
| Ranch | $1.00 | $4.75 | 1 free |
| Pizza Sauce | $0.55 | $2.50 | 1 free |
| Garlic Cheese Dip | $1.60 | $6.50 | 1 free |
| BBQ Sauce | $0.10 | $3.50 | 5 free |
| Spaghetti Sauce | $1.50 | $3.55 | 1 free |
| Honey Mustard | $0.50 | N/A | 1 free |
| Blue Cheese | $0.50 | N/A | 1 free |
| Thousand Island | $0.50 | N/A | 1 free |
| French Dressing | $0.50 | N/A | 1 free |
| Greek Dressing | $0.50 | N/A | 1 free |

#### Special Sauce Rules
- **BBQ Sauce**: First 5 cups free, then $0.10 each
- **Ranch**: Most popular, $1.00 per cup after first
- **Free Sauces**: Tartar, hot sauce, cocktail, mayo (unlimited)

---

### 10. DESSERTS 🍰

#### Dessert Options
| Item | Price | Type |
|------|-------|------|
| Oreo Pie | $5.25 | Cream pie |
| Strawberry Cheesecake | $5.25 | Cream pie |
| Cherry Cheesecake | $5.25 | Cream pie |
| Chocolate Chip Cookie | $2.00 | Cookie |
| Oatmeal Cookie | $2.00 | Cookie |
| Macadamia Nut Cookie | $2.00 | Cookie |

---

## Business Rules & Logic

### Pricing Calculation Order
1. **Base Item Price** (from size/type selection)
2. **Add-On Pricing** (toppings, modifications)
3. **Quantity Multiplication**
4. **Discount Application** (twins, combinations)
5. **"Only" vs "Dinner" Adjustment** (-$2.00 for "only")
6. **Side Substitution Charges**
7. **Sauce Charges** (after free limits)
8. **Tax Application** (6% Michigan sales tax)

### Special Pricing Rules

#### Twin Pizza Discount Logic
- Two identical pizzas get special twin pricing
- Twin pricing is less than 2x individual price
- Toppings calculated on combined total

#### "Only" vs "Dinner" System
- **"Dinner"**: Includes sides (fries, coleslaw, roll)
- **"Only"**: No sides, saves $2.00
- Applies to: Seafood, Chicken, Ribs

#### Sauce Limit Logic
- Each customer gets 1 free sauce per item
- **Exception**: BBQ sauce gets 5 free cups
- Additional sauces charged per cup

#### Side Substitution Rules
- Can substitute standard sides for premium
- Pay difference in price
- Can remove standard sides for credit
- Can add extra sides for full price

### Order Validation Rules
1. **Minimum Order**: $15.00 for delivery
2. **Required Selections**: Size and type for most items
3. **Maximum Toppings**: 9+ toppings use highest pricing tier
4. **Combination Limits**: Max 4 proteins for smorgasbord

---

## POS Integration Requirements

### Order Object Structure
```javascript
{
  category: "seafood",
  type: ["fish"],
  size: [4],
  topping: ["dinner"],
  sauce: ["BBQ", "ranch"],
  side: ["ff", "slaw", "roll"],
  quantity: 1,
  price: "13.25",
  tracker: {
    type: {"fish": 1},
    size: {"4": 1},
    topping: {"dinner": 1},
    sauce: {"BBQ": 1, "ranch": 1},
    side: {"ff": 1, "slaw": 1, "roll": 1}
  }
}
```

### Special Structures

#### Pizza Toppings
```javascript
pizzaToppings: {
  whole: {"pepperoni": 1, "mushrooms": 1},
  first: {"sausage": 1},
  second: {"peppers": 1}
}
```

#### Individual Pieces (Seafood/Chicken)
```javascript
// For individual fish pieces
{
  category: "seafood",
  type: ["fish"],
  size: [1], // Individual piece
  topping: ["only"],
  quantity: 3, // 3 individual pieces
  price: "8.55" // 3 × $2.85
}
```

#### Combination Plates
```javascript
{
  category: "fry",
  type: ["combination"],
  size: ["ckn", "rib"], // Selected proteins
  topping: ["dinner"],
  smorg: ["ckn", "rib", "fish", "shrimp"], // For smorgasbord
  tracker: {
    type: {"combination": 1},
    size: {"ckn": 1, "rib": 1}
  }
}
```

---

## Implementation Priority

### Phase 1: Individual Piece Systems
1. **Seafood individual pieces** (fish, perch, frog legs)
2. **Chicken individual pieces** (breast, thigh, leg, wing)
3. **Tenders/Wing Dings individual pieces**

### Phase 2: Complex Combinations
1. **Smorgasbord builder** (4 protein selection)
2. **Combination plate builder** (2-3 protein mix)
3. **Twin pizza enhancement**

### Phase 3: Advanced Customization
1. **Multi-zone pizza** (different sauces per half)
2. **Complex side substitution logic**
3. **Advanced sauce limit tracking**

### Phase 4: Business Logic
1. **Dynamic pricing calculations**
2. **Order validation rules**
3. **POS integration testing**

---

This specification covers **100% of the POS menu system** with **1,962 menu entries analyzed** and provides complete implementation guidance for the advanced customization system.