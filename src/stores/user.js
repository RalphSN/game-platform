import { defineStore } from 'pinia'
import { fetchPlayerInfo, addFavoriteApi, removeFavoriteApi } from '@/assets/utils/api'
import { showToast, showDialog } from '@/assets/utils/swal'
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
      if (!this.account || !this.token) {
        showToast('請先登入才能收藏遊戲','warning')
        throw new Error('未登入')
      }

      try {
        const isFavorite = this.favoriteGames.includes(gameId)
        let result = null

        if (isFavorite) {
          result = await removeFavoriteApi(this.account, this.token, gameId, ip)
        } else {
          result = await addFavoriteApi(this.account, this.token, gameId, ip)
        }

        if (result.code === 0) {
          await this.getPlayerInfo(ip)
          return true
        } else if (result.code === 5) {
          throw new Error('找不到該遊戲，可能已下架')
        } else {
          throw new Error(result.msg || '操作失敗，請稍後再試')
        }
      } catch (error) {
        console.error('切換收藏發生錯誤:', error)
        throw error
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
