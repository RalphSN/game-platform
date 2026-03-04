<template>
  <header class="app-header">
    <div class="header-container">

      <div class="header-left">
        <router-link to="/" class="logo">
          <span class="logo-icon">🎮</span>
          <span class="logo-text">點點趣星球 DDFun</span>
        </router-link>

        <nav class="pc-nav">
          <router-link to="/" exact-active-class="active">首頁</router-link>
          <router-link to="/games" active-class="active">遊戲列表</router-link>
          <router-link to="/news" active-class="active">最新消息</router-link>
          <!-- <router-link to="/leaderboard" active-class="active">排行榜</router-link> -->
        </nav>
      </div>

      <div class="header-right">
        <div class="pc-actions">
          <button class="icon-btn" title="搜尋">🔍</button>

          <template v-if="!isLoggedIn">
            <router-link to="/login" class="text-btn">登入</router-link>
            <router-link to="/register" class="primary-btn">註冊</router-link>
          </template>

          <template v-else>
            <div class="user-profile-menu" @mouseenter="isProfileMenuOpen = true"
              @mouseleave="isProfileMenuOpen = false">
              <button class="profile-btn">
                <img :src="userAvatar" alt="User Avatar" class="avatar-img" />
                <span class="username">{{ userName }}</span>
              </button>

              <transition name="fade-slide-down">
                <div v-if="isProfileMenuOpen" class="dropdown-menu">
                  <router-link to="/member" class="dropdown-item">會員中心</router-link>
                  <router-link to="/recharge" class="dropdown-item">儲值中心</router-link>
                  <router-link to="/support" class="dropdown-item">聯繫客服</router-link>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item logout-text" @click="handleLogout">登出</button>
                </div>
              </transition>
            </div>
          </template>
        </div>

        <div class="mobile-actions">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="text-btn">登入</router-link>
          </template>
          <template v-else>
            <router-link to="/member" class="profile-btn-mobile">
              <img :src="userAvatar" alt="User Avatar" class="avatar-img-mobile" />
            </router-link>
          </template>
          <button class="icon-btn menu-toggle" @click="toggleMenu">☰</button>
        </div>
      </div>

    </div>

    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="toggleMenu"></div>
    </transition>

    <transition name="slide">
      <nav v-if="isMobileMenuOpen" class="mobile-sidebar">
        <div class="sidebar-header">
          <span class="logo-text">選單</span>
          <button class="close-btn" @click="toggleMenu">✕</button>
        </div>

        <div class="sidebar-user-section" v-if="isLoggedIn">
          <img :src="userAvatar" alt="User Avatar" class="sidebar-avatar" />
          <div class="sidebar-user-info">
            <span class="sidebar-username">{{ userName }}</span>
            <span class="sidebar-balance">餘額: 🪙 1,250</span>
          </div>
        </div>

        <div class="sidebar-links">
          <router-link to="/" exact-active-class="active" @click="toggleMenu">首頁</router-link>
          <router-link to="/games" active-class="active" @click="toggleMenu">遊戲列表</router-link>
          <router-link to="/leaderboard" active-class="active" @click="toggleMenu">排行榜</router-link>

          <template v-if="isLoggedIn">
            <div class="sidebar-divider"></div>
            <router-link to="/member" active-class="active" @click="toggleMenu">會員中心</router-link>
            <router-link to="/recharge" active-class="active" @click="toggleMenu">儲值中心</router-link>
            <router-link to="/support" active-class="active" @click="toggleMenu">聯絡客服</router-link>
          </template>

          <div class="sidebar-divider"></div>

          <template v-if="!isLoggedIn">
            <router-link to="/login" class="sidebar-btn text-btn" @click="toggleMenu">登入</router-link>
            <router-link to="/register" class="sidebar-btn primary-btn" @click="toggleMenu">註冊</router-link>
          </template>
          <template v-else>
            <button class="sidebar-btn text-btn logout-text" @click="handleLogoutAndCloseMenu">登出帳號</button>
          </template>
        </div>
      </nav>
    </transition>

  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('https://ui-avatars.com/api/?name=User&background=5E60CE&color=fff')

const checkLoginStatus = () => {
  const token = localStorage.getItem('user_token')
  if (token) {
    isLoggedIn.value = true
    userName.value = 'abc_player'
  } else {
    isLoggedIn.value = false
    userName.value = ''
  }
}

const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = () => {
  localStorage.removeItem('user_token')

  window.dispatchEvent(new Event('auth-change'))

  isProfileMenuOpen.value = false
  alert('已成功登出！')
  router.push('/')
}

const handleLogoutAndCloseMenu = () => {
  handleLogout()
  toggleMenu()
}

onMounted(() => {
  checkLoginStatus()
  // 監聽自定義的 auth-change 事件
  window.addEventListener('auth-change', checkLoginStatus)

  // 保留 storage 監聽 (為了支援多個分頁同步登出/登入)
  window.addEventListener('storage', (e) => {
    if (e.key === 'user_token') checkLoginStatus()
  })
})

onUnmounted(() => {
  window.removeEventListener('auth-change', checkLoginStatus)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg-content);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: 0 2px 8px var(--color-shadow-main);
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.pc-nav {
  display: flex;
  gap: 8px;
  height: 100%;
  align-items: center;
}

.pc-nav a {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.pc-nav a:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.pc-nav a.active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: 0.35s;
  color: var(--color-text-sub);
}

.icon-btn:hover {
  background-color: var(--color-bg-page);
  color: var(--color-primary);
}

.text-btn {
  background: none;
  border: none;
  color: var(--color-text-main);
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s;
  text-decoration: none;
}

.text-btn:hover {
  color: var(--color-primary);
}

.primary-btn {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 20px;
  transition: 0.35s;
  text-decoration: none;
}

.primary-btn:hover {
  background-color: var(--color-primary-hover);
}

.primary-btn:active {
  background-color: var(--color-primary-active);
}

.user-profile-menu {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.profile-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.profile-btn:hover {
  background-color: var(--color-bg-page);
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 160px;
  background-color: var(--color-bg-content);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--color-shadow-main);
  padding: 8px 0;
  z-index: 101;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  font-size: 0.9rem;
  color: var(--color-text-main);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-bg-page);
  color: var(--color-primary);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border-light);
  margin: 4px 0;
}

.logout-text {
  color: #d32f2f !important;
}

.logout-text:hover {
  background-color: #ffebee !important;
}

.mobile-actions {
  display: none;
}

.pc-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: var(--color-bg-content);
  box-shadow: -4px 0 16px var(--color-shadow-main);
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-sub);
  cursor: pointer;
}

.sidebar-user-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-bg-page);
  border-bottom: 1px solid var(--color-border-light);
}

.sidebar-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-username {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.sidebar-balance {
  font-size: 0.85rem;
  color: #f59e0b;
  font-weight: 600;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
  overflow-y: auto;
}

.sidebar-links a {
  text-decoration: none;
  color: var(--color-text-main);
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.2s;
  padding: 8px 0;
}

.sidebar-links a:hover {
  color: var(--color-primary);
}

.sidebar-links a.active {
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar-divider {
  height: 1px;
  background-color: var(--color-border-light);
  margin: 8px 0;
}

.sidebar-btn {
  text-align: center;
  padding: 12px;
  width: 100%;
}

.profile-btn-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.avatar-img-mobile {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 56px;
  }

  .pc-nav,
  .pc-actions {
    display: none;
  }

  .mobile-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-text {
    font-size: 1.1rem;
  }
}
</style>
