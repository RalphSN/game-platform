<template>
  <nav class="mobile-tab-bar">
    <router-link to="/games" class="tab-item" active-class="active">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
          <line x1="6" y1="12" x2="10" y2="12"></line>
          <line x1="8" y1="10" x2="8" y2="14"></line>
          <line x1="15" y1="13" x2="15.01" y2="13"></line>
          <line x1="18" y1="11" x2="18.01" y2="11"></line>
        </svg>
      </div>
      <span class="tab-label">遊戲</span>
    </router-link>

    <router-link to="/recharge" class="tab-item" active-class="active">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      </div>
      <span class="tab-label">儲值</span>
    </router-link>

    <router-link to="/" class="tab-item center-item" exact-active-class="active">
      <div class="center-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    </router-link>

    <router-link to="/member" class="tab-item" active-class="active">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <span class="tab-label">會員</span>
    </router-link>

    <router-link to="/support" class="tab-item" active-class="active">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path
            d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z">
          </path>
        </svg>
      </div>
      <span class="tab-label">客服</span>
    </router-link>
  </nav>
</template>

<style scoped>
.mobile-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: var(--color-bg-content);
  box-shadow: 0 -4px 16px var(--color-shadow-main);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

@media (max-width: 768px) {
  .mobile-tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-text-sub);
  -webkit-tap-highlight-color: transparent;
  height: 100%;
  position: relative;
}

.icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.icon-wrapper svg {
  width: 100%;
  height: 100%;
  transition: stroke 0.3s ease;
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.3s ease;
}

.tab-item.active {
  color: var(--color-primary);
}

.tab-item.active .icon-wrapper {
  transform: translateY(-4px) scale(1.15);
}

.tab-item.active .icon-wrapper svg {
  stroke: var(--color-primary);
}

.tab-item.active .tab-label {
  color: var(--color-primary);
  transform: translateY(2px);
}

.center-item {
  flex: 1.2;
  position: relative;
}

.center-button {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(94, 96, 206, 0.4);
  border: 4px solid var(--color-bg-content);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.center-button svg {
  width: 30px;
  height: 30px;
  stroke: var(--color-text-white);
  transition: transform 0.3s ease;
}

.center-item.active .center-button {
  transform: translateX(-50%) scale(1.08);
  box-shadow: 0 6px 16px rgba(94, 96, 206, 0.6);
}

.center-item.active .center-button svg {
  animation: float-pulse 1.5s infinite alternate ease-in-out;
}

@keyframes float-pulse {
  0% {
    transform: scale(1) translateY(0);
  }

  100% {
    transform: scale(1.1) translateY(-2px);
  }
}

.tab-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: var(--color-primary-light);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  z-index: -1;
}

.tab-item:active::after {
  transform: translate(-50%, -50%) scale(1.2);
  opacity: 0.8;
  transition: 0s;
}
</style>
