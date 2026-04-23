<template>
  <div class="game-card" :class="{ 'is-locked': game.Lock, 'is-loading': !isImageLoaded }" @click="goToGame">
    <div class="thumb-wrapper">
      <img :src="getImageUrlWithCacheBuster(game.IconURL) || defaultThumb" :alt="game.GameName" class="game-thumb"
        :class="{ 'is-loaded': isImageLoaded }" @load="onImageLoad" loading="lazy" />

      <div v-if="game.Lock" class="lock-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="lock-icon">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <div class="hover-overlay">
        <div class="play-btn" :class="{ 'unlock-btn': game.Lock }">
          {{ game.Lock ? $t('gameCard.viewUnlock') : $t('gameCard.playNow') }}
        </div>
      </div>

      <button v-if="!hideFavorite" class="favorite-btn" :class="{ active: isFavorite }" @click.stop="toggleFavorite"
        :title="$t('gameCard.toggleFavorite')">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
          </path>
        </svg>
      </button>
    </div>

    <div class="game-info">
      <h4 class="game-title">{{ game.GameName || $t('gameCard.loading') }}</h4>
      <div class="game-meta">
        <span class="game-tag">{{ finalCategory }}</span>
        <span class="game-players" v-if="!isBanana">
          <svg class="flame-svg" viewBox="0 0 24 24">
            <path
              d="M12 2C8.5 6 6 9 8 13c-2-1-3-3-2.5-5C3 10 2 14 4 17c1.5 2.5 4 4 8 4s8-3 8-7c0-4-3-7-3-7s.5 3-2 4c1-3-1-7-3-9z" />
          </svg>
          {{ game.PlayerNum }}
        </span>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isImageLoaded = ref(false)

const onImageLoad = () => {
  isImageLoaded.value = true
}

const props = defineProps({
  game: {
    type: Object,
    required: true,
    default: () => ({
      GameAutoNo: 0,
      IconURL: '',
      GameName: '',
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
  },
  isBanana: {
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
    console.error(error)
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

const parsedCategory = computed(() => {
  const labels = props.game.LabelType
  if (!labels) return t('gameCard.uncategorized')

  const labelArray = labels.split(',')

  if (labelArray.includes('999')) {
    return t('category.hot')
  }

  const firstLabelCode = labelArray[0]
  if (['1', '2', '3', '4', '5', '6', '7'].includes(firstLabelCode)) {
    return t(`category.${firstLabelCode}`)
  }

  return t('gameCard.uncategorized')
})

const finalCategory = computed(() => {
  if (props.isBanana) return t('gameCard.mobileGame')
  return parsedCategory.value
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
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px solid var(--color-border-light);
  transition: transform 0.28s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.28s ease, border-color 0.2s ease;
  width: 100%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(94, 96, 206, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: #c5c7f5;
}

.thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

/* 載入中骨架屏 */
.game-card.is-loading .thumb-wrapper {
  background-color: #eef0ff;
}

.game-card.is-loading .thumb-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
  animation: shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

.game-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.game-card:not(.is-loading) .game-thumb {
  opacity: 1;
}

.game-card:hover .game-thumb {
  transform: scale(1.08);
}

/* 上鎖狀態 */
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
  background-color: rgba(255, 255, 255, 0.12);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

.lock-icon {
  width: 20px;
  height: 20px;
  stroke: rgba(255, 255, 255, 0.85);
}

.game-card.is-loading .lock-indicator {
  opacity: 0;
}

.is-locked:hover .lock-indicator {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Hover overlay */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(30, 34, 53, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 3;
  pointer-events: none;
}

@media (hover: hover) {
  .game-card:not(.is-loading):hover .hover-overlay {
    opacity: 1;
  }
}

.play-btn {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  padding: 7px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
  transform: translateY(10px);
  transition: transform 0.28s cubic-bezier(0.23, 1, 0.32, 1);
}

@media (hover: hover) {
  .game-card:not(.is-loading):hover .play-btn {
    transform: translateY(0);
  }
}

.unlock-btn {
  background-color: #f59e0b;
  color: #ffffff;
}

/* 收藏按鈕 */
.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.88);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.favorite-btn svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: #9ca3af;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background-color: #ffffff;
  transform: scale(1.15);
}

.favorite-btn.active {
  background-color: #fff0f1;
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

/* 卡片底部資訊 */
.game-info {
  padding: 10px 12px 12px;
  border-top: 1.5px solid var(--color-primary-light);
}

.game-title {
  color: var(--color-text-main);
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

/* 上鎖時標題降灰 */
.is-locked .game-title {
  color: var(--color-text-muted);
}

.game-card.is-loading .game-title {
  color: transparent;
  background-color: var(--color-primary-light);
  border-radius: 4px;
  width: 75%;
  height: 1rem;
  animation: pulse 1.5s infinite;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary-active);
  font-size: 0.72rem;
  padding: 3px 9px;
  border-radius: 5px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* 上鎖時 tag 降灰 */
.is-locked .game-tag {
  background-color: #f3f4f6;
  color: var(--color-text-muted);
}

.game-players {
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--color-text-sub);
  font-size: 0.78rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
  font-weight: 500;
}

/* 上鎖時人氣降灰 */
.is-locked .game-players {
  color: #d1d5db;
}

.flame-svg {
  width: 13px;
  height: 13px;
  fill: #ff4757;
  flex-shrink: 0;
}

.is-locked .flame-svg {
  fill: #d1d5db;
}

.game-card.is-loading .game-meta {
  display: none;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>
