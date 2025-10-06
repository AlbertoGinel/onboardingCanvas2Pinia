import { assetServiceRegistry } from './asset-service-registry'
import { imageService } from './imageService'
import { textService } from './textService'
import { shapeService } from './shapeService'
import { buttonService } from './buttonService'

/**
 * Initialize and register all asset services
 * This creates the unified service architecture for the AssetsPanel
 */
export function initializeAssetServices(): void {
  // Register all asset services with the registry
  assetServiceRegistry.registerService('images', imageService)
  assetServiceRegistry.registerService('text', textService)
  assetServiceRegistry.registerService('shapes', shapeService)
  assetServiceRegistry.registerService('buttons', buttonService)

  console.log('🎯 Asset services initialized:', assetServiceRegistry.getRegisteredTypes())
}

// Auto-initialize services when this module is imported
initializeAssetServices()

// Export registry for use in components
export { assetServiceRegistry }
export { imageService, textService, shapeService, buttonService }
