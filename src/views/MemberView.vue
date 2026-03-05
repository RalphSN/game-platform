<template>
  <div class="member-view fade-in-up">
    <div class="member-layout">

      <aside class="member-sidebar">
        <div class="user-profile-card">
          <div class="avatar-wrapper">
            <img :src="userInfo.avatar" alt="Avatar" class="avatar-img" />
            <div class="vip-badge">VIP 3</div>
          </div>
          <h2 class="user-nickname">{{ userInfo.nickname }}</h2>
          <p class="user-id">ID: {{ userInfo.id }}</p>
          <div class="balance-info">
            <span class="coin-icon">🪙</span>
            <span class="balance-amount">{{ userInfo.balance }}</span>
          </div>
        </div>

        <nav class="member-nav">
          <button v-for="tab in tabs" :key="tab.id" class="nav-btn" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            <span class="nav-icon" v-html="tab.icon"></span>
            {{ tab.name }}
          </button>
        </nav>
      </aside>

      <main class="member-content">
        <transition name="fade-slide" mode="out-in">

          <section v-if="activeTab === 'profile'" key="profile" class="content-section">
            <h3 class="section-title">個人資料</h3>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div v-if="updateMessage" class="alert-message success">
                {{ updateMessage }}
              </div>

              <div class="form-group">
                <label>帳號</label>
                <div class="input-wrapper">
                  <input type="text" :value="userInfo.account" disabled />
                </div>
              </div>

              <div class="form-group">
                <label>暱稱</label>
                <div class="input-wrapper">
                  <input type="text" v-model="editForm.nickname" required :disabled="isUpdating" />
                </div>
              </div>

              <div class="form-group">
                <label>聯絡信箱</label>
                <div class="input-wrapper">
                  <input type="email" v-model="editForm.email" required :disabled="isUpdating" />
                </div>
              </div>

              <button type="submit" class="submit-btn" :disabled="isUpdating">
                <span v-if="isUpdating" class="loader"></span>
                <span v-else>儲存修改</span>
              </button>
            </form>
          </section>

          <section v-else-if="activeTab === 'history'" key="history" class="content-section">
            <h3 class="section-title">遊戲紀錄</h3>
            <div class="history-list">
              <div v-for="record in playHistory" :key="record.id" class="history-item">
                <img :src="record.thumb" :alt="record.title" class="history-thumb" />
                <div class="history-info">
                  <h4>{{ record.title }}</h4>
                  <p class="play-time">遊玩時長: {{ record.duration }}</p>
                </div>
                <div class="history-date">{{ record.lastPlayed }}</div>
                <button class="action-btn">繼續遊玩</button>
              </div>
            </div>
          </section>

          <section v-else-if="activeTab === 'favorites'" key="favorites" class="content-section">
            <h3 class="section-title">收藏清單</h3>
            <div class="favorites-grid">
              <GameCard v-for="game in favoriteGames" :key="game.id" :game="game" />
            </div>
            <div v-if="favoriteGames.length === 0" class="empty-state">
              <p>目前沒有收藏的遊戲喔！</p>
            </div>
          </section>

          <section v-else-if="activeTab === 'transactions'" key="transactions" class="content-section">
            <h3 class="section-title">儲值紀錄</h3>
            <div class="transaction-table-wrapper">
              <table class="transaction-table">
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>日期</th>
                    <th>金額</th>
                    <th>獲得代幣</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tx in transactions" :key="tx.id">
                    <td>#{{ tx.orderId }}</td>
                    <td>{{ tx.date }}</td>
                    <td class="amount">NT$ {{ tx.amount }}</td>
                    <td class="coins">+{{ tx.coins }} 🪙</td>
                    <td>
                      <span class="status-badge" :class="tx.status.toLowerCase()">
                        {{ tx.statusText }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GameCard from '@/components/GameCard.vue'

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', name: '個人資料', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
  { id: 'history', name: '遊戲紀錄', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' },
  { id: 'favorites', name: '收藏清單', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' },
  { id: 'transactions', name: '儲值紀錄', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>' }
]

const userInfo = reactive({
  id: '8810239',
  account: 'abc',
  nickname: 'abc_player',
  email: 'abc@example.com',
  balance: 1250,
  avatar: 'https://ui-avatars.com/api/?name=User&background=5E60CE&color=fff'
})

const editForm = reactive({
  nickname: userInfo.nickname,
  email: userInfo.email
})

const isUpdating = ref(false)
const updateMessage = ref('')

const updateProfile = async () => {
  isUpdating.value = true
  updateMessage.value = ''

  await new Promise(resolve => setTimeout(resolve, 1000))

  userInfo.nickname = editForm.nickname
  userInfo.email = editForm.email
  isUpdating.value = false
  updateMessage.value = '資料已成功更新！'

  setTimeout(() => { updateMessage.value = '' }, 3000)
}

const playHistory = ref([
  { id: 1, title: '鍛劍開天', thumb: 'https://picsum.photos/seed/51/100/100', duration: '2小時 15分', lastPlayed: '2023-11-15 14:30' },
  { id: 2, title: '夢幻廚房', thumb: 'https://picsum.photos/seed/52/100/100', duration: '45分鐘', lastPlayed: '2023-11-14 09:20' },
  { id: 3, title: '星際塔防', thumb: 'https://picsum.photos/seed/53/100/100', duration: '5小時 10分', lastPlayed: '2023-11-10 21:00' }
])

const favoriteGames = ref([
  { id: 101, title: '鍛劍開天', thumb: 'https://picsum.photos/seed/51/300/300', category: '角色扮演', players: 8400 },
  { id: 102, title: '賽博龐克跑酷', thumb: 'https://picsum.photos/seed/54/300/300', category: '動作闖關', players: 15200 }
])

const transactions = ref([
  { id: 1, orderId: 'TX99201', date: '2023-11-15', amount: 500, coins: 550, status: 'success', statusText: '成功' },
  { id: 2, orderId: 'TX99158', date: '2023-11-01', amount: 1000, coins: 1200, status: 'success', statusText: '成功' },
  { id: 3, orderId: 'TX98902', date: '2023-10-15', amount: 300, coins: 300, status: 'failed', statusText: '失敗' }
])
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.member-view {
  width: 100%;
}

.member-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.member-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-profile-card {
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.avatar-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-bg-page);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vip-badge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 12px;
  white-space: nowrap;
  border: 2px solid var(--color-bg-content);
}

.user-nickname {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 4px;
}

.user-id {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0 0 16px;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-bg-page);
  padding: 8px 24px;
  border-radius: 20px;
}

.coin-icon {
  font-size: 1.1rem;
}

.balance-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f59e0b;
}

.member-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: none;
  border: none;
  border-radius: 12px;
  color: var(--color-text-sub);
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background-color: var(--color-bg-page);
  color: var(--color-text-main);
}

.nav-btn.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
}

.member-content {
  flex: 1;
  min-width: 0;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
  min-height: 500px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.profile-form {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  color: var(--color-text-main);
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.input-wrapper input:disabled {
  background-color: #f0f0f0;
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.input-wrapper input:focus:not(:disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-bg-content);
  outline: none;
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.submit-btn {
  margin-top: 16px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-white);
  background-color: var(--color-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

.alert-message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 1px solid #c8e6c9;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-bg-page);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  transition: transform 0.2s;
}

.history-item:hover {
  transform: translateX(4px);
  border-color: var(--color-primary-light);
}

.history-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}

.history-info {
  flex: 1;
}

.history-info h4 {
  margin: 0 0 8px;
  color: var(--color-text-main);
  font-size: 1.1rem;
}

.play-time {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-sub);
}

.history-date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.action-btn {
  padding: 8px 16px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.action-btn:hover {
  background-color: var(--color-primary);
  color: white;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.transaction-table-wrapper {
  overflow-x: auto;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
}

.transaction-table th,
.transaction-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.transaction-table th {
  font-weight: 600;
  color: var(--color-text-sub);
  font-size: 0.95rem;
  background-color: var(--color-bg-page);
}

.transaction-table td {
  color: var(--color-text-main);
  font-size: 0.95rem;
}

.amount {
  font-weight: 600;
}

.coins {
  color: #f59e0b;
  font-weight: 600;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.failed {
  background-color: #ffebee;
  color: #d32f2f;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 900px) {
  .member-layout {
    flex-direction: column;
  }

  .member-sidebar {
    width: 100%;
  }

  .member-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 8px;
    border-radius: 12px;
  }

  .nav-btn {
    white-space: nowrap;
    justify-content: center;
    padding: 10px 16px;
  }

  .member-content {
    padding: 24px 16px;
    width: 100%;
  }

  .profile-form {
    max-width: none;
  }

  .history-item {
    flex-wrap: wrap;
  }

  .history-date {
    width: 100%;
    order: 3;
    font-size: 0.8rem;
  }
}
</style>
