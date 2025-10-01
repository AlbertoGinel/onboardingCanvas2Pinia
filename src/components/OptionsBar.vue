<template>
  <div class="options-bar">
    <!-- Global actions (always visible) -->
    <div class="control-group global-actions">
      <button
        class="action-btn"
        @click="canvasStore.undo()"
        :disabled="!canvasStore.canUndo"
        title="Undo (Ctrl+Z)"
      >
        ↶
      </button>
      <button
        class="action-btn"
        @click="canvasStore.redo()"
        :disabled="!canvasStore.canRedo"
        title="Redo (Ctrl+Y)"
      >
        ↷
      </button>
      <div class="action-divider"></div>
      <button
        class="action-btn"
        @click="handleClearAll()"
        :disabled="canvasStore.elements.length === 0"
        title="Clear All Elements"
      >
        🧹
      </button>
    </div>

    <!-- Dynamic element controls -->
    <div v-if="selectedElement" class="control-group element-controls">
      <!-- Element info -->
      <div class="element-info">
        <span class="type-icon">{{ getElementIcon(selectedElement.type) }}</span>
        <span class="element-name">{{ getElementName(selectedElement) }}</span>
      </div>

      <!-- Dynamic controls from element -->
      <div class="dynamic-controls">
        <ControlComponent v-for="control in elementControls" :key="control.id" :control="control" />
      </div>

      <!-- Element actions -->
      <div class="element-actions">
        <button
          class="action-btn"
          @click="canvasStore.duplicateElement(selectedElement.id)"
          title="Duplicate (Ctrl+D)"
        >
          📋
        </button>
        <button
          class="action-btn"
          @click="canvasStore.removeElement(selectedElement.id)"
          title="Delete (Del)"
        >
          🗑️
        </button>
        <div class="action-divider"></div>
        <button
          class="action-btn"
          @click="canvasStore.bringToFront(selectedElement.id)"
          title="Bring to Front"
        >
          ⬆️
        </button>
        <button
          class="action-btn"
          @click="canvasStore.sendToBack(selectedElement.id)"
          title="Send to Back"
        >
          ⬇️
        </button>
      </div>
    </div>

    <!-- No selection message -->
    <div v-else class="no-selection-horizontal">
      <span class="message">Select an element to view properties</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores'
import type { AnyCanvasElement } from '../models'
import ControlComponent from './ControlComponent.vue'
import { ControlRenderer } from '../controls/controlRenderer'

const canvasStore = useCanvasStore()

const selectedElement = computed(() => {
  if (canvasStore.selectedElements.length === 1) {
    return canvasStore.selectedElements[0]
  }
  return null
})

const elementControls = computed(() => {
  if (!selectedElement.value) return []
  return ControlRenderer.renderAllControls(selectedElement.value)
})

function getElementIcon(type: string): string {
  switch (type) {
    case 'text':
      return '📝'
    case 'image':
      return '🖼️'
    case 'button':
      return '🔘'
    default:
      return '📄'
  }
}

function getElementName(element: AnyCanvasElement): string {
  switch (element.type) {
    case 'text':
      return 'Text'
    case 'image':
      return 'Image'
    case 'button':
      return 'Button'
    default:
      return 'Element'
  }
}

function handleClearAll() {
  if (confirm('Are you sure you want to clear all elements?')) {
    canvasStore.elements.length = 0
    canvasStore.clearSelection()
  }
}
</script>

<style scoped>
.options-bar {
  height: 48px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 24px;
  overflow-x: auto;
  border-bottom: 1px solid #e1e5e9;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.global-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 16px;
  border-right: 1px solid #e1e5e9;
}

.element-controls {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 24px;
  overflow-x: auto;
}

.element-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  flex-shrink: 0;
}

.dynamic-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  padding: 0 8px;
}

.element-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.type-icon {
  font-size: 16px;
}

.element-name {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.transform-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.input-group label {
  font-size: 10px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.compact-input {
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  background: #ffffff;
}

.compact-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.global-actions,
.element-actions,
.global-actions-only {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.global-actions-only {
  margin-left: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: #6c757d;
}

.action-btn:hover:not(:disabled) {
  background: #f8f9fa;
  color: #495057;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-divider {
  width: 1px;
  height: 20px;
  background: #e1e5e9;
  margin: 0 4px;
}

.no-selection-horizontal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #adb5bd;
  font-size: 14px;
}

.message {
  font-style: italic;
}
</style>
