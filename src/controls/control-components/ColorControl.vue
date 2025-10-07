<template>
  <BaseControl :control="control" :element="element" :disabled="disabled">
    <template #default="{ value, onChange }">
      <div class="color-container">
        <div
          class="color-preview"
          :style="{ backgroundColor: String(value) }"
          @click="showColorPicker = !showColorPicker"
          :title="String(value)"
        />

        <input
          v-show="showColorPicker"
          type="color"
          :value="String(value)"
          @input="onChange(($event.target as HTMLInputElement)?.value || '#000000')"
          class="color-picker"
        />

        <input
          type="text"
          :value="String(value)"
          @input="onChange(($event.target as HTMLInputElement)?.value || '#000000')"
          class="color-input"
          placeholder="#000000"
          maxlength="7"
        />
      </div>
    </template>
  </BaseControl>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseControl from '../BaseControl.vue'
import type { ControlFunction } from '../controlFunctions'
import type { AnyCanvasElement } from '../../models'

defineProps<{
  control: ControlFunction
  element: AnyCanvasElement
  disabled?: boolean
}>()

const showColorPicker = ref(false)
</script>

<style scoped>
.color-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.color-preview:hover {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.color-picker {
  width: 40px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
  padding: 0;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 4px;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  background: #ffffff;
}

.color-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.color-input::placeholder {
  color: #9ca3af;
}
</style>
