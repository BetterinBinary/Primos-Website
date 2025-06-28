# Test POS Integration Command

Comprehensive testing workflow for POS system integration:

## Pre-Integration Setup

1. **Environment Preparation**

   - Ensure POS server running (http://192.168.0.75:8050)
   - Verify database connectivity
   - Check printer server status (port 8060)
   - Confirm test payment processing setup

2. **Test Data Preparation**
   - Create test customer accounts
   - Prepare sample orders for each menu category
   - Set up test payment methods
   - Configure test printer output

## Integration Test Scenarios

**Scenario 1: Simple Pizza Order**

```javascript
const testOrder = {
  customer: { first: "Test", last: "Customer", phone: "555-0123" },
  type: "pick-up",
  items: [
    {
      category: "pizza",
      size: ["small"],
      type: ["round_square"],
      quantity: 1,
      pizzaToppings: { whole: { pepperoni: 1 }, first: {}, second: {} },
      numToppings: 1,
      price: 13.85,
    },
  ],
  price: 13.85,
};
```

**Scenario 2: Complex Multi-Item Order**

```javascript
const complexOrder = {
  customer: { first: "John", last: "Doe", phone: "555-0456" },
  type: "delivery",
  items: [
    // Twin pizzas (discount pricing)
    {
      /* Large Pepperoni */
    },
    {
      /* Large Sausage */
    },
    // Pasta dish
    {
      /* Spaghetti with Meatballs */
    },
    // Beverages
    {
      /* 2-Liter Coke */
    },
  ],
  price: 45.75, // Including delivery fee
};
```

## Testing Workflow

1. **Submit Test Orders**

   - Send orders via website API
   - Monitor POS order queue
   - Verify order appears correctly
   - Check kitchen printer output

2. **Validate Order Processing**

   - Confirm POS staff can read order details
   - Test order status updates
   - Verify payment processing integration
   - Check completion workflow

3. **Error Handling Tests**
   - Test invalid order data
   - Simulate POS server downtime
   - Test network connectivity issues
   - Verify graceful degradation

## Monitoring and Logging

**Order Tracking:**

- Log all API calls to POS system
- Monitor response times and errors
- Track successful order completions
- Document any data transformation issues

**Performance Metrics:**

- API response time (target: <500ms)
- Order processing success rate (target: >99%)
- Error recovery time
- Kitchen printer reliability

## Validation Checklist

**Order Data Integrity:**

- [ ] Customer information transfers correctly
- [ ] All menu items appear with proper formatting
- [ ] Pricing calculations match website display
- [ ] Special instructions preserved
- [ ] Order type (pickup/delivery) correctly set

**POS System Integration:**

- [ ] Orders appear in POS queue immediately
- [ ] Order numbers sync between systems
- [ ] Kitchen tickets print with correct details
- [ ] Staff can mark orders complete
- [ ] Order history updates both systems

**Error Recovery:**

- [ ] Failed orders retry automatically
- [ ] User receives appropriate error messages
- [ ] Fallback order processing available
- [ ] Data loss prevention measures work

## Success Metrics

- Zero order data loss
- 100% kitchen printer compatibility
- <2 second average API response time
- Seamless staff workflow integration
