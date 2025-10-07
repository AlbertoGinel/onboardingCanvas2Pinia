<template>
  <div class="canvas-editor" ref="containerRef">
    <v-stage
      :config="stageConfig"
      @mousedown="handleStageClick"
      @contextmenu="handleStageRightClick"
      @wheel="handleWheel"
      ref="stageRef"
    >
      <v-layer>
        <!-- Canvas background -->
        <v-rect
          :config="{
            x: 0,
            y: 0,
            width: canvasStore.settings.width,
            height: canvasStore.settings.height,
            fill: canvasStore.settings.backgroundColor,
            stroke: '#e9ecef',
            strokeWidth: 1,
          }"
        />

        <!-- Grid (if enabled) -->
        <template v-if="canvasStore.settings.showGrid">
          <!-- Grid lines will be implemented later -->
        </template>

        <!-- Render elements -->
        <template v-for="element in canvasStore.sortedElements" :key="element.id">
          <!-- Text elements -->
          <v-text
            v-if="element.type === 'text'"
            :config="{
              id: element.id,
              x: element.transform.x,
              y: element.transform.y,
              text: (element as TextElement).text,
              fontSize: (element as TextElement).style.fontSize,
              fontFamily: (element as TextElement).style.fontFamily,
              fill: (element as TextElement).style.fill,
              rotation: element.transform.rotation,
              scaleX: element.transform.scaleX,
              scaleY: element.transform.scaleY,
              opacity: element.opacity,
              visible: element.visible,
              draggable: !element.locked,
              listening: !element.locked,
            }"
            @click="handleElementClick(element.id, $event)"
            @dblclick="handleTextDoubleClick(element.id)"
            @dragend="handleElementDragEnd(element.id, $event)"
          />

          <!-- Image elements -->
          <v-image
            v-else-if="element.type === 'image'"
            :config="{
              id: element.id,
              x: element.transform.x,
              y: element.transform.y,
              width: element.transform.width,
              height: element.transform.height,
              rotation: element.transform.rotation,
              scaleX: element.transform.scaleX,
              scaleY: element.transform.scaleY,
              opacity: element.opacity,
              visible: element.visible,
              draggable: !element.locked,
              listening: !element.locked,
              image: getImageForElement(element as ImageElement),
              // Show placeholder if image not loaded
              fill: getImageForElement(element as ImageElement) ? undefined : '#f8f9fa',
              stroke: getImageForElement(element as ImageElement) ? undefined : '#dee2e6',
              strokeWidth: getImageForElement(element as ImageElement) ? undefined : 2,
              dash: getImageForElement(element as ImageElement) ? undefined : [5, 5],
            }"
            @click="handleElementClick(element.id, $event)"
            @dragend="handleElementDragEnd(element.id, $event)"
          />

          <!-- Loading indicator for images -->
          <v-text
            v-if="element.type === 'image' && assetStore.isImageLoading(element.id)"
            :config="{
              x: element.transform.x + element.transform.width / 2,
              y: element.transform.y + element.transform.height / 2,
              text: 'Loading...',
              fontSize: 14,
              fill: '#6c757d',
              align: 'center',
              offsetX: 35,
              offsetY: 7,
            }"
          />

          <!-- Error indicator for failed images -->
          <v-text
            v-if="element.type === 'image' && assetStore.hasImageError(element.id)"
            :config="{
              x: element.transform.x + element.transform.width / 2,
              y: element.transform.y + element.transform.height / 2,
              text: '❌ Failed to load',
              fontSize: 14,
              fill: '#dc3545',
              align: 'center',
              offsetX: 50,
              offsetY: 7,
            }"
          />

          <!-- Button elements -->
          <v-group
            v-else-if="element.type === 'button'"
            :config="{
              id: element.id,
              x: element.transform.x,
              y: element.transform.y,
              rotation: element.transform.rotation,
              scaleX: element.transform.scaleX,
              scaleY: element.transform.scaleY,
              opacity: element.opacity,
              visible: element.visible,
              draggable: !element.locked,
              listening: !element.locked,
            }"
            @click="handleElementClick(element.id, $event)"
            @dragend="handleElementDragEnd(element.id, $event)"
          >
            <!-- Button background -->
            <v-rect
              :config="{
                width: element.transform.width,
                height: element.transform.height,
                fill: (element as ButtonElement).style.backgroundColor,
                stroke: (element as ButtonElement).style.borderColor,
                strokeWidth: (element as ButtonElement).style.borderWidth,
                cornerRadius: (element as ButtonElement).style.borderRadius,
              }"
            />

            <!-- Button text -->
            <v-text
              :config="{
                x: (element as ButtonElement).style.padding.left,
                y: (element as ButtonElement).style.padding.top,
                width:
                  element.transform.width -
                  (element as ButtonElement).style.padding.left -
                  (element as ButtonElement).style.padding.right,
                height:
                  element.transform.height -
                  (element as ButtonElement).style.padding.top -
                  (element as ButtonElement).style.padding.bottom,
                text: (element as ButtonElement).text,
                fontSize: (element as ButtonElement).style.fontSize,
                fontFamily: (element as ButtonElement).style.fontFamily,
                fill: (element as ButtonElement).style.textColor,
                align: 'center',
                verticalAlign: 'middle',
              }"
            />
          </v-group>
        </template>

        <!-- Selection transformer -->
        <v-transformer
          v-if="canvasStore.hasSelection && !canvasStore.isTextEditing"
          ref="transformerRef"
          :config="{
            boundBoxFunc: (oldBox: any, newBox: any) => {
              // Prevent negative scaling
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox
              }
              return newBox
            },
          }"
        />
      </v-layer>
    </v-stage>

    <!-- Context Menu -->
    <div
      v-if="canvasStore.contextMenu.visible"
      class="context-menu"
      :style="{
        left: canvasStore.contextMenu.x + 'px',
        top: canvasStore.contextMenu.y + 'px',
      }"
      @click.stop
    >
      <template v-for="(option, index) in canvasStore.contextMenu.options" :key="index">
        <div
          v-if="!option.divider"
          class="context-menu-item"
          @click="handleContextMenuAction(option.action)"
        >
          <span v-if="option.icon" class="icon">{{ option.icon }}</span>
          <span>{{ option.label }}</span>
        </div>
        <hr v-else class="context-menu-divider" />
      </template>
    </div>

    <!-- Text Editing Overlay -->
    <div
      v-if="canvasStore.isTextEditing && canvasStore.editingElementId"
      class="text-edit-overlay"
      :style="textEditOverlayStyle"
    >
      <textarea
        ref="textEditRef"
        v-model="editingText"
        @blur="handleTextEditBlur"
        @keydown="handleTextEditKeydown"
        @keyup="(e) => e.stopPropagation()"
        @keypress="(e) => e.stopPropagation()"
        class="text-edit-textarea"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useCanvasStore } from '../stores'
import { useAssetStore } from '../stores/assets'
import { TextElement, ImageElement, ButtonElement } from '../models'
import type { AnyCanvasElement } from '../models'

const canvasStore = useCanvasStore()
const assetStore = useAssetStore()

// Refs
const containerRef = ref<HTMLDivElement>()
const stageRef = ref<any>()
const transformerRef = ref<any>()
const textEditRef = ref<HTMLTextAreaElement>()

// Text editing state
const editingText = ref('')

// Image loading now handled by Asset Store

// Watch for new image elements and load their images using Asset Store
watch(
  () => canvasStore.elements,
  (newElements) => {
    newElements.forEach(async (element) => {
      if (
        element.type === 'image' &&
        (element as ImageElement).src &&
        !assetStore.getLoadedImage(element.id) &&
        !assetStore.isImageLoading(element.id)
      ) {
        try {
          // Load image through Asset Store
          await assetStore.loadImage((element as ImageElement).src, element.id)
          console.log(`✅ Successfully loaded image for element: ${element.id}`)
        } catch (error) {
          console.error(`❌ Failed to load image for element ${element.id}:`, error)
        }
      }
    })
  },
  { deep: true, immediate: true },
)

// Helper function to get loaded image or null
function getImageForElement(element: ImageElement): HTMLImageElement | null {
  // Use Asset Store to get loaded image
  return assetStore.getLoadedImage(element.id)
}

// Text edit overlay style
const textEditOverlayStyle = computed(() => {
  if (!canvasStore.editingElementId) return { display: 'none' }

  const element = canvasStore.getElementById(canvasStore.editingElementId)
  if (!element || element.type !== 'text') return { display: 'none' }

  const stage = stageRef.value?.getNode?.() || stageRef.value
  if (!stage) return { display: 'none' }

  const transform = element.transform
  const stageScale = stage.scaleX?.() || 1
  const stagePos = { x: stage.x?.() || 0, y: stage.y?.() || 0 }

  return {
    position: 'absolute' as const,
    left: transform.x * stageScale + stagePos.x + 'px',
    top: transform.y * stageScale + stagePos.y + 'px',
    width: transform.width * stageScale + 'px',
    height: transform.height * stageScale + 'px',
    fontSize: (element as TextElement).style.fontSize * stageScale + 'px',
    fontFamily: (element as TextElement).style.fontFamily,
    color: (element as TextElement).style.fill,
    zIndex: 1000,
  }
})

// Stage configuration
const stageConfig = computed(() => ({
  width: containerRef.value?.clientWidth || 800,
  height: containerRef.value?.clientHeight || 600,
  scaleX: canvasStore.settings.zoom,
  scaleY: canvasStore.settings.zoom,
  x: canvasStore.settings.panX,
  y: canvasStore.settings.panY,
  draggable: false,
}))

// For now, we'll implement image loading later to avoid CORS issues
// This removes the immediate image loading that was causing CORS errors

// Get selected nodes for transformer
function getSelectedNodes() {
  if (!stageRef.value) return []

  try {
    const stage = stageRef.value.getNode?.() || stageRef.value
    if (!stage || typeof stage.findOne !== 'function') return []

    const selectedNodes = []

    for (const elementId of canvasStore.selectedElementIds) {
      const node = stage.findOne(`#${elementId}`)
      if (node) {
        selectedNodes.push(node)
      }
    }

    return selectedNodes
  } catch (error) {
    console.warn('Error getting selected nodes:', error)
    return []
  }
}

// Event handlers
function handleStageClick(e: any) {
  // Check if we clicked on the stage (background)
  const clickedOnEmpty = e.target === e.target.getStage?.() || e.target.className === 'Stage'
  if (clickedOnEmpty) {
    canvasStore.clearSelection()
    canvasStore.hideContextMenu()
  }
}

function handleStageRightClick(e: any) {
  e.evt.preventDefault()

  const stage = e.target.getStage?.() || e.target
  const pointer = stage.getPointerPosition?.() || { x: e.evt.clientX, y: e.evt.clientY }

  const clickedOnEmpty = e.target === stage || e.target.className === 'Stage'
  if (clickedOnEmpty) {
    // Right-clicked on empty canvas
    canvasStore.showContextMenu(pointer.x, pointer.y, null)
  }
}

function handleElementClick(elementId: string, e: any) {
  e.cancelBubble = true

  const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey
  canvasStore.selectElement(elementId, isMultiSelect)
  canvasStore.hideContextMenu()

  // Update transformer after selection
  nextTick(() => {
    updateTransformer()
  })
}

function handleTextDoubleClick(elementId: string) {
  const element = canvasStore.getElementById(elementId)
  if (element && element.type === 'text') {
    const textElement = element as TextElement
    editingText.value = textElement.text
    canvasStore.startTextEditing(elementId)

    nextTick(() => {
      if (textEditRef.value) {
        textEditRef.value.focus()
        textEditRef.value.select()
      }
    })
  }
}

function handleElementDragEnd(elementId: string, e: any) {
  const node = e.target
  canvasStore.updateElement(elementId, {
    transform: {
      ...canvasStore.getElementById(elementId)?.transform!,
      x: node.x(),
      y: node.y(),
    },
  } as Partial<AnyCanvasElement>)
}

function handleWheel(e: any) {
  e.evt.preventDefault()

  const stage = e.target.getStage?.() || e.target
  const pointer = stage.getPointerPosition?.() || { x: 0, y: 0 }

  const scaleBy = 1.1
  const oldScale = stage.scaleX?.() || 1

  let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy

  // Limit zoom
  newScale = Math.max(0.1, Math.min(5, newScale))

  // Calculate new position to zoom towards cursor
  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }

  canvasStore.settings.zoom = newScale
  canvasStore.settings.panX = newPos.x
  canvasStore.settings.panY = newPos.y
}

// Context menu actions
async function handleContextMenuAction(action: string) {
  canvasStore.hideContextMenu()

  try {
    switch (action) {
      case 'add-text':
        await canvasStore.createDefaultElementFromService('text')
        break
      case 'add-image':
        await canvasStore.createDefaultElementFromService('images')
        break
      case 'add-button':
        await canvasStore.createDefaultElementFromService('buttons')
        break
      case 'paste':
        // Paste functionality will be implemented later
        break
      case 'select-all':
        canvasStore.selectAll()
        break
      case 'duplicate':
        if (canvasStore.contextMenu.elementId) {
          canvasStore.duplicateElement(canvasStore.contextMenu.elementId)
        }
        break
      case 'delete':
        if (canvasStore.contextMenu.elementId) {
          canvasStore.removeElement(canvasStore.contextMenu.elementId)
        }
        break
      case 'bring-to-front':
        if (canvasStore.contextMenu.elementId) {
          canvasStore.bringToFront(canvasStore.contextMenu.elementId)
        }
        break
      case 'send-to-back':
        if (canvasStore.contextMenu.elementId) {
          canvasStore.sendToBack(canvasStore.contextMenu.elementId)
        }
        break
    }
  } catch (error) {
    console.error('Failed to create element:', error)
  }
}

// Text editing
function handleTextEditBlur() {
  if (canvasStore.editingElementId) {
    const element = canvasStore.getElementById(canvasStore.editingElementId) as TextElement
    if (element) {
      element.setText(editingText.value)
    }
  }
  canvasStore.stopTextEditing()
}

function handleTextEditKeydown(e: KeyboardEvent) {
  // Stop propagation to prevent global keyboard shortcuts
  e.stopPropagation()

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleTextEditBlur()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    canvasStore.stopTextEditing()
  }
  // Allow all other keys (including Delete, Backspace) to work normally for text editing
}

// Note: Keyboard shortcuts are handled by the Toolbar component

// Lifecycle
onMounted(() => {
  // Handle window resize
  const handleResize = () => {
    if (stageRef.value && containerRef.value) {
      const stage = stageRef.value.getNode?.() || stageRef.value
      if (stage?.size) {
        stage.size({
          width: containerRef.value.clientWidth,
          height: containerRef.value.clientHeight,
        })
      }
    }
  }

  window.addEventListener('resize', handleResize)

  // Handle clicks outside context menu
  const handleClickOutside = (e: MouseEvent) => {
    if (canvasStore.contextMenu.visible) {
      canvasStore.hideContextMenu()
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('click', handleClickOutside)
  })
})

// Watch for transformer updates
watch(
  () => canvasStore.selectedElementIds,
  () => {
    nextTick(() => {
      updateTransformer()
    })
  },
  { deep: true },
)

function updateTransformer() {
  if (!transformerRef.value || !canvasStore.hasSelection || canvasStore.isTextEditing) {
    return
  }

  try {
    const transformer = transformerRef.value.getNode?.() || transformerRef.value
    if (transformer && typeof transformer.nodes === 'function') {
      const selectedNodes = getSelectedNodes()
      if (selectedNodes.length > 0) {
        transformer.nodes(selectedNodes)
      }
    }
  } catch (error) {
    console.warn('Error updating transformer:', error)
  }
}
</script>

<style scoped>
.canvas-editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 1px solid #f1f3f4;
}

.context-menu-item:last-child {
  border-bottom: none;
}

.context-menu-item:hover {
  background: #f1f3f4;
}

.context-menu-item .icon {
  width: 16px;
  text-align: center;
}

.context-menu-divider {
  margin: 4px 0;
  border: none;
  border-top: 1px solid #e9ecef;
}

.text-edit-overlay {
  pointer-events: none;
}

.text-edit-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  pointer-events: auto;
  padding: 0;
  margin: 0;
  font-weight: inherit;
  text-align: inherit;
  line-height: inherit;
}
</style>
