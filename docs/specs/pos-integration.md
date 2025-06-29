# POS Integration Specification

## Overview

This document outlines the integration between the Primos Pizza website and the existing POS system, ensuring seamless order processing and data synchronization.

## POS System Details

**Current System**: Custom POS at `http://192.168.0.75:8050`
**Kitchen Printer**: Port 8060
**Database**: Local PostgreSQL instance

## Data Transformation Layer (DTO Pattern)

### Core DTO Classes

#### WebOrderToPosDTO
Transforms website orders to POS-compatible format:

```typescript
class WebOrderToPosDTO {
  static transform(websiteOrder: WebsiteOrder): PosOrder {
    return {
      type: websiteOrder.orderType,
      items: websiteOrder.items.map(item => this.transformItem(item)),
      customer: this.transformCustomer(websiteOrder.customer),
      price: websiteOrder.total,
      note: websiteOrder.specialInstructions || ""
    };
  }
}
```

#### PosOrderToWebDTO
Transforms POS responses back to website format:

```typescript
class PosOrderToWebDTO {
  static transform(posResponse: PosResponse): WebsiteOrderResult {
    return {
      orderId: posResponse.id,
      orderNumber: posResponse.orderNumber,
      estimatedTime: posResponse.estimatedMinutes,
      status: this.mapPosStatus(posResponse.status)
    };
  }
}
```

## Order Processing Flow

### 1. Website Order Submission
```
Customer Order (Website) 
    ↓
Website Validation
    ↓
WebOrderToPosDTO.transform()
    ↓
POST to POS API (192.168.0.75:8050/orders)
    ↓
POS Processing
    ↓
Kitchen Printer Output
    ↓
Response to Website
```

### 2. Order Status Updates
```
POS Status Change
    ↓
Webhook/Polling to Website
    ↓
PosOrderToWebDTO.transform()
    ↓
Website Status Update
    ↓
Customer Notification
```

## Data Format Specifications

### Pizza Order Transformation

**Website Format:**
```json
{
  "item": "Large Pizza",
  "size": "large",
  "toppings": {
    "whole": ["pepperoni", "mushrooms"],
    "firstHalf": [],
    "secondHalf": []
  },
  "quantity": 1
}
```

**POS Format:**
```json
{
  "category": "pizza",
  "size": ["large"],
  "type": ["round_square"],
  "pizzaToppings": {
    "whole": {"pepperoni": 1, "mushrooms": 1},
    "first": {},
    "second": {}
  },
  "numToppings": 2,
  "quantity": 1,
  "tracker": {
    "size": {"large": 1},
    "type": {"round_square": 1},
    "topping": {"pepperoni": 1, "mushrooms": 1}
  }
}
```

### Customer Data Transformation

**Website Format:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-1234",
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Livonia",
    "state": "MI",
    "zipCode": "48150"
  }
}
```

**POS Format:**
```json
{
  "first": "John",
  "last": "Doe",
  "phone": "555-1234",
  "address": "123 Main St, Livonia, MI 48150"
}
```

## API Endpoints

### Order Processing
- **POST** `/api/orders` - Submit new order
- **GET** `/api/orders/{id}` - Get order status
- **PUT** `/api/orders/{id}/status` - Update order status

### Menu Synchronization
- **GET** `/api/menu/sync` - Sync menu from POS
- **POST** `/api/menu/update` - Update menu item availability

## Error Handling

### Connection Issues
1. **POS Offline**: Queue orders locally, retry when available
2. **Network Timeout**: Retry with exponential backoff
3. **Invalid Data**: Validate before sending, log errors

### Fallback Mechanisms
1. **Email Fallback**: Send order details via email if POS fails
2. **Manual Processing**: Staff notification for failed orders
3. **Order Queue**: Local storage for offline orders

## Testing Strategy

### Unit Tests
- DTO transformation accuracy
- Data validation rules
- Error handling scenarios

### Integration Tests
- End-to-end order processing
- POS connectivity testing
- Kitchen printer verification

### Performance Tests
- API response times (<500ms target)
- Concurrent order handling
- Database connection pooling

## Security Considerations

### Data Protection
- No credit card data stored locally
- Customer PII encryption in transit
- Secure API endpoints with authentication

### Access Control
- POS API authentication tokens
- Rate limiting on order submissions
- Input validation and sanitization

## Monitoring and Logging

### Key Metrics
- Order processing success rate (>99% target)
- API response times
- Kitchen printer success rate
- Customer satisfaction scores

### Logging Strategy
- All API calls to POS system
- Order transformation errors
- Performance bottlenecks
- Customer complaint correlation

## Implementation Phases

### Phase 1: Basic Integration (Week 5-6)
- DTO classes implementation
- Basic order processing
- Error handling framework

### Phase 2: Advanced Features (Week 7-8)
- Real-time status updates
- Menu synchronization
- Performance optimization

### Phase 3: Production Deployment (Week 8+)
- Load testing
- Staff training
- Go-live monitoring

## Success Criteria

- [ ] Zero order data loss
- [ ] 100% kitchen printer compatibility
- [ ] <2 second average API response time
- [ ] Seamless staff workflow integration
- [ ] Customer satisfaction maintained or improved