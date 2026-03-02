<template>
  <transition name="fade-slide">
    <button v-show="isVisible" class="go-top-btn" @click="scrollToTop" aria-label="回到最上方">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
        stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.go-top-btn {
  position: fixed;
  right: 32px;
  bottom: 40px;
  width: 48px;
  height: 48px;
  background: var(--color-bg-content);
  color: var(--color-primary);
  border: 2px solid var(--color-border-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 12px var(--color-shadow-main);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.go-top-btn svg {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.go-top-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-white);
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(94, 96, 206, 0.4);
}

.go-top-btn:hover svg {
  transform: translateY(-2px);
}

.go-top-btn:active {
  transform: translateY(0) scale(0.95);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .go-top-btn {
    right: 16px;
    bottom: calc(84px + env(safe-area-inset-bottom));
    width: 40px;
    height: 40px;
  }

  .go-top-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
