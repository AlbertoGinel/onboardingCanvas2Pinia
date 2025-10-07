import { CanvasElement } from './CanvasElement'
import type { ContextMenuOption, ElementType } from './CanvasElement'
import type { ControlFunction } from '../controls/controlFunctions'
import type { AnyCanvasElement } from './index'

export interface ImageFilter {
  brightness?: number
  contrast?: number
  saturation?: number
  hue?: number
  blur?: number
  opacity?: number
}

export class ImageElement extends CanvasElement {
  public src: string
  public alt: string
  public loaded: boolean
  public naturalWidth: number
  public naturalHeight: number
  public filters: ImageFilter
  public crop: {
    x: number
    y: number
    width: number
    height: number
  } | null

  constructor(
    id: string,
    src: string,
    alt: string = '',
    x: number = 0,
    y: number = 0,
    width: number = 200,
    height: number = 200,
  ) {
    super(id, 'image' as ElementType, x, y, width, height)
    this.src = src
    this.alt = alt
    this.loaded = false
    this.naturalWidth = 0
    this.naturalHeight = 0
    this.filters = {}
    this.crop = null
  }

  public setSrc(src: string): void {
    this.src = src
    this.loaded = false
  }

  public setAlt(alt: string): void {
    this.alt = alt
  }

  public onLoad(naturalWidth: number, naturalHeight: number): void {
    this.loaded = true
    this.naturalWidth = naturalWidth
    this.naturalHeight = naturalHeight

    // Auto-adjust element size to maintain aspect ratio if not manually set
    if (this.transform.width === 200 && this.transform.height === 200) {
      const aspectRatio = naturalWidth / naturalHeight
      if (aspectRatio > 1) {
        // Landscape
        this.transform.width = 200
        this.transform.height = 200 / aspectRatio
      } else {
        // Portrait or square
        this.transform.width = 200 * aspectRatio
        this.transform.height = 200
      }
    }
  }

  public setBrightness(brightness: number): void {
    this.filters.brightness = Math.max(-1, Math.min(1, brightness))
  }

  public setContrast(contrast: number): void {
    this.filters.contrast = Math.max(-1, Math.min(1, contrast))
  }

  public setSaturation(saturation: number): void {
    this.filters.saturation = Math.max(-1, Math.min(1, saturation))
  }

  public setHue(hue: number): void {
    this.filters.hue = hue % 360
  }

  public setBlur(blur: number): void {
    this.filters.blur = Math.max(0, blur)
  }

  public setCrop(x: number, y: number, width: number, height: number): void {
    this.crop = { x, y, width, height }
  }

  public removeCrop(): void {
    this.crop = null
  }

  public resetFilters(): void {
    this.filters = {}
  }

  public getAspectRatio(): number {
    if (this.naturalWidth === 0 || this.naturalHeight === 0) return 1
    return this.naturalWidth / this.naturalHeight
  }

  public fitToContainer(containerWidth: number, containerHeight: number): void {
    if (!this.loaded) return

    const aspectRatio = this.getAspectRatio()
    const containerAspectRatio = containerWidth / containerHeight

    if (aspectRatio > containerAspectRatio) {
      // Image is wider than container
      this.transform.width = containerWidth
      this.transform.height = containerWidth / aspectRatio
    } else {
      // Image is taller than container
      this.transform.width = containerHeight * aspectRatio
      this.transform.height = containerHeight
    }
  }

  public getContextMenuOptions(): ContextMenuOption[] {
    return [
      { label: 'Replace Image', action: 'replace-image', icon: '🖼️' },
      { label: 'Duplicate', action: 'duplicate', icon: '📋' },
      { label: 'Delete', action: 'delete', icon: '🗑️' },
      { label: '', action: '', divider: true },
      { label: 'Crop Image', action: 'crop-image', icon: '✂️' },
      { label: 'Reset Filters', action: 'reset-filters', icon: '🔄' },
      { label: '', action: '', divider: true },
      { label: 'Fit to Original Size', action: 'fit-original', icon: '📐' },
      { label: 'Bring to Front', action: 'bring-to-front', icon: '⬆️' },
      { label: 'Send to Back', action: 'send-to-back', icon: '⬇️' },
      { label: '', action: '', divider: true },
      { label: 'Lock Element', action: 'lock', icon: '🔒' },
      { label: 'Download Image', action: 'download-image', icon: '💾' },
    ]
  }

  public clone(): ImageElement {
    const cloned = new ImageElement(
      `${this.id}_copy`,
      this.src,
      this.alt,
      this.transform.x + 20,
      this.transform.y + 20,
      this.transform.width,
      this.transform.height,
    )
    cloned.loaded = this.loaded
    cloned.naturalWidth = this.naturalWidth
    cloned.naturalHeight = this.naturalHeight
    cloned.filters = { ...this.filters }
    cloned.crop = this.crop ? { ...this.crop } : null
    cloned.transform = { ...this.transform, x: this.transform.x + 20, y: this.transform.y + 20 }
    cloned.opacity = this.opacity
    cloned.visible = this.visible
    cloned.locked = this.locked
    return cloned
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      src: this.src,
      alt: this.alt,
      loaded: this.loaded,
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight,
      filters: { ...this.filters },
      crop: this.crop ? { ...this.crop } : null,
    }
  }

  // Control system methods
  public getControlList(): string[] {
    return [
      // Transform controls
      'positionX',
      'positionY',
      'width',
      'height',
      'rotation',
      'opacity',

      // Image-specific controls
      'imageSrc',
      'imageAlt',
      'brightness',
      'contrast',
      'saturation',
      'hue',
      'blur',
    ]
  }

  public getControlOverrides(): Record<string, Partial<ControlFunction>> {
    return {
      // Maintain aspect ratio when resizing
      width: {
        setValue: (element: AnyCanvasElement, value: string | number | boolean) => {
          const aspectRatio = this.getAspectRatio()
          const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 1
          element.transform.width = Math.max(1, numValue)
          element.transform.height = Math.max(1, numValue / aspectRatio)
        },
      },
      height: {
        setValue: (element: AnyCanvasElement, value: string | number | boolean) => {
          const aspectRatio = this.getAspectRatio()
          const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 1
          element.transform.height = Math.max(1, numValue)
          element.transform.width = Math.max(1, numValue * aspectRatio)
        },
      },
    }
  }
}
