/**
 * FIXED VERSION of IntegrityHooks.js
 * This fixes all the infinite render issues
 */

import {
  useState as ReactUseState,
  useEffect as ReactUseEffect,
  useRef as ReactUseRef,
  useCallback as ReactUseCallback,
  useMemo as ReactUseMemo,
  useReducer as ReactUseReducer,
  useContext as ReactUseContext,
  useLayoutEffect as ReactUseLayoutEffect,
  useImperativeHandle as ReactUseImperativeHandle,
  useDebugValue as ReactUseDebugValue,
  useTransition as ReactUseTransition,
  useDeferredValue as ReactUseDeferredValue,
  useId as ReactUseId,
  useSyncExternalStore as ReactUseSyncExternalStore
} from 'react';

// Keep all the type definitions as they were...
type BasicStateAction<S> = (S => S) | S;
type Dispatch<A> = A => void;

type MemoryInfo = {
  used: number,
  limit: number,
  percentage: number,
  isNearLimit: boolean
};

type PerformanceInfo = {
  fps: number,
  renderTime: number,
  isPerformant: boolean
};

type DeviceInfo = {
  isMobile: boolean,
  isLowEnd: boolean,
  pixelRatio: number,
  memoryGB: number,
  connectionType: string
};

type BatteryInfo = {
  level: number,
  charging: boolean,
  chargingTime: number,
  dischargingTime: number
};

// Keep resolver function as-is
function resolveDispatcher() {
  const dispatcher = IntegritySharedInternals.H;
  if (__DEV__) {
    if (dispatcher === null) {
      console.error('Invalid hook call...');
    }
  }
  return dispatcher;
}

// Standard React hooks stay the same...
export function useContext<T>(Context) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useContext(Context) : ReactUseContext(Context);
}

export function useState<S>(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useState(initialState) : ReactUseState(initialState);
}

export function useReducer<S, I, A>(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useReducer(reducer, initialArg, init) : ReactUseReducer(reducer, initialArg, init);
}

export function useRef<T>(initialValue) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useRef(initialValue) : ReactUseRef(initialValue);
}

export function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useEffect(create, deps) : ReactUseEffect(create, deps);
}

export function useLayoutEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useLayoutEffect(create, deps) : ReactUseLayoutEffect(create, deps);
}

export function useCallback<T>(callback, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useCallback(callback, deps) : ReactUseCallback(callback, deps);
}

export function useMemo<T>(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useMemo(create, deps) : ReactUseMemo(create, deps);
}

// Other standard hooks...
export function useImperativeHandle<T>(ref, create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? 
    dispatcher.useImperativeHandle(ref, create, deps) : 
    ReactUseImperativeHandle(ref, create, deps);
}

export function useDebugValue<T>(value, formatterFn) {
  if (__DEV__) {
    const dispatcher = resolveDispatcher();
    return dispatcher ? 
      dispatcher.useDebugValue(value, formatterFn) : 
      ReactUseDebugValue(value, formatterFn);
  }
}

export function useTransition() {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useTransition() : ReactUseTransition();
}

export function useDeferredValue<T>(value, initialValue) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useDeferredValue(value, initialValue) : ReactUseDeferredValue(value);
}

export function useId() {
  const dispatcher = resolveDispatcher();
  return dispatcher ? dispatcher.useId() : ReactUseId();
}

export function useSyncExternalStore<T>(subscribe, getSnapshot, getServerSnapshot) {
  const dispatcher = resolveDispatcher();
  return dispatcher ? 
    dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) :
    ReactUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// =============================================================================
// FIXED MOBILE-FIRST HOOKS
// =============================================================================

/**
 * FIXED: useMemory - No circular dependencies
 */
export function useMemory(limit?: string): MemoryInfo {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useMemory) {
    return dispatcher.useMemory(limit);
  }
  
  // Parse limit once and memoize
  const parsedLimit = ReactUseMemo(() => {
    if (!limit || typeof limit !== 'string') return 100;
    const match = limit.match(/^(\d+)(MB|GB|KB)$/i);
    if (!match) return 100;
    
    const value = parseInt(match[1]);
    const unit = match[2].toUpperCase();
    
    switch (unit) {
      case 'GB': return value * 1024;
      case 'KB': return value / 1024;
      default: return value;
    }
  }, [limit]);
  
  const [memoryInfo, setMemoryInfo] = ReactUseState<MemoryInfo>({
    used: 0,
    limit: parsedLimit,
    percentage: 0,
    isNearLimit: false
  });
  
  ReactUseEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory;
        const used = memory.usedJSHeapSize / 1024 / 1024; // MB
        const percentage = (used / parsedLimit) * 100;
        
        setMemoryInfo({
          used: Math.round(used * 10) / 10,
          limit: parsedLimit,
          percentage: Math.round(percentage),
          isNearLimit: percentage > 80
        });
      }
    };
    
    checkMemory();
    const interval = setInterval(checkMemory, 2000);
    return () => clearInterval(interval);
  }, [parsedLimit]); // ✅ Only depend on parsedLimit, not state
  
  return memoryInfo;
}

/**
 * FIXED: usePerformance - Stable RAF handling
 */
export function usePerformance(targetFPS?: number): PerformanceInfo {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.usePerformance) {
    return dispatcher.usePerformance(targetFPS);
  }
  
  const [performanceInfo, setPerformanceInfo] = ReactUseState<PerformanceInfo>({
    fps: 60,
    renderTime: 16,
    isPerformant: true
  });
  
  const frameCount = ReactUseRef(0);
  const lastTime = ReactUseRef(performance.now());
  const animationId = ReactUseRef<number>();
  
  ReactUseEffect(() => {
    const target = targetFPS || 60;
    
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        const renderTime = 1000 / fps;
        
        setPerformanceInfo({
          fps,
          renderTime: Math.round(renderTime * 100) / 100,
          isPerformant: fps >= target * 0.75
        });
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId.current = requestAnimationFrame(measureFPS);
    };
    
    animationId.current = requestAnimationFrame(measureFPS);
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [targetFPS]);
  
  return performanceInfo;
}

/**
 * FIXED: useDevice - Stable object reference
 */
export function useDevice(): DeviceInfo {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useDevice) {
    return dispatcher.useDevice();
  }
  
  // Initialize once with stable values
  const [deviceInfo, setDeviceInfo] = ReactUseState<DeviceInfo>(() => {
    const isMobile = typeof window !== 'undefined' ? 
      window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
      false;
    
    const hardwareConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const deviceMemory = typeof navigator !== 'undefined' ? navigator.deviceMemory || 4 : 4;
    const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2;
    
    const connection = typeof navigator !== 'undefined' ? 
      navigator.connection || navigator.mozConnection || navigator.webkitConnection : null;
    const connectionType = connection ? connection.effectiveType || 'unknown' : 'unknown';
    
    return {
      isMobile,
      isLowEnd,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      memoryGB: deviceMemory,
      connectionType
    };
  });
  
  ReactUseEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768 || 
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Only update if actually changed
      setDeviceInfo(prev => {
        if (prev.isMobile !== isMobile) {
          return { ...prev, isMobile };
        }
        return prev; // ✅ Return same reference if no change
      });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  return deviceInfo;
}

/**
 * FIXED: useBattery - Stable implementation
 */
export function useBattery(): BatteryInfo {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useBattery) {
    return dispatcher.useBattery();
  }
  
  const [batteryInfo, setBatteryInfo] = ReactUseState<BatteryInfo>({
    level: 1,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity
  });
  
  ReactUseEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryInfo({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        };
        
        updateBattery();
        battery.addEventListener('chargingchange', updateBattery);
        battery.addEventListener('levelchange', updateBattery);
        
        return () => {
          battery.removeEventListener('chargingchange', updateBattery);
          battery.removeEventListener('levelchange', updateBattery);
        };
      });
    }
  }, []);
  
  return batteryInfo;
}

/**
 * FIXED: useSmartImage - No circular dependencies
 */
export function useSmartImage(src: string, options?: any): {
  src: string | null,
  loading: boolean,
  error: boolean,
  dispose: () => void
} {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useSmartImage) {
    return dispatcher.useSmartImage(src, options);
  }
  
  const [imageState, setImageState] = ReactUseState({
    src: null,
    loading: false,
    error: false
  });
  
  const dispose = ReactUseCallback(() => {
    setImageState({
      src: null,
      loading: false,
      error: false
    });
  }, []);
  
  // Memoize options to prevent effect re-runs
  const memoizedOptions = ReactUseMemo(() => ({
    fallback: options?.fallback || null,
    quality: options?.quality || 'auto'
  }), [options?.fallback, options?.quality]);
  
  ReactUseEffect(() => {
    if (!src) return;
    
    setImageState(prev => ({ ...prev, loading: true, error: false }));
    
    const img = new Image();
    img.onload = () => {
      setImageState({
        src: img.src,
        loading: false,
        error: false
      });
    };
    img.onerror = () => {
      setImageState({
        src: memoizedOptions.fallback,
        loading: false,
        error: true
      });
    };
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, memoizedOptions]); // ✅ Stable dependencies
  
  return { ...imageState, dispose };
}

/**
 * FIXED: useAdaptiveFeatures - Memoized result
 */
export function useAdaptiveFeatures(): {
  enableAnimations: boolean,
  enableComplexLayouts: boolean,
  enableHighResImages: boolean,
  enableRealTimeUpdates: boolean,
  performanceLevel: 'high' | 'medium' | 'low'
} {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useAdaptiveFeatures) {
    return dispatcher.useAdaptiveFeatures();
  }
  
  const deviceInfo = useDevice();
  const performanceInfo = usePerformance();
  const batteryInfo = useBattery();
  
  return ReactUseMemo(() => {
    const isLowBattery = batteryInfo.level < 0.2 && !batteryInfo.charging;
    const isLowPerformance = !performanceInfo.isPerformant || performanceInfo.fps < 30;
    
    if (deviceInfo.isLowEnd || isLowBattery || isLowPerformance) {
      return {
        enableAnimations: false,
        enableComplexLayouts: false,
        enableHighResImages: false,
        enableRealTimeUpdates: false,
        performanceLevel: 'low' as const
      };
    }
    
    if (deviceInfo.isMobile || performanceInfo.fps < 50) {
      return {
        enableAnimations: true,
        enableComplexLayouts: false,
        enableHighResImages: false,
        enableRealTimeUpdates: true,
        performanceLevel: 'medium' as const
      };
    }
    
    return {
      enableAnimations: true,
      enableComplexLayouts: true,
      enableHighResImages: true,
      enableRealTimeUpdates: true,
      performanceLevel: 'high' as const
    };
  }, [
    deviceInfo.isLowEnd, 
    deviceInfo.isMobile,
    performanceInfo.isPerformant, 
    performanceInfo.fps,
    batteryInfo.level, 
    batteryInfo.charging
  ]); // ✅ Only specific properties, not whole objects
}

// Other hooks remain the same but with proper memoization...
export function useNetworkAware<T>(fetcher, options) {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useNetworkAware) {
    return dispatcher.useNetworkAware(fetcher, options);
  }
  
  const [state, setState] = ReactUseState({
    data: null,
    loading: false,
    error: null,
    networkType: 'unknown'
  });
  
  const deviceInfo = useDevice();
  
  ReactUseEffect(() => {
    const networkType = deviceInfo.connectionType;
    setState(prev => ({ ...prev, networkType }));
    
    const isSlowConnection = networkType === 'slow-2g' || networkType === '2g';
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        let data;
        if (isSlowConnection && options?.lowBandwidthFetcher) {
          data = await options.lowBandwidthFetcher();
        } else {
          data = await fetcher();
        }
        
        setState(prev => ({ ...prev, data, loading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, error, loading: false }));
      }
    };
    
    fetchData();
  }, [fetcher, options, deviceInfo.connectionType]);
  
  return state;
}

export function useTouch(ref, options) {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useTouch) {
    return dispatcher.useTouch(ref, options);
  }
  
  ReactUseEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    let lastTapTime = 0;
    const threshold = options?.threshold || 50;
    
    const handleTouchStart = (e) => {
      const now = Date.now();
      const timeDiff = now - lastTapTime;
      
      if (timeDiff < 300 && timeDiff > 0) {
        if (options?.onDoubleTap) {
          options.onDoubleTap(e);
        }
      } else {
        if (options?.onTap) {
          options.onTap(e);
        }
      }
      
      lastTapTime = now;
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref, options]);
}

export function useVirtualList<T>(items, options) {
  const dispatcher = resolveDispatcher();
  if (dispatcher && dispatcher.useVirtualList) {
    return dispatcher.useVirtualList(items, options);
  }
  
  const [scrollTop, setScrollTop] = ReactUseState(0);
  const itemHeight = options?.itemHeight || 50;
  const overscan = options?.overscan || 5;
  
  const visibleItems = ReactUseMemo(() => {
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return items.slice(startIndex, endIndex + 1).map((item, idx) => ({
      item,
      index: startIndex + idx
    }));
  }, [items, scrollTop, itemHeight, overscan]);
  
  const totalHeight = items.length * itemHeight;
  
  const scrollElementProps = ReactUseMemo(() => ({
    onScroll: (e) => {
      const target = e.target;
      setScrollTop(target.scrollTop);
    },
    style: {
      height: '100%',
      overflow: 'auto'
    }
  }), []);
  
  return {
    visibleItems,
    totalHeight,
    scrollElementProps
  };
}