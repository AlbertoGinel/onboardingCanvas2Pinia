import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { ImageElement } from '../models'
import type {
  IAssetService,
  AssetTemplate,
  CanvasElementData,
  AssetRenderConfig,
} from './asset-service-interface'
import type { ControlFunction } from '../controls/controlFunctions'
import { useAssetStore } from '../stores/assets'

export interface ImageAsset {
  id: string
  src: string
  title: string
  category: 'stock' | 'uploaded' | 'recent'
  thumbnail?: string
  tags?: string[]
  width?: number
  height?: number
}

class ImageService implements IAssetService {
  private imagePool = ref<ImageAsset[]>([])
  // Asset loading now handled by Asset Store - no more private loading state!

  constructor() {
    this.initializeStockImages()
  }

  // Initialize with stock images when page loads
  private initializeStockImages() {
    const stockImages: ImageAsset[] = [
      {
        id: 'stock-1',
        src: 'https://picsum.photos/id/1/400/300', // Respect original aspect ratio
        title: 'Mountain Landscape',
        category: 'stock',
        tags: ['nature', 'landscape'],
        // Let preloadImage() determine actual dimensions from loaded image
      },
      {
        id: 'stock-2',
        src: 'https://picsum.photos/id/10/300/400', // Different size for variety
        title: 'Forest Path',
        category: 'stock',
        tags: ['nature', 'forest'],
      },
      {
        id: 'stock-3',
        src: 'https://picsum.photos/id/20/350/350', // Square format
        title: 'Ocean View',
        category: 'stock',
        tags: ['nature', 'ocean'],
      },
      {
        id: 'stock-4',
        src: 'https://picsum.photos/id/30/400/250', // Wide landscape
        title: 'City Architecture',
        category: 'stock',
        tags: ['urban', 'architecture'],
      },
      {
        id: 'stock-5',
        src: 'https://picsum.photos/id/40/280/400', // Tall format
        title: 'Abstract Pattern',
        category: 'stock',
        tags: ['abstract', 'design'],
      },
      {
        id: 'stock-6',
        src: 'https://picsum.photos/id/50/450/300', // Wide landscape
        title: 'Minimalist Design',
        category: 'stock',
        tags: ['minimal', 'design'],
      },
    ]

    this.imagePool.value = stockImages
    this.preloadImages(stockImages)
  }

  // IAssetService interface implementation
  get assets(): Ref<AssetTemplate[]> {
    return computed(() =>
      this.imagePool.value.map((img) => ({
        id: img.id,
        name: img.title,
        preview: img.thumbnail || img.src,
        category: img.category,
        tags: img.tags,
        data: {
          src: img.src,
          title: img.title,
          width: img.width,
          height: img.height,
        },
        renderData: {
          style: {
            aspectRatio: `${img.width || 1}/${img.height || 1}`,
            objectFit:
              img.width && img.height ? (img.width > img.height ? 'cover' : 'contain') : 'cover',
          },
          cssClass: `image-${img.category}`,
        },
      })),
    )
  }

  // Get images by category
  getImagesByCategory(category: 'stock' | 'uploaded' | 'recent') {
    return this.imagePool.value.filter((img) => img.category === category)
  }

  // Get specific image asset by ID
  getImageAsset(imageId: string): ImageAsset | null {
    return this.imagePool.value.find((img) => img.id === imageId) || null
  }

  // Get rendering configuration for image assets - MASONRY STYLE! 🎨
  getRenderConfig(): AssetRenderConfig {
    return {
      gridColumns: 2, // Still 2 columns but dynamic heights
      itemHeight: 'auto', // Let content determine height
      previewComponent: 'ImageAssetPreview',
      cssClasses: ['image-assets-grid', 'masonry-grid'],
      customStyles: {
        '--masonry-gap': '12px',
        '--masonry-border-radius': '12px',
        '--masonry-transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '--masonry-hover-scale': '1.03',
        '--masonry-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
        '--masonry-hover-shadow': '0 8px 25px rgba(0, 0, 0, 0.2)',
      },
    }
  }

  getDisplayName(): string {
    return 'Images'
  }

  // Define what controls this tool uses - minimal clean controls
  getControlList(): string[] {
    return ['brightness', 'contrast', 'saturation', 'blur', 'opacity']
  }

  // Define tool-specific control configurations
  getControlConfigurations(): Record<string, Partial<ControlFunction>> {
    return {
      brightness: {
        type: 'slider',
        component: 'SliderControl',
        label: 'Brightness',
        icon: '☀️',
        hasMenu: true,
        getConfig: () => ({ min: 0, max: 2, step: 0.1 }),
        getValue: (element) => {
          const imageEl = element as ImageElement
          return imageEl.filters?.brightness || 1
        },
        setValue: (element, value) => {
          const imageEl = element as ImageElement
          imageEl.setBrightness(value as number)
        },
      },
      contrast: {
        type: 'slider',
        component: 'SliderControl',
        label: 'Contrast',
        icon: '🔆',
        hasMenu: true,
        getConfig: () => ({ min: 0, max: 2, step: 0.1 }),
        getValue: (element) => {
          const imageEl = element as ImageElement
          return imageEl.filters?.contrast || 1
        },
        setValue: (element, value) => {
          const imageEl = element as ImageElement
          imageEl.setContrast(value as number)
        },
      },
      saturation: {
        type: 'slider',
        component: 'SliderControl',
        label: 'Saturation',
        icon: '🎨',
        hasMenu: true,
        getConfig: () => ({ min: 0, max: 2, step: 0.1 }),
        getValue: (element) => {
          const imageEl = element as ImageElement
          return imageEl.filters?.saturation || 1
        },
        setValue: (element, value) => {
          const imageEl = element as ImageElement
          imageEl.setSaturation(value as number)
        },
      },
      blur: {
        type: 'slider',
        component: 'SliderControl',
        label: 'Blur',
        icon: '🌊',
        hasMenu: true,
        getConfig: () => ({ min: 0, max: 10, step: 0.5 }),
        getValue: (element) => {
          const imageEl = element as ImageElement
          return imageEl.filters?.blur || 0
        },
        setValue: (element, value) => {
          const imageEl = element as ImageElement
          imageEl.setBlur(value as number)
        },
      },
      opacity: {
        type: 'slider',
        component: 'SliderControl',
        label: 'Opacity',
        icon: '👻',
        hasMenu: true,
        getConfig: () => ({ min: 0, max: 1, step: 0.1 }),
        getValue: (element) => {
          const imageEl = element as ImageElement
          return imageEl.opacity || 1
        },
        setValue: (element, value) => {
          const imageEl = element as ImageElement
          imageEl.opacity = value as number
        },
      },
    }
  }

  // Add uploaded image to pool
  async addUploadedImage(file: File): Promise<ImageAsset> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const src = e.target?.result as string
        const imageAsset: ImageAsset = {
          id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src,
          title: file.name,
          category: 'uploaded',
          tags: ['uploaded'],
        }

        this.imagePool.value.unshift(imageAsset) // Add to beginning
        this.preloadImage(imageAsset)
        resolve(imageAsset)
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Add image from URL to pool
  async addImageFromUrl(url: string, title?: string): Promise<ImageAsset> {
    const imageAsset: ImageAsset = {
      id: `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: url,
      title: title || 'Image from URL',
      category: 'uploaded',
      tags: ['url'],
    }

    this.imagePool.value.unshift(imageAsset)
    await this.preloadImage(imageAsset)
    return imageAsset
  }

  // Preload multiple images
  private async preloadImages(images: ImageAsset[]) {
    const promises = images.map((img) => this.preloadImage(img))
    await Promise.allSettled(promises)
  }

  // Preload single image
  private async preloadImage(imageAsset: ImageAsset): Promise<HTMLImageElement> {
    const assetStore = useAssetStore()

    try {
      const img = await assetStore.loadImage(imageAsset.src, imageAsset.id)

      // Update dimensions from loaded image
      imageAsset.width = img.naturalWidth
      imageAsset.height = img.naturalHeight

      return img
    } catch (error) {
      console.error(`Failed to preload image: ${imageAsset.src}`, error)
      throw error
    }
  }

  // Get loaded HTML image element
  getLoadedImage(imageId: string): HTMLImageElement | null {
    const assetStore = useAssetStore()
    return assetStore.getLoadedImage(imageId)
  }

  // Check if image is loading
  isImageLoading(imageId: string): boolean {
    const assetStore = useAssetStore()
    return assetStore.isImageLoading(imageId)
  }

  // Calculate center position for canvas
  calculateCenterPosition(
    canvasWidth: number = 800,
    canvasHeight: number = 600,
    imageWidth: number = 200,
    imageHeight: number = 200,
  ) {
    return {
      x: canvasWidth / 2 - imageWidth / 2,
      y: canvasHeight / 2 - imageHeight / 2,
    }
  }

  // IAssetService interface implementation
  async createCanvasElement(
    asset: AssetTemplate,
    position = { x: 100, y: 100 },
  ): Promise<CanvasElementData> {
    const imageData = asset.data as {
      src: string
      title: string
      width?: number
      height?: number
    }

    const elementId = `image-${Date.now()}`

    // Preload the image FIRST to get actual dimensions
    const tempAsset = {
      id: elementId,
      src: imageData.src,
      title: imageData.title,
      width: imageData.width,
      height: imageData.height,
      category: 'uploaded' as const,
      thumbnail: imageData.src,
      tags: [],
    }

    // Load image and get actual dimensions
    const loadedImg = await this.preloadImage(tempAsset)

    // Now calculate canvas size based on ACTUAL image dimensions
    const actualWidth = loadedImg.naturalWidth
    const actualHeight = loadedImg.naturalHeight
    const aspectRatio = actualWidth / actualHeight

    // Smart scaling based on aspect ratio to optimize canvas real estate
    let canvasWidth: number
    let canvasHeight: number

    if (aspectRatio > 1.5) {
      // Very wide landscape: use wider max width
      canvasWidth = 320
      canvasHeight = 320 / aspectRatio
    } else if (aspectRatio > 1) {
      // Standard landscape: balanced scaling
      canvasWidth = 280
      canvasHeight = 280 / aspectRatio
    } else if (aspectRatio > 0.6) {
      // Portrait: use taller max height
      canvasHeight = 280
      canvasWidth = 280 * aspectRatio
    } else {
      // Very tall portrait: use even taller max height
      canvasHeight = 320
      canvasWidth = 320 * aspectRatio
    }

    // Ensure minimum size for usability (smaller minimum for very wide/tall images)
    const minSize = aspectRatio > 2 || aspectRatio < 0.5 ? 100 : 140
    if (canvasWidth < minSize || canvasHeight < minSize) {
      const scale = minSize / Math.min(canvasWidth, canvasHeight)
      canvasWidth *= scale
      canvasHeight *= scale
    }

    const finalWidth = Math.round(canvasWidth)
    const finalHeight = Math.round(canvasHeight)

    console.log(`📐 Canvas Image: ${imageData.title}`)
    console.log(`   Original: ${actualWidth}x${actualHeight} (ratio: ${aspectRatio.toFixed(2)})`)
    console.log(
      `   Canvas: ${finalWidth}x${finalHeight} (ratio: ${(finalWidth / finalHeight).toFixed(2)})`,
    )

    const imageElement = new ImageElement(
      elementId,
      imageData.src,
      imageData.title,
      position.x,
      position.y,
      finalWidth,
      finalHeight,
    )

    return {
      element: imageElement,
      position,
    }
  }

  // Remove image from pool
  removeImage(imageId: string) {
    const index = this.imagePool.value.findIndex((img) => img.id === imageId)
    if (index > -1) {
      this.imagePool.value.splice(index, 1)
      // Asset cleanup is now handled by the Asset Store
    }
  }

  // Search images by tags or title
  searchImages(query: string): ImageAsset[] {
    const lowercaseQuery = query.toLowerCase()
    return this.imagePool.value.filter(
      (img) =>
        img.title.toLowerCase().includes(lowercaseQuery) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  // IAssetService interface implementation - optional methods
  filterAssets(searchTerm: string): AssetTemplate[] {
    const lowercaseQuery = searchTerm.toLowerCase()
    return this.assets.value.filter(
      (asset) =>
        asset.name.toLowerCase().includes(lowercaseQuery) ||
        asset.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
        asset.category?.toLowerCase().includes(lowercaseQuery),
    )
  }

  getCategories(): string[] {
    const categories = new Set(this.imagePool.value.map((img) => img.category).filter(Boolean))
    return Array.from(categories) as string[]
  }

  async loadAssets(): Promise<void> {
    // Preload stock images
    await this.preloadImages(this.imagePool.value.filter((img) => img.category === 'stock'))
  }
}

// Create singleton instance
export const imageService = new ImageService()
export { ImageService }
