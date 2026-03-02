<template>
  <div class="app-wrapper">
    <AppHeader />

    <main class="main-content">
      <router-view />
    </main>

    <AppFooter />

    <MobileTabBar />

    <GoTopButton />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MobileTabBar from './components/MobileTabBar.vue'
import GoTopButton from './components/GoTopButton.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .app-wrapper {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
}
</style>
