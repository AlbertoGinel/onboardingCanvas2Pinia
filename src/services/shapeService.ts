import { ref } from 'vue'
import type { Ref } from 'vue'
import { ButtonElement } from '../models' // We'll use ButtonElement as base for simple shapes
import type {
  IAssetService,
  AssetTemplate,
  CanvasElementData,
  AssetRenderConfig,
} from './asset-service-interface'

/**
 * Service for managing shape asset templates and creating shape elements
 */
export class ShapeService implements IAssetService {
  readonly assets: Ref<AssetTemplate[]> = ref([])

  constructor() {
    this.initializeShapeTemplates()
  }

  private initializeShapeTemplates(): void {
    this.assets.value = [
      {
        id: 'shape-rectangle',
        name: 'Rectangle',
        preview: '▭',
        category: 'Basic Shapes',
        tags: ['rectangle', 'square', 'box'],
        data: {
          width: 100,
          height: 60,
          backgroundColor: '#3498db',
          borderRadius: 0,
          borderWidth: 0,
        },
        renderData: {
          style: {
            backgroundColor: '#3498db',
            borderRadius: '0px',
            aspectRatio: '5/3',
          },
          cssClass: 'shape-rectangle',
        },
      },
      {
        id: 'shape-rounded-rectangle',
        name: 'Rounded Rectangle',
        preview: '▢',
        category: 'Basic Shapes',
        tags: ['rounded', 'rectangle', 'card'],
        data: {
          width: 100,
          height: 60,
          backgroundColor: '#e74c3c',
          borderRadius: 8,
          borderWidth: 0,
        },
        renderData: {
          style: {
            backgroundColor: '#e74c3c',
            borderRadius: '8px',
            aspectRatio: '5/3',
          },
          cssClass: 'shape-rounded-rectangle',
        },
      },
      {
        id: 'shape-circle',
        name: 'Circle',
        preview: '●',
        category: 'Basic Shapes',
        tags: ['circle', 'round', 'dot'],
        data: {
          width: 80,
          height: 80,
          backgroundColor: '#2ecc71',
          borderRadius: 50, // Makes it circular
          borderWidth: 0,
        },
      },
      {
        id: 'shape-square',
        name: 'Square',
        preview: '■',
        category: 'Basic Shapes',
        tags: ['square', 'box'],
        data: {
          width: 80,
          height: 80,
          backgroundColor: '#f39c12',
          borderRadius: 0,
          borderWidth: 0,
        },
      },
      {
        id: 'shape-pill',
        name: 'Pill',
        preview: '⬭',
        category: 'Basic Shapes',
        tags: ['pill', 'capsule', 'oval'],
        data: {
          width: 120,
          height: 40,
          backgroundColor: '#9b59b6',
          borderRadius: 20,
          borderWidth: 0,
        },
      },
      {
        id: 'shape-outline-rectangle',
        name: 'Outline Rectangle',
        preview: '▯',
        category: 'Outlined Shapes',
        tags: ['outline', 'border', 'stroke'],
        data: {
          width: 100,
          height: 60,
          backgroundColor: 'transparent',
          borderColor: '#34495e',
          borderWidth: 2,
          borderRadius: 0,
        },
      },
      {
        id: 'shape-outline-circle',
        name: 'Outline Circle',
        preview: '○',
        category: 'Outlined Shapes',
        tags: ['outline', 'circle', 'stroke'],
        data: {
          width: 80,
          height: 80,
          backgroundColor: 'transparent',
          borderColor: '#34495e',
          borderWidth: 2,
          borderRadius: 50,
        },
      },
    ]
  }

  async createCanvasElement(
    asset: AssetTemplate,
    position = { x: 100, y: 100 },
  ): Promise<CanvasElementData> {
    const shapeData = asset.data as {
      width: number
      height: number
      backgroundColor: string
      borderColor?: string
      borderWidth: number
      borderRadius: number
    }

    // Use ButtonElement as base for shapes (since it has styling properties)
    const shapeElement = new ButtonElement(
      `shape-${Date.now()}`,
      '', // No text for shapes
      position.x,
      position.y,
      shapeData.width,
      shapeData.height,
    )

    // Apply shape styling
    shapeElement.style.backgroundColor = shapeData.backgroundColor
    shapeElement.style.borderRadius = shapeData.borderRadius
    shapeElement.style.borderWidth = shapeData.borderWidth

    if (shapeData.borderColor) {
      shapeElement.style.borderColor = shapeData.borderColor
    }

    // Hide text for pure shapes by making it empty and fontSize 0
    shapeElement.text = ''
    shapeElement.style.fontSize = 0

    return {
      element: shapeElement,
      position,
    }
  }

  filterAssets(searchTerm: string): AssetTemplate[] {
    const term = searchTerm.toLowerCase()
    return this.assets.value.filter(
      (asset) =>
        asset.name.toLowerCase().includes(term) ||
        asset.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
        asset.category?.toLowerCase().includes(term),
    )
  }

  getCategories(): string[] {
    const categories = new Set(this.assets.value.map((asset) => asset.category).filter(Boolean))
    return Array.from(categories) as string[]
  }

  // Get rendering configuration for shape assets
  getRenderConfig(): AssetRenderConfig {
    return {
      gridColumns: 4, // 4-column grid for compact shape previews
      itemHeight: '60px',
      previewComponent: 'ShapeAssetPreview',
      cssClasses: ['shape-assets-grid'],
      customStyles: {
        '--shape-preview-size': '40px',
        '--shape-preview-margin': '4px',
      },
    }
  }

  getDisplayName(): string {
    return 'Shapes'
  }
}

// Export singleton instance
export const shapeService = new ShapeService()
