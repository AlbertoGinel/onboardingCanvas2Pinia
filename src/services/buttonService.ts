import { ref } from 'vue'
import type { Ref } from 'vue'
import { ButtonElement } from '../models'
import type {
  IAssetService,
  AssetTemplate,
  CanvasElementData,
  AssetRenderConfig,
} from './asset-service-interface'
import type { ControlFunction } from '../controls/controlFunctions'

/**
 * Service for managing button asset templates and creating button elements
 */
export class ButtonService implements IAssetService {
  readonly assets: Ref<AssetTemplate[]> = ref([])

  constructor() {
    this.initializeButtonTemplates()
  }

  private initializeButtonTemplates(): void {
    this.assets.value = [
      {
        id: 'button-primary',
        name: 'Primary Button',
        preview: 'Primary',
        category: 'Action Buttons',
        tags: ['primary', 'action', 'cta'],
        data: {
          text: 'Primary Button',
          backgroundColor: '#007bff',
          textColor: '#ffffff',
          borderColor: '#007bff',
          borderWidth: 1,
          borderRadius: 4,
          fontSize: 16,
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        },
        renderData: {
          style: {
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: '1px solid #007bff',
            fontWeight: 'bold',
          },
          cssClass: 'btn-primary',
        },
      },
      {
        id: 'button-secondary',
        name: 'Secondary Button',
        preview: 'Secondary',
        category: 'Action Buttons',
        tags: ['secondary', 'outline'],
        data: {
          text: 'Secondary',
          backgroundColor: 'transparent',
          textColor: '#6c757d',
          borderColor: '#6c757d',
          borderWidth: 1,
          borderRadius: 4,
          fontSize: 16,
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        },
        renderData: {
          style: {
            backgroundColor: 'transparent',
            color: '#6c757d',
            border: '1px solid #6c757d',
          },
          cssClass: 'btn-secondary',
        },
      },
      {
        id: 'button-success',
        name: 'Success Button',
        preview: 'Success',
        category: 'Status Buttons',
        tags: ['success', 'green', 'confirm'],
        data: {
          text: 'Success',
          backgroundColor: '#28a745',
          textColor: '#ffffff',
          borderColor: '#28a745',
          borderWidth: 1,
          borderRadius: 4,
          fontSize: 16,
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        },
        renderData: {
          style: {
            backgroundColor: '#28a745',
            color: '#ffffff',
            border: '1px solid #28a745',
          },
          cssClass: 'btn-success',
        },
      },
      {
        id: 'button-danger',
        name: 'Danger Button',
        preview: 'Danger',
        category: 'Status Buttons',
        tags: ['danger', 'red', 'delete', 'warning'],
        data: {
          text: 'Danger',
          backgroundColor: '#dc3545',
          textColor: '#ffffff',
          borderColor: '#dc3545',
          borderWidth: 1,
          borderRadius: 4,
          fontSize: 16,
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        },
      },
      {
        id: 'button-warning',
        name: 'Warning Button',
        preview: 'Warning',
        category: 'Status Buttons',
        tags: ['warning', 'yellow', 'caution'],
        data: {
          text: 'Warning',
          backgroundColor: '#ffc107',
          textColor: '#212529',
          borderColor: '#ffc107',
          borderWidth: 1,
          borderRadius: 4,
          fontSize: 16,
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        },
      },
      {
        id: 'button-info',
        name: 'Info Button',
        preview: 'Info',
        category: 'Status Buttons',
        tags: ['info', 'blue', 'information'],
        data: {
          text: 'Info',
          backgroundColor: '#17a2b8',
          textColor: '#ffffff',
          borderColor: '#17a2b8',
          borderWidth: 1,
          borderRadius: 4,
          fontSize: 16,
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        },
      },
      {
        id: 'button-large',
        name: 'Large Button',
        preview: 'Large Button',
        category: 'Size Variants',
        tags: ['large', 'big', 'prominent'],
        data: {
          text: 'Large Button',
          backgroundColor: '#007bff',
          textColor: '#ffffff',
          borderColor: '#007bff',
          borderWidth: 1,
          borderRadius: 6,
          fontSize: 18,
          padding: { top: 12, right: 24, bottom: 12, left: 24 },
        },
      },
      {
        id: 'button-small',
        name: 'Small Button',
        preview: 'Small',
        category: 'Size Variants',
        tags: ['small', 'compact', 'mini'],
        data: {
          text: 'Small',
          backgroundColor: '#007bff',
          textColor: '#ffffff',
          borderColor: '#007bff',
          borderWidth: 1,
          borderRadius: 3,
          fontSize: 14,
          padding: { top: 4, right: 8, bottom: 4, left: 8 },
        },
      },
      {
        id: 'button-rounded',
        name: 'Rounded Button',
        preview: 'Rounded',
        category: 'Style Variants',
        tags: ['rounded', 'pill', 'curved'],
        data: {
          text: 'Rounded',
          backgroundColor: '#6f42c1',
          textColor: '#ffffff',
          borderColor: '#6f42c1',
          borderWidth: 1,
          borderRadius: 25,
          fontSize: 16,
          padding: { top: 8, right: 20, bottom: 8, left: 20 },
        },
      },
    ]
  }

  async createCanvasElement(
    asset: AssetTemplate,
    position = { x: 100, y: 100 },
  ): Promise<CanvasElementData> {
    const buttonData = asset.data as {
      text: string
      backgroundColor: string
      textColor: string
      borderColor: string
      borderWidth: number
      borderRadius: number
      fontSize: number
      padding: { top: number; right: number; bottom: number; left: number }
    }

    // Calculate approximate button size based on text and padding
    const textWidth = buttonData.text.length * (buttonData.fontSize * 0.6) // Rough estimation
    const width = Math.max(80, textWidth + buttonData.padding.left + buttonData.padding.right)
    const height = buttonData.fontSize + buttonData.padding.top + buttonData.padding.bottom + 8

    const buttonElement = new ButtonElement(
      `button-${Date.now()}`,
      buttonData.text,
      position.x,
      position.y,
      width,
      height,
    )

    // Apply template styling
    buttonElement.style.backgroundColor = buttonData.backgroundColor
    buttonElement.style.textColor = buttonData.textColor
    buttonElement.style.borderColor = buttonData.borderColor
    buttonElement.style.borderWidth = buttonData.borderWidth
    buttonElement.style.borderRadius = buttonData.borderRadius
    buttonElement.style.fontSize = buttonData.fontSize
    buttonElement.style.padding = buttonData.padding

    return {
      element: buttonElement,
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

  // Get rendering configuration for button assets
  getRenderConfig(): AssetRenderConfig {
    return {
      gridColumns: 2, // 2-column grid for button previews
      itemHeight: '80px',
      previewComponent: 'ButtonAssetPreview',
      cssClasses: ['button-assets-grid'],
      customStyles: {
        '--button-preview-padding': '12px',
        '--button-preview-gap': '8px',
      },
    }
  }

  getDisplayName(): string {
    return 'Buttons'
  }

  // Define what controls this tool uses
  getControlList(): string[] {
    return [
      'positionX',
      'positionY',
      'width',
      'height',
      'rotation',
      'text',
      'fontSize',
      'fontFamily',
      'textColor',
      'backgroundColor',
      'borderColor',
      'borderWidth',
      'borderRadius',
      'padding',
      'url',
      'opacity',
    ]
  }

  // Define tool-specific control configurations
  getControlConfigurations(): Record<string, Partial<ControlFunction>> {
    return {
      text: {
        type: 'input',
        label: 'Button Text',
        icon: '📝',
        getConfig: () => ({ maxLength: 50 }),
        getValue: (element) => {
          const buttonEl = element as ButtonElement
          return buttonEl.text
        },
        setValue: (element, value) => {
          const buttonEl = element as ButtonElement
          buttonEl.setText(value as string)
        },
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        icon: '🎨',
        getValue: (element) => {
          const buttonEl = element as ButtonElement
          return buttonEl.style.backgroundColor
        },
        setValue: (element, value) => {
          const buttonEl = element as ButtonElement
          buttonEl.setBackgroundColor(value as string)
        },
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        icon: '✏️',
        getValue: (element) => {
          const buttonEl = element as ButtonElement
          return buttonEl.style.textColor
        },
        setValue: (element, value) => {
          const buttonEl = element as ButtonElement
          buttonEl.setTextColor(value as string)
        },
      },
      borderRadius: {
        type: 'slider',
        label: 'Border Radius',
        icon: '⭕',
        getConfig: () => ({ min: 0, max: 50, step: 1 }),
        getValue: (element) => {
          const buttonEl = element as ButtonElement
          return buttonEl.style.borderRadius
        },
        setValue: (element, value) => {
          const buttonEl = element as ButtonElement
          buttonEl.setBorderRadius(value as number)
        },
      },
      url: {
        type: 'input',
        label: 'Link URL',
        icon: '🔗',
        getConfig: () => ({ placeholder: 'https://example.com' }),
        getValue: (element) => {
          const buttonEl = element as ButtonElement
          return buttonEl.url || ''
        },
        setValue: (element, value) => {
          const buttonEl = element as ButtonElement
          buttonEl.setUrl(value as string)
        },
      },
    }
  }
}

// Export singleton instance
export const buttonService = new ButtonService()
