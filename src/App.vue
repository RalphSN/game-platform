<template>
  <div class="app-wrapper">
    <AppHeader />

    <main class="main-content">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
// 引入我們剛剛建立的組件
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
/* 全域基礎樣式重置 (Reset CSS) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


/* 確保整個畫面至少有 100% 螢幕高度，並使用 Flexbox 讓 Footer 沉底 */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 讓中間內容自動撐開剩餘空間 */
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  /* 限制最大寬度 */
  margin: 0 auto;
  /* 內容置中 */
  padding: 20px;
}
</style>
