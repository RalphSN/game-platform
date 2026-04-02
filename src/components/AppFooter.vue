<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <!-- <h3 class="footer-title">點點趣星球 DDFun</h3> -->
        <img :src="logoUrl" alt="logo">
      </div>

      <div class="footer-links">
        <router-link to="/info/terms">{{ $t('footer.termsOfService') }}</router-link>
        <router-link to="/info/privacy">{{ $t('footer.privacyPolicy') }}</router-link>
        <router-link to="/support">{{ $t('footer.contactSupport') }}</router-link>
        <a class="business-link" @click.prevent="copyEmail" href="#">{{ $t('footer.businessCooperation') }}
          <span class="email-tooltip">hentai.bd2@gmail.com</span>
        </a>
      </div>

      <div class="footer-divider"></div>

      <div class="copyright">
        &copy; {{ currentYear }} DDFun. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { showToast } from '@/assets/utils/swal'
import Swal from 'sweetalert2'
import logoUrl from '@/assets/images/logo/logo-light.svg'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const currentYear = computed(() => new Date().getFullYear())
const copyEmail = async () => {
  const email = 'hentai.bd2@gmail.com'
  try {
    await navigator.clipboard.writeText(email)
    showToast(t('terms.copied'), 'success')
  } catch (err) {
    console.error('複製失敗:', err)
    Swal.fire({
      icon: 'warning',
      title: t('terms.failed') || '自動複製失敗',
      html: `<div style="padding: 10px; background: #f1f5f9; border-radius: 8px; font-weight: bold; user-select: all; cursor: text;">
               ${email}
             </div>`,
      confirmButtonText: t('searchModal.close'),
      confirmButtonColor: 'var(--color-primary)'
    })
  }
}

</script>

<style scoped>
.app-footer {
  background-color: var(--color-bg-footer);
  color: var(--color-footer-text);
  padding: 40px 24px 24px;
  /* margin-top: auto; */
  margin-top: 5rem;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-brand {
  display: flex;
  align-items: center;
}

.footer-brand img {
  width: 200px;
}

.footer-title {
  color: var(--color-text-white);
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.footer-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a {
  color: var(--color-footer-text);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-footer-text-hover);
}

.footer-divider {
  width: 100%;
  max-width: 800px;
  height: 1px;
  background-color: var(--color-border-dark);
  margin: 8px 0;
}

.copyright {
  font-size: 0.85rem;
  color: var(--color-footer-text);
}

.business-link {
  position: relative;
  display: inline-block;
}

.email-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0px);

  background-color: var(--color-bg-content);
  color: var(--color-text-main);
  border: 1px solid var(--color-border-light);
  box-shadow: 0 10px 25px -5px var(--color-shadow-main);

  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.5px;

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}

.email-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: var(--color-bg-content) transparent transparent transparent;
}

.business-link:hover .email-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-10px);
}

@media (max-width: 768px) {
  .email-tooltip {
    left: auto;
    right: 0;
    transform: translateY(0px);
  }

  .business-link:hover .email-tooltip {
    transform: translateY(-10px);
  }

  .email-tooltip::after {
    left: auto;
    right: 24px;
    transform: none;
  }
}
</style>
