<template>
  <div class="game-card" :class="{ 'is-locked': game.Lock }" @click="goToGame">
    <div class="thumb-wrapper">
      <img :src="getImageUrlWithCacheBuster(game.IconURL) || defaultThumb" :alt="game.GameName" class="game-thumb" loading="lazy" />

      <div v-if="game.Lock" class="lock-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="lock-icon">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <div class="hover-overlay">
        <div class="play-btn" :class="{ 'unlock-btn': game.Lock }">
          {{ game.Lock ? '查看解鎖條件' : '▶ 立即遊玩' }}
        </div>
      </div>

      <button v-if="!hideFavorite" class="favorite-btn" :class="{ active: isFavorite }" @click.stop="toggleFavorite"
        title="加入/移除收藏">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
          </path>
        </svg>
      </button>
    </div>

    <div class="game-info">
      <h4 class="game-title">{{ game.GameName }}</h4>
      <div class="game-meta">
        <span class="game-tag">{{ parsedCategory }}</span>
        <!-- <span class="game-players">🔥 {{ formatPlayers(game.PlayerNum) }}</span> -->
        <span class="game-players">🔥 {{ game.PlayerNum }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import defaultThumb from '@/assets/images/default-img.jpg'

const props = defineProps({
  game: {
    type: Object,
    required: true,
    default: () => ({
      GameAutoNo: 0,
      IconURL: '',
      GameName: '載入中...',
      LabelType: '',
      PlayerNum: 0,
      Favorite: false,
      Lock: false,
      JumpUrl: ''
    })
  },
  hideFavorite: {
    type: Boolean,
    default: false
  }
})

const userStore = useUserStore()
const router = useRouter()
const localFavorite = ref(props.game.Favorite)

const isFavorite = computed(() => {
  if (!userStore.token) return false
  return userStore.favoriteGames.includes(Number(props.game.GameAutoNo)) || localFavorite.value
})

const toggleFavorite = async (event) => {
  event.stopPropagation()
  if (props.game.GameAutoNo === 0) return

  const currentStatus = isFavorite.value
  localFavorite.value = !currentStatus
  try {
    await userStore.toggleFavorite(props.game.GameAutoNo)
  } catch (error) {
    localFavorite.value = currentStatus
    console.error('收藏狀態切換失敗:', error)
  }
}

const goToGame = () => {
  if (props.game.GameAutoNo === 0) return

  if (props.game.JumpUrl && props.game.JumpUrl.trim() !== '') {
    window.location.href = props.game.JumpUrl
    return
  }

  router.push(`/game/${props.game.GameAutoNo}`)
}

const formatPlayers = (num) => {
  if (!num) return 0
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

const categoryMap = {
  '1': '休閒益智',
  '2': '動作闖關',
  '3': '策略塔防',
  '4': '模擬經營',
  '5': '競技對戰',
  '6': '角色冒險',
  '7': '精選合集'
}

const parsedCategory = computed(() => {
  const labels = props.game.LabelType
  if (!labels) return '未分類'

  const firstLabelCode = labels.split(',')[0]
  return categoryMap[firstLabelCode] || '未分類'
})

watch(
  () => props.game.Favorite,
  (newVal) => {
    localFavorite.value = newVal
  }
)

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

.is-locked .game-thumb {
  filter: grayscale(85%) brightness(60%);
}

.is-locked:hover .game-thumb {
  filter: grayscale(85%) brightness(40%);
}

.lock-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.lock-icon {
  width: 24px;
  height: 24px;
  stroke: #ffffff;
  opacity: 0.9;
}

.is-locked:hover .lock-indicator {
  opacity: 0;
  transition: opacity 0.3s ease;
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
  z-index: 3;
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

.unlock-btn {
  background-color: #f59e0b;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
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

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
}
</style>
