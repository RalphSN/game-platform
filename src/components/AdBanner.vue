<template>
  <div class="ad-banner" :class="{ 'is-loading': !isImageLoaded, 'is-half': isHalf }" @click="handleAdClick"
    style="cursor: pointer;">
    <picture>
      <source v-if="ad.PicURL2" media="(max-width: 768px)" :srcset="getImageUrlWithCacheBuster(ad.PicURL2)"
        referrerpolicy="no-referrer" />

      <img :src="getImageUrlWithCacheBuster(ad.PicURL)" @load="onImageLoad" alt="廣告" class="ad-img" loading="lazy"
        referrerpolicy="no-referrer" />
    </picture>

    <div v-show="isImageLoaded" class="ad-badge">AD</div>
    <div v-show="isImageLoaded" class="shine-effect"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { trackBannerClickApi } from '@/assets/utils/api'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import { ref } from 'vue'

const router = useRouter()

const isImageLoaded = ref(false)

const onImageLoad = () => {
  isImageLoaded.value = true
  // setTimeout(() => {
  //   isImageLoaded.value = true
  // }, 10000)
}

const props = defineProps({
  ad: {
    type: Object,
    required: true,
    default: () => ({
      No: 0,
      URLType: 0,
      JumpURL: '',
      PicURL: 'https://via.placeholder.com/1200x200?text=AD',
      PicURL2: ''
    })
  },
  isHalf: {
    type: Boolean,
    default: false
  }
})

const handleAdClick = () => {
  if (!props.ad.JumpURL) return

  // 點擊廣告API
  trackBannerClickApi(props.ad.No).catch(err => console.error('廣告追蹤失敗:', err))

  // 跳轉
  if (props.ad.URLType === 1) {
    router.push(props.ad.JumpURL)
  } else if (props.ad.URLType === 2) {
    window.open(props.ad.JumpURL, '_blank')
  }
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
  /* aspect-ratio: 708 / 300; */
  background-color: var(--color-border-light);
  cursor: pointer;
}

.ad-banner.is-half {
  aspect-ratio: 708 / 300;
  /* 並排 PC */
}

.ad-banner:hover {
  transform: translateY(-2px);
}

.ad-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.ad-banner:not(.is-loading) .ad-img {
  opacity: 1;
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

.ad-banner.is-loading {
  background-color: #cbd5e1;
}

.is-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
  animation: loadingShimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  z-index: 1;
}

@keyframes loadingShimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
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
    /* aspect-ratio: 534 / 280; */
  }

  .ad-banner.is-half {
    aspect-ratio: 534 / 280;
    /* 並排 Mobile */
  }
}
</style>
