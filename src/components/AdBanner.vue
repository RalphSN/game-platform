<template>
  <a :href="ad.link" target="_blank" class="ad-banner" @click="trackAdClick">
    <picture>
      <source v-if="ad.imageUrlMobile" media="(max-width: 768px)" :srcset="ad.imageUrlMobile" />
      <img :src="ad.imageUrl" :alt="ad.title" class="ad-img" loading="lazy" />
    </picture>

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
      imageUrl: 'https://via.placeholder.com/1200x200?text=AD',
      imageUrlMobile: null,
      link: '#'
    })
  }
})

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
  aspect-ratio: 1440 / 300;
  background-color: var(--color-border-light);
}

.ad-banner:hover {
  transform: translateY(-2px);
}

.ad-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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

@media (max-width: 768px) {
  .ad-banner {
    aspect-ratio: 1080 / 280;
  }
}
</style>
