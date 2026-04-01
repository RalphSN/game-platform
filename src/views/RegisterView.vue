<template>
  <div class="auth-container">
    <div class="auth-card fade-in-up">
      <div class="auth-header">
        <div class="auth-logo">
          <span class="logo-icon">✨</span>
        </div>
        <h2>{{ $t('auth.registerTitle') }}</h2>
        <p>{{ $t('auth.registerSubtitle') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="reg-account">{{ $t('auth.account') }}</label>
          <div class="input-wrapper">
            <input id="reg-account" type="text" v-model="form.account" required
              :placeholder="$t('auth.regAccountPlaceholder')" :disabled="isLoading" minlength="6" maxlength="20" />
          </div>
        </div>

        <div class="form-group">
          <label for="reg-password">{{ $t('auth.password') }}</label>
          <div class="input-wrapper">
            <input id="reg-password" type="password" v-model="form.password" required
              :placeholder="$t('auth.regPasswordPlaceholder')" :disabled="isLoading" minlength="6" maxlength="20" />
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>{{ $t('auth.registerBtn') }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <span>{{ $t('auth.hasAccount') }}</span>
        <router-link to="/login" class="auth-link">{{ $t('auth.loginNow') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendRequest } from '@/assets/utils/api'
import { showToast } from '@/assets/utils/swal'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter()

const form = reactive({
  account: '',
  password: ''
})

const isLoading = ref(false)

const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return 1; // Android
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 2; // iOS
  }
  return 0; // PC
}

const getClientIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  } catch {
    return '127.0.0.1'
  }
}

const handleRegister = async () => {
  isLoading.value = true

  try {
    const deviceType = detectDevice()

    const userIP = await getClientIP()

    const requestData = {
      Account: form.account,
      PWD: form.password,
      RegisterDev: deviceType,
      LoginIP: userIP
    }

    const result = await sendRequest('/member/signup', requestData)


    if (result.code === 0) {
      showToast(t('auth.registerSuccess'), 'success')
      setTimeout(() => {
        router.push({ path: '/login', query: { account: form.account } })
      }, 1500)
    } else {
      switch (result.code) {
        case 1: throw new Error(t('auth.regErrors.params'))
        case 2: throw new Error(t('auth.regErrors.format'))
        case 3: throw new Error(t('auth.regErrors.duplicate'))
        case 4: throw new Error(t('auth.regErrors.specialChars'))
        case 999: throw new Error(t('auth.errors.blocked'))
        default: throw new Error(result.msg || t('auth.regErrors.failed'))
      }
    }

  } catch (error) {
    console.error('[註冊失敗]', error)
    showToast(error.message, 'warning')
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
  font-size: 0.9rem;
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
