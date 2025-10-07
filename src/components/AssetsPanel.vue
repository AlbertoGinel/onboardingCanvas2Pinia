<template>
  <div class="options-panel">
    <div class="panel-header">
      <h3>{{ panelTitle }}</h3>
    </div>

    <div class="panel-content">
      <!-- Universal Asset Grid - works with ANY asset type -->
      <div v-if="currentService && currentAssets.length > 0" class="asset-library">
        <h4>{{ panelTitle }} Library</h4>

        <!-- Search/Filter (if service supports it) -->
        <div v-if="currentService.filterAssets" class="search-section">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search assets..."
            class="search-input"
          />
        </div>

        <!-- Dynamic Asset Grid -->
        <div
          class="asset-grid"
          :class="renderConfig?.cssClasses"
          :style="{
            gridTemplateColumns: `repeat(${renderConfig?.gridColumns || 2}, 1fr)`,
            gap: '8px',
            ...renderConfig?.customStyles,
          }"
        >
          <component
            v-for="asset in filteredAssets"
            :key="asset.id"
            :is="previewComponent"
            :asset="asset"
            @click="handleAssetSelect(asset)"
            :style="{ height: renderConfig?.itemHeight || 'auto' }"
          />
        </div>
      </div>

      <!-- Special upload section for images -->
      <div v-if="activePanel === 'images'" class="upload-section">
        <h4>Upload Images</h4>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleImageUpload"
          style="display: none"
        />
        <button class="upload-btn" @click="fileInput?.click()">
          <span class="icon">⬆️</span>
          <span>Upload Images</span>
        </button>
      </div>

      <!-- No service found message -->
      <div v-else-if="!currentService" class="no-service">
        <p>No assets available for {{ activePanel }}</p>
      </div>

      <!-- No assets in service -->
      <div v-else class="no-assets">
        <p>No {{ activePanel }} assets available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useCanvasStore } from '../stores'
import { assetServiceRegistry, imageService } from '../services'
import type { AssetTemplate } from '../services/asset-service-interface'

// Dynamic component imports
const componentMap = {
  TextAssetPreview: defineAsyncComponent(() => import('./asset-previews/TextAssetPreview.vue')),
  ImageAssetPreview: defineAsyncComponent(() => import('./asset-previews/ImageAssetPreview.vue')),
  ButtonAssetPreview: defineAsyncComponent(() => import('./asset-previews/ButtonAssetPreview.vue')),
  ShapeAssetPreview: defineAsyncComponent(() => import('./asset-previews/ShapeAssetPreview.vue')),
}

// Props
const props = defineProps<{
  activePanel: string
}>()

const canvasStore = useCanvasStore()
const fileInput = ref<HTMLInputElement>()
const searchQuery = ref('')

// Get current service based on active panel
const currentService = computed(() => assetServiceRegistry.getService(props.activePanel))

// Get current assets from the active service
const currentAssets = computed(() => currentService.value?.assets.value || [])

// Filtered assets based on search query
const filteredAssets = computed(() => {
  if (!searchQuery.value || !currentService.value?.filterAssets) {
    return currentAssets.value
  }
  return currentService.value.filterAssets(searchQuery.value)
})

// Get render configuration from current service
const renderConfig = computed(() => currentService.value?.getRenderConfig())

// Get dynamic component for current service
const previewComponent = computed(() => {
  if (!renderConfig.value) return null
  return componentMap[renderConfig.value.previewComponent as keyof typeof componentMap]
})

// Get panel title from current service
const panelTitle = computed(() => currentService.value?.getDisplayName() || 'Options')

// Universal asset selection handler - works with ANY asset type!
async function handleAssetSelect(asset: AssetTemplate) {
  if (!currentService.value) return

  try {
    // Use the service to create a canvas element
    const { element } = await currentService.value.createCanvasElement(asset, { x: 100, y: 100 })

    // Add to canvas store
    canvasStore.addElement(element)

    console.log(`✅ Added ${asset.name} to canvas`)
  } catch (error) {
    console.error('Failed to add asset to canvas:', error)
  }
}

// Image upload handler (special case for images)
async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    try {
      for (const file of Array.from(target.files)) {
        // Add to image service pool
        const imageAsset = await imageService.addUploadedImage(file)
        console.log('Image uploaded and added to pool:', imageAsset)

        // Optionally auto-add to canvas after upload
        // const assetTemplate = currentAssets.value.find(a => a.id === imageAsset.id)
        // if (assetTemplate) handleAssetSelect(assetTemplate)
      }

      // Clear the input
      target.value = ''
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }
}
</script>

<style scoped>
.options-panel {
  width: 240px;
  background: #fafafa;
  border-right: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Base modular asset grid - configured by services */
.asset-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
}

/* Image-specific styling - MASONRY GRID! 🎨 */
.asset-grid.image-assets-grid.masonry-grid {
  /* CSS Grid masonry layout */
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(60px, auto); /* Minimum row height with auto expansion */
  grid-auto-flow: row dense; /* Pack items tightly */
  align-items: start;
  gap: var(--masonry-gap, 12px);

  /* Better spacing and visual flow */
  padding: 4px;
}

/* Masonry item styling with enhanced visuals */
.asset-grid.masonry-grid .image-asset-preview-container {
  transition: var(--masonry-transition);
  border-radius: var(--masonry-border-radius);
  box-shadow: var(--masonry-shadow);
  overflow: hidden;

  /* Ensure items fit their content */
  display: flex;
  flex-direction: column;

  /* Beautiful subtle border */
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.asset-grid.masonry-grid .image-asset-preview-container:hover {
  transform: scale(var(--masonry-hover-scale, 1.03)) translateZ(0);
  box-shadow: var(--masonry-hover-shadow);
  border-color: #3498db;
  z-index: 10; /* Bring hovered item to front */
}

/* Responsive masonry adjustments */
@media (max-width: 400px) {
  .asset-grid.image-assets-grid.masonry-grid {
    grid-template-columns: 1fr; /* Single column on very small screens */
  }
}

/* Legacy grids for backward compatibility */
.template-grid,
.image-grid,
.shape-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.template-item,
.image-item,
.shape-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
  background: #ffffff;
}

.template-item:hover,
.image-item:hover,
.shape-item:hover {
  border-color: #3498db;
  transform: scale(1.02);
}

.template-preview {
  padding: 12px;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-preview {
  margin: 12px;
  text-align: center;
  cursor: pointer;
}

.shape-preview {
  padding: 16px;
  text-align: center;
  font-size: 24px;
}

.template-name,
.shape-name {
  display: block;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #495057;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.image-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
}

.image-info {
  padding: 6px 8px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.image-title {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-category {
  font-size: 10px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.upload-section {
  margin-top: 24px;
}

.upload-btn {
  width: 100%;
  padding: 12px;
  border: 2px dashed #ccc;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6c757d;
  transition: all 0.2s;
}

.upload-btn:hover {
  border-color: #3498db;
  color: #3498db;
}

h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}
</style>
