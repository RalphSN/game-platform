<template>
  <div class="ad-banner" @click="handleAdClick" style="cursor: pointer;">
    <picture>
      <source v-if="ad.PicURL2" media="(max-width: 768px)" :srcset="getImageUrlWithCacheBuster(ad.PicURL2)"
        referrerpolicy="no-referrer" />

      <img :src="getImageUrlWithCacheBuster(ad.PicURL)" alt="廣告" class="ad-img" loading="lazy"
        referrerpolicy="no-referrer" />
    </picture>

    <div class="ad-badge">AD</div>
    <div class="shine-effect"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { trackBannerClickApi } from '@/assets/utils/api'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'

const router = useRouter()

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
