<template>
  <div class="base-control" ref="controlRef">
    <!-- Minimal icon button -->
    <div
      class="control-icon-btn"
      :class="{ active: isExpanded }"
      @click.stop="toggleTooltip"
      :title="control.label"
    >
      {{ control.icon }}
    </div>

    <!-- Tooltip with specific control component -->
    <div v-if="isExpanded" class="control-tooltip" @click.stop>
      <div class="tooltip-header">
        <span class="tooltip-title">{{ control.label }}</span>
        <button @click="closeTooltip" class="tooltip-close">×</button>
      </div>

      <div class="tooltip-content">
        <!-- Dynamic control component based on type -->
        <component
          :is="getControlComponent()"
          :control="control"
          :element="element"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ControlFunction } from './controlFunctions'
import type { AnyCanvasElement } from '../models'

// Import control components
import SliderControl from './control-components/SliderControl.vue'
import ColorControl from './control-components/ColorControl.vue'
import ToggleControl from './control-components/ToggleControl.vue'

const props = defineProps<{
  control: ControlFunction
  element: AnyCanvasElement
  disabled?: boolean
}>()

const isExpanded = ref(false)
const controlRef = ref<HTMLElement>()

// Component mapping
const componentMap = {
  slider: SliderControl,
  color: ColorControl,
  toggle: ToggleControl,
}

function getControlComponent() {
  return componentMap[props.control.type as keyof typeof componentMap] || SliderControl
}

function toggleTooltip() {
  isExpanded.value = !isExpanded.value
}

function closeTooltip() {
  isExpanded.value = false
}

function handleChange(value: string | number | boolean) {
  if (props.disabled) return
  props.control.setValue(props.element, value)
}

// Click outside to close
function handleClickOutside(event: Event) {
  if (!isExpanded.value) return

  const target = event.target as HTMLElement
  if (controlRef.value && !controlRef.value.contains(target)) {
    closeTooltip()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.base-control {
  position: relative;
  display: inline-block;
}

.control-icon-btn {
  width: 32px;
  height: 32px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  user-select: none;
}

.control-icon-btn:hover {
  background: #e9ecef;
  border-color: #3498db;
  transform: translateY(-1px);
}

.control-icon-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.control-tooltip {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  z-index: 1000;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f1f3f4;
}

.tooltip-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.tooltip-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.tooltip-close:hover {
  background: #f8f9fa;
  color: #495057;
}

.tooltip-content {
  padding: 12px 16px 16px;
}

.tooltip-slider-input {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  outline: none;
  background: #e2e8f0;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.tooltip-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.tooltip-slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.minimal-control-icon:hover {
  background: #f1f5f9;
  transform: scale(1.05);
}

.minimal-control-icon:active {
  transform: scale(0.95);
}

.control-icon {
  font-size: 16px;
  color: #374151;
  transition: color 0.2s;
}

.minimal-control-icon:hover .control-icon {
  color: #1f2937;
}
</style>
