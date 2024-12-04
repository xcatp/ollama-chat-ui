import { ref } from 'vue'
import { defineStore } from 'pinia'
import { local } from '@/utils/storage'

export const useSiteStore = defineStore('site', () => {
  const siteState = ref({
    activeAgentId: local.getItem('activeAgentId') || '',
    ChatBarW: local.getItem('chatBarW') || 220,
  })

  const setState = (key, val) => siteState.value[key] = val

  const setChatBarW = function (w) {
    setState('ChatBarW', w)
    local.setItem('chatBarW', w)
  }

  const setActiveAgentId = function (id) {
    setState('activeAgentId', id)
    local.setItem('activeAgentId', id)
  }

  const _reset = () => {
    siteState.value.activeAgentId = ''
    local.delItem('activeAgentId')
    siteState.value.ChatBarW = 220
    local.delItem('chatBarW')
  }

  return {
    siteState,
    setChatBarW,
    setActiveAgentId,
    _reset
  }
})