/**
 * Image Preloader Utility for Primos Pizza Website
 * 
 * Provides intelligent image preloading to improve performance:
 * - Critical above-the-fold images get high priority
 * - Adaptive loading based on connection speed
 * - Memory-conscious preloading with cleanup
 * - Performance monitoring and analytics
 */

/**
 * Connection speed detection
 */
export function getConnectionSpeed() {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    const effectiveType = connection.effectiveType;
    
    // Map effective types to categories
    const speedMap = {
      'slow-2g': 'slow',
      '2g': 'slow', 
      '3g': 'medium',
      '4g': 'fast'
    };
    
    return {
      speed: speedMap[effectiveType] || 'medium',
      saveData: connection.saveData || false,
      downlink: connection.downlink || 0
    };
  }
  
  // Default to medium speed if connection API not available
  return { speed: 'medium', saveData: false, downlink: 0 };
}

/**
 * Preload critical images with priority
 */
export class ImagePreloader {
  constructor(options = {}) {
    this.options = {
      maxConcurrent: 3,
      timeout: 10000,
      retryAttempts: 2,
      ...options
    };
    
    this.queue = [];
    this.loading = new Set();
    this.loaded = new Set();
    this.failed = new Set();
    this.stats = {
      totalRequested: 0,
      totalLoaded: 0,
      totalFailed: 0,
      averageLoadTime: 0
    };
  }
  
  /**
   * Add images to preload queue
   */
  preload(images, priority = 'normal') {
    const imageArray = Array.isArray(images) ? images : [images];
    
    imageArray.forEach(imageUrl => {
      if (this.loaded.has(imageUrl) || this.loading.has(imageUrl)) {
        return; // Already loaded or loading
      }
      
      this.queue.push({
        url: imageUrl,
        priority,
        addedAt: Date.now()
      });
      
      this.stats.totalRequested++;
    });
    
    // Sort queue by priority
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    this.processQueue();
  }
  
  /**
   * Process the preload queue
   */
  async processQueue() {
    while (this.queue.length > 0 && this.loading.size < this.options.maxConcurrent) {
      const item = this.queue.shift();
      await this.loadImage(item);
    }
  }
  
  /**
   * Load a single image with retry logic
   */
  async loadImage(item, attempt = 1) {
    const { url, priority } = item;
    const startTime = performance.now();
    
    this.loading.add(url);
    
    try {
      await this.createImagePromise(url, priority);
      
      const loadTime = performance.now() - startTime;
      this.loaded.add(url);
      this.loading.delete(url);
      this.stats.totalLoaded++;
      
      // Update average load time
      this.stats.averageLoadTime = 
        (this.stats.averageLoadTime * (this.stats.totalLoaded - 1) + loadTime) / 
        this.stats.totalLoaded;
      
      // Continue processing queue
      this.processQueue();
      
    } catch (error) {
      this.loading.delete(url);
      
      // Retry logic
      if (attempt < this.options.retryAttempts) {
        console.warn(`Preload retry ${attempt + 1}/${this.options.retryAttempts} for ${url}`);
        setTimeout(() => this.loadImage(item, attempt + 1), 1000 * attempt);
      } else {
        this.failed.add(url);
        this.stats.totalFailed++;
        console.error(`Failed to preload image after ${attempt} attempts: ${url}`, error);
        
        // Continue processing queue even if this image failed
        this.processQueue();
      }
    }
  }
  
  /**
   * Create promise for image loading
   */
  createImagePromise(url, priority) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image preload timeout: ${url}`));
      }, this.options.timeout);
      
      img.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Image preload failed: ${url}`));
      };
      
      // Set fetch priority for modern browsers
      if ('fetchPriority' in img) {
        img.fetchPriority = priority === 'high' ? 'high' : 'auto';
      }
      
      img.src = url;
    });
  }
  
  /**
   * Get preloader statistics
   */
  getStats() {
    return {
      ...this.stats,
      queueLength: this.queue.length,
      currentlyLoading: this.loading.size,
      successRate: this.stats.totalRequested > 0 
        ? (this.stats.totalLoaded / this.stats.totalRequested * 100).toFixed(1)
        : 0
    };
  }
  
  /**
   * Clear preloader state (useful for memory management)
   */
  clear() {
    this.queue = [];
    this.loading.clear();
    // Keep loaded and failed for cache purposes
  }
}

/**
 * Smart preloader that adapts to connection speed
 */
export class AdaptiveImagePreloader extends ImagePreloader {
  constructor(options = {}) {
    const connection = getConnectionSpeed();
    
    // Adjust concurrent loading based on connection
    const adaptiveOptions = {
      maxConcurrent: connection.speed === 'fast' ? 5 : 
                    connection.speed === 'medium' ? 3 : 2,
      timeout: connection.speed === 'fast' ? 5000 : 
              connection.speed === 'medium' ? 8000 : 12000,
      ...options
    };
    
    super(adaptiveOptions);
    this.connection = connection;
  }
  
  /**
   * Preload with adaptive strategy
   */
  preload(images, priority = 'normal') {
    // Skip preloading on slow connections with data saver enabled
    if (this.connection.saveData && this.connection.speed === 'slow') {
      console.log('Skipping preload due to data saver and slow connection');
      return;
    }
    
    // Reduce priority on slow connections
    if (this.connection.speed === 'slow' && priority === 'normal') {
      priority = 'low';
    }
    
    super.preload(images, priority);
  }
}

/**
 * Preload critical menu images based on current page
 */
export async function preloadCriticalImages() {
  const preloader = new AdaptiveImagePreloader();
  
  // Get current page path
  const path = window.location.pathname;
  
  if (path === '/' || path.includes('menu')) {
    // Preload first menu image with high priority
    preloader.preload([
      '/optimized/primos-menu-1-mobile.webp',
      '/optimized/primos-menu-1-tablet.webp'
    ], 'high');
    
    // Preload second menu image with normal priority
    setTimeout(() => {
      preloader.preload([
        '/optimized/primos-menu-2-mobile.webp', 
        '/optimized/primos-menu-2-tablet.webp'
      ], 'normal');
    }, 100);
  }
  
  // Preload optimized background textures
  preloader.preload([
    '/optimized/noise-tile.webp',
    '/optimized/background-small.webp'
  ], 'normal');
  
  return preloader;
}

/**
 * Monitor and report image loading performance
 */
export function setupImagePerformanceMonitoring() {
  if (!('PerformanceObserver' in window)) {
    return;
  }
  
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.initiatorType === 'img') {
        const loadTime = entry.responseEnd - entry.startTime;
        
        // Log slow image loads
        if (loadTime > 2000) {
          console.warn(`Slow image load detected: ${entry.name} (${loadTime.toFixed(0)}ms)`);
        }
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'image_load_time', {
            event_category: 'Performance',
            event_label: entry.name,
            value: Math.round(loadTime)
          });
        }
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
}