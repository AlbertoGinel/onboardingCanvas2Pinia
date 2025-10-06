import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { ImageElement } from '../models'
import type {
  IAssetService,
  AssetTemplate,
  CanvasElementData,
  AssetRenderConfig,
} from './asset-service-interface'

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
  private loadingImages = ref<Set<string>>(new Set())
  private loadedImages = ref<Map<string, HTMLImageElement>>(new Map())

  constructor() {
    this.initializeStockImages()
  }

  // Initialize with stock images when page loads
  private initializeStockImages() {
    const stockImages: ImageAsset[] = [
      {
        id: 'stock-1',
        src: 'https://picsum.photos/id/1/400/300',
        title: 'Mountain Landscape',
        category: 'stock',
        tags: ['nature', 'landscape'],
      },
      {
        id: 'stock-2',
        src: 'https://picsum.photos/id/10/400/300',
        title: 'Forest Path',
        category: 'stock',
        tags: ['nature', 'forest'],
      },
      {
        id: 'stock-3',
        src: 'https://picsum.photos/id/20/400/300',
        title: 'Ocean View',
        category: 'stock',
        tags: ['nature', 'ocean'],
      },
      {
        id: 'stock-4',
        src: 'https://picsum.photos/id/30/400/300',
        title: 'City Architecture',
        category: 'stock',
        tags: ['urban', 'architecture'],
      },
      {
        id: 'stock-5',
        src: 'https://picsum.photos/id/40/400/300',
        title: 'Abstract Pattern',
        category: 'stock',
        tags: ['abstract', 'design'],
      },
      {
        id: 'stock-6',
        src: 'https://picsum.photos/id/50/400/300',
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

  // Get all images in the pool (reactive) - legacy method for backward compatibility
  get images() {
    return computed(() => this.imagePool.value)
  }

  // Get images by category
  getImagesByCategory(category: 'stock' | 'uploaded' | 'recent') {
    return this.imagePool.value.filter((img) => img.category === category)
  }

  // Get specific image asset by ID
  getImageAsset(imageId: string): ImageAsset | null {
    return this.imagePool.value.find((img) => img.id === imageId) || null
  }

  // Get rendering configuration for image assets
  getRenderConfig(): AssetRenderConfig {
    return {
      gridColumns: 3, // 3-column grid for larger image previews
      itemHeight: '120px',
      previewComponent: 'ImageAssetPreview',
      cssClasses: ['image-assets-grid'],
      customStyles: {
        '--image-preview-size': '100px',
        '--image-preview-radius': '8px',
      },
    }
  }

  getDisplayName(): string {
    return 'Images'
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
    if (this.loadedImages.value.has(imageAsset.id)) {
      return this.loadedImages.value.get(imageAsset.id)!
    }

    this.loadingImages.value.add(imageAsset.id)

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        // Update dimensions
        imageAsset.width = img.naturalWidth
        imageAsset.height = img.naturalHeight

        this.loadedImages.value.set(imageAsset.id, img)
        this.loadingImages.value.delete(imageAsset.id)
        resolve(img)
      }

      img.onerror = () => {
        this.loadingImages.value.delete(imageAsset.id)
        console.error(`Failed to load image: ${imageAsset.src}`)
        reject(new Error(`Failed to load image: ${imageAsset.src}`))
      }

      img.src = imageAsset.src
    })
  }

  // Get loaded HTML image element
  getLoadedImage(imageId: string): HTMLImageElement | null {
    return this.loadedImages.value.get(imageId) || null
  }

  // Check if image is loading
  isImageLoading(imageId: string): boolean {
    return this.loadingImages.value.has(imageId)
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

    // Calculate dimensions
    let width = 200
    let height = 200

    if (imageData.width && imageData.height) {
      const aspectRatio = imageData.width / imageData.height
      if (aspectRatio > 1) {
        // Landscape
        width = 200
        height = 200 / aspectRatio
      } else {
        // Portrait or square
        width = 200 * aspectRatio
        height = 200
      }
    }

    const imageElement = new ImageElement(
      `image-${Date.now()}`,
      imageData.src,
      imageData.title,
      position.x,
      position.y,
      width,
      height,
    )

    return {
      element: imageElement,
      position,
    }
  }

  // Create ImageElement data for canvas (to be used by canvas store) - legacy method
  createImageElementData(
    imageAsset: ImageAsset,
    x?: number,
    y?: number,
  ): {
    src: string
    alt: string
    x: number
    y: number
    width: number
    height: number
  } {
    // Use natural dimensions or fallback
    let width = 200
    let height = 200

    if (imageAsset.width && imageAsset.height) {
      const aspectRatio = imageAsset.width / imageAsset.height
      if (aspectRatio > 1) {
        // Landscape
        width = 200
        height = 200 / aspectRatio
      } else {
        // Portrait or square
        width = 200 * aspectRatio
        height = 200
      }
    }

    // Calculate center position if not provided
    const centerPos = this.calculateCenterPosition(800, 600, width, height)
    const finalX = x ?? centerPos.x
    const finalY = y ?? centerPos.y

    return {
      src: imageAsset.src,
      alt: imageAsset.title,
      x: finalX,
      y: finalY,
      width,
      height,
    }
  }

  // Remove image from pool
  removeImage(imageId: string) {
    const index = this.imagePool.value.findIndex((img) => img.id === imageId)
    if (index > -1) {
      this.imagePool.value.splice(index, 1)
      this.loadedImages.value.delete(imageId)
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
