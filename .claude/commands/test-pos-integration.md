# Test POS Integration Command

Comprehensive testing workflow for POS system integration using TypeScript DTOs and SvelteKit API routes.

## Specification File Management

**IMPORTANT**: Before starting this command, create a detailed specification file for better context management:

1. **Create Specification File**
   ```bash
   # Ensure directories exist
   mkdir -p .claude/specs .claude/old_specs
   
   # Create spec file with timestamp
   touch .claude/specs/test-pos-integration-$(date +%Y%m%d_%H%M%S).spec.md
   ```

2. **Specification Template**
   Use this structure in your `.spec.md` file:
   ```markdown
   # Test POS Integration Specification - [Timestamp]
   
   ## Current Context
   - POS server status and endpoints (http://192.168.0.75:8050)
   - DTO implementation status in src/lib/dtos/
   - SvelteKit API routes for order processing
   - Test data samples and scenarios prepared
   - Kitchen printer configuration (port 8060)
   - Current integration test coverage
   
   ## Implementation Plan
   - Test scenarios to execute (simple pizza, complex orders, edge cases)
   - API endpoint testing sequence
   - Performance benchmarking approach
   - Error handling and recovery testing
   - Load testing strategy for concurrent orders
   
   ## Validation Criteria
   - All test orders process successfully in POS
   - Kitchen printer outputs correctly formatted tickets
   - Order data integrity maintained through transformation
   - API response times under 500ms
   - Error handling graceful with proper fallbacks
   - Performance targets met under load
   
   ## References
   - src/lib/dtos/ DTO implementation files
   - Test data in src/lib/dtos/tests/test-data/
   - API routes in src/routes/api/
   - Performance monitoring utilities
   - POS integration logger implementation
   ```

3. **During Execution**
   - Reference spec for test scenario details
   - Update spec with test results and issues found
   - Use spec for performance metrics tracking

4. **After Completion**
   ```bash
   # Move spec to archive with completion status
   mv .claude/specs/test-pos-integration-*.spec.md \
      .claude/old_specs/test-pos-integration-$(date +%Y%m%d_%H%M%S)-completed.spec.md
   ```

## Pre-Integration Setup

1. **Environment Preparation**
   - Ensure POS server running (http://192.168.0.75:8050)
   - Verify database connectivity and access
   - Check printer server status (port 8060)
   - Confirm test payment processing setup
   - Validate network connectivity between systems

2. **Test Data Preparation**
   - Create test customer accounts in POS system
   - Prepare sample orders for each menu category
   - Set up test payment methods and validation
   - Configure test printer output for kitchen
   - Prepare edge case scenarios

3. **Development Environment Setup**
   - Run SvelteKit development server: `npm run dev`
   - Ensure DTO classes are compiled and available
   - Verify TypeScript compilation: `npm run typecheck`
   - Check API routes are responding correctly

## Integration Test Scenarios

### Scenario 1: Simple Pizza Order
```typescript
const testOrder: WebsiteOrder = {
  customer: { 
    firstName: "Test", 
    lastName: "Customer", 
    phone: "555-0123",
    email: "test@example.com"
  },
  orderType: "pickup",
  items: [{
    id: "pepperoni_pizza",
    category: "pizza",
    selectedSize: "small",
    selectedToppings: [
      { id: "pepperoni", name: "Pepperoni", placement: "whole" }
    ],
    quantity: 1,
    calculatedPrice: 13.85
  }],
  subtotal: 13.85,
  tax: 0.83,
  total: 14.68,
  specialInstructions: "Test order - do not prepare"
};

// Expected POS transformation
const expectedPOSOrder = {
  customer: { first: "Test", last: "Customer", phone: "555-0123" },
  type: "pick-up",
  items: [{
    category: "pizza",
    size: ["small"],
    type: ["round_square"],
    quantity: 1,
    pizzaToppings: { 
      whole: {"pepperoni": 1}, 
      first: {}, 
      second: {} 
    },
    numToppings: 1,
    price: 13.85
  }],
  price: 14.68,
  note: "Test order - do not prepare"
};
```

### Scenario 2: Complex Multi-Item Order
```typescript
const complexOrder: WebsiteOrder = {
  customer: { 
    firstName: "John", 
    lastName: "Doe", 
    phone: "555-0456",
    address: "123 Main St, City, MI 48111"
  },
  orderType: "delivery",
  items: [
    // Twin pizzas with discount
    {
      id: "pepperoni_pizza",
      category: "pizza",
      selectedSize: "large",
      selectedToppings: [{ id: "pepperoni", placement: "whole" }],
      quantity: 1,
      calculatedPrice: 18.99
    },
    {
      id: "sausage_pizza", 
      category: "pizza",
      selectedSize: "large",
      selectedToppings: [{ id: "sausage", placement: "whole" }],
      quantity: 1,
      calculatedPrice: 18.99
    },
    // Pasta dish
    {
      id: "spaghetti_meatballs",
      category: "pasta",
      selectedSize: "regular",
      quantity: 1,
      calculatedPrice: 12.99
    },
    // Beverages
    {
      id: "coke_2liter",
      category: "beverages",
      quantity: 1,
      calculatedPrice: 3.99
    }
  ],
  subtotal: 54.96,
  deliveryFee: 3.50,
  tax: 3.51,
  total: 61.97,
  twinPizzaDiscount: -2.00
};
```

### Scenario 3: Half-and-Half Pizza
```typescript
const halfPizzaOrder: WebsiteOrder = {
  items: [{
    id: "custom_pizza",
    category: "pizza", 
    selectedSize: "large",
    selectedToppings: [
      { id: "pepperoni", placement: "first" },
      { id: "mushrooms", placement: "first" },
      { id: "sausage", placement: "second" },
      { id: "peppers", placement: "second" }
    ],
    quantity: 1,
    specialInstructions: "First half: pepperoni & mushrooms, Second half: sausage & peppers"
  }]
};
```

## Testing Workflow

### 1. API Endpoint Testing
```bash
# Test DTO transformation endpoint
curl -X POST http://localhost:5173/api/orders/transform \
  -H "Content-Type: application/json" \
  -d @test-data/simple-pizza-order.json

# Test POS submission endpoint  
curl -X POST http://localhost:5173/api/orders/submit \
  -H "Content-Type: application/json" \
  -d @test-data/complex-order.json

# Test order validation endpoint
curl -X POST http://localhost:5173/api/orders/validate \
  -H "Content-Type: application/json" \
  -d @test-data/invalid-order.json
```

### 2. Submit Test Orders
- Send orders via SvelteKit API routes
- Monitor POS order queue for receipt
- Verify order appears correctly in POS system
- Check kitchen printer output formatting
- Validate order number synchronization

### 3. Validate Order Processing
- Confirm POS staff can read order details clearly
- Test order status updates (received → preparing → ready)
- Verify payment processing integration works
- Check order completion workflow functions
- Test customer notification system

### 4. Error Handling Tests
```typescript
// Test invalid order data
const invalidOrder = {
  customer: {}, // Missing required fields
  items: [], // Empty items array
  total: -10 // Invalid total
};

// Test POS server downtime simulation
// Mock network timeout scenarios
// Test graceful degradation behavior
```

## Monitoring and Logging

### Order Tracking Implementation
```typescript
// src/lib/utils/pos-logger.ts
export class POSIntegrationLogger {
  static logOrderSubmission(order: WebsiteOrder, posOrder: POSOrder) {
    console.log('Order submitted to POS:', {
      timestamp: new Date().toISOString(),
      websiteOrderId: order.id,
      posOrderData: posOrder,
      transformation: 'WebOrderToPosDTO'
    });
  }

  static logPOSResponse(response: POSResponse, timing: number) {
    console.log('POS Response received:', {
      timestamp: new Date().toISOString(),
      responseTime: `${timing}ms`,
      success: response.success,
      orderId: response.orderId,
      errors: response.errors || []
    });
  }

  static logTransformationError(error: Error, originalData: any) {
    console.error('DTO Transformation Error:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      originalData,
      transformationType: 'WebOrderToPosDTO'
    });
  }
}
```

### Performance Metrics Tracking
```typescript
// Track API response times
const startTime = performance.now();
const posResponse = await submitToPOS(transformedOrder);
const endTime = performance.now();
const responseTime = endTime - startTime;

// Log performance metrics
POSIntegrationLogger.logPOSResponse(posResponse, responseTime);

// Performance targets:
// - API response time: <500ms (target)
// - Order processing success rate: >99% (target) 
// - Error recovery time: <30 seconds
// - Kitchen printer reliability: 100%
```

## Testing Commands

```bash
# Run integration test suite
npm run test:integration

# Test specific POS scenarios
npm run test -- --grep "POS integration"

# Run DTO transformation tests
npm run test -- dto

# Test against live POS (use with caution)
npm run test:pos-live

# Validate all test orders
npm run test:orders

# Performance testing
npm run test:performance
```

## Validation Checklist

### Order Data Integrity
- [ ] Customer information transfers correctly to POS
- [ ] All menu items appear with proper formatting
- [ ] Pricing calculations match website display exactly
- [ ] Special instructions preserved and visible
- [ ] Order type (pickup/delivery) correctly set
- [ ] Delivery address formatted properly for drivers

### POS System Integration  
- [ ] Orders appear in POS queue immediately (<5 seconds)
- [ ] Order numbers sync between website and POS
- [ ] Kitchen tickets print with correct item details
- [ ] Staff can mark orders complete in POS
- [ ] Order history updates both systems
- [ ] Customer lookup works for repeat orders

### Error Recovery and Handling
- [ ] Failed orders retry automatically (3 attempts)
- [ ] User receives appropriate error messages
- [ ] Fallback order processing available (email/phone)
- [ ] Data loss prevention measures work effectively
- [ ] Network timeout handling graceful
- [ ] Invalid data rejected with clear error messages

### Performance and Reliability
- [ ] Average API response time <500ms
- [ ] Order processing success rate >99%
- [ ] Zero data corruption during transmission
- [ ] Kitchen printer outputs 100% reliable
- [ ] System handles concurrent orders properly
- [ ] Memory usage remains stable during testing

## Success Metrics

**Zero Data Loss**: No orders lost during transmission or transformation
**Kitchen Compatibility**: 100% of orders print correctly for kitchen staff
**Response Time**: Average API response time under 2 seconds
**Staff Integration**: POS staff can process website orders without additional training
**Error Rate**: Less than 1% of orders require manual intervention
**Customer Experience**: Seamless ordering flow with accurate confirmations

## Common Integration Issues and Solutions

### Array Format Problems
```typescript
// Issue: POS expects arrays, website uses strings
const websiteSize = "large";
const posSize = [websiteSize]; // Convert to array

// Solution: Always wrap single values in arrays for POS
const transformSize = (size: string): string[] => [size];
```

### Pizza Topping Structure Mismatch
```typescript
// Issue: Website toppings vs POS pizzaToppings structure
const websiteToppings = [
  { id: "pepperoni", placement: "whole" }
];

// Solution: Transform to POS structure
const posToppings = {
  pizzaToppings: {
    whole: { "pepperoni": 1 },
    first: {},
    second: {}
  }
};
```

### Customer Data Field Mapping
```typescript
// Issue: Field name differences
const websiteCustomer = {
  firstName: "John",
  lastName: "Doe", 
  phoneNumber: "555-1234"
};

// Solution: Map to POS field names
const posCustomer = {
  first: websiteCustomer.firstName,
  last: websiteCustomer.lastName,
  phone: websiteCustomer.phoneNumber
};
```

### Pricing Calculation Discrepancies
```typescript
// Issue: Rounding differences between systems
const websiteTotal = 14.567; // Calculated total
const posTotal = Math.round(websiteTotal * 100) / 100; // 14.57

// Solution: Use consistent rounding rules
const normalizePrice = (price: number): number => 
  Math.round(price * 100) / 100;
```

## Rollback and Recovery Procedures

### Immediate Response to Critical Issues
1. **Stop Order Processing**: Disable order submission temporarily
2. **Notify Staff**: Alert kitchen and management of technical issues
3. **Enable Fallback**: Switch to phone/email order processing
4. **Log Incident**: Document all errors for analysis

### System Recovery Steps
```bash
# Check POS server status
curl -f http://192.168.0.75:8050/health || echo "POS server down"

# Restart integration services
npm run restart:integration

# Validate DTO transformations
npm run test:dto -- --verbose

# Test with sample order
npm run test:integration -- --single-order

# Monitor for successful processing
npm run monitor:pos-integration
```

### Post-Recovery Validation
- [ ] All pending orders processed successfully
- [ ] Kitchen printer functioning normally
- [ ] Order numbers sequential and correct
- [ ] Customer notifications sent properly
- [ ] Staff workflow back to normal operations

## Load Testing and Stress Testing

### Concurrent Order Simulation
```typescript
// Test multiple simultaneous orders
const concurrentOrders = Array.from({ length: 10 }, (_, i) => 
  generateTestOrder(`customer-${i}`)
);

// Submit all orders simultaneously
const results = await Promise.allSettled(
  concurrentOrders.map(order => submitOrderToPOS(order))
);

// Analyze results for failures or performance issues
const failures = results.filter(result => result.status === 'rejected');
console.log(`Failed orders: ${failures.length}/${results.length}`);
```

### Peak Hours Simulation
- Test Friday/Saturday evening order volumes
- Simulate lunch rush scenarios
- Validate system performance under load
- Monitor memory usage and response times
- Test printer queue handling during busy periods