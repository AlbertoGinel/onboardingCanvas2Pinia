<template>
  <BaseControl :control="control" :element="element" :disabled="disabled">
    <template #default="{ value, onChange }">
      <div class="toggle-container">
        <button
          @click="onChange(!Boolean(value))"
          :class="['toggle-button', { active: Boolean(value) }]"
          :disabled="disabled"
        >
          <span class="toggle-slider" />
          <span class="toggle-label">
            {{ Boolean(value) ? 'On' : 'Off' }}
          </span>
        </button>

        <span class="toggle-status">
          {{ Boolean(value) ? control.label + ' enabled' : control.label + ' disabled' }}
        </span>
      </div>
    </template>
  </BaseControl>
</template>

<script setup lang="ts">
import BaseControl from '../BaseControl.vue'
import type { ControlFunction } from '../controlFunctions'
import type { AnyCanvasElement } from '../../models'

defineProps<{
  control: ControlFunction
  element: AnyCanvasElement
  disabled?: boolean
}>()
</script>

<style scoped>
.toggle-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-button {
  position: relative;
  width: 48px;
  height: 24px;
  background: #e2e8f0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0;
}

.toggle-button:hover {
  background: #cbd5e1;
}

.toggle-button.active {
  background: #3b82f6;
}

.toggle-button.active:hover {
  background: #2563eb;
}

.toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-button.active .toggle-slider {
  transform: translateX(24px);
}

.toggle-label {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: transparent;
  user-select: none;
}

.toggle-status {
  font-size: 12px;
  color: #6b7280;
}

.toggle-button.active .toggle-status {
  color: #059669;
}
</style>
