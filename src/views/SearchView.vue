<template>
  <div class="search-view">
    <div class="search-header fade-in-up">
      <h1 class="page-title">{{ $t('searchView.title') }}</h1>
      <p class="search-meta" v-if="searchQuery">
        <span
          v-html="$t('searchView.searchingFor', { query: `<span class='highlight-query'>${searchQuery}</span>` })"></span>
        <span v-if="!isLoading && searchResults.length > 0" class="result-count">
          {{ $t('searchView.resultCount', { count: searchResults.length }) }}
        </span>
      </p>
      <p class="search-meta" v-else>{{ $t('searchView.enterKeyword') }}</p>
    </div>

    <div v-if="isLoading" class="games-grid">
      <div class="game-card skeleton-card" v-for="i in 8" :key="i">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-content">
          <div class="skeleton-text title"></div>
          <div class="skeleton-text tag"></div>
        </div>
      </div>
    </div>

    <div v-else-if="searchResults.length > 0" class="games-grid fade-in-up" style="animation-delay: 0.1s;">
      <div v-for="game in searchResults" :key="game.id" class="game-card" @click="goToGame(game.id)">
        <div class="card-thumb-wrapper">
          <img :src="game.thumb" :alt="game.title" class="game-thumb" loading="lazy" />
          <div class="play-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div class="card-info">
          <h3 class="game-title" v-html="highlightText(game.title, searchQuery)"></h3>
          <span class="game-category">{{ game.category }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && !isLoading" class="empty-state fade-in-up" style="animation-delay: 0.1s;">
      <div class="empty-icon">🛸</div>
      <h3>{{ $t('searchView.noResultTitle') }}</h3>
      <p>{{ $t('searchView.noResultDesc') }}</p>
      <button class="back-btn" @click="goToHome">{{ $t('searchView.backToHome') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchFilteredGamesApi } from '@/assets/utils/api'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import { useUserStore } from '@/stores/user'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const searchQuery = computed(() => route.query.q || '')
const isLoading = ref(false)
const searchResults = ref([])

const getCategoryName = (labelStr) => {
  if (!labelStr) return t('gameCard.uncategorized')
  const firstCode = labelStr.split(',')[0]
  if (['1', '2', '3', '4', '5', '6', '7'].includes(firstCode)) {
    return t(`category.${firstCode}`)
  }
  return t('gameCard.uncategorized')
}

const performSearch = async (keyword) => {
  if (!keyword.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    //  keyword 在第 6 個位置
    const res = await fetchFilteredGamesApi(
      userStore.account || '', // Account
      userStore.token || '',   // Token
      '0',                     // LabelType: 0 (全選)
      'N',                     // ConformAny: N
      0,                       // GameStatus: 0 (全部)
      keyword,                 // Keyword
      0,                       // Start: 從第 0 筆開始
      50                       // Length: 搜尋結果頁先要個 50 筆
    )

    if ((res.code === 0 || res.code === 888) && res.da) {
      searchResults.value = res.da.map(game => ({
        id: game.GameAutoNo,
        title: game.GameName,
        category: getCategoryName(game.LabelType),
        thumb: getImageUrlWithCacheBuster(game.IconURL)
      }))
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('搜尋發生錯誤:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const goToGame = (id) => {
  router.push(`/game/${id}`)
}

const goToHome = () => {
  router.push('/')
}

const highlightText = (text, query) => {
  if (!query) return text
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return safeText.replace(regex, '<span class="highlight-text">$1</span>')
}

// 頁面初次載入時執行搜尋
onMounted(() => {
  window.scrollTo(0, 0)
  if (searchQuery.value) {
    performSearch(searchQuery.value)
  }
})

// 監聽網址參數變化 (例如在結果頁用頂部導覽列搜尋新詞)
watch(() => route.query.q, (newQuery) => {
  if (newQuery !== undefined) {
    performSearch(newQuery)
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

.search-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: calc(100vh - 150px);
}

.search-header {
  margin-bottom: 40px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  color: var(--color-text-main);
  margin: 0 0 12px 0;
  font-weight: 800;
}

.search-meta {
  font-size: 1.1rem;
  color: var(--color-text-sub);
  margin: 0;
}

.highlight-query {
  color: var(--color-primary);
  font-weight: 700;
}

.result-count {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-left: 8px;
}

/* 遊戲網格與卡片設計 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.game-card {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px var(--color-shadow-main);
  border-color: var(--color-primary-light);
}

.card-thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.game-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .game-thumb {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  width: 48px;
  height: 48px;
  color: #fff;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.game-card:hover .play-icon {
  transform: scale(1);
}

.card-info {
  padding: 16px;
}

.game-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-title :deep(.highlight-text) {
  color: var(--color-primary);
}

.game-category {
  display: inline-block;
  font-size: 0.8rem;
  padding: 4px 10px;
  background-color: var(--color-bg-page);
  color: var(--color-text-sub);
  border-radius: 12px;
}

/* 骨架屏狀態 */
.skeleton-card {
  pointer-events: none;
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
  width: 70%;
  height: 20px;
}

.skeleton-text.tag {
  width: 40%;
  height: 24px;
  border-radius: 12px;
}

/* 找不到結果狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: var(--color-bg-content);
  border-radius: 20px;
  border: 1px dashed var(--color-border-light);
  margin-top: 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--color-text-main);
  margin: 0 0 12px 0;
}

.empty-state p {
  color: var(--color-text-sub);
  margin: 0 0 24px 0;
}

.back-btn {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .search-view {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
