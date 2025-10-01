<template>
  <div class="toolbar">
    <!-- Tools Section -->
    <div class="toolbar-section">
      <h4 class="section-title">Tools</h4>
      <button
        v-for="tool in tools"
        :key="tool.id"
        :class="['toolbar-button', { active: activeTool === tool.id }]"
        @click="handleToolClick(tool.id)"
        :title="tool.title"
      >
        <span class="icon">{{ tool.icon }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '../stores'

const canvasStore = useCanvasStore()

const activeTool = ref('text')

const tools = [
  { id: 'text', icon: '📝', label: 'Text', title: 'Text Templates & Styles' },
  { id: 'images', icon: '🖼️', label: 'Images', title: 'Image Library & Upload' },
  { id: 'buttons', icon: '🔘', label: 'Buttons', title: 'Button Templates' },
  { id: 'shapes', icon: '🔷', label: 'Shapes', title: 'Basic Shapes & Graphics' },
]

// Make activeTool globally accessible by emitting it
const emit = defineEmits<{
  toolChanged: [toolId: string]
}>()

function handleToolClick(toolId: string) {
  activeTool.value = toolId
  emit('toolChanged', toolId)
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  // Don't process shortcuts if we're editing text
  if (canvasStore.isTextEditing) {
    return
  }

  // Don't process shortcuts if focus is on an input element
  const activeElement = document.activeElement
  if (
    activeElement &&
    (activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      (activeElement as HTMLElement).contentEditable === 'true')
  ) {
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
        selectedIds.forEach((id) => {
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
      case 't':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('text')
        }
        break
      case 'i':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('images')
        }
        break
      case 'b':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('buttons')
        }
        break
      case 's':
        if (!e.ctrlKey && !e.metaKey) {
          handleToolClick('shapes')
        }
        break
      case 'Escape':
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
  width: 60px;
  background: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.section-title {
  font-size: 10px;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center;
  writing-mode: vertical-lr;
  text-orientation: mixed;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #bdc3c7;
  transition: all 0.2s;
  position: relative;
}

.toolbar-button:hover {
  background: #34495e;
  color: #ecf0f1;
}

.toolbar-button.active {
  background: #3498db;
  color: white;
}

.toolbar-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.toolbar-button:disabled:hover {
  background: transparent;
  color: #bdc3c7;
}

.toolbar-button.small {
  width: 36px;
  height: 36px;
}

.icon {
  font-size: 20px;
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.zoom-level {
  font-size: 10px;
  color: #bdc3c7;
  text-align: center;
  margin: 4px 0;
}

/* Tooltip on hover */
.toolbar-button::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  margin-left: 8px;
  padding: 4px 8px;
  background: #2c3e50;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 1000;
}

.toolbar-button:hover::after {
  opacity: 1;
}
</style>
