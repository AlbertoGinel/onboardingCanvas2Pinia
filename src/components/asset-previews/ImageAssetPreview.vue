<template>
  <div class="image-asset-preview-container">
    <img
      :src="asset.preview"
      :alt="asset.name"
      class="image-asset-preview"
      :style="computedStyle"
      :class="props.asset.renderData?.cssClass"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <div v-if="isLoading" class="image-loading">
      <div class="loading-spinner"></div>
    </div>
    <div v-if="hasError" class="image-error">
      <span class="error-icon">🖼️</span>
      <span class="error-text">Failed to load</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AssetTemplate } from '../../services/asset-service-interface'

const props = defineProps<{
  asset: AssetTemplate
}>()

const isLoading = ref(true)
const hasError = ref(false)

const computedStyle = computed(() => ({
  ...props.asset.renderData?.style,
  // Image-specific styles
  objectFit: (props.asset.renderData?.style?.objectFit as 'cover' | 'contain' | 'fill') || 'cover',
  borderRadius: props.asset.renderData?.style?.borderRadius || '6px',
}))

function handleImageLoad() {
  isLoading.value = false
  hasError.value = false
}

function handleImageError() {
  isLoading.value = false
  hasError.value = true
}
</script>

<style scoped>
.image-asset-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  transition: all 0.2s;
}

.image-asset-preview-container:hover {
  border-color: #3498db;
  transform: scale(1.02);
}

.image-asset-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s;
}

.image-loading,
.image-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  flex-direction: column;
  gap: 8px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e9ecef;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon {
  font-size: 24px;
  opacity: 0.5;
}

.error-text {
  font-size: 12px;
  color: #6c757d;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Style variations */
.image-asset-preview.rounded {
  border-radius: 50%;
}

.image-asset-preview.polaroid {
  border: 8px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
