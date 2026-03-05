<template>
  <div class="play-view" ref="playContainer">
    <div class="game-toolbar" :class="{ 'is-hidden': isToolbarHidden && !showExitWarning }">
      <button class="toolbar-btn back-btn" @click="confirmExit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>退出遊戲</span>
      </button>

      <button class="toolbar-btn fullscreen-btn" @click="toggleFullscreen">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <polyline points="4 14 10 14 10 20"></polyline>
          <polyline points="20 10 14 10 14 4"></polyline>
          <line x1="14" y1="10" x2="21" y2="3"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </button>
    </div>

    <transition name="fade">
      <div v-if="showExitWarning" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">確定要退出遊戲嗎？</h3>
          <p class="modal-desc">未儲存的進度可能會遺失，請確認是否離開。</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showExitWarning = false">繼續遊玩</button>
            <button class="btn-confirm" @click="goBack">確認退出</button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loader-container">
        <div class="spinner"></div>
        <p>遊戲載入中，請稍候...</p>
      </div>
    </div>

    <iframe ref="gameIframe" :src="gameUrl" class="game-iframe" allow="autoplay; fullscreen; microphone; camera"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms" @load="handleLoad"></iframe>
  </div>
</template>

<script setup>
// src/views/PlayView.vue 的 script 區塊

import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const playContainer = ref(null)
const gameIframe = ref(null)

const isLoading = ref(true)
const isFullscreen = ref(false)
const isToolbarHidden = ref(false)
const showExitWarning = ref(false)
let hideToolbarTimer = null

const gameUrl = ref('')

const handleLoad = () => {
  isLoading.value = false
  startToolbarTimer()
}

const confirmExit = () => {
  showExitWarning.value = true
}

const goBack = () => {
  if (isFullscreen.value) {
    document.exitFullscreen()
  }
  showExitWarning.value = false
  router.back()
}

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await playContainer.value.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.error('全螢幕切換失敗:', err)
    alert('您的瀏覽器不支援全螢幕功能')
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const startToolbarTimer = () => {
  clearTimeout(hideToolbarTimer)
  isToolbarHidden.value = false
  if (!showExitWarning.value) {
    hideToolbarTimer = setTimeout(() => {
      isToolbarHidden.value = true
    }, 3000)
  }
}

const handleMouseMove = () => {
  startToolbarTimer()
}

// 建立模擬的遊戲網址資料庫
const getBaseGameUrl = (gameId) => {
  const gameMap = {
    '1': 'http://60.250.78.9:8081/',
    '2': 'http://60.250.78.9:8082/'
    // 可以繼續新增其他 ID 的對應
  }
  // 如果找不到對應的 ID，回傳一個預設網址或錯誤提示頁面
  return gameMap[gameId] || 'http://60.250.78.9:8081/'
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchstart', handleMouseMove)

  // 1. 取得路由中的遊戲 ID
  const gameId = route.params.id

  // 2. 從我們模擬的資料庫中取得基礎網址
  const baseUrl = getBaseGameUrl(gameId)

  // 3. 從 localStorage 或路由 query 中取得 Token (這裡從 localStorage 拿最穩)
  const token = localStorage.getItem('user_token') || 'guest'

  // 4. 組合最終的 URL，將 Token 當作參數傳給遊戲端
  // 如果 baseUrl 本身已經有 ? 參數，就要用 & 連接
  const separator = baseUrl.includes('?') ? '&' : '?'
  gameUrl.value = `${baseUrl}${separator}token=${token}`
  // gameUrl.value = baseUrl

  console.log(`正在載入遊戲 ID: ${gameId}`)
  console.log(`實際 iframe 載入網址: ${gameUrl.value}`)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchstart', handleMouseMove)
  clearTimeout(hideToolbarTimer)
})
</script>

<style scoped>
.play-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.game-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 10;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.game-toolbar.is-hidden {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.toolbar-btn svg {
  width: 20px;
  height: 20px;
}

.fullscreen-btn {
  padding: 8px;
  border-radius: 50%;
}

.game-iframe {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: #000000;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #101726;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(94, 96, 206, 0.3);
  border-top-color: #5e60ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-container p {
  color: #a8a8a8;
  font-size: 1.1rem;
  margin: 0;
}

/* --- Modal 樣式 --- */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal-content {
  background-color: var(--color-bg-content);
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border-light);
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.modal-title {
  color: var(--color-text-main);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.modal-desc {
  color: var(--color-text-sub);
  font-size: 0.95rem;
  margin: 0 0 24px;
}

.modal-actions {
  display: flex;
  gap: 16px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background-color: var(--color-bg-page);
  color: var(--color-text-main);
  border: 1px solid var(--color-border-light);
}

.btn-cancel:hover {
  background-color: var(--color-border-light);
}

.btn-confirm {
  background-color: #ef4444;
  color: white;
}

.btn-confirm:hover {
  background-color: #dc2626;
}

/* --- Vue Transition 動畫 --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-content {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .game-toolbar {
    padding: 12px 16px;
  }

  .toolbar-btn span {
    display: none;
  }

  .toolbar-btn {
    padding: 8px;
    border-radius: 50%;
  }
}
</style>
