<template>
  <div class="game-detail-view">
    <section class="game-hero fade-in-up">
      <div class="hero-bg" :class="{ 'skeleton-bg': isLoadingData }"
        :style="isLoadingData || !currentBanner ? {} : { backgroundImage: `url(${currentBanner})` }"></div>
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-left">
          <div v-if="isLoadingData" class="game-cover skeleton skeleton-thumb"></div>
          <img v-else :src="game.thumb" :alt="game.title" class="game-cover" />

          <div class="game-meta">
            <div v-if="isLoadingData" class="skeleton skeleton-title"></div>
            <h1 v-else class="game-title">{{ game.title }}</h1>

            <div class="game-tags">
              <template v-if="isLoadingData">
                <span class="skeleton skeleton-tag"></span>
                <span class="skeleton skeleton-tag"></span>
              </template>
              <template v-else>
                <span class="tag category-tag">{{ game.category }}</span>
                <!-- <span class="tag players-tag">🔥{{ formatPlayers(game.players) }} 人 在 遊 玩 </span> -->
                <span class="tag players-tag">🔥 {{ game.players }} 人 在 遊 玩 </span>
              </template>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <div class="hero-actions">
            <button class="hero-favorite-btn" :class="{ active: localFavorite }" @click="toggleFavorite"
              :disabled="isLoadingData" :title="localFavorite ? '取消收藏' : '加入收藏'">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                </path>
              </svg>
            </button>
            <button class="play-btn" @click="startGame" :disabled="isLoading || isLoadingData">
              <span v-if="isLoading" class="loader"></span>
              <template v-else>
                <img :src="startIcon" alt="開始遊戲">
              </template>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="content-layout">
      <main class="main-column fade-in-up" style="animation-delay: 0.1s;">
        <div v-if="game.isLocked && !isLoadingData" class="info-card unlock-card"
          :class="{ 'highlight-pulse': isPulsing }">
          <div class="card-header warning-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="card-icon warning-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h2>解鎖條件</h2>
          </div>

          <div class="card-body unlock-content">
            <template v-if="game.gamePlayStatus === 1">
              <p class="unlock-desc">此遊戲需要登入會員才能遊玩</p>
              <div class="unlock-actions">
                <button class="action-btn"
                  @click="router.push({ path: '/login', query: { redirect: route.fullPath } })">
                  前往登入 / 註冊
                </button>
              </div>
            </template>

            <template v-else-if="game.gamePlayStatus === 2">
              <p class="unlock-desc">
                需要花費 <strong class="highlight-coins">{{ game.gamePay }}</strong> 代幣以解鎖此遊戲
              </p>
              <div class="unlock-actions">
                <!-- <span class="current-coins">您目前擁有: {{ userStore.points || 0 }} 代幣</span> -->
                <button class="action-btn unlock-pay-btn" @click="handleUnlockGame" :disabled="isBuying">
                  <span v-if="isBuying" class="loader" style="width: 20px; height: 20px; border-width: 2px;"></span>
                  <span v-else>立即解鎖</span>
                </button>
              </div>
            </template>
          </div>
        </div>
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
            <template v-if="isLoadingData">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text short"></div>
            </template>
            <div v-else class="description-text rich-text-content" v-html="game.description"></div>
          </div>
        </div>

        <!-- <div class="info-card fade-in-up" style="animation-delay: 0.2s;">
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
            <template v-if="isLoadingData">
              <div class="skeleton skeleton-text w-80"></div>
              <div class="skeleton skeleton-text w-60"></div>
              <div class="skeleton skeleton-text w-70"></div>
            </template>
            <ul v-else class="controls-list">
              <li v-for="(ctrl, index) in game.controls" :key="index">
                <span class="ctrl-dot"></span>
                {{ ctrl }}
              </li>
            </ul>
          </div>
        </div> -->
      </main>
    </div>

    <div class="related-section fade-in-up" style="animation-delay: 0.3s;">
      <GameSection title="其他人也都在玩" :icon="svgIcons.related" categoryId="related" :games="relatedGames" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchGameInfoApi, buyGameApi } from '@/assets/utils/api'
import { useUserStore } from '@/stores/user'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import GameSection from '@/components/GameSection.vue'
import startIcon from '@/assets/images/icon/start.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(false)
const isLoadingData = ref(true)
const isPulsing = ref(false)
const isBuying = ref(false)

const svgIcons = {
  related: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad2-icon lucide-gamepad-2"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>`,
}

const game = ref({
  id: 0,
  title: '',
  thumb: '',
  pcBanner: '',
  mobileBanner: '',
  category: '',
  players: 0,
  description: '',
  isLocked: false,
  jumpUrl: '',

  gamePlayStatus: 0,
  gamePay: 0,
})

// 本地收藏狀態
const localFavorite = ref(false)
const relatedGames = ref([]) // 目前 API 規格沒有推薦遊戲，先給空陣列或保留假資料

const formatPlayers = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

const categoryMap = {
  '1': '休閒益智', '2': '動作闖關', '3': '策略塔防', '4': '模擬經營',
  '5': '競技對戰', '6': '角色冒險', '7': '精選合集'
}

const getCategoryName = (labelStr) => {
  if (!labelStr) return '未分類'
  const firstCode = labelStr.split(',')[0]
  return categoryMap[firstCode] || '未分類'
}


const toggleFavorite = async () => {
  if (isLoadingData.value || game.value.id === 0) return

  const currentStatus = localFavorite.value
  localFavorite.value = !currentStatus
  try {
    await userStore.toggleFavorite(game.value.id)
  } catch (error) {
    localFavorite.value = currentStatus
    console.error('切換收藏失敗:', error)
  }
}

const fetchGameData = async (gameId) => {
  isLoadingData.value = true
  try {
    const result = await fetchGameInfoApi(userStore.account, userStore.token, gameId)

    if ((result.code === 0 || result.code === 888) && result.da) {
      const data = result.da
      game.value = {
        id: data.GameAutoNo,
        title: data.GameName,
        thumb: getImageUrlWithCacheBuster(data.IconURL),
        pcBanner: data.Introduce1URL,    // PC版Banner
        mobileBanner: data.Introduce1MURL, // 手機版Banner
        category: getCategoryName(data.LabelType),
        players: data.PlayerNum || 0,
        description: data.Introduce || '<p>暫無介紹</p>',
        isLocked: data.Lock,
        jumpUrl: data.JumpUrl || '',

        gamePlayStatus: data.GamePlayStatus || 0,
        gamePay: data.GamePay || 0,
      }
      localFavorite.value = data.Favorite

      relatedGames.value = []
    } else {
      console.error('獲取遊戲詳情失敗:', result.msg)
      router.push('/')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isLoadingData.value = false
  }
}

const startGame = () => {
  if (game.value.isLocked) {
    document.querySelector('.unlock-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    isPulsing.value = true
    setTimeout(() => {
      isPulsing.value = false
    }, 2000)
    return
  }

  if (game.value.jumpUrl && game.value.jumpUrl.trim() !== '') {
    window.location.href = game.value.jumpUrl
    return
  }

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push({
      name: 'play',
      params: { id: game.value.id },
      // query: { token: userStore.token || 'guest_token' }
    })
  }, 500)
}

const handleUnlockGame = async () => {
  if (!userStore.token) {
    alert('請先登入！')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  // 把儲值幣免費幣加起來當作總財產來判斷
  const totalPoints = userStore.points + userStore.freePoints
  if (totalPoints < game.value.gamePay) {
    if (confirm('代幣餘額不足，是否要前往儲值中心？')) {
      router.push({ path: '/recharge', query: { redirect: route.fullPath } })
    }
    return
  }

  // 二次確認
  if (!confirm(`確定要花費 ${game.value.gamePay} 代幣解鎖此遊戲嗎？`)) return

  isBuying.value = true
  try {
    // 購買 API
    const result = await buyGameApi(userStore.account, userStore.token, game.value.id)

    if (result.code === 0) {
      alert('解鎖成功！馬上開始遊玩吧！')

      // 重新抓取一次遊戲資料 (讓畫面的黃色解鎖框消失)
      await fetchGameData(game.value.id)

      // 呼叫Store
      await userStore.getPlayerInfo()

    } else {
      // 攔截後端的錯誤狀態
      if (result.code === 2 || result.code === 3) {
        alert('無法購買：訪客模式或遊戲不存在！')
      } else if (result.code === 6) {
        if (confirm('您的點數餘額不足，是否要前往儲值中心？')) {
          router.push('/recharge')
        }
      } else if (result.code === 999) {
        alert('帳號遭封鎖(IP)！')
      } else {
        alert(result.msg || '解鎖失敗，請稍後再試')
      }
    }
  } catch (error) {
    console.error('解鎖發生錯誤:', error)
    alert('系統連線錯誤，請稍後再試')
  } finally {
    isBuying.value = false
  }
}


const windowWidth = ref(window.innerWidth)
const handleResize = () => { windowWidth.value = window.innerWidth }

const currentBanner = computed(() => {
  if (!game.value.pcBanner && !game.value.mobileBanner) return ''

  if (windowWidth.value <= 768) {
    return game.value.mobileBanner || game.value.pcBanner
  }

  return game.value.pcBanner || game.value.mobileBanner
})

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('resize', handleResize)
  const id = route.params.id
  if (id) fetchGameData(id)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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

@keyframes warningPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(245, 158, 11, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
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

@keyframes skeletonShimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, var(--color-bg-page) 25%, var(--color-border-light) 50%, var(--color-bg-page) 75%);
  background-size: 400% 100%;
  animation: skeletonShimmer 3s infinite ease-in-out;
}

.skeleton-bg {
  background: linear-gradient(90deg, #101726 25%, #1a2333 50%, #101726 75%);
  background-size: 400% 100%;
  animation: skeletonShimmer 3s infinite ease-in-out;
}

.skeleton-thumb {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  border: 4px solid var(--color-bg-content);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
}

.skeleton-title {
  width: 240px;
  height: 36px;
  border-radius: 8px;
  margin-bottom: 4px;
}

.skeleton-tag {
  width: 80px;
  height: 30px;
  border-radius: 20px;
}

.skeleton-text {
  width: 100%;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-text.w-80 {
  width: 80%;
}

.skeleton-text.w-70 {
  width: 70%;
}

.skeleton-text.w-60 {
  width: 60%;
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
  aspect-ratio: 1440 / 450;
  max-height: 450px;
  /* height: 320px; */
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

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-favorite-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.hero-favorite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hero-favorite-btn svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: #ffffff;
  transition: all 0.3s ease;
}

.hero-favorite-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.hero-favorite-btn.active svg {
  fill: #ff4757;
  stroke: #ff4757;
  animation: heartPulse 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
  width: 200px;
  height: 50px;
  padding: 0;
}

.play-btn img {
  width: 200px;
  height: 50px;
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

.related-section {
  margin-top: 16px;
}

/* --- 針對後端編輯器傳回的 HTML 內容進行樣式重置與美化 --- */
.description-text.rich-text-content :deep(p) {
  margin-top: 0;
  margin-bottom: 1em;
  line-height: 1.8;
}

.description-text.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 16px 0;
}

.description-text.rich-text-content :deep(ul),
.description-text.rich-text-content :deep(ol) {
  margin-bottom: 1em;
  padding-left: 24px;
}

.description-text.rich-text-content :deep(li) {
  margin-bottom: 0.5em;
  line-height: 1.6;
}

.description-text.rich-text-content :deep(h1),
.description-text.rich-text-content :deep(h2),
.description-text.rich-text-content :deep(h3),
.description-text.rich-text-content :deep(h4) {
  color: var(--color-text-main);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.description-text.rich-text-content :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.description-text.rich-text-content :deep(strong),
.description-text.rich-text-content :deep(b) {
  font-weight: bold;
}

/* 解鎖區塊 */
.unlock-card {
  border: 2px solid rgba(245, 158, 11, 0.3);
  background: linear-gradient(to bottom, rgba(245, 158, 11, 0.05), transparent);
}

.warning-header h2 {
  color: #f59e0b !important;
}

.warning-icon {
  color: #f59e0b;
}

.unlock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 16px 0;
}

.unlock-desc {
  font-size: 1.1rem;
  color: var(--color-text-main);
  margin: 0;
}

.highlight-coins {
  color: #f59e0b;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 4px;
}

.unlock-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.current-coins {
  font-size: 0.9rem;
  color: var(--color-text-sub);
}

.action-btn {
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--color-primary);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  background-color: var(--color-primary-hover);
}

.unlock-pay-btn {
  background-color: #f59e0b;
}

.unlock-pay-btn:hover {
  background-color: #d97706;
}

.highlight-pulse {
  animation: warningPulse 2s cubic-bezier(0.4, 0, 0.6, 1);
  border-color: rgba(245, 158, 11, 0.8) !important;
}

@media (max-width: 768px) {
  .game-hero {
    height: auto;
    /* aspect-ratio: 1 /1; */
    aspect-ratio: 1080 / 650;
    /* min-height: auto; */
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

  .skeleton-thumb,
  .game-cover {
    width: 120px;
    height: 120px;
  }

  .game-title {
    font-size: 1.5rem;
  }

  .skeleton-title {
    width: 200px;
  }

  .game-tags {
    justify-content: center;
  }

  .hero-right {
    width: 100%;
  }

  .hero-actions {
    width: 100%;
    justify-content: center;
  }

  .info-card {
    padding: 20px;
  }
}
</style>
