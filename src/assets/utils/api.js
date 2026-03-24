const BASE_URL = 'http://190.92.230.160:8021/apisrv'

const encryptPayload = (data) => {
  return data
}

const decryptResponse = (data) => {
  return data
}

// --- 取得外網 IP ---
let cachedIp = null
const getPublicIp = async () => {
  if (cachedIp) return cachedIp // 如果已經抓過直接回傳快取IP
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    cachedIp = data.ip
    return cachedIp
  } catch (error) {
    console.warn('無法取得外網 IP，使用預設值', error)
    return '127.0.0.1' // 備用方案
  }
}
// ------------------------------------

export const sendRequest = async (endpoint, payload) => {
  try {
    const currentIp = await getPublicIp()
    const finalPayload = {
      ...payload,
      LoginIP: currentIp,
    }

    const encryptedData = encryptPayload(finalPayload)

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

export const fetchPlayerInfo = async (account, token) => {
  const requestData = {
    Account: account,
    Token: token,
  }
  return await sendRequest('/member/playerInfo', requestData)
}

// 修改密碼 API
export const updatePasswordApi = async (account, pwdNew, token) => {
  const requestData = {
    Account: account,
    PWDNew: pwdNew,
    Token: token,
  }
  return await sendRequest('/member/updatePWD', requestData)
}

// 修改玩家資訊 API (暱稱)
export const updatePlayerInfoApi = async (account, nickname, token) => {
  const requestData = {
    Account: account,
    NickName: nickname,
    Token: token,
  }
  return await sendRequest('/member/updateInfo', requestData)
}

// 加入收藏API
export const addFavoriteApi = async (account, token, gameId) => {
  const requestData = {
    Account: account,
    Token: token,
    GameAutoNo: parseInt(gameId),
  }
  return await sendRequest('/member/gameLike', requestData)
}

// 取消收藏API
export const removeFavoriteApi = async (account, token, gameId) => {
  const requestData = {
    Account: account,
    Token: token,
    GameAutoNo: parseInt(gameId),
  }
  return await sendRequest('/member/gameLikeCancel', requestData)
}

// 取得玩家收藏清單API
export const fetchFavoriteListApi = async (account, token) => {
  const requestData = {
    Account: account,
    Token: token,
  }
  return await sendRequest('/member/likeList', requestData)
}

// 取得首頁遊戲清單API
export const fetchGameListAllApi = async (account = '', token = '') => {
  // 即使未登入 (訪客模式)，也可以傳空字串
  const requestData = {
    Account: account,
    Token: token,
  }
  return await sendRequest('/game/gameListAll', requestData)
}

// 取得篩選遊戲清單
export const fetchFilteredGamesApi = async (account, token, labelType, conformAny, gameStatus) => {
  const requestData = {
    Account: account,
    Token: token,
    LabelType: labelType, //  "1,2" 或者 "0"
    ConformAny: conformAny, // "Y" (任一) 或 "N" (全部)
    GameStatus: gameStatus, // 0 (全部), 1 (已解鎖), 2 (未解鎖)
  }
  return await sendRequest('/game/gameList', requestData)
}

// 取得單一遊戲詳細資訊
export const fetchGameInfoApi = async (account, token, gameId) => {
  const requestData = {
    Account: account,
    Token: token,
    GameAutoNo: parseInt(gameId, 10)
  }
  return await sendRequest('/game/gameInfo', requestData)
}

// 取得首頁所有 Banner 與廣告
export const fetchBannerListAllApi = async (account = '', token = '') => {
  const requestData = {
    Account: account,
    Token: token,
  }
  return await sendRequest('/game/bannerListAll', requestData)
}

// 追蹤點擊廣告API
export const trackBannerClickApi = async (bannerNo) => {
  const currentIp = await getPublicIp()

  const requestData = {
    CreateIP: currentIp,
    No: parseInt(bannerNo)
  }
  return await sendRequest('/ctrate/bannerHit', requestData)
}

// 取得客訴清單
export const fetchTicketListApi = async (account, token) => {
  const requestData = { Account: account, Token: token }
  return await sendRequest('/membercontact/membercontact', requestData)
}

// 取得單一客訴詳細資料
export const fetchTicketDetailApi = async (account, token, detailId) => {
  const requestData = {
    Account: account,
    Token: token,
    DetailID: parseInt(detailId)
  }
  return await sendRequest('/membercontact/memberContactDetail', requestData)
}

// 送出新問題 (filesObj 包含 chat_1, chat_2, chat_3 的 Base64 字串)
export const submitTicketApi = async (account, token, type, info, filesObj) => {
  const requestData = {
    Account: account,
    Token: token,
    Type: parseInt(type),
    Info: info,
    ...filesObj
  }
  return await sendRequest('/membercontact/addMemberContact', requestData)
}

// 玩家回覆問題
export const replyTicketApi = async (account, token, detailId, info, filesObj) => {
  const requestData = {
    Account: account,
    Token: token,
    DetailID: parseInt(detailId),
    Info: info,
    ...filesObj
  }
  return await sendRequest('/membercontact/addMemberContactReply', requestData)
}

// 玩家儲值紀錄
export const fetchChargeListApi = async (account, token) => {
  const requestData = {
    Account: account,
    Token: token,
  }
  return await sendRequest('/member/chargeList', requestData)
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
