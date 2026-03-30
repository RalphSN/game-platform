<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="search-modal-overlay" @click.self="closeModal">
      <div class="search-modal-content">

        <div class="search-input-area">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input ref="searchInput" v-model="keyword" type="text" :placeholder="$t('searchModal.placeholder')" @input="handleInput"
            @keyup.enter="handleEnterKey" />
          <button v-if="keyword" class="clear-btn" @click="clearKeyword">✕</button>
          <button class="close-modal-btn" @click="closeModal">{{ $t('searchModal.close') }}</button>
        </div>

        <div class="search-results-area" v-if="keyword">
          <div v-if="isSearching" class="loading-state">{{ $t('searchModal.searching') }}</div>
          <div v-else-if="searchResults.length > 0" class="result-list">
            <div v-for="game in searchResults" :key="game.id" class="result-item" @click="goToGame(game.id)">
              <img :src="game.thumb" :alt="game.title" class="result-thumb" />
              <div class="result-info">
                <div class="result-title" v-html="highlightText(game.title, keyword)"></div>
                <div class="result-category">{{ game.category }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">{{ $t('searchModal.noResultFound', { keyword: keyword }) }}</div>
        </div>

        <div class="search-default-area" v-else>
          <div class="section-block" v-if="userStore.token && recentSearches.length > 0">
            <div class="section-header">
              <h3>{{ $t('searchModal.recentSearches') }}</h3>
            </div>
            <div class="tag-list">
              <span v-for="item in recentSearches" :key="item" class="tag" @click="applyKeyword(item)">
                {{ item }}
              </span>
            </div>
          </div>

          <div class="section-block" v-if="hotSearches.length > 0">
            <div class="section-header">
              <h3>{{ $t('searchModal.hotSearches') }}</h3>
            </div>
            <div class="tag-list">
              <span v-for="item in hotSearches" :key="item" class="tag hot-tag" @click="applyKeyword(item)">
                {{ item }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getRecentSearchApi, getHotSearchApi, fetchFilteredGamesApi } from '@/assets/utils/api'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import { useUserStore } from '@/stores/user'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['update:isOpen'])
const router = useRouter()
const userStore = useUserStore()

const searchInput = ref(null)
const keyword = ref('')
const isSearching = ref(false)
const searchResults = ref([])

const recentSearches = ref([])
const hotSearches = ref([])

let debounceTimer = null

// 分類名稱轉換
const getCategoryName = (labelStr) => {
  if (!labelStr) return t('gameCard.uncategorized')
  const firstCode = labelStr.split(',')[0]

  if (['1', '2', '3', '4', '5', '6', '7'].includes(firstCode)) {
    return t(`category.${firstCode}`)
  }
  return t('gameCard.uncategorized')
}

const closeModal = () => {
  emit('update:isOpen', false)
  keyword.value = ''
  searchResults.value = []
}

const clearKeyword = () => {
  keyword.value = ''
  searchResults.value = []
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const handleInput = () => {
  clearTimeout(debounceTimer)
  if (!keyword.value.trim()) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      // 呼叫真實 API，設定 Length = 4 (只抓 4 筆當預覽)
      const res = await fetchFilteredGamesApi(
        userStore.account || '',
        userStore.token || '',
        '0', 'N', 0,
        keyword.value.trim(),
        0, 4
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
      console.error('預覽搜尋發生錯誤:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 400) // 停下打字 400 毫秒後才發 API
}

const handleEnterKey = () => {
  const finalKeyword = keyword.value.trim()
  if (!finalKeyword) return

  closeModal()
  router.push(`/search?q=${encodeURIComponent(finalKeyword)}`)
}

const applyKeyword = (term) => {
  keyword.value = term
  handleEnterKey()
}

const goToGame = (id) => {
  closeModal()
  router.push(`/game/${id}`)
}

const highlightText = (text, query) => {
  if (!query) return text
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return safeText.replace(regex, '<span class="highlight">$1</span>')
}

// 撈取熱門與最近搜尋資料
const fetchKeywords = async () => {
  try {
    const hotRes = await getHotSearchApi(6)
    if (hotRes.code === 0 && hotRes.key) {
      hotSearches.value = hotRes.key
    }

    if (userStore.token) {
      const recentRes = await getRecentSearchApi(userStore.account, userStore.token, 6)
      if (recentRes.code === 0 && recentRes.key) {
        recentSearches.value = recentRes.key
      }
    }
  } catch (error) {
    console.error('取得搜尋關鍵字失敗:', error)
  }
}

// 每次打開彈窗時執行
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await fetchKeywords()
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    keyword.value = ''
    searchResults.value = []
  }
})
</script>

<style scoped>
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
}

.search-modal-content {
  width: 100%;
  max-width: 640px;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  margin: 0 16px;
}

.search-input-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-light);
  gap: 12px;
}

.search-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
  color: var(--color-text-muted);
}

.search-input-area input {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--color-text-main);
  outline: none;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
}

.close-modal-btn {
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  color: var(--color-text-main);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.search-default-area,
.search-results-area {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.section-block {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 1rem;
  color: var(--color-text-sub);
  margin: 0;
}

.text-action {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  color: var(--color-text-main);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary-light);
}

.hot-tag {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
  background-color: rgba(245, 158, 11, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state,
.empty-state {
  text-align: center;
  color: var(--color-text-muted);
  padding: 32px 0;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: var(--color-bg-page);
}

.result-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.result-title {
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 4px;
}

.result-title :deep(.highlight) {
  color: var(--color-primary);
  font-weight: 700;
}

.result-category {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .search-modal-content {
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .search-modal-overlay {
    padding-top: 0;
  }

  .search-modal-content {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
  }

  .search-default-area,
  .search-results-area {
    max-height: calc(100vh - 70px);
  }
}
</style>
