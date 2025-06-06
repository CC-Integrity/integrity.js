/**
 * Integrity.js - Mobile-First React Enhancement
 * Copyright (c) CC Integrity LLC
 * Licensed under MIT
 */

// STEP 1: IMPORT ALL REACT HOOKS AND FUNCTIONS FIRST
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useTransition,
  useDeferredValue,
  useId,
  useSyncExternalStore,
  Fragment,
  createElement,
  cloneElement,
  createContext,
  forwardRef,
  memo,
  lazy,
  Suspense,
  StrictMode,
  Component,
  PureComponent
} from 'react';

// STEP 2: IMPORT ALL THE INTEGRITY.JS ENHANCEMENTS
import { 
  useMemory,
  usePerformance, 
  useDevice,
  useBattery,
  useSmartImage,
  useNetworkAware,
  useTouch,
  useVirtualList,
  useAdaptiveFeatures
} from './hooks';

import { 
  enhance, 
  withIntegrity,
  createIntegrityElement,
  cloneIntegrityElement,
  configureIntegrity,
  getIntegrityConfig
} from './enhance';

// STEP 3: NOW EXPORT EVERYTHING (after importing)
export {
  // All React hooks and functions
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useTransition,
  useDeferredValue,
  useId,
  useSyncExternalStore,
  Fragment,
  createElement,
  cloneElement,
  createContext,
  forwardRef,
  memo,
  lazy,
  Suspense,
  StrictMode,
  Component,
  PureComponent,
  
  // Mobile-first hooks
  useMemory,
  usePerformance,
  useDevice, 
  useBattery,
  useSmartImage,
  useNetworkAware,
  useTouch,
  useVirtualList,
  useAdaptiveFeatures,
  
  // Enhancement functions
  enhance,
  withIntegrity,
  createIntegrityElement,
  cloneIntegrityElement,
  configureIntegrity,
  getIntegrityConfig
};

// STEP 4: Create Integrity object (now everything is properly imported)
const Integrity = {
  // All React hooks (now properly imported and available)
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useTransition,
  useDeferredValue,
  useId,
  useSyncExternalStore,
  
  // React functions
  Fragment,
  createElement,
  cloneElement,
  createContext,
  forwardRef,
  memo,
  lazy,
  Suspense,
  StrictMode,
  Component,
  PureComponent,
  
  // Enhancement functions
  enhance,
  withIntegrity,
  createIntegrityElement,
  cloneIntegrityElement,
  
  // Mobile-first hooks
  useMemory,
  usePerformance,
  useDevice, 
  useBattery,
  useSmartImage,
  useNetworkAware,
  useTouch,
  useVirtualList,
  useAdaptiveFeatures,
  
  // Utility functions
  version: '1.7.0', // 
  
  // Configuration
  configure: configureIntegrity,
  getConfig: getIntegrityConfig
};

// Default export
export default Integrity;

// Browser global (for script tag usage)
if (typeof window !== 'undefined') {
  window.Integrity = Integrity;
  
  // Initialize with default config
  configureIntegrity({
    memoryLimit: '100MB',
    performanceTarget: 60,
    mobileFirst: true,
    autoOptimize: true
  });
  
  console.log('🚀 Integrity.js v1.7.0 loaded - Complete mobile-first React replacement active');
}
