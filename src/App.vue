<script setup lang="ts">
import { ref } from 'vue'
import CanvasEditor from './components/CanvasEditor.vue'
import Toolbar from './components/Toolbar.vue'
import OptionsBar from './components/OptionsBar.vue'
import TopNavBar from './components/TopNavBar.vue'
import AssetsPanel from './components/AssetsPanel.vue'
import ZoomControls from './components/ZoomControls.vue'

const activePanel = ref('text')

function handleToolChanged(toolId: string) {
  activePanel.value = toolId
}
</script>

<template>
  <div id="app">
    <!-- Top Navigation Bar -->
    <TopNavBar />

    <!-- Main Layout -->
    <main class="app-main">
      <!-- Left Sidebar with Toolbar and Assets -->
      <aside class="left-sidebar">
        <Toolbar @toolChanged="handleToolChanged" />
        <AssetsPanel :activePanel="activePanel" />
      </aside>

      <!-- Canvas Area with Top Options -->
      <div class="canvas-area">
        <!-- Horizontal Options Bar -->
        <div class="top-options">
          <OptionsBar />
        </div>

        <!-- Canvas Container -->
        <div class="canvas-container">
          <CanvasEditor />
        </div>
      </div>
    </main>

    <!-- Floating Zoom Controls -->
    <ZoomControls />
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: #fafafa;
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-sidebar {
  display: flex;
  flex-shrink: 0;
  background: #2c3e50;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  margin-left: 1px;
}

.top-options {
  flex-shrink: 0;
  background: #ffffff;
  border-bottom: 1px solid #e1e5e9;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #ffffff;
}

/* Global scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
