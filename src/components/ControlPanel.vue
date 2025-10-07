<template>
  <div class="control-panel">
    <div v-if="selectedElement" class="element-controls">
      <!-- Minimal icon controls for selected element -->
      <BaseControl
        v-for="controlConfig in availableControls"
        :key="controlConfig.id"
        :control="controlConfig.control"
        :element="selectedElement"
      />
    </div>

    <div v-else class="no-selection">
      <span class="no-selection-text">Select an element to view controls</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores'
import { assetServiceRegistry } from '../services'
import BaseControl from '../controls/BaseControl.vue'
import type { ControlFunction } from '../controls/controlFunctions'

const canvasStore = useCanvasStore()

// Get selected element
const selectedElement = computed(() => {
  if (canvasStore.selectedElements.length === 1) {
    return canvasStore.selectedElements[0]
  }
  return null
})

// Get service for selected element
const currentService = computed(() => {
  if (!selectedElement.value) return null

  const serviceMap: Record<string, string> = {
    TextElement: 'text',
    ImageElement: 'images',
    ButtonElement: 'buttons',
    ShapeElement: 'shapes',
  }

  const elementType = selectedElement.value.constructor.name
  const serviceName = serviceMap[elementType] || 'images'

  return assetServiceRegistry.getService(serviceName)
})

// Get controls from service
const availableControls = computed(() => {
  if (!currentService.value || !selectedElement.value) return []

  const controlList = currentService.value.getControlList?.() || []
  const controlConfigs = currentService.value.getControlConfigurations?.() || {}

  return controlList.map((controlId) => {
    const controlConfig = controlConfigs[controlId] || {}
    return {
      id: controlId,
      control: {
        id: controlId,
        type: controlConfig.type || 'slider',
        label: controlConfig.label || controlId,
        icon: controlConfig.icon || '⚙️',
        hasMenu: controlConfig.hasMenu !== false,
        getValue: controlConfig.getValue || (() => 0),
        setValue: controlConfig.setValue || (() => {}),
        getConfig: controlConfig.getConfig || (() => ({ min: 0, max: 100, step: 1 })),
        ...controlConfig,
      } as ControlFunction,
    }
  })
})
</script>

<style scoped>
.control-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  min-height: 48px;
}

.element-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.no-selection {
  color: #6c757d;
  font-size: 14px;
}

.no-selection-text {
  font-style: italic;
}
</style>
