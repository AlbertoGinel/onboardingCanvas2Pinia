<template>
  <div class="zoom-controls-bottom">
    <div class="zoom-controls">
      <button class="zoom-btn" @click="zoomOut" title="Zoom Out">➖</button>
      <span class="zoom-level">{{ Math.round(canvasStore.settings.zoom * 100) }}%</span>
      <button class="zoom-btn" @click="zoomIn" title="Zoom In">➕</button>
      <button class="zoom-btn" @click="resetZoom" title="Reset Zoom">🎯</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasStore } from '../stores'

const canvasStore = useCanvasStore()

function zoomIn() {
  canvasStore.settings.zoom = Math.min(5, canvasStore.settings.zoom * 1.2)
}

function zoomOut() {
  canvasStore.settings.zoom = Math.max(0.1, canvasStore.settings.zoom / 1.2)
}

function resetZoom() {
  canvasStore.settings.zoom = 1
  canvasStore.settings.panX = 0
  canvasStore.settings.panY = 0
}
</script>

<style scoped>
.zoom-controls-bottom {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: #f8f9fa;
  color: #212529;
}

.zoom-btn:active {
  transform: scale(0.95);
}

.zoom-level {
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  min-width: 50px;
  text-align: center;
  padding: 0 8px;
}
</style>
