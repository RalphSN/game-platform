<template>
  <div class="home-view">

    <section class="hero-banner" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
      <transition-group name="fade" tag="div" class="carousel-inner">
        <img v-for="(banner, index) in banners" :key="banner.id" v-show="currentIndex === index" :src="banner.src"
          :alt="banner.alt" class="hero-img" />
      </transition-group>

      <div class="carousel-indicators">
        <span v-for="(banner, index) in banners" :key="'dot-' + banner.id" :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"></span>
      </div>
    </section>

    <div class="feed-container">
      <GameSection title="熱門推薦" icon="🔥" categoryId="hot" :games="games.slice(0, 6)" />

      <div class="ad-wrapper">
        <AdBanner :ad="ads[0]" />
      </div>

      <GameSection title="動作冒險" icon="⚔️" categoryId="action" :games="games.slice(6, 12)" />
      <GameSection title="休閒益智" icon="🧩" categoryId="puzzle" :games="games.slice(12, 18)" />

      <div class="ad-wrapper half-ad">
        <AdBanner :ad="ads[1]" />
        <AdBanner :ad="ads[2]" />
      </div>

      <GameSection title="角色扮演" icon="🛡️" categoryId="rpg" :games="games.slice(18, 24)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameSection from '@/components/GameSection.vue'
import AdBanner from '@/components/AdBanner.vue'

// ==========================================
// 1. Banner 輪播邏輯
// ==========================================
// 在 Vite 中，src/assets 下的圖片必須用 import 引入
import banner1 from '@/assets/images/banner1.png'
import banner2 from '@/assets/images/banner2.png'
import banner3 from '@/assets/images/banner3.png'

const banners = ref([
  { id: 1, src: banner1, alt: '活動 Banner 1' },
  { id: 2, src: banner2, alt: '活動 Banner 2' },
  { id: 3, src: banner3, alt: '活動 Banner 3' }
])

const currentIndex = ref(0)
let timer = null

// 切換到下一張
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

// 點擊底部指示點切換
const goToSlide = (index) => {
  currentIndex.value = index
}

// 開始自動播放 (每 3.5 秒切換一次)
const startAutoPlay = () => {
  timer = setInterval(() => {
    nextSlide()
  }, 3500)
}

// 暫停自動播放 (滑鼠移入時)
const pauseAutoPlay = () => {
  if (timer) clearInterval(timer)
}

// 元件掛載時啟動計時器，卸載時清除避免記憶體流失
onMounted(() => {
  startAutoPlay()
})
onUnmounted(() => {
  pauseAutoPlay()
})

// ==========================================
// 2. Mock API 資料 (不變)
// ==========================================
const mockGames = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `網頁遊戲 ${i + 1}`,
  thumb: `https://picsum.photos/seed/${i + 1}/300/300`,
  category: i % 3 === 0 ? '角色扮演' : i % 2 === 0 ? '休閒益智' : '動作冒險',
  players: Math.floor(Math.random() * 50000) + 1000
}))

const mockAds = Array.from({ length: 10 }, (_, i) => ({
  id: 100 + i,
  title: `推薦廣告 ${i + 1}`,
  imageUrl: `https://via.placeholder.com/1200x200/5E60CE/FFFFFF?text=AD+${i + 1}`,
  link: '#'
}))

const games = ref(mockGames)
const ads = ref(mockAds)
</script>

<style scoped>
.home-view {
  width: 100%;
}

/* --- Banner 輪播區塊樣式 --- */
.hero-banner {
  position: relative;
  width: 100%;
  /* 使用 aspect-ratio 讓高度根據寬度自適應縮放，維持大約 1440:400 的比例 */
  aspect-ratio: 1440 / 400;
  max-height: 400px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  background-color: var(--color-border-light);
  /* 圖片載入前的底色 */
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 漸隱漸顯 (Fade) 動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 底部指示點樣式 */
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

/* 當前啟用的指示點會變長、變亮 */
.carousel-indicators span.active {
  width: 24px;
  border-radius: 5px;
  background-color: #ffffff;
}

/* --- 原有排版樣式 --- */
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
    /* 手機版可能稍微調高比例避免圖片太扁 */
    aspect-ratio: 16 / 9;
  }

  .feed-container {
    gap: 32px;
  }

  .ad-wrapper.half-ad {
    flex-direction: column;
  }
}
</style>
