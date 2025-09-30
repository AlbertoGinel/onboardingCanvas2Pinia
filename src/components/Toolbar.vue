<template>
  <div class="toolbar">
    <div class="toolbar-section">
      <button
        v-for="tool in tools"
        :key="tool.id"
        :class="['toolbar-button', { active: activeTool === tool.id }]"
        @click="handleToolClick(tool.id)"
        :title="tool.title"
      >
        <span class="icon">{{ tool.icon }}</span>
        <span class="label">{{ tool.label }}</span>
      </button>
    </div>
    
    <div class="toolbar-section">
      <button
        v-for="action in actions"
        :key="action.id"
        class="toolbar-button"
        @click="handleActionClick(action.id)"
        :title="action.title"
        :disabled="action.disabled"
      >
        <span class="icon">{{ action.icon }}</span>
        <span class="label">{{ action.label }}</span>
      </button>
    </div>
    
    <div class="toolbar-section">
      <div class="zoom-controls">
        <button class="toolbar-button small" @click="zoomOut" title="Zoom Out">
          <span class="icon">🔍➖</span>
        </button>
        <span class="zoom-level">{{ Math.round(canvasStore.settings.zoom * 100) }}%</span>
        <button class="toolbar-button small" @click="zoomIn" title="Zoom In">
          <span class="icon">🔍➕</span>
        </button>
        <button class="toolbar-button small" @click="resetZoom" title="Reset Zoom">
          <span class="icon">🎯</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCanvasStore } from '../stores'

const canvasStore = useCanvasStore()

const activeTool = ref('select')

const tools = [
  { id: 'select', icon: '🏹', label: 'Select', title: 'Select Tool (V)' },
  { id: 'text', icon: '📝', label: 'Text', title: 'Add Text (T)' },
  { id: 'image', icon: '🖼️', label: 'Image', title: 'Add Image (I)' },
  { id: 'button', icon: '🔘', label: 'Button', title: 'Add Button (B)' }
]

const actions = computed(() => [
  { 
    id: 'undo', 
    icon: '↶', 
    label: 'Undo', 
    title: 'Undo (Ctrl+Z)', 
    disabled: !canvasStore.canUndo 
  },
  { 
    id: 'redo', 
    icon: '↷', 
    label: 'Redo', 
    title: 'Redo (Ctrl+Y)', 
    disabled: !canvasStore.canRedo 
  },
  { 
    id: 'delete', 
    icon: '🗑️', 
    label: 'Delete', 
    title: 'Delete Selected (Del)', 
    disabled: !canvasStore.hasSelection 
  },
  { 
    id: 'duplicate', 
    icon: '📋', 
    label: 'Duplicate', 
    title: 'Duplicate Selected (Ctrl+D)', 
    disabled: !canvasStore.hasSelection 
  },
  { 
    id: 'clear', 
    icon: '🧹', 
    label: 'Clear All', 
    title: 'Clear All Elements', 
    disabled: canvasStore.elements.length === 0 
  }
])

function handleToolClick(toolId: string) {
  activeTool.value = toolId
  
  switch (toolId) {
    case 'select':
      // Default select tool - no action needed
      break
    case 'text':
      canvasStore.createTextElement()
      activeTool.value = 'select' // Return to select tool after creation
      break
    case 'image':
      // For now, add a placeholder image
      canvasStore.createImageElement('https://picsum.photos/200/200')
      activeTool.value = 'select'
      break
    case 'button':
      canvasStore.createButtonElement()
      activeTool.value = 'select'
      break
  }
}

function handleActionClick(actionId: string) {
  switch (actionId) {
    case 'undo':
      canvasStore.undo()
      break
    case 'redo':
      canvasStore.redo()
      break
    case 'delete':
      // Delete all selected elements
      const selectedIds = Array.from(canvasStore.selectedElementIds)
      canvasStore.removeElements(selectedIds)
      break
    case 'duplicate':
      // Duplicate all selected elements
      const elementsToDuplicate = Array.from(canvasStore.selectedElementIds)
      elementsToDuplicate.forEach(id => {
        canvasStore.duplicateElement(id)
      })
      break
    case 'clear':
      if (confirm('Are you sure you want to clear all elements?')) {
        canvasStore.elements.length = 0
        canvasStore.clearSelection()
      }
      break
  }
}

function zoomIn() {
  canvasStore.settings.zoom = Math.min(5, canvasStore.settings.zoom * 1.2)
}

function zoomOut() {
  canvasStore.settings.zoom = Math.max(0.1, canvasStore.settings.zoom / 1.2)
}

function resetZoom() {
  canvasStore.settings.zoom = 1
  canvasStore.settings.panX = 0
  canvasStore.settings.panY = 0
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  // Don't process shortcuts if we're editing text
  if (canvasStore.isTextEditing) {
    return
  }
  
  // Don't process shortcuts if focus is on an input element
  const activeElement = document.activeElement
  if (activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    (activeElement as HTMLElement).contentEditable === 'true'
  )) {
    return
  }
  
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'z':
        e.preventDefault()
        if (e.shiftKey) {
          canvasStore.redo()
        } else {
          canvasStore.undo()
        }
        break
      case 'y':
        e.preventDefault()
        canvasStore.redo()
        break
      case 'd':
        e.preventDefault()
        const selectedIds = Array.from(canvasStore.selectedElementIds)
        selectedIds.forEach(id => {
          canvasStore.duplicateElement(id)
        })
        break
      case 'a':
        e.preventDefault()
        canvasStore.selectAll()
        break
    }
  } else {
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        const selectedIds = Array.from(canvasStore.selectedElementIds)
        canvasStore.removeElements(selectedIds)
        break
      case 'v':
        if (!e.ctrlKey && !e.metaKey) {
          activeTool.value = 'select'
        }
        break
      case 't':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('text')
        }
        break
      case 'i':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('image')
        }
        break
      case 'b':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('button')
        }
        break
      case 'Escape':
        activeTool.value = 'select'
        canvasStore.clearSelection()
        break
    }
  }
}

// Add keyboard event listeners
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.5rem;
  border-left: 1px solid #e9ecef;
}

.toolbar-section:first-child {
  border-left: none;
  padding-left: 0;
}

.toolbar-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  min-width: 60px;
}

.toolbar-button:hover {
  background: #f8f9fa;
}

.toolbar-button.active {
  background: #007bff;
  color: white;
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-button:disabled:hover {
  background: transparent;
}

.toolbar-button.small {
  min-width: auto;
  padding: 0.25rem 0.5rem;
  flex-direction: row;
  gap: 0.25rem;
}

.toolbar-button .icon {
  font-size: 16px;
}

.toolbar-button .label {
  font-size: 11px;
  font-weight: 500;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-level {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  min-width: 40px;
  text-align: center;
}
</style>