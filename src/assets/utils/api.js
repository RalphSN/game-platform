const BASE_URL = 'http://127.0.0.1:3001/apisrv'

const encryptPayload = (data) => {
  console.log('[準備加密的資料]', data)
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
