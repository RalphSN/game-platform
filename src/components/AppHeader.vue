<template>
  <header class="app-header">
    <div class="header-container">

      <div class="header-left">
        <router-link to="/" class="logo">
          <!-- <span class="logo-icon">🎮</span>
          <span class="logo-text">點點趣星球 DDFun</span> -->
          <img :src="logoUrl" alt="logo">
        </router-link>

        <nav class="pc-nav">
          <router-link to="/" exact-active-class="active">{{ $t('header.home') }}</router-link>
          <router-link to="/games" active-class="active">{{ $t('header.gameList') }}</router-link>
          <!-- 初版先不做 -->
          <!-- <router-link to="/news" active-class="active">{{ $t('header.news') }}</router-link> -->
          <!-- <router-link to="/leaderboard" active-class="active">{{ $t('header.leaderboard') }}</router-link> -->
        </nav>
      </div>

      <div class="header-right">
        <div class="pc-actions">

          <button class="icon-btn" title="搜尋" @click="isSearchOpen = true"><svg viewBox="0 0 24 24" fill="none"
              stroke="currentColor" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg></button>

          <button class="icon-btn gift-btn" :title="$t('header.taskCenter')" @click="isTaskModalOpen = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="gift-icon">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span v-if="hasUnclaimedTask" class="red-dot"></span>
          </button>

          <div class="user-profile-menu lang-menu-wrapper" @mouseenter="isLangMenuOpen = true"
            @mouseleave="isLangMenuOpen = false">

            <button class="icon-btn lang-btn" title="切換語系">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="globe-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                </path>
              </svg>
              <span class="lang-text">{{ currentLangShort }}</span>
            </button>

            <transition name="fade-slide-down">
              <div v-if="isLangMenuOpen" class="dropdown-menu lang-dropdown">
                <button v-for="lang in supportLangs" :key="lang.code" class="dropdown-item"
                  :class="{ 'active-lang': locale === lang.code }" @click="changeLanguage(lang.code)">
                  {{ lang.label }}
                </button>
              </div>
            </transition>
          </div>

          <template v-if="!userStore.token">
            <router-link to="/login" class="text-btn">{{ $t('header.login') }}</router-link>
            <router-link to="/register" class="primary-btn">{{ $t('header.register') }}</router-link>
          </template>

          <template v-else>

            <div class="user-profile-menu" @mouseenter="isProfileMenuOpen = true"
              @mouseleave="isProfileMenuOpen = false">
              <button class="profile-btn">
                <img :src="userAvatar" alt="User Avatar" class="avatar-img" />
                <span class="username">{{ userStore.nickname || userStore.account || 'Player' }}</span>
              </button>

              <transition name="fade-slide-down">
                <div v-if="isProfileMenuOpen" class="dropdown-menu">
                  <div class="dropdown-balance-section">
                    <div class="balance-item">
                      <span class="balance-label">{{ $t('header.chargeCoins') }}</span>
                      <span class="balance-value">{{ userStore.points }}</span>
                    </div>
                    <div class="balance-item">
                      <span class="balance-label">{{ $t('header.freeCoins') }}</span>
                      <span class="balance-value free-balance">{{ userStore.freePoints }}</span>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <router-link to="/member" class="dropdown-item">{{ $t('header.memberCenter') }}</router-link>
                  <router-link to="/recharge" class="dropdown-item">{{ $t('header.recharge') }}</router-link>
                  <router-link to="/support" class="dropdown-item">{{ $t('header.support') }}</router-link>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item logout-text" @click="handleLogout">{{ $t('header.logout') }}</button>
                </div>
              </transition>
            </div>
          </template>
        </div>

        <div class="mobile-actions">
          <button class="icon-btn" title="搜尋" @click="isSearchOpen = true"><svg viewBox="0 0 24 24" fill="none"
              stroke="currentColor" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg></button>
          <button class="icon-btn gift-btn" @click="isTaskModalOpen = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="gift-icon">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span v-if="hasUnclaimedTask" class="red-dot"></span>
          </button>
          <div class="user-profile-menu lang-menu-wrapper">
            <button class="icon-btn lang-btn" title="切換語系" @click="isMobileLangMenuOpen = !isMobileLangMenuOpen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="globe-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                </path>
              </svg>
              <span class="lang-text">{{ currentLangShort }}</span>
            </button>
            <transition name="fade-slide-down">
              <div v-if="isMobileLangMenuOpen" class="dropdown-menu lang-dropdown">
                <button v-for="lang in supportLangs" :key="lang.code" class="dropdown-item"
                  :class="{ 'active-lang': locale === lang.code }" @click="changeLanguage(lang.code)">
                  {{ lang.label }}
                </button>
              </div>
            </transition>
          </div>
          <template v-if="!userStore.token">
            <router-link to="/login" class="text-btn">{{ $t('header.login') }}</router-link>
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
          <span class="logo-text">{{ $t('header.menu') }}</span>
          <button class="close-btn" @click="toggleMenu">✕</button>
        </div>

        <div class="sidebar-user-section" v-if="userStore.token">
          <img :src="userAvatar" alt="User Avatar" class="sidebar-avatar" />
          <div class="sidebar-user-info">
            <span class="sidebar-username">{{ userStore.nickname || userStore.account || 'Player' }}</span>

            <div class="balance-item">
              <span class="balance-label">{{ $t('header.chargeCoins') }}</span>
              <span class="balance-value">{{ userStore.points }}</span>
            </div>
            <div class="balance-item">
              <span class="balance-label">{{ $t('header.freeCoins') }}</span>
              <span class="balance-value free-balance">{{ userStore.freePoints }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-links">
          <router-link to="/" exact-active-class="active" @click="toggleMenu">{{ $t('header.home') }}</router-link>
          <router-link to="/games" active-class="active" @click="toggleMenu">{{ $t('header.gameList') }}</router-link>
          <!-- <router-link to="/leaderboard" active-class="active" @click="toggleMenu">{{ $t('header.leaderboard') }}</router-link> -->

          <template v-if="userStore.token">
            <div class="sidebar-divider"></div>
            <router-link to="/member" active-class="active" @click="toggleMenu">{{ $t('header.memberCenter')
              }}</router-link>
            <router-link to="/recharge" active-class="active" @click="toggleMenu">{{ $t('header.recharge')
              }}</router-link>
            <router-link to="/support" active-class="active" @click="toggleMenu">{{ $t('header.support')
              }}</router-link>
          </template>

          <div class="sidebar-divider"></div>

          <template v-if="!userStore.token">
            <router-link to="/login" class="sidebar-btn text-btn" @click="toggleMenu">{{ $t('header.login')
              }}</router-link>
            <router-link to="/register" class="sidebar-btn primary-btn sidebar-register" @click="toggleMenu">{{
              $t('header.register') }}</router-link>
          </template>
          <template v-else>
            <button class="sidebar-btn text-btn logout-text" @click="handleLogoutAndCloseMenu">{{ $t('header.logout')
              }}</button>
          </template>
        </div>
      </nav>
    </transition>
    <SearchModal v-model:isOpen="isSearchOpen" />
    <TaskModal v-model:isOpen="isTaskModalOpen" @task-claimed="checkTaskBadge" />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import { showToast } from '@/assets/utils/swal'
import { useI18n } from 'vue-i18n'
import { fetchPlayerTaskListApi } from '@/assets/utils/api'
import TaskModal from './TaskModal.vue'

import SearchModal from './SearchModal.vue'
import logoUrl from '@/assets/images/logo/logo-dark.svg'
// import searchIcon from '@/assets/images/icon/search.png'

const userStore = useUserStore()
const router = useRouter()
const { locale, t } = useI18n()

const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const isTaskModalOpen = ref(false) // TaskModal.vue 的顯示/隱藏
const hasUnclaimedTask = ref(false) // 小紅點(Badge)是否顯示

const userAvatar = computed(() => {
  const name = userStore.nickname || userStore.account || 'Player'
  const originalUrl = `https://ui-avatars.com/api/?name=${name}&background=5E60CE&color=fff`
  return getImageUrlWithCacheBuster(originalUrl)
})
const isSearchOpen = ref(false)

const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = () => {
  userStore.logout()
  isProfileMenuOpen.value = false
  showToast(t('header.logoutSuccess'), 'success')
  router.push('/')
}

const handleLogoutAndCloseMenu = () => {
  handleLogout()
  toggleMenu()
}


const isLangMenuOpen = ref(false)
const isMobileLangMenuOpen = ref(false)
const supportLangs = [
  { code: 'zh-TW', label: '繁體中文', short: '繁' },
  { code: 'zh-CN', label: '简体中文', short: '简' },
  { code: 'en-US', label: 'English', short: 'EN' }
]
const currentLangShort = computed(() => {
  const current = supportLangs.find(lang => lang.code === locale.value)
  return current ? current.short : '🌐'
})
const changeLanguage = (code) => {
  locale.value = code
  localStorage.setItem('user_language', code)
  isLangMenuOpen.value = false // 切換後關閉選單
  isMobileLangMenuOpen.value = false
}

const checkTaskBadge = async () => {
  if (!userStore.token) return

  try {
    const result = await fetchPlayerTaskListApi(userStore.account, userStore.token)

    if (result.code === 0 && result.tasklist) {
      // 只要包含 1 (可領取)，紅點 = true
      hasUnclaimedTask.value = Object.values(result.tasklist).includes(1)
    }
  } catch (error) {
    console.error('檢查任務狀態失敗:', error)
  }
}

watch(() => userStore.token, async (newToken, oldToken) => {
  if (newToken && !oldToken) {
    await checkTaskBadge()
  }

  if (!newToken) {
    hasUnclaimedTask.value = false
  }
})

onMounted(() => {
  if (userStore.token) {
    userStore.getPlayerInfo()
    checkTaskBadge()
  }
})

onUnmounted(() => {

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

.header-left img {
  width: 150px;
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
  display: flex;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 50%;
  transition: 0.35s;
  color: var(--color-text-sub);
}

.icon-btn img {
  width: 40px;
}

.icon-btn:hover {
  background-color: var(--color-bg-page);
  color: var(--color-primary);
}

.text-btn {
  background: none;
  border: none;
  color: var(--color-text-sub);
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
  font-size: 1rem;
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
  justify-content: center;
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
  flex: 1;
}

.sidebar-username {
  font-size: 1.4rem;
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

.sidebar-links .sidebar-register {
  color: var(--color-text-white);
}

.dropdown-balance-section {
  padding: 10px 16px;
  background-color: var(--color-bg-page);
  margin-bottom: 4px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.balance-item:last-child {
  margin-bottom: 0;
}

.balance-label {
  color: var(--color-text-sub);
}

.balance-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #f59e0b;
}

/* 語系按鈕 */
.icon-btn.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: auto;

  padding: 4px 6px;
  border-radius: 12px;
  border: 2px solid var(--color-text-sub);
}

.icon-btn.lang-btn:hover .globe-icon {
  color: var(--color-primary);
  transform: scale(1.1) rotate(-8deg);
}

/* .icon-btn.lang-btn:hover {
  color: white;
  background-color: var(--color-text-sub);
} */

.lang-text {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
}

.lang-dropdown {
  width: 120px;
  text-align: center;
}

.lang-dropdown .dropdown-item {
  text-align: center;
  font-weight: 500;
}

/* 當前選擇高亮 */
.active-lang {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  font-weight: 700 !important;
}

/* 簽到任務/紅點 */
.gift-btn {
  position: relative;
}

.gift-btn:hover .gift-icon {
  color: var(--color-primary);
  transform: scale(1.1) rotate(-8deg);
}

/* 呼吸紅點動畫 */
.red-dot {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 10px;
  height: 10px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 2px solid var(--color-bg-content);
  box-shadow: 0 0 8px rgba(255, 77, 79, 0.6);
  animation: badge-pulse 2s infinite;
}

.search-icon,
.gift-icon,
.globe-icon {
  width: 22px;
  height: 22px;
  color: var(--color-text-sub);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.search-icon:hover {
  color: var(--color-primary);
  transform: scale(1.1) rotate(-8deg);
}

@keyframes badge-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
  }

  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 6px rgba(255, 77, 79, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
  }
}

.free-balance,
.balance-value.free-balance {
  color: #10b981;
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
