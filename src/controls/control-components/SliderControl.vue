<template>
  <div class="slider-control">
    <div class="slider-container">
      <input
        type="range"
        :min="config.min || 0"
        :max="config.max || 100"
        :step="config.step || 1"
        :value="currentValue"
        @input="handleChange"
        class="slider"
      />
      <div class="value-display">{{ formatValue(currentValue) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AnyCanvasElement } from '../../models'
import type { ControlFunction } from '../controlFunctions'

const props = defineProps<{
  control: ControlFunction
  element: AnyCanvasElement
}>()

const emit = defineEmits<{
  change: [value: number]
}>()

const config = computed(() => props.control.getConfig?.() || { min: 0, max: 100, step: 1 })
const currentValue = computed(() => {
  const value = props.control.getValue(props.element) || 0
  return typeof value === 'number' ? value : parseFloat(String(value)) || 0
})

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  props.control.setValue(props.element, value)
  emit('change', value)
}

function formatValue(value: number): string {
  const step = config.value.step || 1
  return step < 1 ? value.toFixed(2) : Math.round(value).toString()
}
</script>

<style scoped>
.slider-control {
  width: 100%;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.value-display {
  min-width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.slider::-moz-range-track {
  background: #e2e8f0;
  height: 6px;
  border-radius: 3px;
  border: none;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.number-input {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  background: #ffffff;
}

.number-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>
