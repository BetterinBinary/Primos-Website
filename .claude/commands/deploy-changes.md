# Deploy Changes Command

Comprehensive deployment workflow for the Primos Pizza website ensuring quality, performance, and reliability.

## Specification File Management

**IMPORTANT**: Before starting this command, create a detailed specification file for better context management:

1. **Create Specification File**
   ```bash
   # Ensure directories exist
   mkdir -p .claude/specs .claude/old_specs
   
   # Create spec file with timestamp
   touch .claude/specs/deploy-changes-$(date +%Y%m%d_%H%M%S).spec.md
   ```

2. **Specification Template**
   Use this structure in your `.spec.md` file:
   ```markdown
   # Deploy Changes Specification - [Timestamp]
   
   ## Current Context
   - Current branch and git status
   - Changes being deployed (features, fixes, updates)
   - Build configuration and environment variables
   - Performance baseline and targets
   - Deployment target (staging/production)
   - Rollback plan and previous stable version
   
   ## Implementation Plan
   - Pre-deployment validation checklist
   - Build and optimization strategy
   - Deployment method (static site, container, server)
   - Performance and security validation steps
   - Post-deployment monitoring setup
   - Rollback procedures if issues occur
   
   ## Validation Criteria
   - All tests pass (unit, integration, e2e)
   - TypeScript compilation successful
   - Lighthouse Performance score ≥90
   - Core Web Vitals meet targets
   - Security audit passes
   - API endpoints responding correctly
   - No broken functionality detected
   
   ## References
   - package.json scripts and dependencies
   - vite.config.js build configuration
   - Environment variable configuration
   - CI/CD pipeline configuration
   - Monitoring and analytics setup
   - Deployment infrastructure details
   ```

3. **During Execution**
   - Reference spec for deployment requirements
   - Update spec with validation results and issues
   - Use spec for rollback decision making

4. **After Completion**
   ```bash
   # Move spec to archive with completion status
   mv .claude/specs/deploy-changes-*.spec.md \
      .claude/old_specs/deploy-changes-$(date +%Y%m%d_%H%M%S)-completed.spec.md
   ```

## Pre-Deployment Checklist

1. **Code Quality Validation**
   - Run complete test suite: `npm run test`
   - TypeScript compilation: `npm run typecheck`
   - Linting validation: `npm run lint`
   - Code formatting: `npm run format`
   - Build success: `npm run build`

2. **Feature Validation**
   - All new features tested manually
   - Responsive design verified on multiple devices
   - Cross-browser compatibility confirmed
   - Accessibility standards met (WCAG 2.1 AA)
   - Performance targets achieved

3. **Integration Testing**
   - API endpoints functioning correctly
   - Database connections stable
   - Third-party integrations working
   - POS system integration (if applicable)
   - Payment processing validated

## Deployment Process

### 1. Environment Preparation
```bash
# Ensure clean working directory
git status

# Switch to main branch (or target branch)
git checkout main

# Pull latest changes
git pull origin main

# Install latest dependencies
npm ci

# Run full validation suite
npm run check
```

### 2. Build Optimization
```bash
# Clean previous builds
rm -rf build/

# Create production build
npm run build

# Verify build integrity
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### 3. Performance Validation
```bash
# Run Lighthouse audit
npm run audit:lighthouse

# Check Core Web Vitals
npm run audit:performance

# Validate image optimization
npm run audit:images

# Test loading performance
npm run test:performance
```

### 4. Security Checks
```bash
# Audit dependencies for vulnerabilities
npm audit

# Check for security issues
npm run security:scan

# Validate environment variables
npm run check:env

# Verify HTTPS configuration
npm run check:ssl
```

## Deployment Strategies

### Static Site Deployment (Recommended)
```bash
# Build static site
npm run build

# Deploy to static hosting (Netlify, Vercel, etc.)
# Example for Netlify:
netlify deploy --prod --dir=build

# Example for Vercel:
vercel --prod

# Example for GitHub Pages:
npm run deploy:github
```

### Container Deployment
```dockerfile
# Dockerfile for containerized deployment
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "build/index.js"]
```

```bash
# Build and deploy container
docker build -t primos-pizza-website .
docker run -p 3000:3000 primos-pizza-website
```

### Traditional Server Deployment
```bash
# Copy files to server
rsync -avz --delete build/ user@server:/var/www/primos-pizza/

# Restart web server
ssh user@server "sudo systemctl restart nginx"

# Verify deployment
curl -f https://primospizza.com/health
```

## Environment Configuration

### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
PUBLIC_API_URL=https://api.primospizza.com
PUBLIC_SITE_URL=https://primospizza.com
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# POS Integration (if applicable)
POS_API_URL=https://pos.primospizza.com
POS_API_KEY=live_key_...

# Performance monitoring
VITE_SENTRY_DSN=https://...
```

### Build Configuration
```javascript
// vite.config.js - Production settings
export default defineConfig({
  build: {
    target: 'es2022',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['svelte'],
          menu: ['./src/lib/components/menu'],
          utils: ['./src/lib/utils']
        }
      }
    }
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});
```

## Post-Deployment Validation

### Automated Health Checks
```bash
# Basic connectivity test
curl -f https://primospizza.com || echo "Site unreachable"

# API endpoint validation
curl -f https://primospizza.com/api/menu || echo "API error"

# Performance check
lighthouse https://primospizza.com --output=json --quiet

# SSL certificate validation
openssl s_client -connect primospizza.com:443 -servername primospizza.com
```

### Manual Validation Checklist
- [ ] Homepage loads correctly
- [ ] Menu displays all categories and items
- [ ] Search functionality works
- [ ] Cart operations function properly
- [ ] Order submission processes correctly
- [ ] Contact forms send successfully
- [ ] Mobile navigation operates smoothly
- [ ] Images load and display properly
- [ ] Performance meets targets (LCP <2.5s)

### User Acceptance Testing
```bash
# Run automated user journey tests
npm run test:e2e

# Performance regression tests
npm run test:performance:regression

# Accessibility validation
npm run test:a11y

# Cross-browser testing
npm run test:browsers
```

## Monitoring and Alerting

### Performance Monitoring Setup
```javascript
// src/lib/utils/monitoring.ts
export function setupMonitoring() {
  // Core Web Vitals tracking
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });

  // Error tracking
  window.addEventListener('error', (event) => {
    sendErrorToMonitoring({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });

  // Unhandled promise rejection tracking
  window.addEventListener('unhandledrejection', (event) => {
    sendErrorToMonitoring({
      message: 'Unhandled promise rejection',
      reason: event.reason
    });
  });
}
```

### Analytics Configuration
```javascript
// Google Analytics 4 setup
gtag('config', 'GA_MEASUREMENT_ID', {
  // Enhanced ecommerce for menu analytics
  send_page_view: true,
  custom_map: {
    'custom_parameter_1': 'menu_category',
    'custom_parameter_2': 'item_price'
  }
});

// Track menu interactions
export function trackMenuInteraction(action, item) {
  gtag('event', action, {
    event_category: 'menu',
    event_label: item.name,
    custom_parameter_1: item.category,
    custom_parameter_2: item.price
  });
}
```

## Rollback Procedures

### Immediate Rollback
```bash
# Quick rollback to previous version
git checkout HEAD~1
npm run build
npm run deploy

# Or rollback to specific version
git checkout v1.2.3
npm run build
npm run deploy
```

### Database Rollback (if applicable)
```bash
# Backup current database
pg_dump primos_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore previous database version
psql primos_db < backup_previous_version.sql
```

### CDN Cache Invalidation
```bash
# Invalidate CloudFare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Invalidate AWS CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

## Success Metrics

### Performance Targets
- **Lighthouse Performance Score**: e90
- **Largest Contentful Paint**: <2.5 seconds
- **First Input Delay**: <100 milliseconds
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3 seconds

### Business Metrics
- **Uptime**: 99.9% availability
- **Error Rate**: <0.1% of requests
- **Page Load Success**: >99.5%
- **API Response Time**: <500ms average
- **User Satisfaction**: No increase in bounce rate

## Deployment Environments

### Staging Environment
```bash
# Deploy to staging for final testing
npm run build:staging
npm run deploy:staging

# Staging URL: https://staging.primospizza.com
# Test all functionality before production
```

### Production Environment
```bash
# Deploy to production after staging validation
npm run build:production
npm run deploy:production

# Production URL: https://primospizza.com
# Monitor closely after deployment
```

## Common Deployment Issues

### Build Failures
**Issue**: TypeScript compilation errors
**Solution**: 
```bash
# Check for type errors
npm run typecheck

# Fix TypeScript issues
# Update type definitions
# Verify import paths
```

### Performance Degradation
**Issue**: Slower page loads after deployment
**Solution**:
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for large dependencies
# Optimize images and assets
# Review code splitting configuration
```

### API Integration Issues
**Issue**: Backend API connectivity problems
**Solution**:
```bash
# Verify API endpoints
curl -f https://api.primospizza.com/health

# Check environment variables
echo $PUBLIC_API_URL

# Validate CORS configuration
# Test authentication tokens
```

### SSL Certificate Problems
**Issue**: HTTPS certificate errors
**Solution**:
```bash
# Check certificate validity
openssl s_client -connect primospizza.com:443

# Renew certificate if needed
certbot renew

# Update DNS records if required
```

## Maintenance Windows

### Scheduled Maintenance
- **Timing**: Off-peak hours (2-4 AM local time)
- **Duration**: Maximum 30 minutes
- **Notification**: 24-hour advance notice to customers
- **Backup**: Complete system backup before changes

### Emergency Maintenance
- **Response Time**: <15 minutes for critical issues
- **Communication**: Immediate status page update
- **Escalation**: Technical lead notification
- **Documentation**: Incident report within 24 hours

## Documentation Updates

### Post-Deployment Tasks
- [ ] Update version number in package.json
- [ ] Document new features in README.md
- [ ] Update API documentation (if applicable)
- [ ] Create deployment notes in CHANGELOG.md
- [ ] Update environment configuration docs
- [ ] Notify team of successful deployment

### Knowledge Base Updates
- Update troubleshooting guides
- Document new deployment procedures
- Record lessons learned
- Update monitoring alerts configuration
- Review and update backup procedures