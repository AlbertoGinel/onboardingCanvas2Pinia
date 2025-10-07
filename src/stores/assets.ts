import { ref, readonly } from 'vue'
import { defineStore } from 'pinia'

export interface FontOption {
  value: string
  label: string
  category: 'system' | 'serif' | 'sans-serif' | 'monospace' | 'web'
}

/**
 * Universal Asset Store - Manages runtime loading of assets for all tools
 *
 * Responsibilities:
 * - Load and cache images as HTMLImageElement objects
 * - Load and manage web fonts
 * - Track loading states for UI feedback
 * - Memory management and cleanup
 *
 * NOT responsible for:
 * - Asset templates/definitions (those stay in services)
 * - Tool-specific configurations
 */
export const useAssetStore = defineStore('assets', () => {
  // ========== IMAGE ASSETS ==========
  const loadedImages = ref<Map<string, HTMLImageElement>>(new Map())
  const loadingImages = ref<Set<string>>(new Set())
  const imageLoadErrors = ref<Map<string, string>>(new Map())

  // ========== FONT ASSETS ==========
  const loadedFonts = ref<Map<string, FontFace>>(new Map())
  const loadingFonts = ref<Set<string>>(new Set())
  const fontLoadErrors = ref<Map<string, string>>(new Map())

  // Available system and web fonts
  const availableFonts = ref<FontOption[]>([
    // System fonts
    { value: 'Arial', label: 'Arial', category: 'sans-serif' },
    { value: 'Helvetica', label: 'Helvetica', category: 'sans-serif' },
    { value: 'Georgia', label: 'Georgia', category: 'serif' },
    { value: 'Times New Roman', label: 'Times New Roman', category: 'serif' },
    { value: 'Courier New', label: 'Courier New', category: 'monospace' },
    { value: 'Verdana', label: 'Verdana', category: 'sans-serif' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS', category: 'system' },
    { value: 'Impact', label: 'Impact', category: 'system' },
  ])

  // ========== GENERIC ASSET CACHE ==========
  const assetCache = ref<Map<string, unknown>>(new Map())
  const loadingAssets = ref<Set<string>>(new Set())

  // ========== IMAGE METHODS ==========

  /**
   * Load an image and cache it for Konva rendering
   * @param src - Image source URL
   * @param id - Unique identifier for the image
   * @returns Promise that resolves to HTMLImageElement
   */
  async function loadImage(src: string, id: string): Promise<HTMLImageElement> {
    // Return cached image if already loaded
    if (loadedImages.value.has(id)) {
      return loadedImages.value.get(id)!
    }

    // Check if already loading
    if (loadingImages.value.has(id)) {
      // Wait for existing load to complete
      return new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (loadedImages.value.has(id)) {
            resolve(loadedImages.value.get(id)!)
          } else if (imageLoadErrors.value.has(id)) {
            reject(new Error(imageLoadErrors.value.get(id)))
          } else {
            setTimeout(checkLoaded, 50)
          }
        }
        checkLoaded()
      })
    }

    loadingImages.value.add(id)
    imageLoadErrors.value.delete(id) // Clear any previous errors

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous' // Enable CORS for external images

      img.onload = () => {
        loadedImages.value.set(id, img)
        loadingImages.value.delete(id)
        console.log(`✅ Image loaded: ${id}`)
        resolve(img)
      }

      img.onerror = (error) => {
        const errorMessage = `Failed to load image: ${src}`
        imageLoadErrors.value.set(id, errorMessage)
        loadingImages.value.delete(id)
        console.error(`❌ Image load error: ${id}`, error)
        reject(new Error(errorMessage))
      }

      img.src = src
    })
  }

  /**
   * Get a loaded image by ID
   */
  function getLoadedImage(id: string): HTMLImageElement | null {
    return loadedImages.value.get(id) || null
  }

  /**
   * Check if an image is currently loading
   */
  function isImageLoading(id: string): boolean {
    return loadingImages.value.has(id)
  }

  /**
   * Check if an image failed to load
   */
  function hasImageError(id: string): boolean {
    return imageLoadErrors.value.has(id)
  }

  /**
   * Get image load error message
   */
  function getImageError(id: string): string | null {
    return imageLoadErrors.value.get(id) || null
  }

  // ========== FONT METHODS ==========

  /**
   * Load a web font and make it available for use
   * @param fontFamily - Font family name
   * @param fontUrl - Optional URL for web fonts
   * @returns Promise that resolves to FontFace
   */
  async function loadFont(fontFamily: string, fontUrl?: string): Promise<FontFace> {
    // Return cached font if already loaded
    if (loadedFonts.value.has(fontFamily)) {
      return loadedFonts.value.get(fontFamily)!
    }

    // Check if already loading
    if (loadingFonts.value.has(fontFamily)) {
      return new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (loadedFonts.value.has(fontFamily)) {
            resolve(loadedFonts.value.get(fontFamily)!)
          } else if (fontLoadErrors.value.has(fontFamily)) {
            reject(new Error(fontLoadErrors.value.get(fontFamily)))
          } else {
            setTimeout(checkLoaded, 50)
          }
        }
        checkLoaded()
      })
    }

    loadingFonts.value.add(fontFamily)
    fontLoadErrors.value.delete(fontFamily)

    return new Promise((resolve, reject) => {
      const font = new FontFace(fontFamily, fontUrl ? `url(${fontUrl})` : `local("${fontFamily}")`)

      font
        .load()
        .then(() => {
          document.fonts.add(font)
          loadedFonts.value.set(fontFamily, font)
          loadingFonts.value.delete(fontFamily)
          console.log(`✅ Font loaded: ${fontFamily}`)
          resolve(font)
        })
        .catch((error) => {
          const errorMessage = `Failed to load font: ${fontFamily}`
          fontLoadErrors.value.set(fontFamily, errorMessage)
          loadingFonts.value.delete(fontFamily)
          console.error(`❌ Font load error: ${fontFamily}`, error)
          reject(error)
        })
    })
  }

  /**
   * Check if a font is loaded
   */
  function isFontLoaded(fontFamily: string): boolean {
    return loadedFonts.value.has(fontFamily)
  }

  /**
   * Check if a font is currently loading
   */
  function isFontLoading(fontFamily: string): boolean {
    return loadingFonts.value.has(fontFamily)
  }

  /**
   * Add a new font option to available fonts
   */
  function addFontOption(fontOption: FontOption): void {
    if (!availableFonts.value.find((f) => f.value === fontOption.value)) {
      availableFonts.value.push(fontOption)
    }
  }

  // ========== GENERIC ASSET METHODS ==========

  /**
   * Cache any type of asset data
   */
  function cacheAsset(key: string, data: unknown): void {
    assetCache.value.set(key, data)
  }

  /**
   * Retrieve cached asset data
   */
  function getCachedAsset(key: string): unknown {
    return assetCache.value.get(key)
  }

  /**
   * Check if an asset is in the cache
   */
  function hasAssetInCache(key: string): boolean {
    return assetCache.value.has(key)
  }

  // ========== CLEANUP METHODS ==========

  /**
   * Remove unused images from memory
   * @param activeImageIds - Array of image IDs currently in use
   */
  function clearUnusedImages(activeImageIds: string[]): void {
    let removedCount = 0
    for (const [id] of loadedImages.value) {
      if (!activeImageIds.includes(id)) {
        loadedImages.value.delete(id)
        imageLoadErrors.value.delete(id)
        removedCount++
      }
    }
    if (removedCount > 0) {
      console.log(`🧹 Cleared ${removedCount} unused images from memory`)
    }
  }

  /**
   * Remove unused fonts from memory (be careful - fonts might be used elsewhere)
   * @param activeFontFamilies - Array of font families currently in use
   */
  function clearUnusedFonts(activeFontFamilies: string[]): void {
    let removedCount = 0
    for (const [fontFamily] of loadedFonts.value) {
      if (!activeFontFamilies.includes(fontFamily)) {
        // Note: We don't remove from document.fonts - might be used elsewhere
        loadedFonts.value.delete(fontFamily)
        fontLoadErrors.value.delete(fontFamily)
        removedCount++
      }
    }
    if (removedCount > 0) {
      console.log(`🧹 Cleared ${removedCount} unused font references from memory`)
    }
  }

  /**
   * Clear all cached assets (use with caution)
   */
  function clearAllAssets(): void {
    const imageCount = loadedImages.value.size
    const fontCount = loadedFonts.value.size
    const cacheCount = assetCache.value.size

    loadedImages.value.clear()
    loadedFonts.value.clear()
    assetCache.value.clear()
    loadingImages.value.clear()
    loadingFonts.value.clear()
    loadingAssets.value.clear()
    imageLoadErrors.value.clear()
    fontLoadErrors.value.clear()

    console.log(
      `🧹 Cleared all assets: ${imageCount} images, ${fontCount} fonts, ${cacheCount} cached items`,
    )
  }

  // ========== UTILITY METHODS ==========

  /**
   * Get asset store statistics for debugging
   */
  function getStats() {
    return {
      loadedImages: loadedImages.value.size,
      loadingImages: loadingImages.value.size,
      imageErrors: imageLoadErrors.value.size,
      loadedFonts: loadedFonts.value.size,
      loadingFonts: loadingFonts.value.size,
      fontErrors: fontLoadErrors.value.size,
      cachedAssets: assetCache.value.size,
      availableFonts: availableFonts.value.length,
    }
  }

  // ========== RETURN STORE API ==========
  return {
    // Image assets - READ ONLY for DevTools visibility
    loadedImages: readonly(loadedImages),
    loadingImages: readonly(loadingImages),
    imageLoadErrors: readonly(imageLoadErrors),

    // Font assets - READ ONLY for DevTools visibility
    loadedFonts: readonly(loadedFonts),
    loadingFonts: readonly(loadingFonts),
    fontLoadErrors: readonly(fontLoadErrors),
    availableFonts: readonly(availableFonts),

    // Generic cache - READ ONLY for DevTools visibility
    assetCache: readonly(assetCache),
    loadingAssets: readonly(loadingAssets),

    // Image methods
    loadImage,
    getLoadedImage,
    isImageLoading,
    hasImageError,
    getImageError,

    // Font methods
    loadFont,
    isFontLoaded,
    isFontLoading,
    addFontOption,

    // Generic methods
    cacheAsset,
    getCachedAsset,
    hasAssetInCache,

    // Cleanup methods
    clearUnusedImages,
    clearUnusedFonts,
    clearAllAssets,

    // Utility methods
    getStats,
  }
})
