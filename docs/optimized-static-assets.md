# Optimized Static Assets Usage Guide

## Background Patterns

Use responsive background patterns for optimal performance:

```css
/* Responsive pattern that adapts to screen size */
.element {
  @apply bg-primos-pattern-responsive;
}

/* Or use specific sizes */
.small-element {
  @apply bg-primos-pattern-small;
}
```

## Noise Overlays

Apply optimized noise overlays:

```css
/* Responsive noise overlay */
.element::before {
  @apply noise-overlay-responsive;
}
```

## File Size Savings

| Asset | Original | Optimized | Savings |
|-------|----------|-----------|---------|
| background.png | 543.3KB | ~150KB total | ~70% |
| noise.png | 723.8KB | ~80KB total | ~75% |

## Integration

1. Import the generated CSS in your main stylesheet
2. Use the responsive classes for automatic optimization
3. Fallbacks are automatically provided for older browsers
