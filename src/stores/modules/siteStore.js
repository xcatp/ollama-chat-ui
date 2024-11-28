import { ref } from 'vue'
import { defineStore } from 'pinia'
import { local } from '@/utils/storage'

export const useSiteStore = defineStore('site', () => {
  const siteState = ref({
    showBanner: true,
    currTheme: local.getItem('theme') || 'dark', // light or dark
  })

  const setState = (key, val) => siteState.value[key] = val

  const setCurrTheme = function (v) {
    let theme = v === 'light' ? 'light' : 'dark'
    setState('currTheme', theme)
    local.setItem('theme', theme)
  }

  return {
    siteState,
    setShowBanner: (v) => setState('showBanner', v),
    setCurrTheme,
    getCurrTheme: () => siteState.value.currTheme,
  }
})