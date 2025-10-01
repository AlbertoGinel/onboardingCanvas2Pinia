<template>
  <div class="control-item" :class="`control-${control.type}`">
    <!-- Input Controls -->
    <div v-if="control.type === 'input'" class="input-control">
      <label :for="control.id" class="control-label">
        <span v-if="control.icon" class="control-icon">{{ control.icon }}</span>
        {{ control.label }}
      </label>
      <input
        :id="control.id"
        :type="control.config.type || 'text'"
        :value="control.value"
        :min="control.config.min"
        :max="control.config.max"
        :step="control.config.step"
        :placeholder="control.config.placeholder"
        :maxlength="control.config.maxLength"
        :disabled="control.disabled"
        @input="handleChange"
        class="control-input"
      />
    </div>

    <!-- Slider Controls -->
    <div v-else-if="control.type === 'slider'" class="slider-control">
      <label class="control-label">
        <span v-if="control.icon" class="control-icon">{{ control.icon }}</span>
        {{ control.label }}
        <span class="control-value">{{ formatSliderValue(control.value) }}</span>
      </label>
      <input
        type="range"
        :value="control.value"
        :min="control.config.min || 0"
        :max="control.config.max || 100"
        :step="control.config.step || 1"
        :disabled="control.disabled"
        @input="handleChange"
        class="control-slider"
      />
    </div>

    <!-- Color Controls -->
    <div v-else-if="control.type === 'color'" class="color-control">
      <label class="control-label">
        <span v-if="control.icon" class="control-icon">{{ control.icon }}</span>
        {{ control.label }}
      </label>
      <div class="color-input-wrapper">
        <input
          type="color"
          :value="control.value"
          :disabled="control.disabled"
          @input="handleChange"
          class="control-color"
        />
        <input
          type="text"
          :value="control.value"
          :disabled="control.disabled"
          @input="handleChange"
          class="control-color-text"
          placeholder="#000000"
        />
      </div>
    </div>

    <!-- Select Controls -->
    <div v-else-if="control.type === 'select'" class="select-control">
      <label class="control-label">
        <span v-if="control.icon" class="control-icon">{{ control.icon }}</span>
        {{ control.label }}
      </label>
      <select
        :value="control.value"
        :disabled="control.disabled"
        @change="handleChange"
        class="control-select"
      >
        <option v-for="option in control.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Toggle Controls -->
    <div v-else-if="control.type === 'toggle'" class="toggle-control">
      <label class="control-label toggle-label">
        <input
          type="checkbox"
          :checked="Boolean(control.value)"
          :disabled="control.disabled"
          @change="handleToggle"
          class="control-checkbox"
        />
        <span class="toggle-slider"></span>
        <span v-if="control.icon" class="control-icon">{{ control.icon }}</span>
        {{ control.label }}
      </label>
    </div>

    <!-- Button Controls -->
    <div v-else-if="control.type === 'button'" class="button-control">
      <button :disabled="control.disabled" @click="handleButtonClick" class="control-button">
        <span v-if="control.icon" class="control-icon">{{ control.icon }}</span>
        {{ control.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RenderedControl } from '../controls/controlRenderer'

const props = defineProps<{
  control: RenderedControl
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  let value: string | number | boolean = target.value

  // Convert to appropriate type based on control config
  if (props.control.config.type === 'number' || props.control.type === 'slider') {
    value = parseFloat(target.value) || 0
  }

  props.control.onChange(value)
}

function handleToggle(event: Event) {
  const target = event.target as HTMLInputElement
  props.control.onChange(target.checked)
}

function handleButtonClick() {
  props.control.onChange('')
}

function formatSliderValue(value: string | number | boolean): string {
  if (typeof value === 'number') {
    // Format based on the step size
    const step = props.control.config.step || 1
    if (step < 1) {
      return value.toFixed(2)
    }
    return Math.round(value).toString()
  }
  return String(value)
}
</script>

<style scoped>
.control-item {
  margin-bottom: 12px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 4px;
}

.control-icon {
  font-size: 12px;
}

.control-value {
  margin-left: auto;
  font-size: 10px;
  color: #6c757d;
}

/* Input Controls */
.control-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 11px;
  background: #ffffff;
}

.control-input:focus {
  outline: none;
  border-color: #3498db;
}

/* Slider Controls */
.control-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.control-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}

.control-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
  border: none;
}

/* Color Controls */
.color-input-wrapper {
  display: flex;
  gap: 4px;
  align-items: center;
}

.control-color {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-color-text {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
}

/* Select Controls */
.control-select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 11px;
  background: #ffffff;
}

.control-select:focus {
  outline: none;
  border-color: #3498db;
}

/* Toggle Controls */
.toggle-label {
  cursor: pointer;
  user-select: none;
}

.control-checkbox {
  display: none;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 16px;
  background: #ccc;
  border-radius: 16px;
  transition: background 0.2s;
  margin-right: 8px;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.control-checkbox:checked + .toggle-slider {
  background: #3498db;
}

.control-checkbox:checked + .toggle-slider:before {
  transform: translateX(16px);
}

/* Button Controls */
.control-button {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s;
}

.control-button:hover {
  background: #f8f9fa;
  border-color: #3498db;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
