import type { IAssetService } from './asset-service-interface'

/**
 * Registry that manages all asset services in the application
 * This is the central hub for asset type management - completely modular and extensible
 */
export class AssetServiceRegistry {
  private services = new Map<string, IAssetService>()
  private static instance: AssetServiceRegistry | null = null

  constructor() {
    // Services will be registered during initialization
  }

  /**
   * Singleton pattern to ensure single registry instance
   */
  static getInstance(): AssetServiceRegistry {
    if (!AssetServiceRegistry.instance) {
      AssetServiceRegistry.instance = new AssetServiceRegistry()
    }
    return AssetServiceRegistry.instance
  }

  /**
   * Register an asset service for a specific type
   * @param type The asset type identifier (e.g., 'images', 'text', 'shapes')
   * @param service The service implementation
   */
  registerService(type: string, service: IAssetService): void {
    this.services.set(type, service)
    console.log(`✅ Asset service registered: ${type}`)
  }

  /**
   * Get an asset service by type
   * @param type The asset type identifier
   * @returns The service implementation or undefined if not found
   */
  getService(type: string): IAssetService | undefined {
    return this.services.get(type)
  }

  /**
   * Get all registered asset service types
   * @returns Array of registered service type names
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * Check if a service type is registered
   * @param type The asset type identifier
   * @returns True if service is registered
   */
  hasService(type: string): boolean {
    return this.services.has(type)
  }

  /**
   * Initialize all services (call loadAssets if available)
   */
  async initializeServices(): Promise<void> {
    const initPromises = Array.from(this.services.values()).map(async (service) => {
      if (service.loadAssets) {
        try {
          await service.loadAssets()
        } catch (error) {
          console.error('Failed to load assets for service:', error)
        }
      }
    })

    await Promise.all(initPromises)
    console.log(`✅ Initialized ${this.services.size} asset services`)
  }

  /**
   * Unregister a service (useful for testing or dynamic service management)
   * @param type The asset type identifier
   */
  unregisterService(type: string): boolean {
    return this.services.delete(type)
  }
}

// Export singleton instance for easy access
export const assetServiceRegistry = AssetServiceRegistry.getInstance()
