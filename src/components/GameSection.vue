<template>
  <section class="game-section">
    <div class="section-header">
      <h3 class="section-title">
        <span class="title-icon" v-if="icon" v-html="icon"></span>
        {{ title || $t('gameSection.featuredGames') }}
      </h3>

      <button class="more-btn" @click="goToCategory" v-if="showMore">
        {{ $t('gameSection.viewMore') }} <span class="arrow">›</span>
      </button>
    </div>

    <div class="section-content">
      <div class="game-grid">
        <GameCard v-for="(game, index) in games" :key="game.GameAutoNo || index" :game="game"
          :hideFavorite="categoryId === 'banana' || categoryId === '0' || categoryId === 0"
          :isBanana="categoryId === 'banana' || categoryId === '0' || categoryId === 0" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import GameCard from './GameCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: ''
  },
  icon: {
    type: String,
    default: '' // 如 '🔥', '⚔️', '🧩'
  },
  categoryId: {
    type: [String, Number],
    default: 'all' // 用於跳轉路由時帶的參數
  },
  games: {
    type: Array,
    required: true,
    default: () => []
  },
  showMore: {
    type: Boolean,
    default: true // 是否顯示「查看更多」
  }
})

const router = useRouter()

const goToCategory = () => {
  router.push(`/category/${props.categoryId}`)
}
</script>

<style scoped>
.game-section {
  width: 100%;
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-border-light);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.title-icon {
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 「查看更多」 */
.more-btn {
  background: none;
  border: none;
  color: var(--color-text-sub);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.more-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.arrow {
  font-size: 1.2rem;
  line-height: 1;
}

/* --- 內容區域 --- */
.section-content {
  width: 100%;
}

.game-grid {
  display: grid;
  /* 預設電腦版一排 6 個 */
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

/* ==========================================
   RWD 響應式斷點
   ========================================== */
@media (max-width: 1024px) {
  .game-grid {
    grid-template-columns: repeat(4, 1fr);
    /* 平板 4 個 */
  }
}

@media (max-width: 768px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
    /* 手機 3 個 */
    gap: 12px;
  }

  .section-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr);
    /* 小手機 2 個 */
  }
}
</style>
