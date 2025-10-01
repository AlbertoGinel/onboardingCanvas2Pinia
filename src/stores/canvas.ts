import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { TextElement, ImageElement, ButtonElement } from '../models'
import type { AnyCanvasElement, ContextMenuOption } from '../models'
import { imageService } from '../services/imageService'

export interface ContextMenu {
  visible: boolean
  x: number
  y: number
  elementId: string | null
  options: ContextMenuOption[]
}

export interface CanvasSettings {
  width: number
  height: number
  backgroundColor: string
  showGrid: boolean
  gridSize: number
  snapToGrid: boolean
  showRulers: boolean
  zoom: number
  panX: number
  panY: number
}

export const useCanvasStore = defineStore('canvas', () => {
  // Core state
  const elements = ref<AnyCanvasElement[]>([])
  const selectedElementIds = ref<Set<string>>(new Set())
  const clipboard = ref<AnyCanvasElement[]>([])
  const history = ref<{ elements: AnyCanvasElement[]; selectedIds: string[] }[]>([])
  const historyIndex = ref(-1)

  // Canvas settings
  const settings = reactive<CanvasSettings>({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    showGrid: false,
    gridSize: 20,
    snapToGrid: false,
    showRulers: false,
    zoom: 1,
    panX: 0,
    panY: 0,
  })

  // Context menu state
  const contextMenu = reactive<ContextMenu>({
    visible: false,
    x: 0,
    y: 0,
    elementId: null,
    options: [],
  })

  // UI state
  const isTextEditing = ref(false)
  const editingElementId = ref<string | null>(null)
  const isDragging = ref(false)
  const dragStartPos = ref({ x: 0, y: 0 })

  // Computed properties
  const selectedElements = computed(() =>
    elements.value.filter((element) => selectedElementIds.value.has(element.id)),
  )

  const hasSelection = computed(() => selectedElementIds.value.size > 0)

  const canUndo = computed(() => historyIndex.value > 0)

  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  const sortedElements = computed(() => [...elements.value].sort((a, b) => a.zIndex - b.zIndex))

  // Element management actions
  function addElement(element: AnyCanvasElement): void {
    // Assign a unique zIndex
    const maxZIndex = elements.value.reduce((max, el) => Math.max(max, el.zIndex), 0)
    element.zIndex = maxZIndex + 1

    elements.value.push(element)
    saveToHistory()
  }

  function removeElement(elementId: string): void {
    const index = elements.value.findIndex((el) => el.id === elementId)
    if (index !== -1) {
      elements.value.splice(index, 1)
      selectedElementIds.value.delete(elementId)
      saveToHistory()
    }
  }

  function removeElements(elementIds: string[]): void {
    elementIds.forEach((id) => {
      const index = elements.value.findIndex((el) => el.id === id)
      if (index !== -1) {
        elements.value.splice(index, 1)
        selectedElementIds.value.delete(id)
      }
    })
    saveToHistory()
  }

  function duplicateElement(elementId: string): AnyCanvasElement | null {
    const element = elements.value.find((el) => el.id === elementId)
    if (!element) return null

    const cloned = element.clone()
    cloned.id = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    addElement(cloned)
    return cloned
  }

  function updateElement(elementId: string, updates: Partial<AnyCanvasElement>): void {
    const element = elements.value.find((el) => el.id === elementId)
    if (element) {
      Object.assign(element, updates)
    }
  }

  function getElementById(elementId: string): AnyCanvasElement | null {
    return elements.value.find((el) => el.id === elementId) || null
  }

  // Selection actions
  function selectElement(elementId: string, multiSelect = false): void {
    if (!multiSelect) {
      selectedElementIds.value.clear()
    }
    selectedElementIds.value.add(elementId)
  }

  function deselectElement(elementId: string): void {
    selectedElementIds.value.delete(elementId)
  }

  function selectElements(elementIds: string[]): void {
    selectedElementIds.value.clear()
    elementIds.forEach((id) => selectedElementIds.value.add(id))
  }

  function clearSelection(): void {
    selectedElementIds.value.clear()
    stopTextEditing()
  }

  function selectAll(): void {
    elements.value.forEach((element) => selectedElementIds.value.add(element.id))
  }

  // Z-index management
  function bringToFront(elementId: string): void {
    const element = getElementById(elementId)
    if (!element) return

    const maxZIndex = elements.value.reduce((max, el) => Math.max(max, el.zIndex), 0)
    element.zIndex = maxZIndex + 1
    saveToHistory()
  }

  function sendToBack(elementId: string): void {
    const element = getElementById(elementId)
    if (!element) return

    const minZIndex = elements.value.reduce((min, el) => Math.min(min, el.zIndex), 0)
    element.zIndex = minZIndex - 1
    saveToHistory()
  }

  function bringForward(elementId: string): void {
    const element = getElementById(elementId)
    if (!element) return

    element.zIndex += 1
    saveToHistory()
  }

  function sendBackward(elementId: string): void {
    const element = getElementById(elementId)
    if (!element) return

    element.zIndex -= 1
    saveToHistory()
  }

  // History management
  function saveToHistory(): void {
    // Remove any future history if we're not at the end
    if (historyIndex.value < history.value.length - 1) {
      history.value.splice(historyIndex.value + 1)
    }

    // Create a deep copy of current state
    const snapshot = {
      elements: elements.value.map((el) => el.clone()),
      selectedIds: Array.from(selectedElementIds.value),
    }

    history.value.push(snapshot)
    historyIndex.value = history.value.length - 1

    // Limit history size
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }

  function undo(): void {
    if (!canUndo.value) return

    historyIndex.value--
    const snapshot = history.value[historyIndex.value]
    if (snapshot) {
      elements.value = snapshot.elements
      selectedElementIds.value = new Set(snapshot.selectedIds)
    }
  }

  function redo(): void {
    if (!canRedo.value) return

    historyIndex.value++
    const snapshot = history.value[historyIndex.value]
    if (snapshot) {
      elements.value = snapshot.elements
      selectedElementIds.value = new Set(snapshot.selectedIds)
    }
  }

  // Text editing
  function startTextEditing(elementId: string): void {
    const element = getElementById(elementId)
    if (element && element.type === 'text') {
      isTextEditing.value = true
      editingElementId.value = elementId
      ;(element as TextElement).startEditing()
    }
  }

  function stopTextEditing(): void {
    if (editingElementId.value) {
      const element = getElementById(editingElementId.value)
      if (element && element.type === 'text') {
        ;(element as TextElement).stopEditing()
      }
    }
    isTextEditing.value = false
    editingElementId.value = null
  }

  // Context menu
  function showContextMenu(x: number, y: number, elementId: string | null = null): void {
    if (elementId) {
      const element = getElementById(elementId)
      if (element) {
        contextMenu.elementId = elementId
        contextMenu.options = element.getContextMenuOptions()
      }
    } else {
      contextMenu.elementId = null
      contextMenu.options = [
        { label: 'Add Text', action: 'add-text', icon: '📝' },
        { label: 'Add Image', action: 'add-image', icon: '🖼️' },
        { label: 'Add Button', action: 'add-button', icon: '🔘' },
        { label: '', action: '', divider: true },
        { label: 'Paste', action: 'paste', icon: '📋' },
        { label: 'Select All', action: 'select-all', icon: '🔲' },
      ]
    }

    contextMenu.x = x
    contextMenu.y = y
    contextMenu.visible = true
  }

  function hideContextMenu(): void {
    contextMenu.visible = false
    contextMenu.elementId = null
    contextMenu.options = []
  }

  // Element creation helpers
  function createTextElement(text: string = 'New Text', x: number = 100, y: number = 100): string {
    const id = `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const element = new TextElement(id, text, x, y)
    addElement(element)
    selectElement(id)
    return id
  }

  function createImageElement(imageAssetIdOrSrc?: string, x?: number, y?: number): string {
    const id = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    let imageData: {
      src: string
      alt: string
      x: number
      y: number
      width: number
      height: number
    }

    // Check if it's an imageAssetId from the image service
    if (
      imageAssetIdOrSrc &&
      (imageAssetIdOrSrc.startsWith('stock-') ||
        imageAssetIdOrSrc.startsWith('uploaded-') ||
        imageAssetIdOrSrc.startsWith('url-'))
    ) {
      // It's an image asset ID - use the image service
      const imageAsset = imageService.getImageAsset(imageAssetIdOrSrc)

      if (imageAsset) {
        imageData = imageService.createImageElementData(imageAsset, x, y)
        console.log('Creating image element from asset:', imageAsset.title, imageData)
      } else {
        // Fallback if asset not found
        console.warn(`Image asset not found: ${imageAssetIdOrSrc}, using fallback`)
        imageData = {
          src: 'https://picsum.photos/200/300',
          alt: 'Fallback Image',
          x: x ?? 100,
          y: y ?? 100,
          width: 200,
          height: 200,
        }
      }
    } else {
      // It's a direct src URL or no parameter (backward compatibility)
      const src = imageAssetIdOrSrc || 'https://picsum.photos/200/300'
      imageData = {
        src,
        alt: 'Image',
        x: x ?? 100,
        y: y ?? 100,
        width: 200,
        height: 200,
      }
    }

    const element = new ImageElement(
      id,
      imageData.src,
      imageData.alt,
      imageData.x,
      imageData.y,
      imageData.width,
      imageData.height,
    )

    addElement(element)
    selectElement(id)
    console.log('Created image element:', element)
    return id
  }

  function createButtonElement(
    text: string = 'Click Me',
    x: number = 100,
    y: number = 100,
  ): string {
    const id = `button_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const element = new ButtonElement(id, text, x, y)
    addElement(element)
    selectElement(id)
    return id
  }

  // Initialize history with empty state
  saveToHistory()

  return {
    // State
    elements,
    selectedElementIds,
    clipboard,
    settings,
    contextMenu,
    isTextEditing,
    editingElementId,
    isDragging,
    dragStartPos,

    // Computed
    selectedElements,
    hasSelection,
    canUndo,
    canRedo,
    sortedElements,

    // Element management
    addElement,
    removeElement,
    removeElements,
    duplicateElement,
    updateElement,
    getElementById,

    // Selection
    selectElement,
    deselectElement,
    selectElements,
    clearSelection,
    selectAll,

    // Z-index
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,

    // History
    saveToHistory,
    undo,
    redo,

    // Text editing
    startTextEditing,
    stopTextEditing,

    // Context menu
    showContextMenu,
    hideContextMenu,

    // Element creation
    createTextElement,
    createImageElement,
    createButtonElement,
  }
})
