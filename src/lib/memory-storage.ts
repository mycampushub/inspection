/**
 * In-Memory Storage Utility
 * Replaces localStorage/sessionStorage with a pure in-memory solution
 */

class MemoryStorage {
  private store: Record<string, string> = {}

  /**
   * Get an item from memory storage
   */
  getItem(key: string): string | null {
    return this.store[key] || null
  }

  /**
   * Set an item in memory storage
   */
  setItem(key: string, value: string): void {
    this.store[key] = value
  }

  /**
   * Remove an item from memory storage
   */
  removeItem(key: string): void {
    delete this.store[key]
  }

  /**
   * Clear all items from memory storage
   */
  clear(): void {
    this.store = {}
  }

  /**
   * Get all keys in memory storage
   */
  key(index: number): string | null {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }

  /**
   * Get the number of items in memory storage
   */
  get length(): number {
    return Object.keys(this.store).length
  }

  /**
   * Check if a key exists in memory storage
   */
  has(key: string): boolean {
    return key in this.store
  }
}

// Create singleton instances
export const memoryStorage = new MemoryStorage()
export const memorySessionStorage = new MemoryStorage()

// For backward compatibility, you can also export as default
export default memoryStorage
