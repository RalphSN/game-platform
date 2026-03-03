<template>
  <div class="auth-container">
    <div class="auth-card fade-in-up">
      <div class="auth-header">
        <div class="auth-logo">
          <span class="logo-icon">✨</span>
        </div>
        <h2>建立新帳號</h2>
        <p>加入我們，開始遊戲旅程</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="reg-account">帳號</label>
          <div class="input-wrapper">
            <input id="reg-account" type="text" v-model="form.account" required placeholder="請設定登入帳號"
              :disabled="isLoading" />
          </div>
        </div>

        <div class="form-group">
          <label for="reg-password">密碼</label>
          <div class="input-wrapper">
            <input id="reg-password" type="password" v-model="form.password" required placeholder="請設定密碼 (至少 6 碼)"
              :disabled="isLoading" minlength="6" />
          </div>
        </div>

        <div class="form-group">
          <label for="reg-nickname">暱稱</label>
          <div class="input-wrapper">
            <input id="reg-nickname" type="text" v-model="form.nickname" required placeholder="您的暱稱"
              :disabled="isLoading" />
          </div>
        </div>

        <div class="form-group">
          <label for="reg-invite">
            邀請碼 <span class="optional-tag">(非必填)</span>
          </label>
          <div class="input-wrapper">
            <input id="reg-invite" type="text" v-model="form.inviteCode" placeholder="若有邀請碼請輸入" :disabled="isLoading" />
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>立即註冊</span>
        </button>
      </form>

      <div class="auth-footer">
        <span>已經有帳號了？</span>
        <router-link to="/login" class="auth-link">立即登入</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  account: '',
  password: '',
  nickname: '',
  inviteCode: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

// 模擬後端 API 請求
const mockRegisterAPI = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模擬驗證邏輯：帳號 abc 已經被註冊
      if (data.account === 'abc') {
        reject({ status: 409, message: '此帳號已被註冊，請換一個！' })
      } else {
        resolve({ status: 200, message: '註冊成功' })
      }
    }, 1500)
  })
}

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // 呼叫 API
    const response = await mockRegisterAPI({
      account: form.account,
      password: form.password,
      nickname: form.nickname,
      inviteCode: form.inviteCode
    })

    console.log('[API 成功]', response)

    alert('註冊成功！請重新登入。')
    // 註冊成功後，跳轉到登入頁，並帶上帳號
    router.push({ name: 'login', query: { account: form.account } })

  } catch (error) {
    console.error('[API 失敗]', error)
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
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
  animation: fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 144px);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: var(--color-primary-light);
  border-radius: 16px;
  margin-bottom: 16px;
  transform: rotate(10deg);
  transition: transform 0.3s ease;
}

.auth-card:hover .auth-logo {
  transform: rotate(0deg) scale(1.05);
}

.logo-icon {
  font-size: 2rem;
}

.auth-header h2 {
  font-size: 1.5rem;
  color: var(--color-text-main);
  margin: 0 0 8px 0;
}

.auth-header p {
  font-size: 0.95rem;
  color: var(--color-text-sub);
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-message {
  padding: 10px 14px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #ffcdd2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.optional-tag {
  font-size: 0.75rem;
  font-weight: normal;
  color: var(--color-text-muted);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  color: var(--color-text-main);
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper input::placeholder {
  color: var(--color-text-muted);
}

.input-wrapper input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.input-wrapper input:focus:not(:disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-bg-content);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.submit-btn {
  margin-top: 16px;
  width: 100%;
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
  box-shadow: 0 4px 12px rgba(94, 96, 206, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-sub);
}

.auth-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  margin-left: 8px;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }
}
</style>
