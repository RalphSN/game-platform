<template>
  <div class="recharge-view">
    <div class="recharge-container fade-in-up">
      <div class="recharge-header">
        <!-- <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
            <circle cx="17" cy="15" r="1"></circle>
            <circle cx="13" cy="15" r="1"></circle>
          </svg>
        </div> -->
        <h2>儲值中心</h2>
        <!-- <p>請選擇您要使用的幣別與支付方式</p> -->
      </div>

      <div class="currency-tabs">
        <button v-for="(data, key) in rechargeData" :key="key" class="tab-btn"
          :class="{ active: currentCurrency === key }" @click="currentCurrency = key">
          {{ data.label }}
        </button>
      </div>

      <transition name="fade-slide" mode="out-in">
        <div :key="currentCurrency" class="step-section">

          <div class="section-title">
            <span class="step-number">1</span>
            <h3>選擇支付方式</h3>
          </div>

          <div class="methods-grid">
            <div v-for="method in availableMethods" :key="method.id" class="method-card"
              :class="{ active: currentMethod?.id === method.id }" @click="currentMethod = method">
              <div class="method-icon">
                <img :src="method.icon" :alt="method.name" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <span class="method-name">{{ method.name }}</span>
              <div class="check-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <transition name="fade-slide">
            <div v-if="currentMethod" class="options-section">
              <div class="section-title">
                <span class="step-number">2</span>
                <h3>選擇儲值面額</h3>
              </div>

              <div class="options-grid">
                <div v-for="option in currentMethod.options" :key="option.id" class="option-card fade-in-up"
                  :class="{ active: selectedOption?.id === option.id }" @click="selectedOption = option">
                  <div class="points-area">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" class="diamond-icon">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                      </polygon>
                    </svg>
                    <span class="points-val">{{ option.points }}</span>
                    <span class="points-text">點</span>
                  </div>
                  <div class="price-area">
                    {{ currentCurrency === 'CNY' ? '¥' : 'NT$' }} {{ option.amount }}
                  </div>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </transition>

      <div class="checkout-footer">
        <div class="summary">
          <span class="summary-label">總計結帳金額：</span>
          <span class="summary-price">
            {{ currentCurrency === 'CNY' ? '¥' : 'NT$' }} {{ selectedOption ? selectedOption.amount : '0' }}
          </span>
        </div>
        <button class="submit-btn" :disabled="!selectedOption || isLoading" @click="handlePayment">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>前往付款</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import iconAlipay from '@/assets/images/recharge/alipay.svg'
import iconWeixin from '@/assets/images/recharge/weixin.svg'
import iconJkopay from '@/assets/images/recharge/jkopay.svg'
import iconLinepay from '@/assets/images/recharge/linepay.png'
import iconApplepay from '@/assets/images/recharge/applepay.png'

const rechargeData = {
  CNY: {
    label: '人民幣 (CNY)',
    methods: [
      {
        id: 'alipay',
        name: '支付寶',
        icon: iconAlipay, options: [
          { id: 'cny_ali_1', amount: 10, points: 100 },
          { id: 'cny_ali_2', amount: 20, points: 200 },
          { id: 'cny_ali_3', amount: 30, points: 300 },
          { id: 'cny_ali_4', amount: 50, points: 520 },
        ]
      },
      {
        id: 'wechat',
        name: '微信支付',
        icon: iconWeixin, options: [
          { id: 'cny_wc_1', amount: 15, points: 150 },
          { id: 'cny_wc_2', amount: 30, points: 300 },
          { id: 'cny_wc_3', amount: 60, points: 620 },
          { id: 'cny_wc_4', amount: 100, points: 1050 },
        ]
      }
    ]
  },
  TWD: {
    label: '新台幣 (TWD)',
    methods: [
      {
        id: 'jkopay',
        name: '街口支付',
        icon: iconJkopay, options: [
          { id: 'twd_jko_1', amount: 50, points: 100 },
          { id: 'twd_jko_2', amount: 150, points: 300 },
          { id: 'twd_jko_3', amount: 300, points: 610 },
          { id: 'twd_jko_4', amount: 500, points: 1050 },
        ]
      },
      {
        id: 'linepay',
        name: 'LINE Pay',
        icon: iconLinepay, options: [
          { id: 'twd_line_1', amount: 100, points: 200 },
          { id: 'twd_line_2', amount: 300, points: 600 },
          { id: 'twd_line_3', amount: 500, points: 1020 },
          { id: 'twd_line_4', amount: 1000, points: 2100 },
        ]
      },
      {
        id: 'applepay',
        name: 'Apple Pay',
        icon: iconApplepay, options: [
          { id: 'twd_apple_1', amount: 80, points: 160 },
          { id: 'twd_apple_2', amount: 240, points: 480 },
          { id: 'twd_apple_3', amount: 500, points: 1100 },
          { id: 'twd_apple_4', amount: 1000, points: 2200 },
        ]
      },
    ]
  }
}


const currentCurrency = ref('CNY')
const currentMethod = ref(null)
const selectedOption = ref(null)
const isLoading = ref(false)

const availableMethods = computed(() => {
  return rechargeData[currentCurrency.value]?.methods || []
})

watch(currentCurrency, () => {
  if (availableMethods.value.length > 0) {
    currentMethod.value = availableMethods.value[0]
  } else {
    currentMethod.value = null
  }
  selectedOption.value = null
})

watch(currentMethod, () => {
  selectedOption.value = null
})

onMounted(() => {
  if (availableMethods.value.length > 0) {
    currentMethod.value = availableMethods.value[0]
  }
})

const handlePayment = () => {
  if (!selectedOption.value) return
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    alert(`[Mock] 準備前往 ${currentMethod.value.name} 付款 ${selectedOption.value.amount} 元`)
  }, 1000)
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
  animation: fadeInUp 0.5s ease-out forwards;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.recharge-view {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0 60px;
}

.recharge-container {
  width: 100%;
  max-width: 800px;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.recharge-header {
  text-align: center;
}

.header-icon {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.header-icon svg {
  width: 48px;
  height: 48px;
  color: var(--color-primary);
}

.recharge-header h2 {
  font-size: 1.75rem;
  color: var(--color-text-main);
  margin: 0 0 8px;
}

.recharge-header p {
  color: var(--color-text-sub);
  margin: 0;
}

.currency-tabs {
  display: flex;
  background-color: var(--color-bg-page);
  border-radius: 12px;
  padding: 6px;
  gap: 6px;
}

.tab-btn {
  flex: 1;
  padding: 14px;
  border: none;
  background: transparent;
  color: var(--color-text-sub);
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--color-text-main);
}

.tab-btn.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
}

.section-title h3 {
  font-size: 1.2rem;
  color: var(--color-text-main);
  margin: 0;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.method-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background-color: var(--color-bg-page);
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.method-card:hover {
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
}

.method-card.active {
  border-color: var(--color-primary);
  background-color: rgba(94, 96, 206, 0.05);
}

.method-icon {
  width: auto;
  height: 30px;
  margin-top: 10px;
}

.method-icon img {
  width: 100%;
  height: 100%;
}

.method-name {
  font-weight: 600;
  color: var(--color-text-main);
}

.check-circle {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.check-circle svg {
  width: 12px;
  height: 12px;
}

.method-card.active .check-circle {
  opacity: 1;
  transform: scale(1);
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
  padding-top: 32px;
  border-top: 1px dashed var(--color-border-light);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.option-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-page);
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.option-card:hover {
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(94, 96, 206, 0.2);
}

.points-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  background-color: rgba(255, 255, 255, 0.02);
}

.diamond-icon {
  width: 20px;
  height: 20px;
  color: #f59e0b;
}

.points-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.points-text {
  font-size: 0.9rem;
  color: var(--color-text-sub);
  margin-top: 4px;
}

.price-area {
  text-align: center;
  padding: 12px;
  background-color: var(--color-border-light);
  color: var(--color-text-main);
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.option-card.active .price-area {
  background-color: var(--color-primary);
  color: white;
}

.checkout-footer {
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.summary-label {
  color: var(--color-text-sub);
  font-size: 1rem;
}

.summary-price {
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 800;
}

.submit-btn {
  height: 52px;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
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
  background-color: var(--color-border-light);
  color: var(--color-text-muted);
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@media (max-width: 768px) {
  .recharge-container {
    padding: 32px 20px;
  }

  .checkout-footer {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    text-align: center;
  }

  .summary {
    justify-content: center;
  }
}
</style>
