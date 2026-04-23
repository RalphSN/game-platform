<template>
  <div class="spinner-container">
    <svg class="spinner" :width="size" :height="size" viewBox="0 0 24 24" fill="none" :stroke="color" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <!-- 縮小右上角的箭頭頭部 -->
      <path d="M21 4.5v3.5h-3.5"></path>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
      <!-- 縮小左下角的箭頭頭部 -->
      <path d="M3 19.5v-3.5h3.5"></path>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
    </svg>
    <p v-if="text" class="loading-text" :style="{ color: color }">{{ text ?? $t('common.loading') }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 40
  },
  color: {
    type: String,
    default: 'var(--color-primary, #5e60ce)' // 預設使用主色，若無則降級為紫色
  },
  text: {
    type: String,
    default: undefined
  }
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  width: 100%;
}

.spinner {
  /* 稍微加快轉速，讓現代感與俐落感提升 */
  animation: rotate 0.75s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 1px;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
