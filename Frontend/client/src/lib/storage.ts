/**
 * Safe localStorage utility that handles all permission and availability issues
 */

const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    // Test actual read/write access
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (!isStorageAvailable()) {
        return null;
      }
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`Failed to get item "${key}" from localStorage:`, e);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (!isStorageAvailable()) {
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`Failed to set item "${key}" in localStorage:`, e);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (!isStorageAvailable()) {
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Failed to remove item "${key}" from localStorage:`, e);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (!isStorageAvailable()) {
        return false;
      }
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
      return false;
    }
  }
};