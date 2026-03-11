<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="search-modal-overlay" @click.self="closeModal">
      <div class="search-modal-content">

        <div class="search-input-area">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input ref="searchInput" v-model="keyword" type="text" placeholder="搜尋遊戲名稱或類型..." @input="handleInput"
            @keyup.enter="handleEnterKey" />
          <button v-if="keyword" class="clear-btn" @click="clearKeyword">✕</button>
          <button class="close-modal-btn" @click="closeModal">關閉</button>
        </div>

        <div class="search-results-area" v-if="keyword">
          <div v-if="isSearching" class="loading-state">搜尋中...</div>
          <div v-else-if="searchResults.length > 0" class="result-list">
            <div v-for="game in searchResults" :key="game.id" class="result-item" @click="goToGame(game.id)">
              <img :src="game.thumb" :alt="game.title" class="result-thumb" />
              <div class="result-info">
                <div class="result-title" v-html="highlightText(game.title, keyword)"></div>
                <div class="result-category">{{ game.category }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">找不到符合「{{ keyword }}」的遊戲</div>
        </div>

        <div class="search-default-area" v-else>
          <div class="section-block" v-if="history.length > 0">
            <div class="section-header">
              <h3>最近搜尋</h3>
              <button class="text-action" @click="clearHistory">清除</button>
            </div>
            <div class="tag-list">
              <span v-for="item in history" :key="item" class="tag" @click="applyKeyword(item)">{{ item }}</span>
            </div>
          </div>

          <div class="section-block">
            <div class="section-header">
              <h3>熱門搜尋</h3>
            </div>
            <div class="tag-list">
              <span v-for="item in hotKeywords" :key="item" class="tag hot-tag" @click="applyKeyword(item)">{{ item
                }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { fetchHotKeywords, searchGames } from '@/assets/utils/api'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['update:isOpen'])
const router = useRouter()

const searchInput = ref(null)
const keyword = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const history = ref([])
const hotKeywords = ref([])

let debounceTimer = null

// 自動聚焦功能
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

const closeModal = () => {
  emit('update:isOpen', false)
  keyword.value = ''
  searchResults.value = []
}

const clearKeyword = () => {
  keyword.value = ''
  searchResults.value = []
  // 清除後重新聚焦
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const loadHistory = () => {
  const saved = localStorage.getItem('search_history')
  if (saved) {
    history.value = JSON.parse(saved)
  }
}

const saveHistory = (term) => {
  if (!term.trim()) return
  const newHistory = [term, ...history.value.filter(i => i !== term)].slice(0, 5)
  history.value = newHistory
  localStorage.setItem('search_history', JSON.stringify(newHistory))
}

const clearHistory = () => {
  history.value = []
  localStorage.removeItem('search_history')
}

const fetchHot = async () => {
  const res = await fetchHotKeywords()
  if (res.code === 0) hotKeywords.value = res.data
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
    const res = await searchGames(keyword.value.trim())
    if (res.code === 0) searchResults.value = res.data
    isSearching.value = false
  }, 400)
}

const applyKeyword = (term) => {
  keyword.value = term
  handleInput()
}

const goToGame = (id) => {
  saveHistory(keyword.value)
  closeModal()
  router.push(`/game/${id}`)
}

// 修正連按兩次 Enter 的錯誤
const handleEnterKey = () => {
  if (!keyword.value.trim()) return
  if (isSearching.value) return
  goToSearchPage()
}

const goToSearchPage = () => {
  saveHistory(keyword.value)
  const queryWord = keyword.value
  closeModal()
  router.push(`/search?q=${encodeURIComponent(queryWord)}`)
}

// 高亮關鍵字功能
const highlightText = (text, query) => {
  if (!query) return text
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return safeText.replace(regex, '<span class="highlight">$1</span>')
}

onMounted(() => {
  loadHistory()
  fetchHot()
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
