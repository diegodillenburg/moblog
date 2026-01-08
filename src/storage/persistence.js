export class Persistence {
  constructor(options = {}) {
    this.options = {
      storageKey: 'mlog-logs',
      maxEntries: 200,
      useLocalStorage: false,
      ...options,
    };

    this.storage = this.options.useLocalStorage ? localStorage : sessionStorage;
  }

  save(logs) {
    try {
      const data = logs.slice(-this.options.maxEntries);
      this.storage.setItem(this.options.storageKey, JSON.stringify(data));
    } catch (e) {
      // Storage full or unavailable - silently ignore
    }
  }

  load() {
    try {
      const stored = this.storage.getItem(this.options.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Corrupted data - silently ignore
    }
    return [];
  }

  clear() {
    try {
      this.storage.removeItem(this.options.storageKey);
    } catch (e) {
      // Storage unavailable - silently ignore
    }
  }
}
