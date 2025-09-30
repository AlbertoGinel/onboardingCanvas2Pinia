<script setup lang="ts">
import CanvasEditor from './components/CanvasEditor.vue'
import Toolbar from './components/Toolbar.vue'
import OptionsBar from './components/OptionsBar.vue'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>Canvas Editor</h1>
      <Toolbar />
    </header>
    
    <main class="app-main">
      <aside class="sidebar">
        <OptionsBar />
      </aside>
      
      <div class="canvas-container">
        <CanvasEditor />
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.app-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.app-header h1 {
  margin: 0;
  font-size: 1.25rem;
  color: #495057;
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
  flex-shrink: 0;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
