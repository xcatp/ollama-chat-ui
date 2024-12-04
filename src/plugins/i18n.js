import messages from '@/locals'
import { createI18n } from 'vue-i18n'

const defaultLang = localStorage.getItem('lang') || 'en'

const i18n = createI18n({
  locale: defaultLang, // 设置默认语言
  legacy: false,
  fallbackLocale: 'en', // 设置备用语言
  messages, // 设置语言包
})

export default i18n
