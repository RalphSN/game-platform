<template>
  <div class="news-detail-view">
    <div class="news-detail-container fade-in-up">

      <div class="detail-header">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回列表
        </button>
      </div>

      <article class="article-content">
        <template v-if="isLoading">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton-meta-group">
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-date"></div>
          </div>
          <div class="skeleton-body">
            <div class="skeleton skeleton-text w-100"></div>
            <div class="skeleton skeleton-text w-100"></div>
            <div class="skeleton skeleton-text w-80"></div>
            <br>
            <div class="skeleton skeleton-text w-100"></div>
            <div class="skeleton skeleton-text w-90"></div>
            <div class="skeleton skeleton-text w-60"></div>
          </div>
        </template>

        <template v-else>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="news-tag" :class="getCategoryClass(article.category)">{{ article.category }}</span>
            <span class="article-date">{{ article.date }}</span>
          </div>

          <div class="article-body" v-html="article.content"></div>
        </template>
      </article>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)

const article = ref({
  id: 0,
  title: '',
  category: '',
  date: '',
  content: ''
})

const goBack = () => {
  router.push('/news')
}

const getCategoryClass = (category) => {
  switch (category) {
    case '活動公告': return 'cat-event'
    case '維護公告': return 'cat-maintain'
    default: return 'cat-news'
  }
}

const fetchNewsDetail = async (id) => {
  isLoading.value = true
  return new Promise((resolve) => {
    setTimeout(() => {
      article.value = {
        id: id,
        title: '《鍛劍開天》S5 賽季火熱開啟！多重福利等你拿',
        category: '活動公告',
        date: '2023-11-20 14:00:00',
        content: `
          <p>親愛的玩家您好：</p>
          <p>感謝各位玩家長久以來的支持！《鍛劍開天》S5 全新賽季即將於明日正式開啟！本次賽季將帶來全新的武將系統以及更豐富的跨服戰役，請各位玩家提早做好準備。</p>
          <br>
          <h3>🔥 S5 賽季專屬福利 🔥</h3>
          <p>1. <strong>登入即送</strong>：賽季首日登入遊戲，即可於信箱領取「S5 啟航禮包」，內含高級招募券 x10、綁定金幣 x5000。</p>
          <p>2. <strong>經驗加倍</strong>：首週全伺服器打怪經驗值提升 150%，助您快速衝刺等級！</p>
          <p>3. <strong>新首領登場</strong>：全新世界 BOSS「煉獄魔龍」將於每晚 20:00 降臨，參與擊殺有機會獲得絕版神裝。</p>
          <br>
          <p>詳細的更新內容與數值調整，請參閱遊戲內的「更新日誌」面板。祝各位在新的賽季中武運昌隆！</p>
          <p>《點點趣星球》營運團隊 敬上</p>
        `
      }
      isLoading.value = false
      resolve()
    }, 1200)
  })
}

onMounted(() => {
  window.scrollTo(0, 0)
  const newsId = route.params.id || 101
  fetchNewsDetail(newsId)
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

.news-detail-view {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0 60px;
}

.news-detail-container {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.detail-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--color-border-light);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-text-sub);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.back-btn:hover {
  color: var(--color-primary);
}

.article-content {
  padding: 40px 32px;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 20px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.news-tag {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
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

.article-date {
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-text-sub);
}

.article-body :deep(h3) {
  color: var(--color-text-main);
  margin: 24px 0 16px;
  font-size: 1.3rem;
}

.article-body :deep(p) {
  margin: 0 0 16px;
}

.article-body :deep(strong) {
  color: var(--color-primary);
  font-weight: 600;
}

.skeleton-title {
  height: 40px;
  width: 80%;
  border-radius: 8px;
  margin-bottom: 24px;
}

.skeleton-meta-group {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.skeleton-tag {
  width: 80px;
  height: 28px;
  border-radius: 12px;
}

.skeleton-date {
  width: 140px;
  height: 28px;
  border-radius: 4px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-text {
  height: 20px;
  border-radius: 4px;
}

.w-100 {
  width: 100%;
}

.w-90 {
  width: 90%;
}

.w-80 {
  width: 80%;
}

.w-60 {
  width: 60%;
}

@media (max-width: 768px) {
  .detail-header {
    padding: 16px 20px;
  }

  .article-content {
    padding: 24px 20px;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-body {
    font-size: 1rem;
  }

  .skeleton-title {
    width: 100%;
    height: 60px;
  }
}
</style>
