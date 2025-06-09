// Polyfill for structuredClone (not available in older Node versions or test environments)
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => structuredClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = structuredClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  };
}

// Set up fake-indexeddb for testing
import 'fake-indexeddb/auto';
