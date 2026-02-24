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
          <router-link to="/leaderboard" active-class="active">排行榜</router-link>
        </nav>
      </div>

      <div class="header-right">
        <div class="pc-actions">
          <button class="icon-btn" title="搜尋">🔍</button>
          <button class="text-btn">登入</button>
          <button class="primary-btn">註冊</button>
        </div>

        <div class="mobile-actions">
          <button class="text-btn">登入</button>
          <button class="icon-btn menu-toggle" @click="toggleMenu">☰</button>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// 手機版選單狀態
const isMobileMenuOpen = ref(false)
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<style scoped>
/* --- 基礎佈局 --- */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg-content);
  /* 白色底色 */
  border-bottom: 1px solid var(--color-border-light);
  /* 淡灰底框線 */
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

/* --- 左側：Logo --- */
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
  /* LOGO 藍紫 */
}

/* --- PC 選單 --- */
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
  /* 未選中文字：次灰 */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.pc-nav a:hover {
  color: var(--color-primary);
  /* 滑過變色：藍紫 */
  background-color: var(--color-primary-light);
  /* 滑過加上一點淡紫底色增加回饋感 */
}

.pc-nav a.active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  /* 當前頁面底色：淡紫 */
  font-weight: 600;
}

/* --- 按鈕共用樣式 --- */
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
  /* 未選中 icon：灰色 */
}

.icon-btn:hover {
  background-color: var(--color-bg-page);
  color: var(--color-primary);
}

/* 次要按鈕 (登入) */
.text-btn {
  background: none;
  border: none;
  color: var(--color-text-main);
  /* 標題文字色 */
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s;
}

.text-btn:hover {
  color: var(--color-primary);
}

/* 主要按鈕 (註冊) */
.primary-btn {
  background-color: var(--color-primary);
  /* 主要按鈕：藍紫 */
  color: var(--color-text-white);
  /* 文字白 */
  border: none;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 20px;
  transition: 0.35s;
}

.primary-btn:hover {
  background-color: var(--color-primary-hover);
  /* 滑過變色：深藍紫 */
}

.primary-btn:active {
  background-color: var(--color-primary-active);
  /* 所在頁/點擊：更深藍紫 */
}

/* --- PC / Mobile 顯示切換 --- */
.mobile-actions {
  display: none;
}

.pc-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* --- RWD 響應式 (螢幕小於 768px 時) --- */
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
    gap: 8px;
  }

  .logo-text {
    font-size: 1.1rem;
  }
}
</style>
