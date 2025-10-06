<template>
  <div class="shape-asset-preview" :style="computedStyle" :class="props.asset.renderData?.cssClass">
    <div class="shape-icon">
      {{ asset.preview }}
    </div>
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
  // Default shape preview styles
  backgroundColor: props.asset.renderData?.style?.backgroundColor || '#f8f9fa',
  borderColor: props.asset.renderData?.style?.borderColor || '#dee2e6',
  borderWidth: props.asset.renderData?.style?.borderWidth || '1px',
  borderStyle: 'solid',
  borderRadius: props.asset.renderData?.style?.borderRadius || '6px',
  color: props.asset.renderData?.style?.color || '#495057',
}))
</script>

<style scoped>
.shape-asset-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.shape-asset-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shape-icon {
  font-size: 28px;
  transition: all 0.2s;
  user-select: none;
}

.shape-asset-preview:hover .shape-icon {
  transform: scale(1.1);
}

/* Shape style variations */
.shape-asset-preview.filled {
  background: linear-gradient(
    135deg,
    var(--shape-color, #3498db),
    var(--shape-color-dark, #2980b9)
  );
  border: none;
}

.shape-asset-preview.filled .shape-icon {
  color: white;
}

.shape-asset-preview.outline {
  background: transparent;
  border-width: 2px;
}

.shape-asset-preview.rounded {
  border-radius: 50%;
}

.shape-asset-preview.square {
  border-radius: 0;
}

.shape-asset-preview.soft-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Color variations that can be set via CSS custom properties */
.shape-asset-preview.blue {
  --shape-color: #3498db;
  --shape-color-dark: #2980b9;
}

.shape-asset-preview.red {
  --shape-color: #e74c3c;
  --shape-color-dark: #c0392b;
}

.shape-asset-preview.green {
  --shape-color: #2ecc71;
  --shape-color-dark: #27ae60;
}

.shape-asset-preview.orange {
  --shape-color: #f39c12;
  --shape-color-dark: #e67e22;
}

.shape-asset-preview.purple {
  --shape-color: #9b59b6;
  --shape-color-dark: #8e44ad;
}

.shape-asset-preview.yellow {
  --shape-color: #f1c40f;
  --shape-color-dark: #f39c12;
}
</style>
