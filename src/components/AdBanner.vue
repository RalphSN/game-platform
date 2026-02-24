<template>
  <a :href="ad.link" target="_blank" class="ad-banner" @click="trackAdClick">
    <img :src="ad.imageUrl" :alt="ad.title" class="ad-img" loading="lazy" />

    <div class="ad-badge">AD</div>

    <div class="shine-effect"></div>
  </a>
</template>

<script setup>
const props = defineProps({
  ad: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '預設廣告',
      imageUrl: 'https://via.placeholder.com/1200x200?text=Advertisement',
      link: '#'
    })
  }
})

// 模擬廣告點擊追蹤 API
const trackAdClick = () => {
  console.log(`[Mock API] 記錄廣告點擊: ID ${props.ad.id}`)
}
</script>

<style scoped>
.ad-banner {
  display: block;
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--color-shadow-main);
  transition: transform 0.2s ease;
  /* 設定一個基本的長寬比，避免圖片載入前畫面跳動 */
  aspect-ratio: 21 / 9;
  background-color: var(--color-border-light);
}

.ad-banner:hover {
  transform: translateY(-2px);
}

.ad-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 確保圖片不變形填滿容器 */
}

/* 廣告右上角標示 */
.ad-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--color-text-white);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 1px;
}

/* --- UIUX：Hover 時的光澤掃過特效 --- */
.shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%);
  transform: skewX(-20deg);
  transition: none;
}

.ad-banner:hover .shine-effect {
  animation: shine 0.7s ease-in-out;
}

@keyframes shine {
  0% {
    left: -100%;
  }

  100% {
    left: 200%;
  }
}

/* 手機版時稍微調整廣告的長寬比，避免太扁 */
@media (max-width: 768px) {
  .ad-banner {
    aspect-ratio: 16 / 9;
  }
}
</style>
