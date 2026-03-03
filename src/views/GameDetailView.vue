<template>
  <div class="game-detail-view">
    <section class="game-hero fade-in-up">
      <div class="hero-bg" :style="{ backgroundImage: `url(${game.banner})` }"></div>
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-left">
          <img :src="game.thumb" :alt="game.title" class="game-cover" />
          <div class="game-meta">
            <h1 class="game-title">{{ game.title }}</h1>
            <div class="game-tags">
              <span class="tag category-tag">{{ game.category }}</span>
              <span class="tag players-tag">🔥 {{ game.players }} 人在玩</span>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <button class="play-btn" @click="startGame" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <template v-else>
              <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
                <path d="M8 5v14l11-7z" />
              </svg>
              開始遊戲
            </template>
          </button>
        </div>
      </div>
    </section>

    <div class="content-layout">
      <main class="main-column fade-in-up" style="animation-delay: 0.1s;">
        <div class="info-card">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="card-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h2>遊戲簡介</h2>
          </div>
          <div class="card-body">
            <p v-if="isLoadingData" class="loading-text">資料載入中...</p>
            <p v-else class="description-text">{{ game.description }}</p>
          </div>
        </div>

        <div class="info-card fade-in-up" style="animation-delay: 0.2s;">
          <div class="card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="card-icon">
              <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
              <circle cx="16" cy="12" r="1"></circle>
              <circle cx="18" cy="10" r="1"></circle>
              <line x1="6" y1="12" x2="10" y2="12"></line>
              <line x1="8" y1="10" x2="8" y2="14"></line>
            </svg>
            <h2>操作說明</h2>
          </div>
          <div class="card-body">
            <p v-if="isLoadingData" class="loading-text">資料載入中...</p>
            <ul v-else class="controls-list">
              <li v-for="(ctrl, index) in game.controls" :key="index">
                <span class="ctrl-dot"></span>
                {{ ctrl }}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>

    <div class="related-section fade-in-up" style="animation-delay: 0.3s;">
      <GameSection title="其他人也都在玩" icon="🎮" categoryId="related" :games="relatedGames" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import GameSection from '@/components/GameSection.vue'

const route = useRoute()
const isLoading = ref(false)
const isLoadingData = ref(true)

// const formatPlayers = (num) => {
//   if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
//   if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
//   return num
// }

const game = ref({
  id: 0,
  title: '載入中...',
  thumb: '',
  banner: '',
  category: '載入中...',
  players: 0,
  description: '',
  controls: []
})

const relatedGames = ref([])

const fetchGameData = async (gameId) => {
  isLoadingData.value = true

  return new Promise((resolve) => {
    setTimeout(() => {
      game.value = {
        id: gameId,
        title: `夢幻廚房`,
        thumb: `https://picsum.photos/seed/${gameId * 10}/300/300`,
        banner: `https://picsum.photos/seed/${gameId * 20}/1200/400`,
        category: '休閒益智',
        players: Math.floor(Math.random() * 50000) + 1000,
        description: '這是一款非常有趣的模擬經營遊戲。在這裡，你將經營一家屬於自己的夢幻廚房，從挑選食材、烹飪美食到服務顧客，體驗完整的餐廳經營樂趣。不斷解鎖新食譜，升級廚房設備，打造世界頂級的米其林餐廳！豐富的關卡與挑戰等你來發掘。',
        controls: [
          '滑鼠左鍵：點擊食材與廚具進行互動',
          '拖曳：移動畫面或分配食物給顧客',
          'ESC：暫停遊戲或開啟選單'
        ]
      }

      relatedGames.value = Array.from({ length: 6 }, (_, i) => ({
        id: i + 20 + parseInt(gameId),
        title: `推薦遊戲 ${i + 1}`,
        thumb: `https://picsum.photos/seed/${i + 200 + parseInt(gameId)}/300/300`,
        category: i % 2 === 0 ? '休閒益智' : '動作闖關',
        players: Math.floor(Math.random() * 50000) + 1000
      }))

      isLoadingData.value = false
      resolve()
    }, 800)
  })
}

const startGame = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    alert(`即將進入遊戲：${game.value.title}`)
  }, 1000)
}

onMounted(() => {
  window.scrollTo(0, 0)
  const id = route.params.id || 1
  fetchGameData(id)
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchGameData(newId)
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(94, 96, 206, 0.4);
  }

  70% {
    box-shadow: 0 0 0 15px rgba(94, 96, 206, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(94, 96, 206, 0);
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

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.game-detail-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.game-hero {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 8px 24px var(--color-shadow-main);
}

.hero-bg {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background-size: cover;
  background-position: center;
  filter: blur(15px);
  z-index: 1;
  transition: background-image 0.5s ease;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(16, 23, 38, 0.95) 0%, rgba(16, 23, 38, 0.4) 50%, rgba(16, 23, 38, 0.2) 100%);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.hero-left {
  display: flex;
  align-items: flex-end;
  gap: 24px;
}

.game-cover {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  border: 4px solid var(--color-bg-content);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.game-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
}

.game-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.game-tags {
  display: flex;
  gap: 12px;
}

.tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.category-tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.players-tag {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(4px);
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
  min-width: 160px;
  height: 56px;
}

.play-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px) scale(1.02);
}

.play-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.play-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
  animation: none;
  box-shadow: none;
}

.play-icon {
  width: 24px;
  height: 24px;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

.content-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
  margin-bottom: 24px;
  min-height: 150px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.card-icon {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
}

.description-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text-sub);
  margin: 0;
  white-space: pre-line;
}

.controls-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.controls-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: var(--color-text-sub);
}

.ctrl-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  border-radius: 50%;
  flex-shrink: 0;
}

.loading-text {
  color: var(--color-text-muted);
  font-style: italic;
}

.related-section {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .game-hero {
    height: auto;
    min-height: 380px;
    flex-direction: column;
    align-items: center;
    border-radius: 16px;
  }

  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    padding: 32px 20px 24px;
  }

  .hero-left {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .game-cover {
    width: 120px;
    height: 120px;
  }

  .game-title {
    font-size: 1.5rem;
  }

  .game-tags {
    justify-content: center;
  }

  .hero-right {
    width: 100%;
  }

  .play-btn {
    width: 100%;
    justify-content: center;
  }

  .info-card {
    padding: 20px;
  }
}
</style>
