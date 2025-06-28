/**
 * Integrity.js - Mobile-First React Enhancement (Fixed JavaScript Version)
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

// STEP 2: IMPORT ALL THE INTEGRITY.JS ENHANCEMENTS (Fixed versions)
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

// STEP 3: EXPORT EVERYTHING (Fixed for JavaScript compatibility)
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
  
  // Mobile-first hooks (Fixed versions)
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

// STEP 4: Create Integrity object (JavaScript-safe)
const Integrity = {
  // All React hooks 
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
  
  // Mobile-first hooks (Fixed for JavaScript)
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
  version: '1.7.2', // Updated version with JavaScript fixes
  
  // Configuration
  configure: configureIntegrity,
  getConfig: getIntegrityConfig
};

// Default export
export default Integrity;

// Browser global (for script tag usage) - JavaScript safe
if (typeof window !== 'undefined') {
  window.Integrity = Integrity;
  
  // Initialize with default config (safe for all environments)
  try {
    configureIntegrity({
      memoryLimit: '100MB',
      performanceTarget: 60,
      mobileFirst: true,
      autoOptimize: true
    });
    
    console.log('🚀 Integrity.js v1.7.2 loaded - JavaScript-compatible mobile-first React enhancement active');
  } catch (error) {
    console.warn('Integrity.js initialization warning:', error);
    console.log('🚀 Integrity.js v1.7.2 loaded - Core functionality available');
  }
}
