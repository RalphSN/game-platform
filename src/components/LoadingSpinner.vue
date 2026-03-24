<template>
  <div class="spinner-container">
    <svg class="spinner" :width="size" :height="size" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" :stroke="color" stroke-width="5"></circle>
    </svg>
    <p v-if="text" class="loading-text" :style="{ color: color }">{{ text }}</p>
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
    default: '載入中...' // 預設顯示文字，傳入空字串則不顯示
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
  animation: rotate 2s linear infinite;
}

.spinner .path {
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
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

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
