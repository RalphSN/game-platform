<template>
  <div class="home-view">
    <section class="hero-banner fade-in-up" style="animation-delay: 0s;" @mouseenter="pauseAutoPlay"
      @mouseleave="startAutoPlay">
      <transition-group name="fade" tag="div" class="carousel-inner">
        <picture v-for="(banner, index) in banners" :key="banner.No" v-show="currentIndex === index"
          class="hero-img-container" @click="handleBannerClick(banner)" style="cursor: pointer;">
          <source media="(max-width: 768px)" :srcset="banner.PicURL2" referrerpolicy="no-referrer" />
          <img :src="banner.PicURL" :alt="$t('homeView.eventBanner')" class="hero-img" referrerpolicy="no-referrer" />
        </picture>
      </transition-group>

      <div class="carousel-indicators">
        <span v-for="(banner, index) in banners" :key="banner.No" :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"></span>
      </div>
    </section>

    <div class="feed-container">
      <div v-if="isLoading" class="loading-wrapper">
        <LoadingSpinner />
      </div>

      <template v-else>
        <GameSection class="fade-in-up" style="animation-delay: 0.1s;" :title="$t('homeView.sections.hot')"
          :icon="svgIcons.hot" categoryId="hot" :games="hotGames.slice(0, 6)" />

        <div v-if="adMiddle" class="ad-wrapper fade-in-up" style="animation-delay: 0.2s;">
          <AdBanner :ad="adMiddle" />
        </div>

        <GameSection class="fade-in-up" style="animation-delay: 0.3s;" :title="$t('homeView.sections.action')"
          :icon="svgIcons.action" categoryId="action" :games="actionGames.slice(0, 6)" />

        <GameSection class="fade-in-up" style="animation-delay: 0.4s;" :title="$t('homeView.sections.puzzle')"
          :icon="svgIcons.puzzle" categoryId="puzzle" :games="puzzleGames.slice(0, 6)" />

        <div v-if="adLeft || adRight" class="ad-wrapper half-ad fade-in-up" style="animation-delay: 0.5s;">
          <AdBanner v-if="adLeft" :ad="adLeft" />
          <AdBanner v-if="adRight" :ad="adRight" />
        </div>

        <GameSection class="fade-in-up" style="animation-delay: 0.3s;" :title="$t('homeView.sections.simulate')"
          :icon="svgIcons.simulate" categoryId="simulate" :games="simulateGames.slice(0, 6)" />

        <GameSection class="fade-in-up" style="animation-delay: 0.6s;" :title="$t('homeView.sections.rpg')"
          :icon="svgIcons.rpg" categoryId="rpg" :games="rpgGames.slice(0, 6)" />

        <GameSection class="fade-in-up" style="animation-delay: 0.7s;" :title="$t('homeView.sections.banana')"
          :icon="svgIcons.banana" categoryId="banana" :games="bananaGames.slice(0, 6)" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fetchGameListAllApi, fetchBannerListAllApi, trackBannerClickApi } from '@/assets/utils/api'
import { useUserStore } from '@/stores/user'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import GameSection from '@/components/GameSection.vue'
import AdBanner from '@/components/AdBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

import hotIcon from '@/assets/images/icon/hot.png'
import actionIcon from '@/assets/images/icon/action.png'
import puzzleIcon from '@/assets/images/icon/puzzle.png'
import simulateIcon from '@/assets/images/icon/simulate.png'
import rpgIcon from '@/assets/images/icon/rpg.png'
import bananaIcon from '@/assets/images/icon/banana.png'

import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 儲存各分類遊戲
const simulateGames = ref([]) // 對應分類 4 (模擬經營)
const hotGames = ref([])     // 對應分類 7 (熱門推薦)
const bananaGames = ref([])  // 對應分類 0 (香蕉遊戲)
const actionGames = ref([])  // 對應分類 2 (動作闖關)
const puzzleGames = ref([])  // 對應分類 1 (休閒益智)
const rpgGames = ref([])     // 對應分類 6 (角色冒險)


// Banner與廣告
const banners = ref([])    // 對應 BType: 1 (輪播大 BANNER)
const adMiddle = ref(null) // 對應 BType: 2 (中間廣告)
const adLeft = ref(null)   // 對應 BType: 3 (BANNER 左)
const adRight = ref(null)  // 對應 BType: 4 (BANNER 右)

const isLoading = ref(true)

// const svgIcons = {

//   hot: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame-icon lucide-flame"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>`,

//   action: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords-icon lucide-swords"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>`,

//   puzzle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-puzzle-icon lucide-puzzle"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg>
// `,

//   rpg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>`,

//   banana: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chess-queen-icon lucide-chess-queen"><path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402"/><path d="m20 9-3 9"/><path d="m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34"/><path d="M7 18 4 9"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="7" r="2"/><circle cx="4" cy="7" r="2"/></svg>`,

//   simulate: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers-icon lucide-layers"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>`,
// }

const svgIcons = {
  hot: hotIcon,
  action: actionIcon,
  puzzle: puzzleIcon,
  rpg: rpgIcon,
  banana: bananaIcon,
  simulate: simulateIcon
}

// 獲取資料
const loadGames = async () => {
  isLoading.value = true
  try {
    // 如果是訪客模式 userStore.account 會是空的
    const result = await fetchGameListAllApi(userStore.account, userStore.token)

    if (result.code === 0 || result.code === 888) {
      hotGames.value = result['999'] || []
      simulateGames.value = result['4'] || []
      bananaGames.value = result['0'] || []
      actionGames.value = result['2'] || []
      puzzleGames.value = result['1'] || []
      rpgGames.value = result['6'] || []
    } else {
      console.error('獲取遊戲列表失敗:', result.msg)
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isLoading.value = false
  }
}

// 獲取Banner
const loadBanners = async () => {
  try {
    const result = await fetchBannerListAllApi(userStore.account, userStore.token)
    if (result.code === 0 || result.code === 888) {

      const rawBanners = result['1'] || []
      banners.value = rawBanners.map(banner => ({
        ...banner,
        PicURL: getImageUrlWithCacheBuster(banner.PicURL),
        PicURL2: getImageUrlWithCacheBuster(banner.PicURL2)
      }))

      adMiddle.value = result['2']?.[0] || null
      adLeft.value = result['3']?.[0] || null
      adRight.value = result['4']?.[0] || null
    } else {
      console.error('獲取 Banner 失敗:', result.msg)
    }
  } catch (error) {
    console.error('Banner API 錯誤:', error)
  }
}

const handleBannerClick = (banner) => {
  if (!banner.JumpURL) return

  // 點擊廣告API
  trackBannerClickApi(banner.No).catch(err => console.error('追蹤點擊失敗:', err))

  // 跳轉
  if (banner.URLType === 1) {
    router.push(banner.JumpURL)
  } else if (banner.URLType === 2) {
    window.open(banner.JumpURL, '_blank')
  }
}

const currentIndex = ref(0)
let timer = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  timer = setInterval(() => {
    nextSlide()
  }, 3500)
}

const pauseAutoPlay = () => {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  startAutoPlay()
  loadGames()
  loadBanners()
})

onUnmounted(() => {
  pauseAutoPlay()
})

</script>

<style scoped>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.home-view {
  width: 100%;
}

.hero-banner {
  position: relative;
  width: 100%;
  aspect-ratio: 1440 / 450;
  max-height: 580px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  background-color: var(--color-border-light);
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-img-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.carousel-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  width: 24px;
  border-radius: 5px;
  background-color: #ffffff;
}

.feed-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 60px;
}

.ad-wrapper {
  width: 100%;
  display: flex;
  gap: 20px;
}

.ad-wrapper>* {
  flex: 1;
}

@media (max-width: 768px) {
  .hero-banner {
    margin-bottom: 24px;
    aspect-ratio: 1080 / 650;
  }

  .feed-container {
    gap: 32px;
  }

  .ad-wrapper.half-ad {
    flex-direction: column;
  }
}
</style>
