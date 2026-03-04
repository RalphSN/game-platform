<template>
  <div class="game-card" @click="goToGame">
    <div class="thumb-wrapper">
      <img :src="game.thumb" :alt="game.title" class="game-thumb" loading="lazy" />
      <div class="hover-overlay">
        <div class="play-btn">▶ 立即遊玩</div>
      </div>
      <button class="favorite-btn" :class="{ active: isFavorite }" @click.stop="toggleFavorite" title="加入/移除收藏">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
          </path>
        </svg>
      </button>
    </div>

    <div class="game-info">
      <h4 class="game-title">{{ game.title }}</h4>
      <div class="game-meta">
        <span class="game-tag">{{ game.category }}</span>
        <span class="game-players">🔥 {{ formatPlayers(game.players) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 預留接收 API 資料的 Props
const props = defineProps({
  game: {
    type: Object,
    required: true,
    // Mock API 資料結構示範
    default: () => ({
      id: 0,
      title: '載入中...',
      thumb: 'https://via.placeholder.com/300x300?text=Game',
      category: '未分類',
      players: 0,
      isFavorite: false
    })
  }
})

const router = useRouter()
const isFavorite = ref(props.game.isFavorite || false)

const toggleFavorite = () => {
  if (props.game.id === 0) return
  isFavorite.value = !isFavorite.value
  console.log(`${isFavorite.value ? '加入' : '移除'}收藏: ${props.game.title} (ID: ${props.game.id})`)
}

// 點擊卡片跳轉到遊戲詳情頁
const goToGame = () => {
  if (props.game.id === 0) return
  console.log(`準備進入遊戲 ID: ${props.game.id}`)
  router.push(`/game/${props.game.id}`)
}

const formatPlayers = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}
</script>

<style scoped>
.game-card {
  background-color: var(--color-bg-content);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
}

.game-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px var(--color-shadow-main);
}

.thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.game-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .game-thumb {
  transform: scale(1.08);
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 41, 55, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .hover-overlay {
  opacity: 1;
}

.play-btn {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.game-card:hover .play-btn {
  transform: translateY(0);
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.favorite-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #ffffff;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.favorite-btn.active {
  background-color: rgba(255, 255, 255, 0.5);
}

.favorite-btn.active svg {
  fill: #ff4757;
  stroke: #ff4757;
  animation: heartPulse 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes heartPulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

/* --- 資訊區 --- */
.game-info {
  padding: 12px;
}

.game-title {
  color: var(--color-text-main);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.game-players {
  color: var(--color-text-sub);
  font-size: 0.8rem;
}
</style>
