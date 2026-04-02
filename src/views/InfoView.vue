<template>
  <div class="info-container fade-in-up">
    <div class="info-card">
      <h1 class="info-title">{{ currentData.title }}</h1>
      <div class="info-content" v-html="currentData.content"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t, te } = useI18n()

const currentData = computed(() => {
  let id = route.params.id

  if (!te(`info.${id}.title`)) {
    id = 'terms'
  }

  return {
    title: t(`info.${id}.title`),
    content: t(`info.${id}.content`)
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.info-container {
  display: flex;
  justify-content: center;
  padding: 40px 24px;
  min-height: calc(100vh - 200px);
}

.info-card {
  width: 100%;
  max-width: 900px;
  background-color: var(--color-bg-content);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 8px 32px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
}

.info-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-main);
  margin: 0 0 32px 0;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
}

:deep(.info-content h3) {
  color: var(--color-text-main);
  font-size: 1.25rem;
  margin: 32px 0 16px;
  font-weight: 700;
}

:deep(.info-content p) {
  color: var(--color-text-sub);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 16px;
}

:deep(.info-content ul) {
  color: var(--color-text-sub);
  font-size: 1rem;
  line-height: 1.8;
  padding-left: 24px;
  margin-bottom: 16px;
}

:deep(.info-content li) {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .info-container {
    padding: 32px 20px;
  }

  .info-card {
    padding: 40px 32px;
    border-radius: 20px;
  }

  .info-title {
    font-size: 1.75rem;
    margin-bottom: 24px;
    padding-bottom: 20px;
  }

  :deep(.info-content h3) {
    font-size: 1.15rem;
    margin: 24px 0 12px;
  }
}

@media (max-width: 480px) {
  .info-container {
    padding: 24px 16px;
  }

  .info-card {
    padding: 32px 20px;
    border-radius: 16px;
  }

  .info-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  :deep(.info-content h3) {
    font-size: 1.1rem;
    margin: 20px 0 10px;
  }

  :deep(.info-content p),
  :deep(.info-content ul) {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  :deep(.info-content ul) {
    padding-left: 20px;
  }
}
</style>
