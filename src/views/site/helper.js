import { useSiteStore, useAgentStore, useChatStore, useTemplateStore } from "@/stores"
import { toRaw } from "vue"
import { ElMessage } from 'element-plus'
import { storeToRefs } from "pinia"
import { local } from "@/utils/storage"

export function handleExportData() {
  const data = {}
  data.siteData = toRaw(useSiteStore().siteState)
  data.agentData = toRaw(useAgentStore().agentState)
  data.chatData = toRaw(useChatStore().chatState)
  data.templateData = toRaw(useTemplateStore().templateState)
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'chat.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function handleImportData(e) {
  handleDeleteData(() => { })
  const target = e.target
  if (!target || !target.files) return
  const file = target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result)
    const siteStore = useSiteStore()
    siteStore.setActiveAgentId(data.siteData.activeAgentId)
    siteStore.setChatBarW(data.siteData.ChatBarW)
    siteStore.setTheme(data.siteData.theme)
    //
    local.setItem('agents', JSON.stringify(data.agentData.agents))
    const agentStore = useAgentStore()
    const agents = storeToRefs(agentStore)
    agents.agentState.value.agents = data.agentData.agents
    //
    const chatStore = useChatStore()
    for (const key in data.chatData.chatHistory) {
      data.chatData.chatHistory[key].forEach(item => chatStore.addChat(key, item))
    }
    //
    local.setItem('prompts', JSON.stringify(data.templateData.prompts))
    const templateStore = useTemplateStore()
    const prompts = storeToRefs(templateStore)
    prompts.templateState.value.prompts = data.templateData.prompts
  }
  reader.readAsText(file)
  ElMessage({
    message: 'Imported!',
    type: 'success'
  })
}

export function handleDeleteData(_) {
  _()
  useSiteStore()._reset()
  useAgentStore()._reset()
  useChatStore()._reset()
  useTemplateStore()._reset()
  ElMessage({
    message: 'All data has been deleted',
    type: 'success'
  })
}