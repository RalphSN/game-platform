<template>
  <div class="support-view">
    <div class="support-container fade-in-up">
      <div class="support-header">
        <div class="header-icon">🎧</div>
        <h2>聯絡客服</h2>
        <p>遇到問題了嗎？請填寫下方表單，我們將盡快為您處理。</p>
      </div>

      <div v-if="isSuccess" class="success-message fade-in-up">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3>回報已成功送出！</h3>
        <p>您的問題已記錄 (單號：<span class="ticket-id">#{{ ticketId }}</span>)</p>
        <p class="sub-text">客服人員將於 1-2 個工作天內透過 Email 與您聯繫。</p>
        <button @click="resetForm" class="primary-btn">返回填寫新單</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="support-form">
        <div class="form-row">
          <div class="form-group half-width">
            <label for="issueType">問題類型</label>
            <div class="input-wrapper">
              <select id="issueType" v-model="form.type" required :disabled="isLoading">
                <option value="" disabled>請選擇類型</option>
                <option value="account">帳號與登入問題</option>
                <option value="payment">儲值與購買異常</option>
                <option value="bug">遊戲 Bug 回報</option>
                <option value="suggestion">功能建議</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
          <div class="form-group half-width">
            <label for="email">聯絡信箱</label>
            <div class="input-wrapper">
              <input id="email" type="email" v-model="form.email" required placeholder="請輸入 Email"
                :disabled="isLoading" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="title">主旨</label>
          <div class="input-wrapper">
            <input id="title" type="text" v-model="form.title" required placeholder="請簡述您的問題" :disabled="isLoading" />
          </div>
        </div>

        <div class="form-group">
          <label for="description">詳細說明</label>
          <div class="input-wrapper">
            <textarea id="description" v-model="form.description" required rows="5"
              placeholder="請詳細描述您遇到的狀況、發生時間及操作步驟..." :disabled="isLoading"></textarea>
          </div>
        </div>

        <div class="form-group">
          <label>上傳截圖 <span class="optional-tag">(選填，最多 3 張)</span></label>

          <div class="upload-zone"
            :class="{ 'is-dragging': isDragging, 'is-disabled': isLoading || previewImages.length >= 3 }"
            @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
            @click="triggerFileInput">
            <input type="file" ref="fileInput" multiple accept="image/png, image/jpeg, image/jpg"
              @change="handleFileSelect" style="display: none;" :disabled="isLoading || previewImages.length >= 3" />
            <div class="upload-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>點擊或將圖片拖曳至此處</span>
              <span class="upload-hint">支援 JPG, PNG 格式</span>
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
          <span v-else>送出回報</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue'

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

const handleFileProcessing = (newFiles) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']

  Array.from(newFiles).forEach(file => {
    if (previewImages.value.length >= 3) return
    if (!allowedTypes.includes(file.type)) {
      alert('僅支援 JPG 與 PNG 圖片格式')
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

const mockSubmitAPI = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('送出的表單資料:', formData)
      console.log('送出的圖片數量:', files.value.length)
      resolve({
        status: 200,
        ticketId: 'TK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
      })
    }, 1500)
  })
}

const handleSubmit = async () => {
  isLoading.value = true

  try {
    const response = await mockSubmitAPI({ ...form })
    ticketId.value = response.ticketId
    isSuccess.value = true
  } catch (error) {
    alert('送出失敗，請稍後再試。')
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
  font-size: 3rem;
  margin-bottom: 12px;
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

@media (max-width: 768px) {
  .support-container {
    padding: 32px 20px;
    border-radius: 12px;
  }

  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
