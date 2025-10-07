<template>
  <div class="image-asset-preview-container" :class="masonryClasses" :style="masonryContainerStyle">
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

// Calculate masonry aspect ratio for dynamic heights
const aspectRatio = computed((): number => {
  const data = props.asset.data as { width?: number; height?: number }

  // If we have actual dimensions from preloaded image, use those
  if (data?.width && data?.height && data.height > 0) {
    return data.width / data.height
  }

  // Extract dimensions from Picsum URL if available
  // URL format: https://picsum.photos/id/X/WIDTH/HEIGHT
  const urlMatch = props.asset.preview.match(/\/(\d+)\/(\d+)(?:\?|$)/)
  if (urlMatch && urlMatch[1] && urlMatch[2]) {
    const width = parseInt(urlMatch[1], 10)
    const height = parseInt(urlMatch[2], 10)
    if (width > 0 && height > 0) {
      return width / height
    }
  }

  // Fallback to varied aspect ratios based on ID for visual variety
  const index = props.asset.id.charCodeAt(props.asset.id.length - 1) % 5
  const ratios = [1.33, 0.75, 1.0, 1.6, 0.9] // Landscape, portrait, square, wide, nearly square
  return ratios[index] || 1.0
})

// Masonry container styling based on aspect ratio
const masonryContainerStyle = computed(() => {
  const ratio = aspectRatio.value

  return {
    aspectRatio: ratio.toString(),
    // More nuanced grid row spanning based on aspect ratio
    gridRowEnd:
      ratio > 1.5
        ? 'span 1' // Very wide landscapes - short
        : ratio > 1.2
          ? 'span 2' // Wide landscapes - medium
          : ratio > 0.9
            ? 'span 2' // Square-ish - medium
            : ratio > 0.6
              ? 'span 3' // Portraits - tall
              : 'span 4', // Very tall portraits - very tall
  }
})

// CSS classes for masonry styling
const masonryClasses = computed(() => {
  const ratio = aspectRatio.value
  const classes = []

  if (ratio > 1.5) classes.push('masonry-very-wide')
  else if (ratio > 1.2) classes.push('masonry-wide')
  else if (ratio > 0.9) classes.push('masonry-square')
  else if (ratio > 0.6) classes.push('masonry-tall')
  else classes.push('masonry-very-tall')

  return classes
})

const computedStyle = computed(() => ({
  ...props.asset.renderData?.style,
  // Image-specific styles for masonry
  objectFit: 'cover' as const, // Always cover for masonry effect
  borderRadius: 'var(--masonry-border-radius, 12px)',
  width: '100%',
  height: '100%',
}))

function handleImageLoad(event: Event) {
  isLoading.value = false
  hasError.value = false

  // Extract actual dimensions from loaded image for better aspect ratio
  const img = event.target as HTMLImageElement
  if (img && img.naturalWidth && img.naturalHeight) {
    // Update the asset data with actual dimensions if not already set
    const data = props.asset.data as { width?: number; height?: number }
    if (!data.width || !data.height) {
      // Note: This is read-only in practice, but helps with future loads
      console.log(
        `📐 Image ${props.asset.id} actual dimensions: ${img.naturalWidth}x${img.naturalHeight}`,
      )
    }
  }
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
  border-radius: var(--masonry-border-radius, var(--image-preview-radius, 12px));
  overflow: hidden;
  border: 1px solid #e9ecef;
  transition: var(--masonry-transition, all 0.3s ease);
}

/* Masonry-specific height variations for natural aspect ratios */
.image-asset-preview-container.masonry-very-wide {
  /* Very wide landscapes - minimal height */
  min-height: 100px;
}

.image-asset-preview-container.masonry-wide {
  /* Wide landscapes - short height */
  min-height: 130px;
}

.image-asset-preview-container.masonry-square {
  /* Square-ish images - balanced height */
  min-height: 160px;
}

.image-asset-preview-container.masonry-tall {
  /* Portrait images - taller height */
  min-height: 200px;
}

.image-asset-preview-container.masonry-very-tall {
  /* Very tall portraits - maximum height */
  min-height: 250px;
}

.image-asset-preview-container:hover {
  border-color: #3498db;
  transform: scale(1.02);
}

.image-asset-preview {
  width: 100%;
  height: 100%;
  min-height: var(--image-preview-size, 100px);
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
