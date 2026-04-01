<template>
  <div class="app-wrapper">
    <AppHeader v-if="!$route.meta.hideLayout" />

    <main class="main-content" :class="{ 'full-screen-content': $route.meta.hideLayout }">
      <router-view />
    </main>

    <AppFooter v-if="!$route.meta.hideLayout" />

    <MobileTabBar v-if="!$route.meta.hideLayout" />

    <GoTopButton v-if="!$route.meta.hideLayout" />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MobileTabBar from './components/MobileTabBar.vue'
import GoTopButton from './components/GoTopButton.vue'

import { onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const { locale } = useI18n()

// 負責更新 <body> class 的函式
const updateBodyLangClass = (lang) => {
  // 先移除所有可能的語系 class
  document.body.classList.remove('lang-zh-TW', 'lang-zh-CN', 'lang-en-US')
  // 加上當前的語系 class
  document.body.classList.add(`lang-${lang}`)
}

// 右上角按鈕改了 locale 觸發
watch(locale, (newLang) => {
  updateBodyLangClass(newLang)
})

onMounted(async () => {
  // 網頁初次載入時，先設定一次目前的語系 class
  updateBodyLangClass(locale.value)

  if (userStore.token) {
    await userStore.getPlayerInfo()
  }
})
</script>

<style>
@import '@/assets/fonts/fonts.css';

:root {
  --font-en: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body,
body.lang-zh-TW {
  font-family: var(--font-en), 'Noto Sans TC', sans-serif;
}

body.lang-zh-CN {
  font-family: var(--font-en), 'Noto Sans SC', sans-serif;
}

body.lang-en-US {
  font-family: var(--font-en);
  letter-spacing: 0.3px;
}

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

.main-content.full-screen-content {
  max-width: 100%;
  padding: 0;
  margin: 0;
}

/* 客製化showToast */
div.swal2-container.swal2-top-end,
div.swal2-container.swal2-top-right {
  top: 75px !important;
}

@media (max-width: 768px) {

  div.swal2-container.swal2-top-end,
  div.swal2-container.swal2-top-right {
    top: 65px !important;
  }
}

@media (max-width: 768px) {
  .app-wrapper {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }

  .app-wrapper:has(.full-screen-content) {
    padding-bottom: 0;
  }
}
</style>
