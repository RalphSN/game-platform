import { defineStore } from 'pinia'
import { fetchPlayerInfo, addFavoriteApi, removeFavoriteApi } from '@/assets/utils/api'
export const useUserStore = defineStore('user', {
  state: () => ({
    account: localStorage.getItem('user_account') || '',
    token: localStorage.getItem('user_token') || '',
    nickname: '',
    points: 0,
    freePoints: 0,
    favoriteGames: [],
  }),

  actions: {
    async getPlayerInfo(ip = '127.0.0.1') {
      if (!this.account || !this.token) return false

      try {
        const result = await fetchPlayerInfo(this.account, this.token, ip)

        if (result.code === 0 && result.player) {
          this.points = result.player.Points
          this.freePoints = result.player.FreePoints
          this.nickname = result.player.NickName || ''

          // 將 "1,2" 這種字串轉換成數字陣列 [1, 2]
          this.favoriteGames = result.player.FavoriteGame
            ? result.player.FavoriteGame.split(',').map(Number)
            : []

          return true
        } else {
          this.logout()
          return false
        }
      } catch (error) {
        console.error('獲取玩家資訊失敗:', error)
        return false
      }
    },
    // 切換收藏狀態 (加入或取消)
    async toggleFavorite(gameId, ip = '127.0.0.1') {
      // 確認登入
      if (!this.account || !this.token) {
        alert('請先登入才能收藏遊戲')
        return false
      }

      try {
        // 判斷收藏清單裡有無此遊戲 ID
        const isFavorite = this.favoriteGames.includes(gameId)
        let result = null

        // 根據判斷結果決定打API
        if (isFavorite) {
          // 已經收藏 -> 取消 API
          result = await removeFavoriteApi(this.account, this.token, gameId, ip)
        } else {
          // 還沒收藏 -> 加入 API
          result = await addFavoriteApi(this.account, this.token, gameId, ip)
        }

        // API回傳成功在背景「重取玩家資訊」更新愛心狀態
        if (result.code === 0) {
          await this.getPlayerInfo(ip)
          return true
        } else {
          console.error('收藏動作失敗:', result.msg)
          alert(result.msg || '操作失敗，請稍後再試')
          return false
        }
      } catch (error) {
        console.error('切換收藏發生錯誤:', error)
        return false
      }
    },

    setLoginData(account, token) {
      this.account = account
      this.token = token
      localStorage.setItem('user_account', account)
      localStorage.setItem('user_token', token)
    },

    logout() {
      this.account = ''
      this.token = ''
      this.nickname = ''
      this.points = 0
      this.freePoints = 0
      this.favoriteGames = []
      localStorage.removeItem('user_account')
      localStorage.removeItem('user_token')
    },
  },
})
