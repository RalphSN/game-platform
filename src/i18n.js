import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.json'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

// 取得使用者上次選擇的語系，預設繁體中文
const savedLanguage = localStorage.getItem('user_language') || 'zh-TW'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage, // 當前的語系
  fallbackLocale: 'zh-TW', // 如果找不到對應的翻譯退回哪一個語系
  messages: {
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    'en-US': enUS
  },
})

export default i18n
