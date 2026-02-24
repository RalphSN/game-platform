import { createRouter, createWebHistory } from 'vue-router'
// 引入我們剛剛寫好的首頁
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // ==========================================
    // 以下為未來擴充預留的路由，目前先註解起來
    // ==========================================

    // {
    //   path: '/games',
    //   name: 'games',
    //   // 延遲載入 (Lazy load)：只有當使用者點擊進來時才載入該頁面的程式碼，優化首頁速度
    //   component: () => import('../views/GamesView.vue')
    // },
    // {
    //   path: '/category/:categoryId',
    //   name: 'category',
    //   component: () => import('../views/CategoryView.vue')
    // },
    // {
    //   path: '/game/:id',
    //   name: 'game-detail',
    //   component: () => import('../views/GameDetailView.vue')
    // },
    // {
    //   path: '/leaderboard',
    //   name: 'leaderboard',
    //   component: () => import('../views/LeaderboardView.vue')
    // }
  ],
  // 加上這段，可以確保每次切換頁面時，畫面都會自動回到最頂端
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
