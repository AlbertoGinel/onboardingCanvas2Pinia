<template>
  <div class="top-navbar">
    <div class="nav-left">
      <button class="nav-button">
        <span class="icon">☰</span>
      </button>
      <h1 class="app-title">Canvas Editor</h1>
    </div>

    <div class="nav-center">
      <div class="breadcrumb">
        <span class="breadcrumb-item">Projects</span>
        <span class="separator">/</span>
        <span class="breadcrumb-item active">Untitled Design</span>
      </div>
    </div>

    <div class="nav-right">
      <button class="nav-button">
        <span class="icon">👤</span>
      </button>
      <button class="nav-button">
        <span class="icon">⚙️</span>
      </button>
      <button class="nav-button primary">
        <span class="text">Share</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Top navigation bar component
</script>

<style scoped>
.top-navbar {
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-left,
.nav-center,
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background: #f5f5f5;
}

.nav-button.primary {
  background: #007bff;
  color: white;
}

.nav-button.primary:hover {
  background: #0056b3;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 14px;
}

.breadcrumb-item.active {
  color: #495057;
  font-weight: 500;
}

.separator {
  color: #adb5bd;
}

.icon {
  font-size: 16px;
}

.text {
  font-weight: 500;
}
</style>
