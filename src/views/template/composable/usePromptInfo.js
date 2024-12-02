import { ref } from "vue"
import { useTemplateStore } from '@/stores'

export default function usePromptInfo(currPage, pageSize) {

  const promptList = ref([])
  const total = ref(0)

  getFromLocal(currPage, pageSize)

  function getFromLocal(p, s) {
    const templateStore = useTemplateStore()
    promptList.value = templateStore.templateState.prompts.slice((p - 1) * s, p * s)
    total.value = templateStore.templateState.prompts.length
  }

  return {
    promptList,
    total,
    getPageData: getFromLocal
  }
}