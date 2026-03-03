import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/game/:id',
      name: 'game-detail',
      component: () => import('../views/GameDetailView.vue'),
    },
    // ==========================================
    // 預留路由，目前註解
    // ==========================================

    // {
    //   path: '/games',
    //   name: 'games',
    //   // 延遲載入 (Lazy load) 使用者點擊進來時才載入該頁面的程式碼
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
  // 切換頁面時畫面自動回到頂端
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
