const BASE_URL = 'http://190.92.230.160:8021/apisrv/'

const encryptPayload = (data) => {
  return data
}

const decryptResponse = (data) => {
  return data
}

export const sendRequest = async (endpoint, payload) => {
  try {
    const encryptedData = encryptPayload(payload)
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encryptedData),
    })

    if (!response.ok) {
      throw new Error(`伺服器錯誤: ${response.status}`)
    }

    const rawResult = await response.json()

    const decryptedResult = decryptResponse(rawResult)

    return decryptedResult
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('無法連線至伺服器，請檢查網路或 CORS 設定')
    }
    throw error
  }
}

export const fetchPlayerInfo = async (account, token, ip) => {
  const requestData = {
    Account: account,
    Token: token,
    LoginIP: ip || '127.0.0.1',
  }

  return await sendRequest('/member/playerInfo', requestData)
}

// 修改密碼 API
export const updatePasswordApi = async (account, pwdNew, token, ip) => {
  const requestData = {
    Account: account,
    PWDNew: pwdNew,
    Token: token,
    LoginIP: ip || '127.0.0.1',
  }

  return await sendRequest('/member/updatePWD', requestData)
}

// 修改玩家資訊 API (暱稱)
export const updatePlayerInfoApi = async (account, nickname, token, ip) => {
  const requestData = {
    Account: account,
    NickName: nickname, // 注意大小寫
    Token: token,
    LoginIP: ip || '127.0.0.1',
  }
  return await sendRequest('/member/updateInfo', requestData)
}

// 模擬熱門關鍵字 API
export const fetchHotKeywords = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: ['鍛劍開天', '夢幻廚房', 'RPG', '射擊', '掛機'],
      })
    }, 300)
  })
}

// 模擬搜尋 API
export const searchGames = async (keyword) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!keyword || keyword.trim() === '') {
        resolve({ code: 0, data: [] })
        return
      }

      const mockDB = [
        {
          id: 1,
          title: '鍛劍開天',
          category: '角色扮演',
          thumb: 'https://picsum.photos/seed/1/100/100',
        },
        {
          id: 2,
          title: '夢幻廚房',
          category: '休閒益智',
          thumb: 'https://picsum.photos/seed/2/100/100',
        },
        {
          id: 3,
          title: '星際塔防',
          category: '策略',
          thumb: 'https://picsum.photos/seed/3/100/100',
        },
        {
          id: 4,
          title: '劍與魔法',
          category: '角色扮演',
          thumb: 'https://picsum.photos/seed/4/100/100',
        },
      ]

      const results = mockDB.filter(
        (game) => game.title.includes(keyword) || game.category.includes(keyword),
      )

      resolve({ code: 0, data: results })
    }, 500)
  })
}

// 模擬依分類取得遊戲清單 API
export const fetchGamesByCategory = async (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const count = categoryId === 'hot' ? 12 : 8
      const categoryName =
        categoryId === 'hot' ? '熱門遊戲' : categoryId === 'new' ? '最新上架' : '精選遊戲'

      const mockResults = Array.from({ length: count }, (_, i) => ({
        id: parseInt(`${categoryId.length}${i}`),
        title: `${categoryName} ${i + 1}`,
        category: categoryName,
        thumb: `https://picsum.photos/seed/${categoryId}${i}/300/300`,
        players: Math.floor(Math.random() * 10000) + 100,
      }))

      resolve({
        code: 0,
        data: {
          title: categoryName, // 回傳該分類的顯示名稱
          games: mockResults,
        },
      })
    }, 600)
  })
}
