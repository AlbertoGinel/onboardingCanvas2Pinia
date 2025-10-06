<template>
  <div class="text-asset-preview" :style="computedStyle" :class="props.asset.renderData?.cssClass">
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
  // Default text preview styles can be overridden
  fontFamily: props.asset.renderData?.style?.fontFamily || 'Arial, sans-serif',
  fontSize: props.asset.renderData?.style?.fontSize || '14px',
  fontWeight: props.asset.renderData?.style?.fontWeight || 'normal',
  color: props.asset.renderData?.style?.color || '#2c3e50',
}))
</script>

<style scoped>
.text-asset-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  height: 100%;
  border: 1px solid #e9ecef;
  transition: all 0.2s;
  overflow: hidden;
  word-break: break-word;
}

.text-asset-preview:hover {
  background: #e9ecef;
  border-color: #3498db;
}

/* Style variations that can be applied via cssClass */
.text-asset-preview.heading {
  font-weight: bold;
  font-size: 16px;
}

.text-asset-preview.quote {
  font-style: italic;
  background: #fff8e1;
  border-color: #ffb74d;
}

.text-asset-preview.display {
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
}
</style>
