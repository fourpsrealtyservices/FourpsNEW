// Simple in-memory cache with TTL for API responses
// This dramatically reduces MongoDB calls for public-facing pages

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize = 200; // max cached entries

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    // Evict oldest entries if cache is full
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.store.clear();
      return;
    }
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key);
      }
    }
  }

  get size(): number {
    return this.store.size;
  }
}

// Singleton - persists across API calls in the same server instance
declare global {
  // eslint-disable-next-line no-var
  var __apiCache: MemoryCache | undefined;
}

const cache = global.__apiCache || new MemoryCache();
if (!global.__apiCache) {
  global.__apiCache = cache;
}

export default cache;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  PROPERTIES_LIST: 30,      // 30s for property listings (frequently updated)
  PROPERTY_DETAIL: 60,      // 60s for individual property pages
  CITIES: 300,              // 5 min for cities (rarely changes)
  TESTIMONIALS: 300,        // 5 min
  INSIGHTS: 120,            // 2 min
  LOCALITIES: 300,          // 5 min
  GROWTH_CORRIDORS: 300,    // 5 min
  ABOUT: 300,               // 5 min
};
