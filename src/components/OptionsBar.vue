<template>
  <div class="options-bar">
    <div class="options-header">
      <h3>Properties</h3>
    </div>
    
    <div class="options-content">
      <!-- No selection state -->
      <div v-if="!canvasStore.hasSelection" class="no-selection">
        <p>Select an element to view its properties</p>
      </div>
      
      <!-- Multiple selection state -->
      <div v-else-if="canvasStore.selectedElements.length > 1" class="multiple-selection">
        <p>{{ canvasStore.selectedElements.length }} elements selected</p>
        
        <div class="option-group">
          <h4>Transform</h4>
          <button 
            class="option-button"
            @click="alignSelectedElements('left')"
          >
            Align Left
          </button>
          <button 
            class="option-button"
            @click="alignSelectedElements('center')"
          >
            Align Center
          </button>
          <button 
            class="option-button"
            @click="alignSelectedElements('right')"
          >
            Align Right
          </button>
        </div>
      </div>
      
      <!-- Single element selection -->
      <div v-else-if="selectedElement">
        <!-- Common properties for all elements -->
        <div class="option-group">
          <h4>Transform</h4>
          
          <div class="option-row">
            <label>X:</label>
            <input 
              type="number" 
              :value="Math.round(selectedElement.transform.x)"
              @change="updateTransform('x', $event)"
              class="option-input"
            />
          </div>
          
          <div class="option-row">
            <label>Y:</label>
            <input 
              type="number" 
              :value="Math.round(selectedElement.transform.y)"
              @change="updateTransform('y', $event)"
              class="option-input"
            />
          </div>
          
          <div class="option-row">
            <label>Width:</label>
            <input 
              type="number" 
              :value="Math.round(selectedElement.transform.width)"
              @change="updateTransform('width', $event)"
              class="option-input"
              min="1"
            />
          </div>
          
          <div class="option-row">
            <label>Height:</label>
            <input 
              type="number" 
              :value="Math.round(selectedElement.transform.height)"
              @change="updateTransform('height', $event)"
              class="option-input"
              min="1"
            />
          </div>
          
          <div class="option-row">
            <label>Rotation:</label>
            <input 
              type="number" 
              :value="Math.round(selectedElement.transform.rotation)"
              @change="updateTransform('rotation', $event)"
              class="option-input"
              step="1"
            />
          </div>
        </div>
        
        <div class="option-group">
          <h4>Appearance</h4>
          
          <div class="option-row">
            <label>Opacity:</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              :value="selectedElement.opacity"
              @input="updateProperty('opacity', parseFloat(($event.target as HTMLInputElement).value))"
              class="option-slider"
            />
            <span class="option-value">{{ Math.round(selectedElement.opacity * 100) }}%</span>
          </div>
          
          <div class="option-row">
            <label>
              <input 
                type="checkbox" 
                :checked="selectedElement.visible"
                @change="updateProperty('visible', ($event.target as HTMLInputElement).checked)"
              />
              Visible
            </label>
          </div>
          
          <div class="option-row">
            <label>
              <input 
                type="checkbox" 
                :checked="selectedElement.locked"
                @change="updateProperty('locked', ($event.target as HTMLInputElement).checked)"
              />
              Locked
            </label>
          </div>
        </div>
        
        <!-- Text element specific properties -->
        <template v-if="selectedElement.type === 'text'">
          <div class="option-group">
            <h4>Text</h4>
            
            <div class="option-row">
              <label>Content:</label>
              <textarea 
                :value="(selectedElement as TextElement).text"
                @input="updateTextProperty('text', ($event.target as HTMLTextAreaElement).value)"
                class="option-textarea"
                rows="3"
              />
            </div>
            
            <div class="option-row">
              <label>Font Size:</label>
              <input 
                type="number" 
                :value="(selectedElement as TextElement).style.fontSize"
                @change="updateTextStyle('fontSize', parseInt(($event.target as HTMLInputElement).value))"
                class="option-input"
                min="8"
                max="200"
              />
            </div>
            
            <div class="option-row">
              <label>Font Family:</label>
              <select 
                :value="(selectedElement as TextElement).style.fontFamily"
                @change="updateTextStyle('fontFamily', ($event.target as HTMLSelectElement).value)"
                class="option-select"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>
            
            <div class="option-row">
              <label>Color:</label>
              <input 
                type="color" 
                :value="(selectedElement as TextElement).style.fill"
                @change="updateTextStyle('fill', ($event.target as HTMLInputElement).value)"
                class="option-color"
              />
            </div>
            
            <div class="option-row">
              <label>Align:</label>
              <select 
                :value="(selectedElement as TextElement).style.align"
                @change="updateTextStyle('align', ($event.target as HTMLSelectElement).value)"
                class="option-select"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            
            <div class="option-row">
              <label>
                <input 
                  type="checkbox" 
                  :checked="(selectedElement as TextElement).style.fontWeight === 'bold'"
                  @change="updateTextStyle('fontWeight', ($event.target as HTMLInputElement).checked ? 'bold' : 'normal')"
                />
                Bold
              </label>
            </div>
            
            <div class="option-row">
              <label>
                <input 
                  type="checkbox" 
                  :checked="(selectedElement as TextElement).style.fontStyle === 'italic'"
                  @change="updateTextStyle('fontStyle', ($event.target as HTMLInputElement).checked ? 'italic' : 'normal')"
                />
                Italic
              </label>
            </div>
          </div>
        </template>
        
        <!-- Image element specific properties -->
        <template v-if="selectedElement.type === 'image'">
          <div class="option-group">
            <h4>Image</h4>
            
            <div class="option-row">
              <label>Source URL:</label>
              <input 
                type="url" 
                :value="(selectedElement as ImageElement).src"
                @change="updateImageProperty('src', ($event.target as HTMLInputElement).value)"
                class="option-input"
              />
            </div>
            
            <div class="option-row">
              <label>Alt Text:</label>
              <input 
                type="text" 
                :value="(selectedElement as ImageElement).alt"
                @change="updateImageProperty('alt', ($event.target as HTMLInputElement).value)"
                class="option-input"
              />
            </div>
            
            <div class="option-row">
              <button 
                class="option-button"
                @click="fitImageToOriginalSize"
                :disabled="!(selectedElement as ImageElement).loaded"
              >
                Fit to Original Size
              </button>
            </div>
            
            <!-- Image filters -->
            <h5>Filters</h5>
            
            <div class="option-row">
              <label>Brightness:</label>
              <input 
                type="range" 
                min="-1" 
                max="1" 
                step="0.1"
                :value="(selectedElement as ImageElement).filters.brightness || 0"
                @input="updateImageFilter('brightness', parseFloat(($event.target as HTMLInputElement).value))"
                class="option-slider"
              />
            </div>
            
            <div class="option-row">
              <label>Contrast:</label>
              <input 
                type="range" 
                min="-1" 
                max="1" 
                step="0.1"
                :value="(selectedElement as ImageElement).filters.contrast || 0"
                @input="updateImageFilter('contrast', parseFloat(($event.target as HTMLInputElement).value))"
                class="option-slider"
              />
            </div>
            
            <div class="option-row">
              <button 
                class="option-button"
                @click="resetImageFilters"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </template>
        
        <!-- Button element specific properties -->
        <template v-if="selectedElement.type === 'button'">
          <div class="option-group">
            <h4>Button</h4>
            
            <div class="option-row">
              <label>Text:</label>
              <input 
                type="text" 
                :value="(selectedElement as ButtonElement).text"
                @change="updateButtonProperty('text', ($event.target as HTMLInputElement).value)"
                class="option-input"
              />
            </div>
            
            <div class="option-row">
              <label>URL:</label>
              <input 
                type="url" 
                :value="(selectedElement as ButtonElement).url"
                @change="updateButtonProperty('url', ($event.target as HTMLInputElement).value)"
                class="option-input"
              />
            </div>
            
            <div class="option-row">
              <label>Background:</label>
              <input 
                type="color" 
                :value="(selectedElement as ButtonElement).style.backgroundColor"
                @change="updateButtonStyle('backgroundColor', ($event.target as HTMLInputElement).value)"
                class="option-color"
              />
            </div>
            
            <div class="option-row">
              <label>Text Color:</label>
              <input 
                type="color" 
                :value="(selectedElement as ButtonElement).style.textColor"
                @change="updateButtonStyle('textColor', ($event.target as HTMLInputElement).value)"
                class="option-color"
              />
            </div>
            
            <div class="option-row">
              <label>Border Radius:</label>
              <input 
                type="number" 
                :value="(selectedElement as ButtonElement).style.borderRadius"
                @change="updateButtonStyle('borderRadius', parseInt(($event.target as HTMLInputElement).value))"
                class="option-input"
                min="0"
                max="50"
              />
            </div>
            
            <div class="option-row">
              <label>Font Size:</label>
              <input 
                type="number" 
                :value="(selectedElement as ButtonElement).style.fontSize"
                @change="updateButtonStyle('fontSize', parseInt(($event.target as HTMLInputElement).value))"
                class="option-input"
                min="8"
                max="48"
              />
            </div>
          </div>
        </template>
        
        <!-- Layer controls -->
        <div class="option-group">
          <h4>Layer</h4>
          
          <div class="option-row">
            <button 
              class="option-button"
              @click="canvasStore.bringToFront(selectedElement.id)"
            >
              Bring to Front
            </button>
          </div>
          
          <div class="option-row">
            <button 
              class="option-button"
              @click="canvasStore.sendToBack(selectedElement.id)"
            >
              Send to Back
            </button>
          </div>
          
          <div class="option-row">
            <button 
              class="option-button"
              @click="canvasStore.bringForward(selectedElement.id)"
            >
              Bring Forward
            </button>
          </div>
          
          <div class="option-row">
            <button 
              class="option-button"
              @click="canvasStore.sendBackward(selectedElement.id)"
            >
              Send Backward
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores'
import { TextElement, ImageElement, ButtonElement } from '../models'
import type { AnyCanvasElement } from '../models'

const canvasStore = useCanvasStore()

const selectedElement = computed(() => {
  if (canvasStore.selectedElements.length === 1) {
    return canvasStore.selectedElements[0]
  }
  return null
})

function updateTransform(property: string, event: Event) {
  if (!selectedElement.value) return
  
  const value = parseFloat((event.target as HTMLInputElement).value)
  const element = selectedElement.value
  
  const updatedTransform = { ...element.transform }
  ;(updatedTransform as any)[property] = value
  
  canvasStore.updateElement(element.id, {
    transform: updatedTransform
  } as Partial<AnyCanvasElement>)
}

function updateProperty(property: string, value: any) {
  if (!selectedElement.value) return
  
  canvasStore.updateElement(selectedElement.value.id, {
    [property]: value
  } as Partial<AnyCanvasElement>)
}

function updateTextProperty(property: string, value: any) {
  if (!selectedElement.value || selectedElement.value.type !== 'text') return
  
  const element = selectedElement.value as TextElement
  element.setText(value)
}

function updateTextStyle(property: string, value: any) {
  if (!selectedElement.value || selectedElement.value.type !== 'text') return
  
  const element = selectedElement.value as TextElement
  ;(element.style as any)[property] = value
}

function updateImageProperty(property: string, value: any) {
  if (!selectedElement.value || selectedElement.value.type !== 'image') return
  
  const element = selectedElement.value as ImageElement
  if (property === 'src') {
    element.setSrc(value)
  } else if (property === 'alt') {
    element.setAlt(value)
  }
}

function updateImageFilter(filter: string, value: number) {
  if (!selectedElement.value || selectedElement.value.type !== 'image') return
  
  const element = selectedElement.value as ImageElement
  ;(element.filters as any)[filter] = value
}

function resetImageFilters() {
  if (!selectedElement.value || selectedElement.value.type !== 'image') return
  
  const element = selectedElement.value as ImageElement
  element.resetFilters()
}

function fitImageToOriginalSize() {
  if (!selectedElement.value || selectedElement.value.type !== 'image') return
  
  const element = selectedElement.value as ImageElement
  if (element.loaded) {
    element.setSize(element.naturalWidth, element.naturalHeight)
  }
}

function updateButtonProperty(property: string, value: any) {
  if (!selectedElement.value || selectedElement.value.type !== 'button') return
  
  const element = selectedElement.value as ButtonElement
  if (property === 'text') {
    element.setText(value)
  } else if (property === 'url') {
    element.setUrl(value)
  }
}

function updateButtonStyle(property: string, value: any) {
  if (!selectedElement.value || selectedElement.value.type !== 'button') return
  
  const element = selectedElement.value as ButtonElement
  ;(element.style as any)[property] = value
}

function alignSelectedElements(alignment: 'left' | 'center' | 'right') {
  const elements = canvasStore.selectedElements
  if (elements.length < 2) return
  
  const bounds = elements.map(el => ({
    element: el,
    left: el.transform.x,
    right: el.transform.x + el.transform.width,
    center: el.transform.x + el.transform.width / 2
  }))
  
  let targetX: number
  
  switch (alignment) {
    case 'left':
      targetX = Math.min(...bounds.map(b => b.left))
      elements.forEach((element, index) => {
        element.setPosition(targetX, element.transform.y)
      })
      break
    case 'center':
      const centerX = (Math.min(...bounds.map(b => b.left)) + Math.max(...bounds.map(b => b.right))) / 2
      elements.forEach((element, index) => {
        const newX = centerX - element.transform.width / 2
        element.setPosition(newX, element.transform.y)
      })
      break
    case 'right':
      targetX = Math.max(...bounds.map(b => b.right))
      elements.forEach((element, index) => {
        const newX = targetX - element.transform.width
        element.setPosition(newX, element.transform.y)
      })
      break
  }
}
</script>

<style scoped>
.options-bar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.options-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.options-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #495057;
}

.options-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.no-selection, .multiple-selection {
  text-align: center;
  color: #6c757d;
  padding: 2rem 0;
}

.option-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.option-group h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.option-group h5 {
  margin: 1rem 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.option-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.option-row label {
  min-width: 80px;
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
}

.option-input, .option-select, .option-textarea {
  flex: 1;
  padding: 0.375rem 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.option-input:focus, .option-select:focus, .option-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.option-slider {
  flex: 1;
  margin: 0 0.5rem;
}

.option-value {
  min-width: 40px;
  font-size: 0.75rem;
  color: #6c757d;
  text-align: right;
}

.option-color {
  width: 60px;
  height: 32px;
  padding: 0;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
}

.option-button {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.option-button:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.option-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-textarea {
  resize: vertical;
  min-height: 60px;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>