/**
 * Integrity.js Enhancement Functions (Complete JavaScript-Safe Version)
 * Enhances React components with mobile-first capabilities
 * Compatible with hooks.js and index.js v1.7.2
 */

// Import React functions with aliases to avoid naming conflicts
import React, { createElement as ReactCreateElement, cloneElement as ReactCloneElement } from 'react';

/**
 * Enhance a React component with Integrity.js mobile optimizations
 */
export function enhance(Component) {
  const IntegrityEnhancedComponent = React.forwardRef((props, ref) => {
    try {
      const enhancedProps = processMobileAttributes(props);
      const optimizedProps = applyMobileOptimizations(enhancedProps);
      
      return ReactCreateElement(Component, {
        ...optimizedProps,
        ref,
        'data-integrity': 'enhanced'
      });
    } catch (error) {
      console.warn('Integrity.js enhance error:', error);
      // Fallback to regular component
      return ReactCreateElement(Component, { ...props, ref });
    }
  });

  IntegrityEnhancedComponent.displayName = `Integrity(${Component.displayName || Component.name || 'Component'})`;
  
  return IntegrityEnhancedComponent;
}

/**
 * Higher-order component for Integrity.js enhancement
 */
export function withIntegrity(Component) {
  return enhance(Component);
}

/**
 * Process mobile-first attributes with enhanced validation (JavaScript-safe)
 */
function processMobileAttributes(props) {
  const mobileAttrs = {
    'memory-limit': true,
    'auto-cleanup': true,
    'performance-budget': true,
    'device-target': true,
    'mobile-quality': true,
    'lazy-threshold': true,
    'memory-priority': true,
    'touch-delay': true,
    'network-aware': true,
    'battery-aware': true,
    'virtual-threshold': true,
    'preload-buffer': true,
    'memory-strategy': true,
    'optimization': true,
    'fps-target': true,
    'gc-hint': true,
    'gc-threshold': true
  };

  const regularProps = {};
  const integrityProps = {};

  try {
    Object.keys(props || {}).forEach(key => {
      if (mobileAttrs[key]) {
        integrityProps[key] = props[key];
        
        // Enhanced validation in development (JavaScript-safe)
        if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
          validateMobileAttribute(key, props[key]);
        }
      } else {
        regularProps[key] = props[key];
      }
    });

    // Store integrity props for processing
    if (Object.keys(integrityProps).length > 0) {
      regularProps['data-integrity-props'] = JSON.stringify(integrityProps);
    }
  } catch (error) {
    console.warn('Error processing mobile attributes:', error);
    return props || {};
  }

  return regularProps;
}

/**
 * Enhanced mobile attribute validation (JavaScript-safe)
 */
function validateMobileAttribute(attrName, value) {
  try {
    switch (attrName) {
      case 'memory-limit':
        if (typeof value === 'string' && !value.match(/^\d+(MB|GB|KB)$/i)) {
          console.warn(
            `[Integrity.js] Invalid memory-limit value: "${value}". Expected format: "50MB", "1GB", "500KB"`
          );
        }
        break;
        
      case 'performance-budget':
        if (typeof value === 'string' && !value.match(/^\d+(ms|fps)$/i)) {
          console.warn(
            `[Integrity.js] Invalid performance-budget value: "${value}". Expected format: "16ms" or "60fps"`
          );
        }
        break;
        
      case 'device-target':
        if (!['mobile', 'desktop', 'tablet', 'low-end', 'high-end', 'auto'].includes(value)) {
          console.warn(
            `[Integrity.js] Invalid device-target value: "${value}". Expected: mobile, desktop, tablet, low-end, high-end, or auto`
          );
        }
        break;
        
      case 'mobile-quality':
        if (!['auto', 'high', 'medium', 'low'].includes(value)) {
          console.warn(
            `[Integrity.js] Invalid mobile-quality value: "${value}". Expected: auto, high, medium, or low`
          );
        }
        break;
        
      case 'memory-priority':
        if (!['high', 'medium', 'low'].includes(value)) {
          console.warn(
            `[Integrity.js] Invalid memory-priority value: "${value}". Expected: high, medium, or low`
          );
        }
        break;
        
      case 'fps-target':
        if (typeof value === 'string') {
          const fps = parseInt(value);
          if (isNaN(fps) || fps < 15 || fps > 120) {
            console.warn(
              `[Integrity.js] Invalid fps-target value: "${value}". Expected: number between 15-120`
            );
          }
        }
        break;
        
      case 'touch-delay':
        if (typeof value === 'string' && !value.match(/^\d+(ms)$/i)) {
          console.warn(
            `[Integrity.js] Invalid touch-delay value: "${value}". Expected format: "0ms", "50ms"`
          );
        }
        break;
        
      case 'lazy-threshold':
        if (typeof value === 'string' && !value.match(/^\d+(px|%)$/i)) {
          console.warn(
            `[Integrity.js] Invalid lazy-threshold value: "${value}". Expected format: "100px", "50%"`
          );
        }
        break;
        
      case 'virtual-threshold':
        if (typeof value === 'string') {
          const threshold = parseInt(value);
          if (isNaN(threshold) || threshold < 10) {
            console.warn(
              `[Integrity.js] Invalid virtual-threshold value: "${value}". Expected: number >= 10`
            );
          }
        }
        break;
    }
  } catch (error) {
    console.warn('Error validating mobile attribute:', error);
  }
}

/**
 * Apply mobile optimizations based on device (JavaScript-safe)
 */
function applyMobileOptimizations(props) {
  const optimizedProps = { ...props };
  
  try {
    // Safe device detection with fallbacks for SSR and older browsers
    const isMobile = typeof navigator !== 'undefined' ? 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
      false;
      
    const isLowEnd = typeof navigator !== 'undefined' ? 
      (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2) : 
      false;
      
    const isSlowNetwork = typeof navigator !== 'undefined' && navigator.connection ? 
      ['slow-2g', '2g'].includes(navigator.connection.effectiveType) : 
      false;

    // Get integrity props for processing (JavaScript-safe)
    let integrityProps = {};
    try {
      if (props['data-integrity-props']) {
        integrityProps = JSON.parse(props['data-integrity-props']);
      }
    } catch (error) {
      console.warn('Error parsing integrity props:', error);
    }

    // Auto-apply mobile optimizations
    if (isMobile || integrityProps['device-target'] === 'mobile') {
      // Remove 300ms touch delay
      if (!optimizedProps.style) optimizedProps.style = {};
      optimizedProps.style.touchAction = optimizedProps.style.touchAction || 'manipulation';
      
      // Auto-apply memory optimizations for images
      if (props.src && !integrityProps['mobile-quality']) {
        integrityProps['mobile-quality'] = isLowEnd ? 'low' : 'medium';
      }
      
      // Auto-set touch delay optimization
      if (!integrityProps['touch-delay']) {
        integrityProps['touch-delay'] = '0ms';
      }
      
      // Auto-set memory limits
      if (!integrityProps['memory-limit']) {
        integrityProps['memory-limit'] = isLowEnd ? '25MB' : '50MB';
      }
      
      // Enable lazy loading by default on mobile
      if (props.src && !integrityProps['lazy-threshold']) {
        integrityProps['lazy-threshold'] = '100px';
      }
    }

    // Auto-apply low-end device optimizations
    if (isLowEnd || integrityProps['device-target'] === 'low-end') {
      // Disable animations and complex layouts on low-end devices
      if (!optimizedProps.style) optimizedProps.style = {};
      optimizedProps.style.willChange = 'auto';
      optimizedProps['data-low-end'] = 'true';
      
      // Set conservative performance budget
      if (!integrityProps['performance-budget']) {
        integrityProps['performance-budget'] = '32ms'; // 30 FPS target
      }
      
      // Enable aggressive garbage collection
      if (!integrityProps['gc-hint']) {
        integrityProps['gc-hint'] = 'aggressive';
      }
      
      // Reduce memory limits for low-end devices
      if (!integrityProps['memory-limit']) {
        integrityProps['memory-limit'] = '20MB';
      }
    }

    // Auto-apply network optimizations
    if (isSlowNetwork || integrityProps['network-aware']) {
      // More aggressive lazy loading
      if (props.src && !props.loading) {
        optimizedProps.loading = 'lazy';
      }
      
      // Increase lazy loading threshold for slow networks
      if (props.src && !integrityProps['lazy-threshold']) {
        integrityProps['lazy-threshold'] = '200px';
      }
      
      // Reduce image quality on slow networks
      if (props.src && !integrityProps['mobile-quality']) {
        integrityProps['mobile-quality'] = 'low';
      }
    }

    // Auto-apply high-end device optimizations
    if (!isLowEnd && !isMobile && integrityProps['device-target'] !== 'low-end') {
      // Enable high-performance features
      if (!integrityProps['performance-budget']) {
        integrityProps['performance-budget'] = '60fps';
      }
      
      // Enable high-resolution images
      if (props.src && !integrityProps['mobile-quality']) {
        integrityProps['mobile-quality'] = 'high';
      }
      
      // Higher memory limits for high-end devices
      if (!integrityProps['memory-limit']) {
        integrityProps['memory-limit'] = '200MB';
      }
    }

    // Apply battery-aware optimizations if battery API is available
    if (integrityProps['battery-aware'] && typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        if (battery.level < 0.2 && !battery.charging) {
          // Low battery optimizations
          if (props.src && !integrityProps['mobile-quality']) {
            integrityProps['mobile-quality'] = 'low';
          }
          if (!integrityProps['performance-budget']) {
            integrityProps['performance-budget'] = '30fps';
          }
        }
      }).catch(() => {
        // Battery API not supported, ignore
      });
    }

    // Update integrity props if they were modified
    if (Object.keys(integrityProps).length > 0) {
      try {
        optimizedProps['data-integrity-props'] = JSON.stringify(integrityProps);
      } catch (error) {
        console.warn('Error updating integrity props:', error);
      }
    }

    // Apply CSS optimizations based on device capabilities
    if (!optimizedProps.style) optimizedProps.style = {};
    
    // Optimize rendering performance
    if (isLowEnd) {
      optimizedProps.style.transform = optimizedProps.style.transform || 'translateZ(0)';
      optimizedProps.style.backfaceVisibility = 'hidden';
    }
    
    // Optimize touch interactions
    if (isMobile) {
      optimizedProps.style.touchAction = optimizedProps.style.touchAction || 'manipulation';
      optimizedProps.style.webkitTapHighlightColor = 'transparent';
    }

  } catch (error) {
    console.warn('Error applying mobile optimizations:', error);
  }

  return optimizedProps;
}

/**
 * Enhanced memory cleanup function (JavaScript-safe)
 */
function triggerIntegrityCleanup() {
  try {
    console.log('?完 Integrity.js: Enhanced memory cleanup triggered');
    
    // Force garbage collection if available
    if (typeof window !== 'undefined' && window.gc) {
      window.gc();
      console.log('?完 Forced garbage collection completed');
    }
    
    // Clear Integrity.js specific caches
    if (typeof window !== 'undefined' && window.__INTEGRITY_CACHE__) {
      const cacheSize = window.__INTEGRITY_CACHE__.size || 0;
      window.__INTEGRITY_CACHE__.clear();
      console.log(`?完 Cleared Integrity cache (${cacheSize} items)`);
    }
    
    // Clear image caches if memory is critical
    if (typeof window !== 'undefined' && window.__INTEGRITY_IMAGE_CACHE__) {
      const imageCount = window.__INTEGRITY_IMAGE_CACHE__.size || 0;
      window.__INTEGRITY_IMAGE_CACHE__.clear();
      console.log(`?完 Cleared image cache (${imageCount} images)`);
    }
    
    // Clear any texture caches for Three.js applications
    if (typeof window !== 'undefined' && window.__INTEGRITY_TEXTURE_CACHE__) {
      window.__INTEGRITY_TEXTURE_CACHE__.clear();
      console.log('?完 Cleared texture cache');
    }
    
    return true;
  } catch (error) {
    console.warn('Error during Integrity cleanup:', error);
    return false;
  }
}

/**
 * Create Integrity-enhanced JSX elements (JavaScript-safe)
 */
export function integrityJsx(type, props, ...children) {
  try {
    const enhancedProps = processMobileAttributes(props || {});
    const optimizedProps = applyMobileOptimizations(enhancedProps);
    
    if (children.length > 0) {
      optimizedProps.children = children.length === 1 ? children[0] : children;
    }
    
    return ReactCreateElement(type, optimizedProps);
  } catch (error) {
    console.warn('Error creating Integrity JSX:', error);
    // Fallback to regular React createElement
    return ReactCreateElement(type, props || {}, ...children);
  }
}

/**
 * Integrity.js version of createElement (JavaScript-safe)
 */
export function createIntegrityElement(type, props, ...children) {
  try {
    const enhancedProps = processMobileAttributes(props || {});
    const optimizedProps = applyMobileOptimizations(enhancedProps);
    
    if (children.length > 0) {
      optimizedProps.children = children.length === 1 ? children[0] : children;
    }
    
    return ReactCreateElement(type, optimizedProps);
  } catch (error) {
    console.warn('Error creating Integrity element:', error);
    // Fallback to regular React createElement
    return ReactCreateElement(type, props || {}, ...children);
  }
}

// Export with compatibility aliases
export const jsx = integrityJsx;
export const createElement = createIntegrityElement;

/**
 * Enhanced cloneElement with Integrity.js features (JavaScript-safe)
 */
export function cloneIntegrityElement(element, props, ...children) {
  try {
    if (!element) {
      console.warn('Integrity cloneElement: element is null or undefined');
      return element;
    }
    
    const enhancedProps = processMobileAttributes(props || {});
    const optimizedProps = applyMobileOptimizations(enhancedProps);
    
    if (children.length > 0) {
      optimizedProps.children = children.length === 1 ? children[0] : children;
    }
    
    return ReactCloneElement(element, optimizedProps);
  } catch (error) {
    console.warn('Error cloning Integrity element:', error);
    // Fallback to regular React cloneElement
    return ReactCloneElement(element, props || {}, ...children);
  }
}

export const cloneElement = cloneIntegrityElement;

/**
 * Auto-enhance a component with mobile-first attributes (JavaScript-safe)
 */
export function autoEnhance(Component) {
  if (!Component) {
    console.warn('autoEnhance: Component is null or undefined');
    return Component;
  }
  
  return React.forwardRef((props, ref) => {
    try {
      // Automatically detect and apply mobile optimizations
      const deviceAwareProps = applyAutoOptimizations(props || {});
      
      return ReactCreateElement(Component, {
        ...deviceAwareProps,
        ref,
        'data-integrity-auto': 'true'
      });
    } catch (error) {
      console.warn('Error auto-enhancing component:', error);
      // Fallback to regular component
      return ReactCreateElement(Component, { ...props, ref });
    }
  });
}

/**
 * Apply automatic optimizations based on current device state (JavaScript-safe)
 */
function applyAutoOptimizations(props) {
  const optimizedProps = { ...props };
  
  try {
    // Auto-detect current device state
    if (typeof window !== 'undefined') {
      let currentMemory = 0.5; // Default fallback
      
      if (performance && performance.memory) {
        currentMemory = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      }
      
      const isMemoryConstrained = currentMemory > 0.8;
      const isSlowDevice = navigator.hardwareConcurrency <= 2;
      const hasLowMemory = navigator.deviceMemory <= 2;
      
      // Apply automatic optimizations
      if (isMemoryConstrained || isSlowDevice || hasLowMemory) {
        optimizedProps['data-auto-optimized'] = 'memory-constrained';
        
        // Reduce image quality automatically
        if (props.src && !props['mobile-quality']) {
          optimizedProps['mobile-quality'] = 'low';
        }
        
        // Enable aggressive cleanup
        optimizedProps['auto-cleanup'] = 'true';
        optimizedProps['memory-limit'] = '30MB';
        
        // Reduce performance budget
        if (!props['performance-budget']) {
          optimizedProps['performance-budget'] = '30fps';
        }
      }
      
      // Auto-optimize for very high-end devices
      if (!isSlowDevice && !hasLowMemory && currentMemory < 0.3) {
        optimizedProps['data-auto-optimized'] = 'high-performance';
        optimizedProps['performance-budget'] = '60fps';
        optimizedProps['memory-limit'] = '200MB';
      }
    }
  } catch (error) {
    console.warn('Error applying auto optimizations:', error);
  }
  
  return optimizedProps;
}

/**
 * Performance monitoring and automatic adjustment (JavaScript-safe)
 */
export function createPerformanceObserver(callback) {
  try {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      console.warn('PerformanceObserver not available');
      return null;
    }
    
    const observer = new PerformanceObserver((list) => {
      try {
        const entries = list.getEntries();
        const performanceData = {
          renderTime: 0,
          memoryUsage: 0,
          fps: 60,
          loadTime: 0
        };
        
        entries.forEach(entry => {
          try {
            if (entry.entryType === 'measure') {
              performanceData.renderTime = Math.max(performanceData.renderTime, entry.duration);
            }
            if (entry.entryType === 'navigation') {
              performanceData.loadTime = entry.loadEventEnd - entry.loadEventStart;
            }
            if (entry.entryType === 'paint') {
              performanceData.paintTime = entry.startTime;
            }
          } catch (entryError) {
            console.warn('Error processing performance entry:', entryError);
          }
        });
        
        // Calculate FPS from frame timing
        const now = performance.now();
        const lastFrameTime = window.__lastFrameTime || now;
        const frameDelta = now - lastFrameTime;
        const fps = frameDelta > 0 ? Math.round(1000 / frameDelta) : 60;
        window.__lastFrameTime = now;
        performanceData.fps = Math.min(fps, 120); // Cap at 120fps
        
        // Get memory info
        if (performance.memory) {
          performanceData.memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
          performanceData.memoryUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        
        callback(performanceData);
      } catch (error) {
        console.warn('Error in performance observer callback:', error);
      }
    });
    
    // Observe performance entries with error handling
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (observeError) {
      console.warn('Error starting performance observation:', observeError);
      // Try with fewer entry types
      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (fallbackError) {
        console.warn('Performance observer fallback failed:', fallbackError);
        return null;
      }
    }
    
    return observer;
  } catch (error) {
    console.warn('Error creating performance observer:', error);
    return null;
  }
}

/**
 * Global configuration for Integrity.js (JavaScript-safe)
 */
export function configureIntegrity(config = {}) {
  try {
    if (typeof window !== 'undefined') {
      // Initialize caches
      if (!window.__INTEGRITY_CACHE__) {
        window.__INTEGRITY_CACHE__ = new Map();
      }
      if (!window.__INTEGRITY_IMAGE_CACHE__) {
        window.__INTEGRITY_IMAGE_CACHE__ = new Map();
      }
      if (!window.__INTEGRITY_TEXTURE_CACHE__) {
        window.__INTEGRITY_TEXTURE_CACHE__ = new Map();
      }
      
      // Set configuration
      window.__INTEGRITY_CONFIG__ = {
        autoOptimize: true,
        memoryLimit: '100MB',
        performanceTarget: '60fps',
        deviceTarget: 'auto',
        enableCleanup: true,
        enableMonitoring: true,
        cleanupThreshold: 0.8,
        frameDropThreshold: 30,
        ...config
      };
      
      // Initialize performance monitoring if enabled
      if (window.__INTEGRITY_CONFIG__.enableMonitoring) {
        const observer = createPerformanceObserver((data) => {
          try {
            // Auto-adjust settings based on performance
            const shouldCleanup = data.fps < window.__INTEGRITY_CONFIG__.frameDropThreshold || 
                                 data.memoryUsage > window.__INTEGRITY_CONFIG__.cleanupThreshold;
            
            if (shouldCleanup) {
              triggerIntegrityCleanup();
            }
            
            // Store performance data
            window.__INTEGRITY_PERFORMANCE__ = data;
          } catch (error) {
            console.warn('Error in performance monitoring callback:', error);
          }
        });
        
        if (observer) {
          window.__INTEGRITY_PERFORMANCE_OBSERVER__ = observer;
        }
      }
      
      console.log('?? Integrity.js configuration applied:', window.__INTEGRITY_CONFIG__);
    }
  } catch (error) {
    console.warn('Error configuring Integrity.js:', error);
  }
}

/**
 * Get current Integrity.js configuration (JavaScript-safe)
 */
export function getIntegrityConfig() {
  try {
    return typeof window !== 'undefined' ? 
      window.__INTEGRITY_CONFIG__ || {} : 
      {};
  } catch (error) {
    console.warn('Error getting Integrity config:', error);
    return {};
  }
}

/**
 * Get current performance data (JavaScript-safe)
 */
export function getIntegrityPerformance() {
  try {
    return typeof window !== 'undefined' ? 
      window.__INTEGRITY_PERFORMANCE__ || {} : 
      {};
  } catch (error) {
    console.warn('Error getting Integrity performance data:', error);
    return {};
  }
}

/**
 * Manually trigger cleanup (JavaScript-safe)
 */
export function cleanup() {
  return triggerIntegrityCleanup();
}

/**
 * Dispose of all Integrity.js resources (JavaScript-safe)
 */
export function dispose() {
  try {
    if (typeof window !== 'undefined') {
      // Stop performance monitoring
      if (window.__INTEGRITY_PERFORMANCE_OBSERVER__) {
        window.__INTEGRITY_PERFORMANCE_OBSERVER__.disconnect();
        delete window.__INTEGRITY_PERFORMANCE_OBSERVER__;
      }
      
      // Clear all caches
      if (window.__INTEGRITY_CACHE__) {
        window.__INTEGRITY_CACHE__.clear();
      }
      if (window.__INTEGRITY_IMAGE_CACHE__) {
        window.__INTEGRITY_IMAGE_CACHE__.clear();
      }
      if (window.__INTEGRITY_TEXTURE_CACHE__) {
        window.__INTEGRITY_TEXTURE_CACHE__.clear();
      }
      
      // Clear configuration
      delete window.__INTEGRITY_CONFIG__;
      delete window.__INTEGRITY_PERFORMANCE__;
      
      console.log('?完 Integrity.js disposed of all resources');
    }
  } catch (error) {
    console.warn('Error disposing Integrity.js:', error);
  }
}
