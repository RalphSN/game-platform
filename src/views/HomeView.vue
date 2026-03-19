<template>
  <div class="home-view">
    <section class="hero-banner fade-in-up" style="animation-delay: 0s;" @mouseenter="pauseAutoPlay"
      @mouseleave="startAutoPlay">
      <transition-group name="fade" tag="div" class="carousel-inner">
        <picture v-for="(banner, index) in banners" :key="banner.id" v-show="currentIndex === index"
          class="hero-img-container">
          <source media="(max-width: 768px)" :srcset="banner.srcMobile" />
          <img :src="banner.src" :alt="banner.alt" class="hero-img" />
        </picture>
      </transition-group>

      <div class="carousel-indicators">
        <span v-for="(banner, index) in banners" :key="'dot-' + banner.id" :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"></span>
      </div>
    </section>

    <div class="feed-container">
      <div v-if="isLoading" style="text-align: center; padding: 40px;">載入中...</div>

      <template v-else>
        <GameSection class="fade-in-up" style="animation-delay: 0.1s;" title="熱門推薦" icon="🔥" categoryId="hot"
          :games="hotGames.slice(0, 6)" />

        <div class="ad-wrapper fade-in-up" style="animation-delay: 0.2s;">
          <AdBanner :ad="ads[0]" />
        </div>

        <GameSection class="fade-in-up" style="animation-delay: 0.3s;" title="動作冒險" icon="⚔️" categoryId="action"
          :games="actionGames.slice(0, 6)" />

        <GameSection class="fade-in-up" style="animation-delay: 0.4s;" title="休閒益智" icon="🧩" categoryId="puzzle"
          :games="puzzleGames.slice(0, 6)" />

        <div class="ad-wrapper half-ad fade-in-up" style="animation-delay: 0.5s;">
          <AdBanner :ad="ads[1]" />
          <AdBanner :ad="ads[2]" />
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
import { fetchGameListAllApi } from '@/assets/utils/api'
import { useUserStore } from '@/stores/user'
import GameSection from '@/components/GameSection.vue'
import AdBanner from '@/components/AdBanner.vue'

import banner1 from '@/assets/images/banner1.jpg'
import banner2 from '@/assets/images/banner2.jpg'
import banner3 from '@/assets/images/banner3.jpg'
import banner1m from '@/assets/images/banner1-m.jpg'
import banner2m from '@/assets/images/banner2-m.jpg'
import banner3m from '@/assets/images/banner3-m.jpg'

import ad1 from '@/assets/images/ad1.jpg'
import ad1m from '@/assets/images/ad1-m.jpg'
import ad2 from '@/assets/images/ad2.jpg'
import ad2m from '@/assets/images/ad2-m.jpg'


const userStore = useUserStore()

// 建立用來儲存各分類遊戲的變數
const hotGames = ref([])     // 對應分類 7 (精選合集/熱門)
const bananaGames = ref([])  // 對應分類 0 (香蕉遊戲)
const actionGames = ref([])  // 對應分類 2 (動作闖關)
const puzzleGames = ref([])  // 對應分類 1 (休閒益智)
const rpgGames = ref([])     // 對應分類 6 (角色冒險)

const isLoading = ref(true)

// 定義獲取資料的函數
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

const banners = ref([
  { id: 1, src: banner1, srcMobile: banner1m, alt: '活動 Banner 1' },
  { id: 2, src: banner2, srcMobile: banner2m, alt: '活動 Banner 2' },
  { id: 3, src: banner3, srcMobile: banner3m, alt: '活動 Banner 3' }
])

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
})

onUnmounted(() => {
  pauseAutoPlay()
})


const mockAds = [
  { id: 101, title: '廣告 1', imageUrl: ad1, imageUrlMobile: ad1m, link: '#' },
  { id: 102, title: '廣告 2', imageUrl: ad2, imageUrlMobile: ad2m, link: '#' },
  { id: 103, title: '廣告 3', imageUrl: ad1, imageUrlMobile: ad1m, link: '#' },
]

const ads = ref(mockAds)
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
