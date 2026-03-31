<template>
  <div class="support-view">
    <div class="support-layout">
      <aside class="support-sidebar fade-in-up">
        <div class="sidebar-menu">
          <button class="menu-item" :class="{ active: currentTab === 'new' }" @click="switchTab('new')">
            <span class="menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </span>
            {{ $t('support.tabs.newIssue') }}
          </button>
          <button class="menu-item" :class="{ active: currentTab === 'list' || currentTab === 'detail' }"
            @click="switchTab('list')">
            <span class="menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <line x1="9" y1="14" x2="15" y2="14"></line>
                <line x1="9" y1="18" x2="15" y2="18"></line>
                <line x1="9" y1="10" x2="15" y2="10"></line>
              </svg>
            </span>
            {{ $t('support.tabs.history') }}
          </button>
        </div>
      </aside>

      <main class="support-content fade-in-up" style="animation-delay: 0.1s;">
        <transition name="fade-slide" mode="out-in">
          <div v-if="currentTab === 'new'" key="new" class="support-container">
            <div class="support-header">
              <h2>{{ $t('support.newIssue.title') }}</h2>
              <p>{{ $t('support.newIssue.subtitle') }}</p>
            </div>

            <div v-if="isSuccess" class="success-message fade-in-up">
              <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>{{ $t('support.newIssue.successTitle') }}</h3>
              <p v-html="$t('support.newIssue.ticketId', { id: `<span class='ticket-id'>＃${ticketId}</span>` })"></p>
              <p class="sub-text">{{ $t('support.newIssue.successDesc') }}</p>
              <button @click="resetForm" class="primary-btn">{{ $t('support.newIssue.backToNew') }}</button>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="support-form">
              <div class="form-row">
                <div class="form-group half-width">
                  <label for="issueType">{{ $t('support.form.issueType') }}</label>
                  <div class="input-wrapper">
                    <select id="issueType" v-model="form.type" required :disabled="isLoading">
                      <option value="" disabled>{{ $t('support.form.selectType') }}</option>
                      <option value="account">{{ $t('support.issueTypes.account') }}</option>
                      <option value="payment">{{ $t('support.issueTypes.payment') }}</option>
                      <option value="bug">{{ $t('support.issueTypes.bug') }}</option>
                      <option value="suggestion">{{ $t('support.issueTypes.suggestion') }}</option>
                      <option value="other">{{ $t('support.issueTypes.other') }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="description">{{ $t('support.form.description') }}</label>
                <div class="input-wrapper">
                  <textarea id="description" v-model="form.description" required rows="5"
                    :placeholder="$t('support.form.descPlaceholder')" :disabled="isLoading"></textarea>
                </div>
              </div>

              <div class="form-group">
                <label>{{ $t('support.form.uploadImage') }} <span class="optional-tag">{{ $t('support.form.optional3')
                }}</span></label>
                <div class="upload-zone"
                  :class="{ 'is-dragging': isDragging, 'is-disabled': isLoading || previewImages.length >= 3 }"
                  @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop" @click="triggerFileInput">
                  <input type="file" ref="fileInput" multiple accept="image/png, image/jpeg, image/jpg"
                    @change="handleFileSelect" style="display: none;"
                    :disabled="isLoading || previewImages.length >= 3" />
                  <div class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>{{ $t('support.form.dragHint') }}</span>
                    <span class="upload-hint">{{ $t('support.form.supportFormat') }}</span>
                  </div>
                </div>

                <div v-if="previewImages.length > 0" class="image-preview-area">
                  <div v-for="(img, index) in previewImages" :key="index" class="preview-item fade-in-up"
                    :style="{ animationDelay: `${index * 0.1}s` }">
                    <img :src="img.url" alt="upload preview" />
                    <button type="button" class="remove-btn" @click.stop="removeImage(index)" :disabled="isLoading">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" class="submit-btn" :disabled="isLoading">
                <span v-if="isLoading" class="loader"></span>
                <span v-else>{{ $t('support.form.submit') }}</span>
              </button>
            </form>
          </div>

          <div v-else-if="currentTab === 'list'" key="list" class="support-container list-container">
            <div class="support-header">
              <h2>{{ $t('support.history.title') }}</h2>
            </div>
            <div class="ticket-list">
              <div v-for="ticket in ticketList" :key="ticket.AutoNo" class="ticket-card" @click="viewTicket(ticket)">
                <div class="ticket-top">
                  <span class="ticket-type">{{ getTicketTypeName(ticket.Type) }}</span>
                  <span class="ticket-status" :class="getStatusClass(ticket.Status)">
                    {{ getStatusName(ticket.Status) }}
                  </span>
                </div>
                <p class="ticket-info">{{ ticket.Info }}</p>
                <div class="ticket-bottom">
                  <span class="ticket-date">{{ ticket.CreateTime }}</span>
                  <span class="ticket-no">{{ $t('support.history.ticketNo', { id: ticket.AutoNo }) }}</span>
                </div>
              </div>
              <div v-if="ticketList.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                </div>
                <p>{{ $t('support.history.empty') }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="currentTab === 'detail'" key="detail" class="support-container detail-container">
            <div class="detail-header">
              <button class="back-btn" @click="switchTab('list')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                {{ $t('support.detail.back') }}
              </button>
              <span class="ticket-status" :class="getStatusClass(selectedTicket.Status)">
                {{ getStatusName(selectedTicket.Status) }}
              </span>
            </div>

            <div class="chat-container" ref="chatContainer">
              <div v-for="(msg, index) in ticketDetail.contactDetail" :key="index" class="chat-bubble-wrapper"
                :class="{ 'is-player': msg.MsgBy === 0, 'is-cs': msg.MsgBy === 1 }">
                <div class="chat-avatar">
                  <svg v-if="msg.MsgBy === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path
                      d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z">
                    </path>
                  </svg>
                </div>
                <div class="chat-content">
                  <div class="chat-bubble">{{ msg.Info }}</div>
                  <div class="chat-time">{{ msg.CreateTime }}</div>
                </div>
              </div>

              <div v-if="ticketDetail.filePath && ticketDetail.filePath.length > 0" class="attachment-area">
                <h4>{{ $t('support.detail.attachments') }}</h4>
                <div class="image-preview-area">
                  <div v-for="(path, index) in ticketDetail.filePath" :key="index" class="preview-item">
                    <img :src="path" alt="attachment" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedTicket.Status !== 2" class="reply-section">
              <div class="form-group">
                <div class="input-wrapper">
                  <textarea v-model="replyText" rows="3" :placeholder="$t('support.detail.replyPlaceholder')"
                    :disabled="isLoading"></textarea>
                </div>
              </div>
              <button class="submit-btn" @click="submitReply" :disabled="isLoading || !replyText.trim()">
                <span v-if="isLoading" class="loader"></span>
                <span v-else>{{ $t('support.detail.submitReply') }}</span>
              </button>
            </div>
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onUnmounted, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  fetchTicketListApi,
  fetchTicketDetailApi,
  submitTicketApi,
  replyTicketApi
} from '@/assets/utils/api'
import { getImageUrlWithCacheBuster } from '@/assets/utils/helpers'
import { showToast } from '@/assets/utils/swal'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userStore = useUserStore()

const chatContainer = ref(null)

const form = reactive({
  type: '',
  email: '',
  title: '',
  description: ''
})

const fileInput = ref(null)
const previewImages = ref([])
const files = ref([])
const isDragging = ref(false)

const isLoading = ref(false)
const isSuccess = ref(false)
const ticketId = ref('')

const currentTab = ref('new')
const selectedTicket = ref(null)
const replyText = ref('')

const ticketList = ref([])
const ticketDetail = ref({
  filePath: [],
  contactDetail: [],
  status: 0
})

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const prepareFilesObject = async () => {
  const filesObj = {}
  for (let i = 0; i < files.value.length; i++) {
    filesObj[`chat_${i + 1}`] = await fileToBase64(files.value[i])
  }
  return filesObj
}

const loadTicketList = async () => {
  if (!userStore.account) return
  isLoading.value = true
  try {
    const res = await fetchTicketListApi(userStore.account, userStore.token)
    if (res.code === 0) {
      ticketList.value = res.contactInfo || []
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const switchTab = (tab) => {
  currentTab.value = tab
  if (tab === 'new') {
    resetForm()
  } else if (tab === 'list') {
    loadTicketList()
  }
}

const viewTicket = async (ticket) => {
  selectedTicket.value = ticket
  currentTab.value = 'detail'
  replyText.value = ''
  isLoading.value = true

  try {
    const res = await fetchTicketDetailApi(userStore.account, userStore.token, ticket.AutoNo)
    if (res.code === 0) {
      const rawFilePaths = res.filePath || []

      ticketDetail.value = {
        filePath: rawFilePaths.map(path => getImageUrlWithCacheBuster(path)),
        contactDetail: res.contactDetail || [],
        status: res.status !== undefined ? res.status : ticket.Status
      }
      selectedTicket.value.Status = ticketDetail.value.status

      setTimeout(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTo({
            top: chatContainer.value.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 350)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const submitReply = async () => {
  if (!replyText.value.trim() || !userStore.account) return
  isLoading.value = true

  try {
    const response = await replyTicketApi(
      userStore.account,
      userStore.token,
      selectedTicket.value.AutoNo,
      replyText.value,
      {}
    )

    if (response.code === 0) {
      await viewTicket(selectedTicket.value)
    } else {
      showToast(response.msg || t('support.errors.replyFailed'), 'warning')
    }
  } catch (error) {
    showToast(t('gameDetail.messages.systemError'), 'warning')
  } finally {
    isLoading.value = false
  }
}

const getTicketTypeName = (type) => {
  const types = {
    1: t('support.issueTypes.account'),
    2: t('support.issueTypes.payment'),
    3: t('support.issueTypes.bug'),
    4: t('support.issueTypes.suggestion'),
    5: t('support.issueTypes.other')
  }
  return types[type] || t('support.issueTypes.other')
}

const getStatusName = (status) => {
  const statuses = {
    0: t('support.status.pending'),
    1: t('support.status.processing'),
    2: t('support.status.resolved')
  }
  return statuses[status] || t('support.status.unknown')
}
const getStatusClass = (status) => {
  const classes = { 0: 'status-pending', 1: 'status-processing', 2: 'status-resolved' }
  return classes[status] || ''
}

const handleFileProcessing = (newFiles) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']

  Array.from(newFiles).forEach(file => {
    if (previewImages.value.length >= 3) return
    if (!allowedTypes.includes(file.type)) {
      showToast(t('support.errors.formatOnly'), 'warning')
      return
    }

    files.value.push(file)
    previewImages.value.push({
      file,
      url: URL.createObjectURL(file)
    })
  })
}

const triggerFileInput = () => {
  if (isLoading.value || previewImages.value.length >= 3) return
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  handleFileProcessing(event.target.files)
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  if (isLoading.value || previewImages.value.length >= 3) return
  handleFileProcessing(event.dataTransfer.files)
}

const removeImage = (index) => {
  URL.revokeObjectURL(previewImages.value[index].url)
  previewImages.value.splice(index, 1)
  files.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!userStore.account) return showToast(t('gameDetail.messages.loginFirst'), 'warning')
  isLoading.value = true

  try {
    const filesObj = await prepareFilesObject()
    const typeMap = { 'account': 1, 'payment': 2, 'bug': 3, 'suggestion': 4, 'other': 5 }
    const typeCode = typeMap[form.type] || 5

    const response = await submitTicketApi(
      userStore.account,
      userStore.token,
      typeCode,
      form.description,
      filesObj
    )

    if (response.code === 0) {
      ticketId.value = response.LastAutoNo || ''
      isSuccess.value = true
    } else {
      showToast(response.msg || t('support.errors.submitFailed'), 'warning')
    }
  } catch (error) {
    showToast(t('gameDetail.messages.systemError'), 'warning')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.type = ''
  form.email = ''
  form.title = ''
  form.description = ''
  previewImages.value.forEach(img => URL.revokeObjectURL(img.url))
  previewImages.value = []
  files.value = []
  isSuccess.value = false
}

onMounted(() => {
  if (currentTab.value === 'list') {
    loadTicketList()
  }
})

onUnmounted(() => {
  previewImages.value.forEach(img => URL.revokeObjectURL(img.url))
})
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

.support-view {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0 60px;
}

.support-container {
  width: 100%;
  max-width: 680px;
  background-color: var(--color-bg-content);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
}

.support-header {
  text-align: center;
  margin-bottom: 32px;
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

.support-header h2 {
  font-size: 1.75rem;
  color: var(--color-text-main);
  margin: 0 0 8px;
}

.support-header p {
  color: var(--color-text-sub);
  margin: 0;
}

.support-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.half-width {
  flex: 1;
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

.optional-tag {
  font-size: 0.8rem;
  font-weight: normal;
  color: var(--color-text-muted);
  margin-left: 4px;
}

.input-wrapper input,
.input-wrapper select,
.input-wrapper textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  color: var(--color-text-main);
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input-wrapper textarea {
  resize: vertical;
  min-height: 120px;
}

.input-wrapper input:focus,
.input-wrapper select:focus,
.input-wrapper textarea:focus {
  border-color: var(--color-primary);
  background-color: var(--color-bg-content);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.input-wrapper input:disabled,
.input-wrapper select:disabled,
.input-wrapper textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.upload-zone {
  border: 2px dashed var(--color-border-light);
  border-radius: 8px;
  padding: 32px 20px;
  text-align: center;
  background-color: var(--color-bg-page);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-zone:hover:not(.is-disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.upload-zone.is-dragging {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  transform: scale(1.02);
}

.upload-zone.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-text-sub);
}

.upload-placeholder svg {
  width: 36px;
  height: 36px;
  color: var(--color-primary);
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.image-preview-area {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover:not(:disabled) {
  background-color: #d32f2f;
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.submit-btn {
  margin-top: 16px;
  width: 100%;
  height: 52px;
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
  background-color: #a0a0a0;
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

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: #e8f5e9;
  color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.success-icon svg {
  width: 40px;
  height: 40px;
}

.success-message h3 {
  font-size: 1.5rem;
  color: var(--color-text-main);
  margin: 0 0 12px;
}

.success-message p {
  color: var(--color-text-main);
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.ticket-id {
  font-weight: 700;
  color: var(--color-primary);
}

.sub-text {
  font-size: 0.95rem;
  color: var(--color-text-sub);
  margin-bottom: 32px !important;
}

.primary-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.support-layout {
  display: flex;
  width: 100%;
  max-width: 1000px;
  gap: 24px;
}

.support-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.support-content {
  flex: 1;
  min-width: 0;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: var(--color-bg-content);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px var(--color-shadow-main);
  border: 1px solid var(--color-border-light);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--color-text-sub);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.menu-item:hover {
  background-color: var(--color-bg-page);
  color: var(--color-text-main);
}

.menu-item.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.menu-icon {
  display: flex;
  align-items: center;
}

.menu-icon svg {
  width: 20px;
  height: 20px;
}

.list-container {
  padding: 40px;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-card {
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.ticket-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ticket-type {
  font-weight: 600;
  color: var(--color-text-main);
}

.ticket-status {
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.status-pending {
  background-color: #fee2e2;
  color: #ef4444;
}

.status-processing {
  background-color: #fef3c7;
  color: #f59e0b;
}

.status-resolved {
  background-color: #e0f2fe;
  color: #0ea5e9;
}

.ticket-info {
  color: var(--color-text-sub);
  font-size: 0.95rem;
  margin: 0 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--color-text-sub);
}

.empty-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  color: var(--color-border-light);
}

.empty-icon svg {
  width: 64px;
  height: 64px;
}

.detail-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-text-sub);
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.back-btn:hover {
  color: var(--color-primary);
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.chat-bubble-wrapper {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.chat-bubble-wrapper.is-player {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-bubble-wrapper.is-cs {
  align-self: flex-start;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-sub);
  flex-shrink: 0;
}

.chat-avatar svg {
  width: 20px;
  height: 20px;
}

.is-player .chat-avatar {
  background-color: var(--color-primary);
  color: white;
}

.chat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.is-player .chat-content {
  align-items: flex-end;
}

.chat-bubble {
  background-color: var(--color-bg-page);
  padding: 12px 16px;
  border-radius: 12px;
  color: var(--color-text-main);
  line-height: 1.5;
}

.is-player .chat-bubble {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.chat-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.attachment-area {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--color-border-light);
}

.attachment-area h4 {
  font-size: 0.9rem;
  margin: 0 0 12px 0;
  color: var(--color-text-sub);
}

.reply-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}

@media (max-width: 768px) {
  .support-container {
    padding: 32px 20px;
    border-radius: 12px;
  }

  .form-row {
    flex-direction: column;
    gap: 20px;
  }

  .support-layout {
    flex-direction: column;
  }

  .support-sidebar {
    width: 100%;
  }

  .sidebar-menu {
    flex-direction: row;
    padding: 8px;
  }

  .menu-item {
    flex: 1;
    justify-content: center;
  }

  .chat-bubble-wrapper {
    max-width: 90%;
  }
}
</style>
