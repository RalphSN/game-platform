<template>
  <div class="games-view">
    <section class="filter-section">
      <div class="filter-header">
        <h2>{{ $t('gamesView.filterTitle') }}</h2>

        <div class="mode-switch-container" @click="toggleMatchMode">
          <div class="mode-track">
            <div class="mode-thumb" :class="{ 'move-right': isFullyMatch }"></div>

            <div class="mode-item" :class="{ active: !isFullyMatch }" :title="$t('gamesView.looseMatch')">
              <svg xmlns="http://www.w3.org/2000/svg" class="mode-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </div>

            <div class="mode-item" :class="{ active: isFullyMatch }" :title="$t('gamesView.exactMatch')">
              <svg xmlns="http://www.w3.org/2000/svg" class="mode-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </div>
          </div>
          <span class="mode-desc">{{ isFullyMatch ? $t('gamesView.matchAll') : $t('gamesView.matchAny') }}</span>
        </div>
      </div>

      <div v-for="(category, cIndex) in categoryList" :key="cIndex" class="category-row">
        <h3 class="category-title">{{ $t(category.titleKey) }}</h3>

        <div class="options-container">
          <button v-for="(opt, oIndex) in category.list" :key="opt.id" class="option-btn"
            :class="{ 'active': Array.isArray(selectedIds[category.key]) ? selectedIds[category.key].includes(opt.id) : selectedIds[category.key] === opt.id }"
            :style="{ animationDelay: `${(cIndex * 0.1) + (oIndex * 0.03)}s` }"
            @click="updateSelection(category.key, opt.id)">
            {{ $t(opt.nameKey) }}
          </button>
        </div>
      </div>
    </section>

    <section class="result-section">
      <div class="result-header">
        <h3>{{ $t('gamesView.filterResult') }} <span class="result-count">({{ filteredGames.length }})</span></h3>
      </div>

      <div class="game-grid" :key="refreshKey">
        <template v-if="!isLoading">
          <div v-for="(game, index) in filteredGames" :key="game.GameAutoNo || index" class="animated-card"
            :style="{ animationDelay: `${index * 0.04}s` }">
            <GameCard :game="game" />
          </div>
        </template>
        <div v-else class="loading-wrapper">
          <LoadingSpinner text="loading..." />
        </div>
      </div>

      <div v-if="filteredGames.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <p>{{ $t('gamesView.noResult') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFilteredGamesApi } from '@/assets/utils/api'
import { useUserStore } from '@/stores/user'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const userStore = useUserStore()

// const categoryList = ref([
//   {
//     title: '遊戲類別',
//     key: 'genre',
//     list: [
//       { id: 0, name: '全部' },
//       { id: 1, name: '休閒益智' },
//       { id: 2, name: '動作闖關' },
//       { id: 3, name: '策略塔防' },
//       { id: 4, name: '模擬經營' },
//       { id: 5, name: '競技對戰' },
//       { id: 6, name: '角色冒險' },
//       { id: 7, name: '精選合集' }
//     ]
//   },
//   {
//     title: '遊戲狀態',
//     key: 'mode',
//     list: [
//       { id: 0, name: '全部' },
//       { id: 1, name: '已解鎖' },
//       { id: 2, name: '未解鎖' }
//     ]
//   }
// ])

const categoryList = ref([
  {
    titleKey: 'gamesView.genre',
    key: 'genre',
    list: [
      { id: 0, nameKey: 'gamesView.all' },
      { id: 1, nameKey: 'category.1' },
      { id: 2, nameKey: 'category.2' },
      { id: 3, nameKey: 'category.3' },
      { id: 4, nameKey: 'category.4' },
      { id: 5, nameKey: 'category.5' },
      { id: 6, nameKey: 'category.6' },
      { id: 7, nameKey: 'category.7' }
    ]
  },
  {
    titleKey: 'gamesView.status',
    key: 'mode',
    list: [
      { id: 0, nameKey: 'gamesView.all' },
      { id: 1, nameKey: 'gamesView.unlocked' },
      { id: 2, nameKey: 'gamesView.locked' }
    ]
  }
])

const selectedIds = ref({
  genre: [0], // 陣列多選
  mode: 0 // 純數字單選
})

const isFullyMatch = ref(false)

const filteredGames = ref([])
const isLoading = ref(true)

const fetchGames = async () => {
  isLoading.value = true
  try {

    // 測試用延遲
    // await new Promise(resolve => setTimeout(resolve, 2000))

    let labelTypeStr = ''
    if (!selectedIds.value.genre.includes(0)) {
      labelTypeStr = selectedIds.value.genre.join(',')
    }

    const conformAnyStr = isFullyMatch.value ? 'N' : 'Y'

    const gameStatusNum = selectedIds.value.mode

    const result = await fetchFilteredGamesApi(
      userStore.account,
      userStore.token,
      labelTypeStr,
      conformAnyStr,
      gameStatusNum
    )

    if (result.code === 0 || result.code === 888) {
      filteredGames.value = result.da || []
    } else {
      console.error('獲取篩選結果失敗:', result.msg)
      filteredGames.value = []
    }
  } catch (error) {
    console.error('API 錯誤:', error)
    filteredGames.value = []
  } finally {
    isLoading.value = false
  }
}

const refreshKey = computed(() => {
  return JSON.stringify(selectedIds.value) + isFullyMatch.value
})

const toggleMatchMode = () => {
  isFullyMatch.value = !isFullyMatch.value
  fetchGames()
}

const updateSelection = (type, tagId) => {
  if (type === 'mode') {
    // 單選邏輯 (解鎖狀態)
    selectedIds.value[type] = tagId
  } else {
    // 多選邏輯 (遊戲類別)
    let ids = [...selectedIds.value[type]]

    if (tagId === 0) {
      ids = [0] // 如果點了全部，清空其他選項
    } else {
      if (ids.includes(0)) {
        ids = [] // 如果原本有全部，把它移除
      }
      const index = ids.indexOf(tagId)
      if (index > -1) {
        ids.splice(index, 1) // 取消選取
      } else {
        ids.push(tagId) // 加入選取
      }
      if (ids.length === 0) {
        ids = [0] // 預設回到選全部
      }
    }
    selectedIds.value[type] = ids
  }
  fetchGames()
}

onMounted(() => {
  fetchGames()
})

// const allGames = ref(mockDatabase)

// const filteredGames = computed(() => {
//   return allGames.value.filter(game => {
//     const genreFilter = selectedIds.value.genre
//     const isGenreMatch = genreFilter.includes(0) || genreFilter.some(id => game.tags.genre.includes(id))

//     const modeFilter = selectedIds.value.mode
//     const isModeMatch = modeFilter === 0 || game.tags.mode === modeFilter

//     // 匹配模式
//     if (!isFullyMatch.value) {
//       // 寬鬆匹配 (符合任一條件)
//       if (genreFilter.includes(0) && modeFilter === 0) return true;
//       if (genreFilter.includes(0)) return isModeMatch;
//       if (modeFilter === 0) return isGenreMatch;
//       return isGenreMatch || isModeMatch;
//     } else {
//       // 精準匹配 (符合所有條件)
//       return isGenreMatch && isModeMatch;
//     }
//   })
// })
</script>

<style scoped>
@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.games-view {
  width: 100%;
}

.filter-section {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
  border-left: 4px solid var(--color-primary);
  padding-left: 12px;
  margin: 0;
}

.mode-switch-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
}

.mode-track {
  position: relative;
  display: flex;
  background-color: var(--color-bg-page);
  border-radius: 40px;
  padding: 4px;
  width: 140px;
  height: 36px;
  box-shadow: inset 0 2px 4px var(--color-shadow-main);
}

.mode-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background-color: var(--color-primary);
  border-radius: 34px;
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mode-thumb.move-right {
  transform: translateX(100%);
}

.mode-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: var(--color-text-sub);
  transition: color 0.3s;
}

.mode-item.active {
  color: var(--color-text-white);
}

.mode-icon {
  width: 20px;
  height: 20px;
}

.mode-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 6px;
}

.category-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.category-row:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 0.95rem;
  color: var(--color-text-main);
  font-weight: 600;
  width: 100px;
  flex-shrink: 0;
  margin: 0;
  padding-top: 8px;
}

.options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1;
}

.option-btn {
  background-color: var(--color-bg-page);
  border: 1px solid transparent;
  color: var(--color-text-sub);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  animation: fadeSlideUp 0.4s ease-out forwards;
}

.option-btn:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.option-btn.active {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  box-shadow: 0 4px 10px rgba(94, 96, 206, 0.3);
}

.result-section {
  width: 100%;
}

.result-header {
  margin-bottom: 24px;
}

.result-header h3 {
  font-size: 1.25rem;
  color: var(--color-text-main);
  margin: 0;
}

.result-count {
  color: var(--color-text-muted);
  font-size: 1rem;
  font-weight: normal;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.animated-card {
  opacity: 0;
  animation: fadeSlideUp 0.5s ease-out forwards;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--color-text-sub);
  font-size: 1rem;
}

.loading-wrapper {
  grid-column: 1 / -1;
  /* 讓載入動畫橫跨所有的 grid 欄位 */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  /* 給予最小高度避免畫面跳動過大 */
}

@media (max-width: 1024px) {
  .game-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
  }

  .category-row {
    flex-direction: column;
    gap: 12px;
  }

  .category-title {
    width: 100%;
    padding-top: 0;
  }

  .game-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .mode-switch-container {
    align-items: flex-start;
  }

  .options-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .mode-switch-container {
    align-self: flex-start;
  }
}
</style>
