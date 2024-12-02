import { ref } from "vue"
import { useTemplateStore } from '@/stores'

export default function useTemplateInfo(key) {

  const prompt = ref(null)

  getFromLocal()

  function getFromLocal() {
    const templateStore = useTemplateStore()
    const find = templateStore.templateState.prompts.find(v => v.key === key)
    prompt.value = find ? find : { key: '', value: '' }
  }

  return {
    prompt,
  }
}