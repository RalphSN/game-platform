<template>
  <div class="game-card" @click="goToGame">

    <div class="thumb-wrapper">
      <img :src="game.thumb" :alt="game.title" class="game-thumb" loading="lazy" />
      <div class="hover-overlay">
        <div class="play-btn">▶ 立即遊玩</div>
      </div>
    </div>

    <div class="game-info">
      <h4 class="game-title">{{ game.title }}</h4>
      <div class="game-meta">
        <span class="game-tag">{{ game.category }}</span>
        <span class="game-players">🔥 {{ game.players }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
// import { useRouter } from 'vue-router'

// 預留接收 API 資料的 Props
const props = defineProps({
  game: {
    type: Object,
    required: true,
    // Mock API 預期的資料結構示範
    default: () => ({
      id: 0,
      title: '載入中...',
      thumb: 'https://via.placeholder.com/300x300?text=Game',
      category: '未分類',
      players: 0
    })
  }
})

// const router = useRouter()

// 點擊卡片跳轉到遊戲詳情頁 (未來可串接真實路由)
const goToGame = () => {
  if (props.game.id === 0) return // 防止載入中被點擊
  console.log(`準備進入遊戲 ID: ${props.game.id}`)
  // router.push(`/game/${props.game.id}`)
}

// 格式化遊玩人數 (例如: 12000 -> 1.2w)
// const formatPlayers = (num) => {
//   if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
//   if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
//   return num
// }
</script>

<style scoped>
/* 卡片外觀：白色底、圓角、預設陰影 */
.game-card {
  background-color: var(--color-bg-content);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  /* 寬度由外層 Grid 決定 */
}

/* Hover 互動效果：整張卡片上浮並加深陰影 */
.game-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px var(--color-shadow-main);
}

/* --- 圖片與遮罩區 --- */
.thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  /* 強制正方形比例，讓瀑布流整齊 */
  overflow: hidden;
}

.game-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* 滑鼠移入時，圖片微微放大 */
.game-card:hover .game-thumb {
  transform: scale(1.08);
}

/* 黑色半透明遮罩 (預設隱藏) */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 41, 55, 0.6);
  /* 深灰半透明 */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .hover-overlay {
  opacity: 1;
}

/* 播放按鈕 */
.play-btn {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.game-card:hover .play-btn {
  transform: translateY(0);
}

/* --- 資訊區 --- */
.game-info {
  padding: 12px;
}

.game-title {
  color: var(--color-text-main);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  /* 文字過長省略號 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.game-players {
  color: var(--color-text-sub);
  font-size: 0.8rem;
}
</style>
