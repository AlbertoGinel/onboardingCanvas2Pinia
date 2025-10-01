<template>
  <div class="options-panel">
    <div class="panel-header">
      <h3>{{ getPanelTitle() }}</h3>
    </div>

    <div class="panel-content">
      <!-- Text Templates Panel -->
      <div v-if="activePanel === 'text'" class="text-panel">
        <div class="text-templates">
          <h4>Text Templates</h4>
          <div class="template-grid">
            <div
              v-for="template in textTemplates"
              :key="template.id"
              class="template-item"
              @click="addTextFromTemplate(template)"
            >
              <div class="template-preview" :style="template.style">
                {{ template.preview }}
              </div>
              <span class="template-name">{{ template.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Images Panel -->
      <div v-else-if="activePanel === 'images'" class="images-panel">
        <div class="image-library">
          <h4>Image Library</h4>
          <div class="image-grid">
            <div
              v-for="image in imagePool"
              :key="image.id"
              class="image-item"
              @click="selectImageFromPool(image)"
              :title="image.title"
            >
              <img :src="image.src" :alt="image.title" />
              <div class="image-info">
                <span class="image-title">{{ image.title }}</span>
                <span class="image-category">{{ image.category }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="upload-section">
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
      </div>

      <!-- Buttons Panel -->
      <div v-else-if="activePanel === 'buttons'" class="buttons-panel">
        <div class="button-templates">
          <h4>Button Templates</h4>
          <div class="template-grid">
            <div
              v-for="template in buttonTemplates"
              :key="template.id"
              class="template-item"
              @click="addButtonFromTemplate(template)"
            >
              <div class="button-preview" :style="template.style">
                {{ template.text }}
              </div>
              <span class="template-name">{{ template.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Shapes Panel -->
      <div v-else-if="activePanel === 'shapes'" class="shapes-panel">
        <div class="shape-library">
          <h4>Basic Shapes</h4>
          <div class="shape-grid">
            <div
              v-for="shape in basicShapes"
              :key="shape.id"
              class="shape-item"
              @click="addShapeToCanvas(shape)"
            >
              <div class="shape-preview" :style="{ color: shape.color }">
                {{ shape.icon }}
              </div>
              <span class="shape-name">{{ shape.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '../stores'
import { imageService } from '../services/imageService'
import type { ImageAsset } from '../services/imageService'

// Props
const props = defineProps<{
  activePanel: string
}>()

const canvasStore = useCanvasStore()
const fileInput = ref<HTMLInputElement>()

// Get image pool from service
const imagePool = imageService.getImagePool()

// Panel title based on active panel
function getPanelTitle(): string {
  switch (props.activePanel) {
    case 'text':
      return 'Text'
    case 'images':
      return 'Images'
    case 'buttons':
      return 'Buttons'
    case 'shapes':
      return 'Shapes'
    default:
      return 'Options'
  }
}

// Text Templates
const textTemplates = ref<TextTemplate[]>([
  {
    id: 1,
    name: 'Heading',
    preview: 'Heading',
    style: { fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' },
    fontSize: 32,
    fontWeight: 'bold',
    text: 'Your Heading Here',
  },
  {
    id: 2,
    name: 'Subheading',
    preview: 'Subheading',
    style: { fontSize: '18px', fontWeight: '500', color: '#34495e' },
    fontSize: 24,
    fontWeight: '500',
    text: 'Your Subheading',
  },
  {
    id: 3,
    name: 'Body Text',
    preview: 'Body Text',
    style: { fontSize: '14px', fontWeight: 'normal', color: '#555' },
    fontSize: 16,
    fontWeight: 'normal',
    text: 'Your body text here',
  },
  {
    id: 4,
    name: 'Quote',
    preview: '"Quote"',
    style: { fontSize: '16px', fontStyle: 'italic', color: '#7f8c8d' },
    fontSize: 18,
    fontStyle: 'italic',
    text: '"Your inspiring quote here"',
  },
])

// Button Templates
const buttonTemplates = ref<ButtonTemplate[]>([
  {
    id: 1,
    name: 'Primary',
    text: 'Click Me',
    style: {
      background: '#3498db',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
    },
  },
  {
    id: 2,
    name: 'Secondary',
    text: 'Button',
    style: {
      background: '#95a5a6',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
    },
  },
  {
    id: 3,
    name: 'Success',
    text: 'Success',
    style: {
      background: '#27ae60',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
    },
  },
  {
    id: 4,
    name: 'Outline',
    text: 'Outline',
    style: {
      background: 'transparent',
      color: '#3498db',
      padding: '8px 16px',
      borderRadius: '6px',
      border: '2px solid #3498db',
      fontSize: '14px',
    },
  },
])

// Basic Shapes
const basicShapes = ref<Shape[]>([
  { id: 1, name: 'Circle', icon: '●', color: '#e74c3c' },
  { id: 2, name: 'Square', icon: '■', color: '#3498db' },
  { id: 3, name: 'Triangle', icon: '▲', color: '#f39c12' },
  { id: 4, name: 'Diamond', icon: '♦', color: '#9b59b6' },
  { id: 5, name: 'Star', icon: '⭐', color: '#f1c40f' },
  { id: 6, name: 'Heart', icon: '❤️', color: '#e91e63' },
])

// Types
interface TextTemplate {
  id: number
  name: string
  preview: string
  style: Record<string, string>
  fontSize: number
  fontWeight?: string
  text: string
  fontStyle?: string
}

interface ButtonTemplate {
  id: number
  name: string
  text: string
  style: Record<string, string>
}

interface Shape {
  id: number
  name: string
  icon: string
  color: string
}

// Actions
function addTextFromTemplate(template: TextTemplate) {
  canvasStore.createTextElement()
  // Apply template properties when element creation is updated
  console.log('Adding text from template:', template.name)
}

// Image Actions using Image Service
function selectImageFromPool(imageAsset: ImageAsset) {
  // Create image element from the image pool - this will center it on canvas
  console.log('Selecting image from pool:', imageAsset.title, imageAsset.id)
  canvasStore.createImageElement(imageAsset.id)
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    try {
      for (const file of Array.from(target.files)) {
        // Add to image service pool
        const imageAsset = await imageService.addUploadedImage(file)
        console.log('Image uploaded and added to pool:', imageAsset)

        // Optionally auto-add to canvas
        // canvasStore.createImageElement(imageAsset.id)
      }

      // Clear the input
      target.value = ''
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }
}

function addButtonFromTemplate(template: ButtonTemplate) {
  canvasStore.createButtonElement()
  console.log('Adding button from template:', template.name)
}

function addShapeToCanvas(shape: Shape) {
  // For now, create as text element with shape icon
  console.log('Adding shape:', shape.name)
  canvasStore.createTextElement()
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
