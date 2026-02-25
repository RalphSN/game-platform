<template>
  <div class="home-view">
    <section class="hero-banner" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
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

import game1 from '@/assets/images/game1.jpg'
import game2 from '@/assets/images/game2.jpg'

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
})

onUnmounted(() => {
  pauseAutoPlay()
})

const customGames = [
  { id: 1, title: '鍛劍開天', thumb: game1, category: '角色扮演', players: 8400 },
  { id: 2, title: '夢幻廚房', thumb: game2, category: '休閒益智', players: 12500 }
]

const randomGames = Array.from({ length: 28 }, (_, i) => ({
  id: i + 3,
  title: `網頁遊戲 ${i + 3}`,
  thumb: `https://picsum.photos/seed/${i + 3}/300/300`,
  category: (i + 2) % 3 === 0 ? '角色扮演' : (i + 2) % 2 === 0 ? '休閒益智' : '動作冒險',
  players: Math.floor(Math.random() * 50000) + 1000
}))

const mockGames = [...customGames, ...randomGames]

const mockAds = [
  { id: 101, title: '廣告 1', imageUrl: ad1, imageUrlMobile: ad1m, link: '#' },
  { id: 102, title: '廣告 2', imageUrl: ad2, imageUrlMobile: ad2m, link: '#' },
  { id: 103, title: '廣告 3', imageUrl: ad1, imageUrlMobile: ad1m, link: '#' },
]

const games = ref(mockGames)
const ads = ref(mockAds)
</script>

<style scoped>
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
