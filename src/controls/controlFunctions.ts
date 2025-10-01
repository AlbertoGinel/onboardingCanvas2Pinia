import type { AnyCanvasElement } from '../models'
import { TextElement } from '../models/TextElement'
import { ImageElement } from '../models/ImageElement'
import { ButtonElement } from '../models/ButtonElement'

export interface ControlOption {
  value: string | number
  label: string
}

export interface ControlConfig {
  type?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  maxLength?: number
}

export type ControlFunction = {
  id: string
  type: 'input' | 'slider' | 'color' | 'select' | 'toggle' | 'button' | 'range'
  label: string
  icon?: string
  getValue: (element: AnyCanvasElement) => string | number | boolean
  setValue: (element: AnyCanvasElement, value: string | number | boolean) => void
  getOptions?: () => ControlOption[]
  getConfig?: () => ControlConfig
  isVisible?: (element: AnyCanvasElement) => boolean
  isDisabled?: (element: AnyCanvasElement) => boolean
}

// Reusable control functions
export const controlFunctions: Record<string, ControlFunction> = {
  // Position Controls
  positionX: {
    id: 'positionX',
    type: 'input',
    label: 'X',
    icon: '↔️',
    getValue: (element) => Math.round(element.transform.x),
    setValue: (element, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
      element.transform.x = numValue
    },
    getConfig: () => ({ type: 'number', step: 1 }),
  },

  positionY: {
    id: 'positionY',
    type: 'input',
    label: 'Y',
    icon: '↕️',
    getValue: (element) => Math.round(element.transform.y),
    setValue: (element, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
      element.transform.y = numValue
    },
    getConfig: () => ({ type: 'number', step: 1 }),
  },

  // Size Controls
  width: {
    id: 'width',
    type: 'input',
    label: 'W',
    icon: '↔️',
    getValue: (element) => Math.round(element.transform.width),
    setValue: (element, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 1
      element.transform.width = Math.max(1, numValue)
    },
    getConfig: () => ({ type: 'number', min: 1, step: 1 }),
  },

  height: {
    id: 'height',
    type: 'input',
    label: 'H',
    icon: '↕️',
    getValue: (element) => Math.round(element.transform.height),
    setValue: (element, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 1
      element.transform.height = Math.max(1, numValue)
    },
    getConfig: () => ({ type: 'number', min: 1, step: 1 }),
  },

  // Transform Controls
  rotation: {
    id: 'rotation',
    type: 'slider',
    label: 'Rotation',
    icon: '🔄',
    getValue: (element) => Math.round(element.transform.rotation || 0),
    setValue: (element, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
      element.transform.rotation = numValue
    },
    getConfig: () => ({ min: 0, max: 360, step: 1 }),
  },

  opacity: {
    id: 'opacity',
    type: 'slider',
    label: 'Opacity',
    icon: '👁️',
    getValue: (element) => element.opacity || 1,
    setValue: (element, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 1
      element.opacity = Math.max(0, Math.min(1, numValue))
    },
    getConfig: () => ({ min: 0, max: 1, step: 0.01 }),
  },

  // Text-specific Controls
  textContent: {
    id: 'textContent',
    type: 'input',
    label: 'Text',
    icon: '📝',
    getValue: (element) => {
      if (element.type === 'text') {
        return (element as TextElement).text || ''
      }
      return ''
    },
    setValue: (element, value) => {
      if (element.type === 'text') {
        ;(element as TextElement).text = String(value) || ''
      }
    },
    getConfig: () => ({ type: 'text' }),
    isVisible: (element) => element.type === 'text',
  },

  fontSize: {
    id: 'fontSize',
    type: 'slider',
    label: 'Font Size',
    icon: '🔤',
    getValue: (element) => {
      if (element.type === 'text') {
        return (element as TextElement).style?.fontSize || 16
      }
      return 16
    },
    setValue: (element, value) => {
      if (element.type === 'text') {
        const textEl = element as TextElement
        const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 16
        if (textEl.style) {
          textEl.style.fontSize = Math.max(8, numValue)
        }
      }
    },
    getConfig: () => ({ min: 8, max: 72, step: 1 }),
    isVisible: (element) => element.type === 'text',
  },

  fontFamily: {
    id: 'fontFamily',
    type: 'select',
    label: 'Font',
    icon: '🔤',
    getValue: (element) => {
      if (element.type === 'text') {
        return (element as TextElement).style?.fontFamily || 'Arial'
      }
      return 'Arial'
    },
    setValue: (element, value) => {
      if (element.type === 'text') {
        const textEl = element as TextElement
        if (textEl.style) {
          textEl.style.fontFamily = String(value)
        }
      }
    },
    getOptions: () => [
      { value: 'Arial', label: 'Arial' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Times New Roman', label: 'Times' },
      { value: 'Courier New', label: 'Courier' },
      { value: 'Helvetica', label: 'Helvetica' },
    ],
    isVisible: (element) => element.type === 'text',
  },

  textColor: {
    id: 'textColor',
    type: 'color',
    label: 'Color',
    icon: '🎨',
    getValue: (element) => {
      if (element.type === 'text') {
        return (element as TextElement).style?.fill || '#000000'
      }
      return '#000000'
    },
    setValue: (element, value) => {
      if (element.type === 'text') {
        const textEl = element as TextElement
        if (textEl.style) {
          textEl.style.fill = String(value)
        }
      }
    },
    isVisible: (element) => element.type === 'text',
  },

  // Image-specific Controls
  imageSrc: {
    id: 'imageSrc',
    type: 'input',
    label: 'Image URL',
    icon: '🔗',
    getValue: (element) => {
      if (element.type === 'image') {
        return (element as ImageElement).src || ''
      }
      return ''
    },
    setValue: (element, value) => {
      if (element.type === 'image') {
        ;(element as ImageElement).src = String(value)
      }
    },
    getConfig: () => ({ type: 'url' }),
    isVisible: (element) => element.type === 'image',
  },

  imageAlt: {
    id: 'imageAlt',
    type: 'input',
    label: 'Alt Text',
    icon: '📝',
    getValue: (element) => {
      if (element.type === 'image') {
        return (element as ImageElement).alt || ''
      }
      return ''
    },
    setValue: (element, value) => {
      if (element.type === 'image') {
        ;(element as ImageElement).alt = String(value)
      }
    },
    getConfig: () => ({ type: 'text' }),
    isVisible: (element) => element.type === 'image',
  },

  // Button-specific Controls
  buttonText: {
    id: 'buttonText',
    type: 'input',
    label: 'Button Text',
    icon: '📝',
    getValue: (element) => {
      if (element.type === 'button') {
        return (element as ButtonElement).text || ''
      }
      return ''
    },
    setValue: (element, value) => {
      if (element.type === 'button') {
        ;(element as ButtonElement).text = String(value) || ''
      }
    },
    isVisible: (element) => element.type === 'button',
  },

  buttonUrl: {
    id: 'buttonUrl',
    type: 'input',
    label: 'URL',
    icon: '🔗',
    getValue: (element) => {
      if (element.type === 'button') {
        return (element as ButtonElement).url || ''
      }
      return ''
    },
    setValue: (element, value) => {
      if (element.type === 'button') {
        ;(element as ButtonElement).url = String(value) || ''
      }
    },
    getConfig: () => ({ type: 'url' }),
    isVisible: (element) => element.type === 'button',
  },

  backgroundColor: {
    id: 'backgroundColor',
    type: 'color',
    label: 'Background',
    icon: '🎨',
    getValue: (element) => {
      if (element.type === 'button') {
        return (element as ButtonElement).style?.backgroundColor || '#3498db'
      }
      return '#3498db'
    },
    setValue: (element, value) => {
      if (element.type === 'button') {
        const buttonEl = element as ButtonElement
        if (buttonEl.style) {
          buttonEl.style.backgroundColor = String(value)
        }
      }
    },
    isVisible: (element) => element.type === 'button',
  },
}
