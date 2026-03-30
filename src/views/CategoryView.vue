<template>
  <div class="category-view">
    <div class="category-header fade-in-up">
      <button class="back-btn" @click="router.back()">
        <span class="arrow">‹</span> {{ $t('categoryView.back') }}
      </button>
      <h1 class="page-title">
        <span v-if="isLoading" class="skeleton skeleton-title-text"></span>
        <span v-else>{{ $t(categoryTitleKey) }}</span>
      </h1>
    </div>

    <div v-if="isLoading" class="games-grid">
      <div class="game-card skeleton-card" v-for="i in 12" :key="i">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-content">
          <div class="skeleton-text title"></div>
          <div class="skeleton-text tag"></div>
        </div>
      </div>
    </div>

    <div v-else class="games-grid fade-in-up" style="animation-delay: 0.1s;">
      <GameCard v-for="(game, index) in games" :key="game.GameAutoNo || index" :game="game"
        :hideFavorite="route.params.id === 'banana'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchGameListAllApi } from '@/assets/utils/api'
import { useUserStore } from '@/stores/user'
import GameCard from '@/components/GameCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(true)
const categoryTitleKey = ref('categoryView.allGames')
const games = ref([])

const categoryMapping = {
  'hot': { id: '7', titleKey: 'categoryView.categories.hot' },
  'banana': { id: '0', titleKey: 'categoryView.categories.banana' },
  'action': { id: '2', titleKey: 'categoryView.categories.action' },
  'puzzle': { id: '1', titleKey: 'categoryView.categories.puzzle' },
  'rpg': { id: '6', titleKey: 'categoryView.categories.rpg' }
}

const loadCategoryData = async (categoryId) => {
  isLoading.value = true
  games.value = []

  try {
    const config = categoryMapping[categoryId]
    if (!config) {
      categoryTitleKey.value = 'categoryView.allGames'
    } else {
      categoryTitleKey.value = config.titleKey
    }

    const result = await fetchGameListAllApi(userStore.account, userStore.token)

    if (result.code === 0) {
      if (config && result[config.id]) {
        games.value = result[config.id]
      } else {
        games.value = []
      }
    } else {
      console.error('取得分類資料失敗:', result.msg)
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  loadCategoryData(route.params.id)
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadCategoryData(newId)
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

@keyframes skeletonShimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.category-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: calc(100vh - 150px);
}

.category-header {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-sub);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.back-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-content);
}

.back-btn .arrow {
  font-size: 1.5rem;
  line-height: 1;
}

.page-title {
  font-size: 2.5rem;
  color: var(--color-text-main);
  margin: 0 0 12px 0;
  font-weight: 800;
  display: flex;
  justify-content: center;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}

/* 骨架屏 */
.skeleton-card {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.skeleton-title-text {
  width: 200px;
  height: 40px;
  border-radius: 8px;
}

.skeleton-thumb {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, var(--color-bg-page) 25%, var(--color-border-light) 50%, var(--color-bg-page) 75%);
  background-size: 400% 100%;
  animation: skeletonShimmer 2s infinite ease-in-out;
}

.skeleton-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-text {
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-bg-page) 25%, var(--color-border-light) 50%, var(--color-bg-page) 75%);
  background-size: 400% 100%;
  animation: skeletonShimmer 2s infinite ease-in-out;
}

.skeleton-text.title {
  width: 80%;
  height: 20px;
}

.skeleton-text.tag {
  width: 50%;
  height: 24px;
  border-radius: 12px;
}

/* RWD 斷點 */
@media (max-width: 1200px) {
  .games-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .category-view {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .back-btn {
    position: relative;
    top: 0;
    transform: none;
    margin-bottom: 16px;
    left: -8px;
  }

  .category-header {
    text-align: left;
  }

  .page-title {
    justify-content: flex-start;
  }

  .games-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
