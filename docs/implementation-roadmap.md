# Primos Pizza Complete Implementation Roadmap

*Copy-paste command sequence for systematic menu implementation*

**Total Timeline**: 71 implementation days  
**Total Categories**: 11 menu categories  
**Total Components**: 50+ reusable components  
**Last Updated**: July 2025

---

## 🎯 Quick Start

Copy and paste these command blocks in sequence to implement the complete Primos Pizza menu system:

```bash
# Quick verification before starting
claude debug "Verify project structure and dependencies"
npm run typecheck
npm run test
```

---

## 📋 Phase-by-Phase Implementation

### **Phase 1: Foundation Setup (Days 1-10)**
*Establish core architecture and baseline functionality*

#### Day 1-3: Foundation Categories
```bash
# Start with simplest category to establish patterns
claude implement-appetizers

# Verify appetizers implementation
npm run test appetizers
npm run typecheck

# Test basic cart integration
claude debug "Test appetizer cart integration"
```

#### Day 4-10: Complex Pizza System
```bash
# Implement most complex category early for architecture validation
claude implement-pizza

# Run comprehensive pizza tests
npm run test pizza
npm run test:watch -- --grep "Pizza"

# Verify topping system works
claude debug "Test pizza topping selection and pricing"

# Test half-pizza functionality
claude debug "Test half-pizza customization system"
```

**Phase 1 Completion Checkpoint:**
```bash
# Verify foundation is solid before proceeding
npm run typecheck
npm run test
npm run build

# Visual verification
npm run dev
# Test: Add appetizer to cart, customize pizza with toppings
```

---

### **Phase 2: Standard Categories (Days 11-32)**
*Implement medium-complexity categories with scaling systems*

#### Day 11-15: Salads with Size Scaling
```bash
claude implement-salads

# Test size-based dressing scaling
npm run test salads
claude debug "Test salad size scaling and dressing limits"
```

#### Day 16-21: Pasta with Baked Options
```bash
claude implement-pasta

# Test size-based side scaling
npm run test pasta
claude debug "Test pasta size scaling and baked cheese options"

# Verify meatball selection system
claude debug "Test meatball selection and pricing"
```

#### Day 22-27: BBQ Ribs with Sauce Systems
```bash
claude implement-bbq-ribs

# Test sauce level selection
npm run test bbq-ribs
claude debug "Test BBQ sauce level selection and portion types"
```

**Phase 2 Completion Checkpoint:**
```bash
# Verify all standard categories work
npm run typecheck
npm run test
npm run build

# Integration test
claude debug "Test multiple categories in cart simultaneously"
```

---

### **Phase 3: Complex Individual Pieces (Days 33-51)**
*Implement sophisticated piece selection systems*

#### Day 33-42: Complete Chicken System
```bash
claude implement-chicken

# Test individual piece selection
npm run test chicken
claude debug "Test individual chicken piece selection"

# Test BBQ style surcharges
claude debug "Test BBQ style per-piece pricing"

# Test order type logic (only vs dinner)
claude debug "Test chicken order type discount system"

# Test meat selection for portions
claude debug "Test chicken meat selection (white/dark/mixed/breast-only)"
```

#### Day 43-51: Seafood with Preparation Styles
```bash
claude implement-seafood

# Test individual seafood pieces
npm run test seafood
claude debug "Test individual seafood piece selection (fish/perch/frog legs)"

# Test preparation styles
claude debug "Test seafood preparation styles (regular/cajun)"

# Test integration with chicken piece system
claude debug "Test shared piece selection components"
```

**Phase 3 Completion Checkpoint:**
```bash
# Verify complex piece systems work
npm run typecheck
npm run test
npm run build

# Test complex scenarios
claude debug "Test mixed orders with individual pieces"
claude debug "Test pricing accuracy for piece combinations"
```

---

### **Phase 4: Remaining Categories (Days 52-66)**
*Complete standard menu categories*

#### Day 52-57: Submarines with Preset Modifications
```bash
claude implement-submarines

# Test preset ingredient tracking
npm run test submarines
claude debug "Test submarine preset modification tracking"

# Test extra options (meat/cheese)
claude debug "Test submarine extra meat and cheese options"
```

#### Day 58-63: Sandwiches with Only/Deluxe System
```bash
claude implement-sandwiches

# Test only/deluxe order types
npm run test sandwiches
claude debug "Test sandwich only vs deluxe pricing"

# Test bread selection
claude debug "Test sandwich bread selection system"
```

#### Day 64-66: Simple Desserts
```bash
claude implement-desserts

# Test flavor and size selection
npm run test desserts
claude debug "Test dessert flavor and size selection"

# Test ice cream toppings
claude debug "Test ice cream topping system"
```

**Phase 4 Completion Checkpoint:**
```bash
# Verify all individual categories work
npm run typecheck
npm run test
npm run build

# Complete menu test
claude debug "Test complete menu navigation and ordering"
```

---

### **Phase 5: Advanced Integration (Days 67-71)**
*Implement most complex category and final integration*

#### Day 67-71: Combination Plates
```bash
claude implement-combinations

# Test multi-protein selection
npm run test combinations
claude debug "Test combination plate protein selection"

# Test portion balancing
claude debug "Test combination portion balancing system"

# Test smorgasbord builder
claude debug "Test smorgasbord combination builder"

# Test cooking coordination
claude debug "Test combination cooking coordination"
```

**Final Integration Testing:**
```bash
# Complete system validation
npm run typecheck
npm run test
npm run test:coverage
npm run build

# Performance testing
npm run test:performance
claude debug "Test full menu system performance"

# Accessibility testing
npm run test:accessibility
claude debug "Test complete accessibility compliance"

# POS integration testing
claude debug "Test POS DTO generation for all categories"
claude debug "Test cart persistence across all categories"
```

---

## 🧪 Testing Command Blocks

### Quick Test Commands (Use Between Phases)
```bash
# Basic functionality test
npm run test

# Type checking
npm run typecheck

# Build verification
npm run build

# Development server
npm run dev

# Visual testing
npm run test:ui
```

### Comprehensive Testing Commands
```bash
# Full test suite
npm run test:coverage

# Performance testing
npm run test:performance

# Accessibility testing
npm run test:accessibility

# Integration testing
npm run test:integration

# End-to-end testing
npm run test:e2e
```

### Debug and Troubleshooting Commands
```bash
# Debug specific category
claude debug "Category name issue description"

# Debug pricing calculations
claude debug "Test pricing accuracy for [category]"

# Debug cart integration
claude debug "Test cart functionality for [category]"

# Debug POS integration
claude debug "Test POS DTO generation for [category]"

# Debug performance issues
claude debug "Analyze performance for [category] customization"
```

---

## 📊 Progress Tracking

### Implementation Checklist

#### ✅ Phase 1: Foundation (Days 1-10)
- [ ] Appetizers implemented and tested
- [ ] Pizza system implemented with full topping support
- [ ] Half-pizza functionality working
- [ ] Basic cart integration verified
- [ ] Core architecture validated

#### ⏳ Phase 2: Standard Categories (Days 11-32)
- [ ] Salads with size-based scaling
- [ ] Pasta with baked options and meatball selection
- [ ] BBQ ribs with sauce levels
- [ ] All size-based systems working correctly

#### ⏳ Phase 3: Complex Individual Pieces (Days 33-51)
- [ ] Complete chicken system (all 3 categories)
- [ ] Individual piece selection working
- [ ] BBQ style and order type logic
- [ ] Seafood with preparation styles
- [ ] Shared component architecture validated

#### ⏳ Phase 4: Remaining Categories (Days 52-66)
- [ ] Submarines with preset modification tracking
- [ ] Sandwiches with only/deluxe system
- [ ] Desserts with flavor/size selection
- [ ] All basic categories complete

#### ⏳ Phase 5: Advanced Integration (Days 67-71)
- [ ] Combination plates with multi-protein system
- [ ] Portion balancing functionality
- [ ] Smorgasbord builder
- [ ] Complete system integration
- [ ] Performance optimization
- [ ] Final testing and validation

---

## 🚨 Troubleshooting Guide

### Common Issues and Solutions

#### Category Implementation Failures
```bash
# Reset and retry category
claude debug "Reset [category] implementation and retry"

# Check dependencies
npm run typecheck
npm install

# Verify POS data
claude debug "Verify POS data structure for [category]"
```

#### Pricing Calculation Errors
```bash
# Debug specific pricing issue
claude debug "Test pricing calculation for [specific scenario]"

# Verify POS pricing accuracy
claude debug "Compare website pricing to POS for [category]"

# Check tax calculations
claude debug "Verify tax calculation accuracy"
```

#### Cart Integration Problems
```bash
# Debug cart state
claude debug "Test cart state persistence for [category]"

# Reset cart state
claude debug "Reset and test cart functionality"

# Test cart with multiple items
claude debug "Test cart with items from multiple categories"
```

#### Performance Issues
```bash
# Analyze performance bottlenecks
claude debug "Analyze performance for [specific component]"

# Optimize component rendering
claude debug "Optimize rendering performance for [category]"

# Check memory usage
claude debug "Analyze memory usage during [category] customization"
```

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] All 11 menu categories implemented and working
- [ ] Individual piece selection systems functional
- [ ] Complex pricing calculations accurate
- [ ] Cart integration preserves all customizations
- [ ] POS DTO generation works for all categories
- [ ] Order type logic (only/dinner/deluxe) working
- [ ] Size-based scaling systems functional
- [ ] Preset modification tracking working

### Performance Requirements
- [ ] Category pages load in <2 seconds
- [ ] Customization interactions respond in <100ms
- [ ] Complex pricing updates in <200ms
- [ ] Cart operations complete in <50ms
- [ ] Full menu navigation smooth and responsive

### Quality Requirements
- [ ] Unit test coverage >90% for all categories
- [ ] Integration tests pass for all workflows
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Mobile responsive design working
- [ ] Cross-browser compatibility verified
- [ ] POS integration accuracy validated

---

## 📈 Implementation Statistics

| Category | Components | Timeline | Complexity | Test Coverage Required |
|----------|------------|----------|------------|----------------------|
| Appetizers | 3-4 | 3 days | Simple | >85% |
| Pizza | 12-15 | 7 days | Very High | >95% |
| Salads | 4-6 | 5 days | Medium | >90% |
| Pasta | 6-8 | 6 days | Medium | >90% |
| BBQ Ribs | 5-7 | 6 days | Medium | >90% |
| Chicken | 8-12 | 10 days | High | >95% |
| Seafood | 8-12 | 8 days | High | >95% |
| Submarines | 8-10 | 6 days | Medium | >90% |
| Sandwiches | 5-7 | 6 days | Medium | >90% |
| Desserts | 2-3 | 2 days | Simple | >85% |
| Combinations | 15-20 | 12 days | Very High | >95% |

**Total: 71 days, 50+ components, >90% average test coverage**

---

*This roadmap provides a complete, copy-paste implementation strategy for the entire Primos Pizza menu system. Follow the phases sequentially, test thoroughly at each checkpoint, and use the troubleshooting commands when needed.*