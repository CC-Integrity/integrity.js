/**
 * Integrity.js Enhancement Functions
 * Enhances React components with mobile-first capabilities
 */

// FIXED: Import React functions with aliases to avoid naming conflicts
import React, { createElement as ReactCreateElement, cloneElement as ReactCloneElement } from 'react';

/**
 * Enhance a React component with Integrity.js mobile optimizations
 */
export function enhance(Component) {
  const IntegrityEnhancedComponent = React.forwardRef((props, ref) => {
    const enhancedProps = processMobileAttributes(props);
    const optimizedProps = applyMobileOptimizations(enhancedProps);
    
    return ReactCreateElement(Component, {
      ...optimizedProps,
      ref,
      'data-integrity': 'enhanced'
    });
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
 * Process mobile-first attributes with enhanced validation
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

  Object.keys(props).forEach(key => {
    if (mobileAttrs[key]) {
      integrityProps[key] = props[key];
      
      // Enhanced validation in development
      if (process.env.NODE_ENV === 'development') {
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

  return regularProps;
}

/**
 * Enhanced mobile attribute validation
 */
function validateMobileAttribute(attrName, value) {
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
  }
}

/**
 * Apply mobile optimizations based on device with enhanced safety checks
 */
function applyMobileOptimizations(props) {
  const optimizedProps = { ...props };
  
  // Safe device detection with fallbacks for SSR
  const isMobile = typeof navigator !== 'undefined' ? 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
    false;
    
  const isLowEnd = typeof navigator !== 'undefined' ? 
    (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2) : 
    false;
    
  const isSlowNetwork = typeof navigator !== 'undefined' && navigator.connection ? 
    navigator.connection.effectiveType === 'slow-2g' : 
    false;

  // Get integrity props for processing
  const integrityProps = props['data-integrity-props'] ? 
    JSON.parse(props['data-integrity-props']) : {};

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
  }

  // Auto-apply network optimizations
  if (isSlowNetwork || integrityProps['network-aware']) {
    // More aggressive lazy loading
    if (props.src && !props.loading) {
      optimizedProps.loading = 'lazy';
    }
    
    // Increase lazy loading threshold
    if (props.src && !integrityProps['lazy-threshold']) {
      integrityProps['lazy-threshold'] = '200px';
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
  }

  // Update integrity props if they were modified
  if (Object.keys(integrityProps).length > 0) {
    optimizedProps['data-integrity-props'] = JSON.stringify(integrityProps);
  }

  return optimizedProps;
}

/**
 * Enhanced memory cleanup function
 */
function triggerIntegrityCleanup() {
  // Force garbage collection if available
  if (typeof window !== 'undefined' && window.gc) {
    window.gc();
  }
  
  // Clear Integrity.js specific caches
  if (typeof window !== 'undefined' && window.__INTEGRITY_CACHE__) {
    window.__INTEGRITY_CACHE__.clear();
  }
  
  // Clear image caches if memory is critical
  if (typeof window !== 'undefined' && window.__INTEGRITY_IMAGE_CACHE__) {
    window.__INTEGRITY_IMAGE_CACHE__.clear();
  }
  
  console.log('🧹 Integrity.js: Enhanced memory cleanup triggered');
}

/**
 * Create Integrity-enhanced JSX elements
 * FIXED: Uses unique function name to avoid React conflicts
 */
export function integrityJsx(type, props, ...children) {
  const enhancedProps = processMobileAttributes(props || {});
  const optimizedProps = applyMobileOptimizations(enhancedProps);
  
  if (children.length > 0) {
    optimizedProps.children = children.length === 1 ? children[0] : children;
  }
  
  return ReactCreateElement(type, optimizedProps);
}

/**
 * FIXED: Integrity.js version of createElement with unique name
 * This replaces the original createElement function to avoid conflicts
 */
export function createIntegrityElement(type, props, ...children) {
  const enhancedProps = processMobileAttributes(props || {});
  const optimizedProps = applyMobileOptimizations(enhancedProps);
  
  if (children.length > 0) {
    optimizedProps.children = children.length === 1 ? children[0] : children;
  }
  
  return ReactCreateElement(type, optimizedProps);
}

// FIXED: Export with compatibility alias but avoid direct conflicts
export const jsx = integrityJsx;
export const createElement = createIntegrityElement;

/**
 * FIXED: Enhanced cloneElement with Integrity.js features
 */
export function cloneIntegrityElement(element, props, ...children) {
  const enhancedProps = processMobileAttributes(props || {});
  const optimizedProps = applyMobileOptimizations(enhancedProps);
  
  if (children.length > 0) {
    optimizedProps.children = children.length === 1 ? children[0] : children;
  }
  
  return ReactCloneElement(element, optimizedProps);
}

export const cloneElement = cloneIntegrityElement;

/**
 * Auto-enhance a component with mobile-first attributes
 */
export function autoEnhance(Component) {
  return React.forwardRef((props, ref) => {
    // Automatically detect and apply mobile optimizations
    const deviceAwareProps = applyAutoOptimizations(props);
    
    return ReactCreateElement(Component, {
      ...deviceAwareProps,
      ref,
      'data-integrity-auto': 'true'
    });
  });
}

/**
 * Apply automatic optimizations based on current device state
 */
function applyAutoOptimizations(props) {
  const optimizedProps = { ...props };
  
  // Auto-detect current device state
  if (typeof window !== 'undefined') {
    const currentMemory = performance.memory ? 
      (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) : 0.5;
    
    const isMemoryConstrained = currentMemory > 0.8;
    const isSlowDevice = navigator.hardwareConcurrency <= 2;
    const isBatteryLow = navigator.getBattery ? 
      (async () => {
        const battery = await navigator.getBattery();
        return battery.level < 0.2 && !battery.charging;
      })() : false;
    
    // Apply automatic optimizations
    if (isMemoryConstrained || isSlowDevice) {
      optimizedProps['data-auto-optimized'] = 'memory-constrained';
      
      // Reduce image quality automatically
      if (props.src && !props['mobile-quality']) {
        optimizedProps['mobile-quality'] = 'low';
      }
      
      // Enable aggressive cleanup
      optimizedProps['auto-cleanup'] = 'true';
      optimizedProps['memory-limit'] = '30MB';
    }
  }
  
  return optimizedProps;
}

/**
 * Performance monitoring and automatic adjustment
 */
export function createPerformanceObserver(callback) {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return null;
  }
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const performanceData = {
      renderTime: 0,
      memoryUsage: 0,
      fps: 60
    };
    
    entries.forEach(entry => {
      if (entry.entryType === 'measure') {
        performanceData.renderTime = entry.duration;
      }
      if (entry.entryType === 'navigation') {
        performanceData.loadTime = entry.loadEventEnd - entry.loadEventStart;
      }
    });
    
    // Calculate FPS from frame timing
    const now = performance.now();
    const fps = Math.round(1000 / (now - (window.__lastFrameTime || now)));
    window.__lastFrameTime = now;
    performanceData.fps = fps;
    
    // Get memory info
    if (performance.memory) {
      performanceData.memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
    }
    
    callback(performanceData);
  });
  
  // Observe performance entries
  observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
  
  return observer;
}

/**
 * Global configuration for Integrity.js
 */
export function configureIntegrity(config = {}) {
  if (typeof window !== 'undefined') {
    window.__INTEGRITY_CONFIG__ = {
      autoOptimize: true,
      memoryLimit: '100MB',
      performanceTarget: '60fps',
      deviceTarget: 'auto',
      enableCleanup: true,
      enableMonitoring: true,
      ...config
    };
    
    // Initialize performance monitoring if enabled
    if (window.__INTEGRITY_CONFIG__.enableMonitoring) {
      createPerformanceObserver((data) => {
        // Auto-adjust settings based on performance
        if (data.fps < 30 || data.memoryUsage > 0.9) {
          triggerIntegrityCleanup();
        }
      });
    }
  }
}

/**
 * Get current Integrity.js configuration
 */
export function getIntegrityConfig() {
  return typeof window !== 'undefined' ? 
    window.__INTEGRITY_CONFIG__ || {} : 
    {};
}