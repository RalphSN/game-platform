<template>
  <transition name="fade-scale">
    <div v-if="isOpen" class="task-modal-overlay" @click.self="close">
      <div class="task-modal-card">
        <div class="modal-header">
          <div class="header-title">
            <!-- <span class="sparkle">✨</span> -->
            <!-- <h3>{{ $t('task.title') }}</h3> -->
          </div>
          <button class="close-x" @click="close">✕</button>
        </div>

        <div class="modal-body" v-if="!loading">
          <div class="check-in-section">
            <h4 class="sub-title">{{ $t('task.checkInSubtitle') }}</h4>
            <div class="calendar-grid">
              <div v-for="(signed, date) in calendarData" :key="date" class="day-box"
                :class="{ 'is-signed': signed, 'is-today': isToday(date) }">
                <div class="day-dot"></div>
                <span class="day-label">{{ formatShortDate(date) }}</span>
                <span class="status-icon">
                  <img v-if="signed" :src="isToday(date) ? yellowCheck : greenCheck" alt="check"
                    :class="{ 'stamp-animation': isToday(date) }" />
                </span>
              </div>
            </div>
          </div>

          <div class="tasks-section">
            <h4 class="sub-title">{{ $t('task.rewardSubtitle') }}</h4>
            <div class="task-items">
              <div class="task-card" :class="getTaskClass(tasklist['1'])">
                <div class="task-info">
                  <div class="task-icon"><img :src="daily" alt="gift"></div>
                  <div class="task-text">
                    <h5>{{ $t('task.dailyLogin.name') }}</h5>
                    <p>{{ $t('task.dailyLogin.desc') }}</p>
                  </div>
                </div>
                <button class="claim-btn" :disabled="tasklist['1'] !== 1" @click="handleClaim(1)">
                  {{ getBtnText(tasklist['1'], 1) }}
                </button>
              </div>

              <div class="task-card" :class="getTaskClass(tasklist['2'])">
                <div class="task-info">
                  <div class="task-icon"><img :src="threeDay" alt="coin"></div>
                  <div class="task-text">
                    <h5>{{ $t('task.accumulate3.name') }}</h5>
                    <p>{{ $t('task.accumulate3.desc') }}</p>
                  </div>
                </div>
                <button class="claim-btn" :disabled="tasklist['2'] !== 1" @click="handleClaim(2)">
                  {{ getBtnText(tasklist['2'], 2) }}
                </button>
              </div>

              <div class="task-card" :class="getTaskClass(tasklist['3'])">
                <div class="task-info">
                  <div class="task-icon"><img :src="fiveDay" alt="diamond"></div>
                  <div class="task-text">
                    <h5>{{ $t('task.accumulate5.name') }}</h5>
                    <p>{{ $t('task.accumulate5.desc') }}</p>
                  </div>
                </div>
                <button class="claim-btn" :disabled="tasklist['3'] !== 1" @click="handleClaim(3)">
                  {{ getBtnText(tasklist['3'], 3) }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-loading" v-else>
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { fetchPlayerTaskListApi, claimPlayerTaskApi } from '@/assets/utils/api'
import { showToast } from '@/assets/utils/swal'
import confetti from 'canvas-confetti'
import greenCheck from '@/assets/images/icon/greenCheck.png'
import yellowCheck from '@/assets/images/icon/yellowCheck.png'
import daily from '@/assets/images/icon/daily.png'
import threeDay from '@/assets/images/icon/threeDay.png'
import fiveDay from '@/assets/images/icon/fiveDay.png'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen', 'task-claimed'])

const userStore = useUserStore()
const loading = ref(true)
const calendarData = ref({})
const tasklist = ref({ "1": 0, "2": 0, "3": 0 })

const currentProgress = computed(() => {
  if (!calendarData.value) return 0;

  let maxStreak = 0;
  let currentStreak = 0;

  // 確保日期是按時間先後順序排列的
  const sortedDates = Object.keys(calendarData.value).sort();

  // 依序檢查每一天的狀態
  for (const date of sortedDates) {
    if (calendarData.value[date] === true) {
      currentStreak++; // 有簽到，當前連續天數 +1
      maxStreak = Math.max(maxStreak, currentStreak); // 隨時記錄這週最高的連續紀錄
    } else {
      currentStreak = 0; // 沒簽到斷掉 把當前連續天數歸零
    }
  }

  return maxStreak; // 回傳本週最大的連續天數
})

const close = () => emit('update:isOpen', false)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchPlayerTaskListApi(userStore.account, userStore.token)
    if (res.code === 0) {
      calendarData.value = res.calendar
      tasklist.value = res.tasklist
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleClaim = async (type) => {
  try {
    const res = await claimPlayerTaskApi(userStore.account, userStore.token, type)
    if (res.code === 0) {
      fireConfetti()
      showToast(t('task.messages.claimSuccess'), 'success')
      await fetchData()
      emit('task-claimed')
      userStore.getPlayerInfo()
    } else {
      showToast(res.msg || t('task.messages.claimFailed'), 'warning')
    }
  } catch {
    showToast(t('task.messages.systemError'), 'error')
  }
}

const isToday = (dateStr) => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - offset).toISOString().split('T')[0];
  return dateStr === localISOTime;
}

const formatShortDate = (dateStr) => {
  const parts = dateStr.split('-')
  return `${parts[1]}/${parts[2]}`
}

const getTaskClass = (status) => {
  if (status === 1) return 'can-claim'
  if (status === 2) return 'is-claimed'
  return 'locked'
}

const getBtnText = (status, taskId) => {
  // 1: 可領取, 2: 已領取
  if (status === 1) return t('task.status.canClaim')
  if (status === 2) return t('task.status.claimed')

  // 0: 未達成 (鎖定狀態) 根據任務 ID 顯示當前連續進度
  if (taskId === 1) {
    return t('task.status.locked')
  } else if (taskId === 2) {
    return `${currentProgress.value} / 3` // 連續 3 天任務
  } else if (taskId === 3) {
    return `${currentProgress.value} / 5` // 連續 5 天任務
  }

  return t('task.status.locked') // 防呆
}

const fireConfetti = () => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 3000
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#FFD700', '#FFA500', '#FFFFFF']
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) fetchData()
})
</script>

<style scoped>
.task-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.task-modal-card {
  width: 100%;
  max-width: 500px;
  background-color: var(--color-bg-page);
  border: 1px solid #cbd5e1;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

.modal-header {
  /* padding: 32px 32px 20px; */
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h3 {
  color: #1a1a1a;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
}

.sparkle {
  animation: pulse 2s infinite;
}

.close-x {
  background: transparent;
  border: none;
  color: #94a3b8;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: 20px;
}

.close-x:hover {
  color: #1e293b;
  transform: scale(1.2);
}

.check-in-section {
  padding: 0 32px 32px;
}

.sub-title {
  /* color: #94a3b8; */
  color: #575555;
  font-size: 0.8rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

.day-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 16px;
  border: 1px solid #cbd5e1;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  aspect-ratio: 1 / 1.4;
  justify-content: center;
  padding: 6px 2px;
}

.day-dot {
  position: absolute;
  top: 8px;
  width: 4px;
  height: 4px;
  background-color: #cbd5e1;
  border-radius: 50%;
}

.day-label {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 700;
  margin-top: 4px;
}

.status-icon {
  margin-top: 6px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.status-icon img {
  max-width: 36px;
  max-height: 36px;
  width: 100%;
  object-fit: contain;
}

.day-box.is-signed {
  background-color: #f0fdf4;
  border-color: #82bd82b2;
}

.day-box.is-signed .day-dot {
  background-color: #82bd82b2;
}

.day-box.is-signed .day-label {
  color: #166534;
}

.day-box.is-today {
  background-color: #fffbeb;
  border: 2px solid #fcd34d;
  transform: translateY(0) scale(1.08);
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.1);
  z-index: 1;
}

.day-box.is-today .day-label {
  color: #92400e;
  font-weight: 800;
}

.day-box.is-today .day-dot {
  background-color: #f59e0b;
}

.tasks-section {
  padding: 0 32px 32px;
}

.task-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--color-bg-content);
  border-radius: 24px;
  border: 1px solid #cbd5e1;
  transition: all 0.3s ease;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-icon {
  font-size: 1.8rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
}

.task-icon img {
  width: 70px;
  height: auto;
}

.task-text {
  margin-left: 10px;
}

.task-text h5 {
  color: #1e293b;
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
}

.task-text p {
  color: #64748b;
  margin: 0;
  font-size: 0.85rem;
}

.claim-btn {
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 105px;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.task-card.can-claim {
  border-color: #fcd34d;
  background-color: #fffdf5;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.05);
}

.task-card.can-claim .claim-btn {
  background: linear-gradient(135deg, #fde68a 0%, #f59e0b 100%);
  color: #1f2937;
  box-shadow: 0 8px 20px -6px rgba(245, 158, 11, 0.4);
  animation: btn-pulse 2s infinite;
}

.task-card.is-claimed {
  opacity: 0.4;
  background-color: #f8fafc;
}

.task-card.is-claimed .claim-btn {
  background-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

/* 未達成 (鎖定) */
.task-card.locked {
  background-color: var(--color-bg-content);
}

.task-card.locked .claim-btn {
  background-color: #f8fafc;
  color: #64748b;
  border: 1px dashed #cbd5e1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
  cursor: default;
}

/* 當日簽到蓋章動畫 */

.stamp-animation {
  animation: stamp-in 0.45s cubic-bezier(0.25, 1.5, 0.5, 1) forwards;
}

@keyframes stamp-in {
  0% {
    opacity: 0;
    transform: scale(3.5) rotate(-15deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes btn-pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.04);
    box-shadow: 0 12px 24px -6px rgba(245, 158, 11, 0.5);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.4s ease;
}

.fade-scale-enter-active .task-modal-card,
.fade-scale-leave-active .task-modal-card {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
}

.fade-scale-enter-from .task-modal-card,
.fade-scale-leave-to .task-modal-card {
  transform: scale(0.9) translateY(30px);
}

.modal-loading {
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 4px solid #cbd5e1;
  border-top: 4px solid #1e293b;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .task-modal-card {
    border-radius: 24px;
  }

  .modal-header {
    /* padding: 20px 20px 12px; */
    padding-top: 20px;
  }

  .check-in-section,
  .tasks-section {
    padding: 0 20px 20px;
  }

  .calendar-grid {
    gap: 4px;
  }

  .day-box {
    border-radius: 10px;
  }

  .day-label {
    font-size: 0.55rem;
  }

  .status-icon img {
    max-width: 28px;
    max-height: 28px;
  }

  .task-card {
    padding: 12px 16px;
    border-radius: 16px;
  }

  .task-info {
    gap: 12px;
  }

  .task-icon {
    font-size: 1.4rem;
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .task-text h5 {
    font-size: 0.95rem;
  }

  .task-text p {
    font-size: 0.75rem;
  }

  .claim-btn {
    padding: 10px 14px;
    border-radius: 12px;
    min-width: 85px;
    font-size: 0.85rem;
  }

  .task-icon img {
    width: 55px;
  }

  .close-x {
    top: 10px;
    right: 10px;
  }
}
</style>
