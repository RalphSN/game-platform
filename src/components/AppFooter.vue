<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <h3 class="footer-title">點點趣星球 DDFun</h3>
      </div>

      <div class="footer-links">
        <a href="#">關於我們</a>
        <a href="#">服務條款</a>
        <a href="#">隱私權政策</a>
        <a href="#">聯絡客服</a>
      </div>

      <div class="footer-divider"></div>

      <div class="copyright">
        &copy; {{ currentYear }} GamePlay. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: var(--color-bg-footer);
  /* 背景：深灰藍 */
  color: var(--color-footer-text);
  /* 文字：淡灰 */
  padding: 40px 24px 24px;
  margin-top: auto;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-title {
  color: var(--color-text-white);
  /* 標題：白色 */
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
  /* 文字：淡灰 */
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-footer-text-hover);
  /* 文字滑過：淺藍 */
}

/* 分隔線：深灰 */
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
</style>
