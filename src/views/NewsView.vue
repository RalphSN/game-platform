<template>
  <div class="news-view">
    <div class="news-header fade-in-up">
      <!-- <div class="header-icon">📢</div> -->
      <h2>最新消息</h2>
      <!-- <p>掌握點點趣星球的最新動態與活動資訊</p> -->
    </div>

    <section class="news-container fade-in-up" style="animation-delay: 0.1s;">
      <div class="filter-tabs">
        <button v-for="cat in categories" :key="cat" class="tab-btn" :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat">
          {{ cat }}
        </button>
      </div>

      <div class="news-list">
        <template v-if="isLoading">
          <div v-for="i in 4" :key="'skel-' + i" class="news-item skeleton-item">
            <div class="item-left">
              <div class="skeleton skeleton-tag"></div>
              <div class="item-content">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
              </div>
            </div>
            <div class="skeleton skeleton-date"></div>
          </div>
        </template>

        <template v-else>
          <div v-for="news in filteredNews" :key="news.id" class="news-item" @click="goToDetail(news.id)">
            <div class="item-left">
              <span class="news-tag" :class="getCategoryClass(news.category)">
                {{ news.category }}
              </span>
              <div class="item-content">
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-summary">{{ news.summary }}</p>
              </div>
            </div>
            <div class="item-right">
              <span class="news-date">{{ news.date }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="arrow-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          <div v-if="filteredNews.length === 0" class="empty-state">
            <div class="empty-icon">📂</div>
            <p>目前沒有相關公告</p>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(true)

const categories = ['全部', '最新消息', '活動公告', '維護公告']
const activeCategory = ref('全部')
const newsData = ref([])

const fetchNews = async () => {
  isLoading.value = true
  return new Promise((resolve) => {
    setTimeout(() => {
      newsData.value = [
        { id: 101, title: '《鍛劍開天》S5 賽季火熱開啟！', summary: '全新賽季帶來全新武將與多重登入福利，快來領取你的專屬獎勵...', category: '活動公告', date: '2023-11-20' },
        { id: 102, title: '伺服器例行性維護公告', summary: '為了提供更好的遊戲品質，我們將於 11/22 早上 08:00 進行例行性維護...', category: '維護公告', date: '2023-11-18' },
        { id: 103, title: '點點趣星球 會員系統升級通知', summary: '會員中心全面升級！新增多項個人化功能與安全性驗證機制...', category: '最新消息', date: '2023-11-15' },
        { id: 104, title: '歡慶萬聖節！不給糖就搗蛋限定活動', summary: '活動期間內完成指定任務，即可獲得萬聖節限定頭像框與專屬稱號...', category: '活動公告', date: '2023-10-25' },
        { id: 105, title: '修正《夢幻廚房》部分玩家卡頓問題', summary: '已修復在特定關卡中發生的卡頓異常，請玩家重整網頁即可生效...', category: '最新消息', date: '2023-10-20' }
      ]
      isLoading.value = false
      resolve()
    }, 1200)
  })
}

const filteredNews = computed(() => {
  if (activeCategory.value === '全部') return newsData.value
  return newsData.value.filter(news => news.category === activeCategory.value)
})

const getCategoryClass = (category) => {
  switch (category) {
    case '活動公告': return 'cat-event'
    case '維護公告': return 'cat-maintain'
    default: return 'cat-news'
  }
}

const goToDetail = (id) => {
  router.push(`/news/${id}`)
}

onMounted(() => {
  window.scrollTo(0, 0)
  fetchNews()
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
  animation: fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.skeleton {
  background: linear-gradient(90deg, var(--color-bg-page) 25%, var(--color-border-light) 50%, var(--color-bg-page) 75%);
  background-size: 400% 100%;
  animation: skeletonShimmer 2.5s infinite ease-in-out;
}

.news-view {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.news-header {
  text-align: center;
  padding: 10px 20px;
}

.header-icon {
  font-size: 3.5rem;
  margin-bottom: 16px;
}

.news-header h2 {
  font-size: 2rem;
  color: var(--color-text-main);
  margin: 0 0 12px;
}

.news-header p {
  color: var(--color-text-sub);
  font-size: 1.1rem;
  margin: 0;
}

.news-container {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  padding: 24px 32px;
  border-bottom: 1px solid var(--color-border-light);
  overflow-x: auto;
}

.tab-btn {
  background-color: var(--color-bg-page);
  border: 1px solid transparent;
  color: var(--color-text-sub);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.tab-btn.active {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  box-shadow: 0 4px 10px rgba(94, 96, 206, 0.3);
}

.news-list {
  display: flex;
  flex-direction: column;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color 0.2s;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background-color: var(--color-bg-page);
}

.item-left {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.news-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.cat-news {
  background-color: rgba(94, 96, 206, 0.15);
  color: #5e60ce;
}

.cat-event {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.cat-maintain {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-summary {
  font-size: 0.95rem;
  color: var(--color-text-sub);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-left: 20px;
}

.news-date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: var(--color-text-muted);
  transition: transform 0.2s;
}

.news-item:hover .arrow-icon {
  transform: translateX(4px);
  color: var(--color-primary);
}

.skeleton-item {
  pointer-events: none;
}

.skeleton-tag {
  width: 80px;
  height: 26px;
  border-radius: 12px;
}

.skeleton-title {
  width: 60%;
  height: 24px;
  border-radius: 4px;
}

.skeleton-text {
  width: 90%;
  height: 18px;
  border-radius: 4px;
}

.skeleton-date {
  width: 80px;
  height: 18px;
  border-radius: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--color-text-sub);
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .news-header {
    padding: 20px 16px 16px;
  }

  .filter-tabs {
    padding: 16px;
  }

  .news-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 16px;
  }

  .item-left {
    width: 100%;
  }

  .news-title {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .news-summary {
    display: none;
  }

  .item-right {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
    padding-left: 92px;
  }

  .skeleton-item {
    padding-left: 16px;
  }
}
</style>
