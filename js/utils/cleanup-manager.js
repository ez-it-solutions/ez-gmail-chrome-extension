// Ez Gmail - Cleanup Manager
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Centralized cleanup and memory management

class CleanupManager {
  constructor() {
    this.observers = [];
    this.eventListeners = [];
    this.timers = [];
    this.requests = [];
    this.components = [];
  }

  // Register MutationObserver for cleanup
  registerObserver(observer, name = 'Unknown') {
    this.observers.push({ observer, name });
    console.log(`Ez Gmail: Registered observer: ${name}`);
    return observer;
  }

  // Register event listener for cleanup
  registerEventListener(element, event, handler, options, name = 'Unknown') {
    element.addEventListener(event, handler, options);
    this.eventListeners.push({ element, event, handler, options, name });
    console.log(`Ez Gmail: Registered event listener: ${name}`);
  }

  // Register timer for cleanup
  registerTimer(timerId, type = 'timeout', name = 'Unknown') {
    this.timers.push({ timerId, type, name });
    return timerId;
  }

  // Register AbortController for cleanup
  registerRequest(controller, name = 'Unknown') {
    this.requests.push({ controller, name });
    return controller;
  }

  // Register component for cleanup
  registerComponent(component, name = 'Unknown') {
    if (component && typeof component.destroy === 'function') {
      this.components.push({ component, name });
      console.log(`Ez Gmail: Registered component: ${name}`);
    }
  }

  // Cleanup all observers
  cleanupObservers() {
    console.log(`Ez Gmail: Cleaning up ${this.observers.length} observers`);
    this.observers.forEach(({ observer, name }) => {
      try {
        observer.disconnect();
        console.log(`Ez Gmail: Disconnected observer: ${name}`);
      } catch (error) {
        console.error(`Ez Gmail: Error disconnecting observer ${name}:`, error);
      }
    });
    this.observers = [];
  }

  // Cleanup all event listeners
  cleanupEventListeners() {
    console.log(`Ez Gmail: Cleaning up ${this.eventListeners.length} event listeners`);
    this.eventListeners.forEach(({ element, event, handler, options, name }) => {
      try {
        element.removeEventListener(event, handler, options);
        console.log(`Ez Gmail: Removed event listener: ${name}`);
      } catch (error) {
        console.error(`Ez Gmail: Error removing event listener ${name}:`, error);
      }
    });
    this.eventListeners = [];
  }

  // Cleanup all timers
  cleanupTimers() {
    console.log(`Ez Gmail: Cleaning up ${this.timers.length} timers`);
    this.timers.forEach(({ timerId, type, name }) => {
      try {
        if (type === 'timeout') {
          clearTimeout(timerId);
        } else if (type === 'interval') {
          clearInterval(timerId);
        }
        console.log(`Ez Gmail: Cleared ${type}: ${name}`);
      } catch (error) {
        console.error(`Ez Gmail: Error clearing timer ${name}:`, error);
      }
    });
    this.timers = [];
  }

  // Cleanup all requests
  cleanupRequests() {
    console.log(`Ez Gmail: Cleaning up ${this.requests.length} requests`);
    this.requests.forEach(({ controller, name }) => {
      try {
        controller.abort();
        console.log(`Ez Gmail: Aborted request: ${name}`);
      } catch (error) {
        console.error(`Ez Gmail: Error aborting request ${name}:`, error);
      }
    });
    this.requests = [];
  }

  // Cleanup all components
  cleanupComponents() {
    console.log(`Ez Gmail: Cleaning up ${this.components.length} components`);
    this.components.forEach(({ component, name }) => {
      try {
        component.destroy();
        console.log(`Ez Gmail: Destroyed component: ${name}`);
      } catch (error) {
        console.error(`Ez Gmail: Error destroying component ${name}:`, error);
      }
    });
    this.components = [];
  }

  // Cleanup everything
  cleanupAll() {
    console.log('Ez Gmail: Starting full cleanup...');
    this.cleanupRequests();
    this.cleanupTimers();
    this.cleanupEventListeners();
    this.cleanupObservers();
    this.cleanupComponents();
    console.log('Ez Gmail: Cleanup complete');
  }

  // Get cleanup stats
  getStats() {
    return {
      observers: this.observers.length,
      eventListeners: this.eventListeners.length,
      timers: this.timers.length,
      requests: this.requests.length,
      components: this.components.length
    };
  }
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Utility: Wait for element with MutationObserver
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
    
    // Store for cleanup if needed
    if (window.EzGmailCleanup) {
      window.EzGmailCleanup.registerObserver(observer, `waitForElement: ${selector}`);
      window.EzGmailCleanup.registerTimer(timer, 'timeout', `waitForElement timeout: ${selector}`);
    }
  });
}

// Utility: LRU Cache
class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  get size() {
    return this.cache.size;
  }
}

// Utility: Request Deduplicator
class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }
  
  async fetch(key, fetchFn) {
    if (this.pending.has(key)) {
      console.log(`Ez Gmail: Reusing pending request: ${key}`);
      return this.pending.get(key);
    }
    
    const promise = fetchFn().finally(() => {
      this.pending.delete(key);
    });
    
    this.pending.set(key, promise);
    return promise;
  }
  
  clear() {
    this.pending.clear();
  }
}

// Utility: Memory Monitor
class MemoryMonitor {
  constructor(warningThreshold = 0.8) {
    this.warningThreshold = warningThreshold;
    this.checkInterval = null;
    this.onWarning = null;
  }
  
  start(intervalMs = 60000) {
    this.checkInterval = setInterval(() => {
      this.checkMemory();
    }, intervalMs);
    
    if (window.EzGmailCleanup) {
      window.EzGmailCleanup.registerTimer(this.checkInterval, 'interval', 'MemoryMonitor');
    }
  }
  
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  checkMemory() {
    if (!performance.memory) {
      console.warn('Ez Gmail: performance.memory not available');
      return null;
    }
    
    const used = performance.memory.usedJSHeapSize;
    const limit = performance.memory.jsHeapSizeLimit;
    const percentage = (used / limit);
    
    const stats = {
      usedMB: (used / 1024 / 1024).toFixed(2),
      limitMB: (limit / 1024 / 1024).toFixed(2),
      percentage: (percentage * 100).toFixed(2)
    };
    
    console.log(`Ez Gmail Memory: ${stats.usedMB}MB / ${stats.limitMB}MB (${stats.percentage}%)`);
    
    if (percentage > this.warningThreshold) {
      console.warn('Ez Gmail: High memory usage detected!');
      if (this.onWarning) {
        this.onWarning(stats);
      }
    }
    
    return stats;
  }
}

// Utility: Error Boundary
class ErrorBoundary {
  static wrap(fn, context = 'Unknown') {
    return async function(...args) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        console.error(`Ez Gmail Error in ${context}:`, error);
        ErrorBoundary.logError(context, error);
        return null;
      }
    };
  }
  
  static logError(context, error) {
    const errorData = {
      context,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Store in chrome.storage for debugging
    chrome.storage.local.get(['ezErrorLog'], (result) => {
      const errorLog = result.ezErrorLog || [];
      errorLog.push(errorData);
      
      // Keep only last 50 errors
      if (errorLog.length > 50) {
        errorLog.shift();
      }
      
      chrome.storage.local.set({ ezErrorLog: errorLog });
    });
    
    console.error('Ez Gmail Error logged:', errorData);
  }
}

// Create global cleanup manager instance
if (typeof window !== 'undefined') {
  window.EzGmailCleanup = window.EzGmailCleanup || new CleanupManager();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    console.log('Ez Gmail: Page unloading, cleaning up...');
    window.EzGmailCleanup.cleanupAll();
  });
  
  // Cleanup when tab becomes hidden (optional, for aggressive cleanup)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Ez Gmail: Tab hidden, running partial cleanup...');
      // Only cleanup requests and timers, keep observers and listeners
      window.EzGmailCleanup.cleanupRequests();
      // Optionally cleanup non-critical timers
    }
  });
  
  // Expose utilities globally
  window.EzGmailUtils = {
    debounce,
    throttle,
    waitForElement,
    LRUCache,
    RequestDeduplicator,
    MemoryMonitor,
    ErrorBoundary
  };
  
  console.log('Ez Gmail: Cleanup manager and utilities loaded');
}
