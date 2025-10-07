import type { Ref } from 'vue'
import type { AnyCanvasElement } from '../models'
import type { ControlFunction } from '../controls/controlFunctions'

export interface AssetTemplate {
  id: string
  name: string
  preview: string // Can be URL, emoji, SVG, or text preview
  category?: string
  tags?: string[]
  data: Record<string, unknown> // Template-specific data
  renderData?: {
    component?: string // Override preview component for this specific asset
    style?: Record<string, string> // Inline styles for this asset
    cssClass?: string // Custom CSS class for this asset
  }
}

export interface AssetRenderConfig {
  gridColumns: number
  itemHeight: string
  previewComponent: string // Component name to use for previews
  cssClasses: string[] // CSS classes to apply to the grid container
  customStyles?: Record<string, string> // CSS custom properties
}

export interface CanvasElementData {
  element: AnyCanvasElement
  position?: { x: number; y: number }
}

/**
 * Interface that all asset services must implement
 * This ensures consistency across different asset types (images, text, shapes, buttons, etc.)
 */
export interface IAssetService {
  /**
   * Reactive array of available assets for this service
   */
  readonly assets: Ref<AssetTemplate[]>

  /**
   * Create a canvas element from an asset template
   * @param asset The asset template to create element from
   * @param position Optional position to place the element
   * @returns Promise resolving to canvas element data
   */
  createCanvasElement(
    asset: AssetTemplate,
    position?: { x: number; y: number },
  ): Promise<CanvasElementData>

  /**
   * Optional: Load assets (for services that need to fetch data)
   */
  loadAssets?(): Promise<void>

  /**
   * Optional: Filter assets by search term
   */
  filterAssets?(searchTerm: string): AssetTemplate[]

  /**
   * Optional: Get asset categories for organizing assets
   */
  getCategories?(): string[]

  /**
   * Get rendering configuration for this asset type
   * This defines how the AssetsPanel should display these assets
   */
  getRenderConfig(): AssetRenderConfig

  /**
   * Get display name for this asset type
   * This is used for panel titles and labels
   */
  getDisplayName(): string

  /**
   * Optional: Get list of control IDs that this asset type uses
   */
  getControlList?(): string[]

  /**
   * Optional: Get control configurations specific to this asset type
   * This allows services to override default control behavior
   */
  getControlConfigurations?(): Record<string, Partial<ControlFunction>>
}
