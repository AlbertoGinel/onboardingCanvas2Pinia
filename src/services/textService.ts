import { ref } from 'vue'
import type { Ref } from 'vue'
import { TextElement } from '../models'
import type { IAssetService, AssetTemplate, CanvasElementData } from './asset-service-interface'

/**
 * Service for managing text asset templates and creating text elements
 */
export class TextService implements IAssetService {
  readonly assets: Ref<AssetTemplate[]> = ref([])

  constructor() {
    this.initializeTextTemplates()
  }

  getRenderConfig() {
    return {
      gridColumns: 2,
      itemHeight: '60px',
      previewComponent: 'TextAssetPreview',
      cssClasses: ['text-assets'],
      customStyles: {
        '--font-preview-size': '14px',
        '--preview-padding': '12px',
      },
    }
  }

  getDisplayName(): string {
    return 'Text'
  }

  private initializeTextTemplates(): void {
    this.assets.value = [
      {
        id: 'text-heading',
        name: 'Heading',
        preview: 'Heading',
        category: 'Typography',
        tags: ['heading', 'title', 'large'],
        data: {
          text: 'Your Heading',
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
        },
        renderData: {
          cssClass: 'heading',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2c3e50',
          },
        },
      },
      {
        id: 'text-subheading',
        name: 'Subheading',
        preview: 'Subheading',
        category: 'Typography',
        tags: ['subheading', 'subtitle'],
        data: {
          text: 'Your Subheading',
          fontSize: 24,
          fontWeight: '600',
          fontFamily: 'Arial, sans-serif',
          color: '#333333',
        },
        renderData: {
          style: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#34495e',
          },
        },
      },
      {
        id: 'text-body',
        name: 'Body Text',
        preview: 'Body Text',
        category: 'Typography',
        tags: ['body', 'paragraph', 'content'],
        data: {
          text: 'Your body text goes here',
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Arial, sans-serif',
          color: '#666666',
        },
        renderData: {
          style: {
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#666666',
          },
        },
      },
      {
        id: 'text-caption',
        name: 'Caption',
        preview: 'Caption',
        category: 'Typography',
        tags: ['caption', 'small', 'footnote'],
        data: {
          text: 'Caption text',
          fontSize: 12,
          fontWeight: 'normal',
          fontFamily: 'Arial, sans-serif',
          color: '#999999',
        },
        renderData: {
          style: {
            fontSize: '12px',
            fontWeight: 'normal',
            color: '#999999',
          },
        },
      },
      {
        id: 'text-quote',
        name: 'Quote',
        preview: '"Quote"',
        category: 'Typography',
        tags: ['quote', 'citation', 'italic'],
        data: {
          text: '"Your inspiring quote here"',
          fontSize: 18,
          fontWeight: 'normal',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          color: '#444444',
        },
        renderData: {
          cssClass: 'quote',
          style: {
            fontSize: '15px',
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            color: '#7f8c8d',
          },
        },
      },
      {
        id: 'text-display',
        name: 'Display',
        preview: 'DISPLAY',
        category: 'Typography',
        tags: ['display', 'large', 'bold'],
        data: {
          text: 'DISPLAY',
          fontSize: 48,
          fontWeight: 'bold',
          fontFamily: 'Impact, Arial Black, sans-serif',
          color: '#000000',
        },
        renderData: {
          cssClass: 'display',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Impact, Arial Black, sans-serif',
            color: '#2c3e50',
            textTransform: 'uppercase',
          },
        },
      },
    ]
  }

  async createCanvasElement(
    asset: AssetTemplate,
    position = { x: 100, y: 100 },
  ): Promise<CanvasElementData> {
    const textData = asset.data as {
      text: string
      fontSize: number
      fontWeight: string
      fontFamily: string
      fontStyle?: string
      color: string
    }

    const textElement = new TextElement(
      `text-${Date.now()}`,
      textData.text,
      position.x,
      position.y,
      200, // default width
      50, // default height
    )

    // Apply template styling
    textElement.style.fontSize = textData.fontSize
    textElement.style.fontWeight = textData.fontWeight as typeof textElement.style.fontWeight
    textElement.style.fontFamily = textData.fontFamily
    textElement.style.fill = textData.color

    if (textData.fontStyle) {
      textElement.style.fontStyle = textData.fontStyle as 'normal' | 'italic'
    }

    return {
      element: textElement,
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
}

// Export singleton instance
export const textService = new TextService()
