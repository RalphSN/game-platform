<template>
  <div class="home-view">
    <section class="hero-banner fade-in-up" style="animation-delay: 0s;" @mouseenter="pauseAutoPlay"
      @mouseleave="startAutoPlay">
      <transition-group name="fade" tag="div" class="carousel-inner">
        <picture v-for="(banner, index) in banners" :key="banner.No" v-show="currentIndex === index"
          class="hero-img-container" @click="handleBannerClick(banner)" style="cursor: pointer;">
          <source media="(max-width: 768px)" :srcset="banner.PicURL2" referrerpolicy="no-referrer" />
          <img :src="banner.PicURL" alt="活動 Banner" class="hero-img" referrerpolicy="no-referrer" />
        </picture>
      </transition-group>

      <div class="carousel-indicators">
        <span v-for="(banner, index) in banners" :key="banner.No" :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"></span>
      </div>
    </section>

    <div class="feed-container">
      <div v-if="isLoading" style="text-align: center; padding: 40px;">載入中...</div>

      <template v-else>
        <GameSection class="fade-in-up" style="animation-delay: 0.1s;" title="熱門推薦" icon="🔥" categoryId="hot"
          :games="hotGames.slice(0, 6)" />

        <div v-if="adMiddle" class="ad-wrapper fade-in-up" style="animation-delay: 0.2s;">
          <AdBanner :ad="adMiddle" />
        </div>

        <GameSection class="fade-in-up" style="animation-delay: 0.3s;" title="動作冒險" icon="⚔️" categoryId="action"
          :games="actionGames.slice(0, 6)" />

        <GameSection class="fade-in-up" style="animation-delay: 0.4s;" title="休閒益智" icon="🧩" categoryId="puzzle"
          :games="puzzleGames.slice(0, 6)" />

        <div v-if="adLeft || adRight" class="ad-wrapper half-ad fade-in-up" style="animation-delay: 0.5s;">
          <AdBanner v-if="adLeft" :ad="adLeft" />
          <AdBanner v-if="adRight" :ad="adRight" />
        </div>

        <GameSection class="fade-in-up" style="animation-delay: 0.6s;" title="角色扮演" icon="🛡️" categoryId="rpg"
          :games="rpgGames.slice(0, 6)" />

        <GameSection class="fade-in-up" style="animation-delay: 0.7s;" title="香蕉遊戲" icon="🍌" categoryId="banana"
          :games="bananaGames.slice(0, 6)" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fetchGameListAllApi, fetchBannerListAllApi, trackBannerClickApi } from '@/assets/utils/api'
import { useUserStore } from '@/stores/user'
import GameSection from '@/components/GameSection.vue'
import AdBanner from '@/components/AdBanner.vue'

import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 儲存各分類遊戲
const hotGames = ref([])     // 對應分類 7 (精選合集/熱門)
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

// 獲取資料
const loadGames = async () => {
  isLoading.value = true
  try {
    // 如果是訪客模式 userStore.account 會是空的
    const result = await fetchGameListAllApi(userStore.account, userStore.token)

    if (result.code === 0) {
      hotGames.value = result['7'] || []
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

    if (result.code === 0) {
      banners.value = result['1'] || []

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
  aspect-ratio: 1440 / 580;
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
