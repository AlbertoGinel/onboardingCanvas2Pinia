<template>
  <div
    class="button-asset-preview"
    :style="computedStyle"
    :class="props.asset.renderData?.cssClass"
  >
    {{ asset.preview }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AssetTemplate } from '../../services/asset-service-interface'

const props = defineProps<{
  asset: AssetTemplate
}>()

const computedStyle = computed(() => ({
  ...props.asset.renderData?.style,
  // Default button preview styles
  backgroundColor: props.asset.renderData?.style?.backgroundColor || '#3498db',
  color: props.asset.renderData?.style?.color || 'white',
  borderRadius: props.asset.renderData?.style?.borderRadius || '6px',
  fontSize: props.asset.renderData?.style?.fontSize || '14px',
  fontWeight: props.asset.renderData?.style?.fontWeight || '500',
  border: props.asset.renderData?.style?.border || 'none',
  padding: props.asset.renderData?.style?.padding || '8px 16px',
}))
</script>

<style scoped>
.button-asset-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  font-family: Arial, sans-serif;
  text-decoration: none;
  outline: none;
  min-height: 36px;
}

.button-asset-preview:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.button-asset-preview:active {
  transform: translateY(0);
}

/* Button style variations */
.button-asset-preview.primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.button-asset-preview.secondary {
  background: transparent;
  border: 2px solid #6c757d;
  color: #6c757d;
}

.button-asset-preview.success {
  background: linear-gradient(135deg, #27ae60, #219a52);
}

.button-asset-preview.danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.button-asset-preview.warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: #2c3e50;
}

.button-asset-preview.outline {
  background: transparent;
  border: 2px solid currentColor;
}

.button-asset-preview.rounded {
  border-radius: 25px;
}

.button-asset-preview.large {
  padding: 12px 24px;
  font-size: 16px;
}

.button-asset-preview.small {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
