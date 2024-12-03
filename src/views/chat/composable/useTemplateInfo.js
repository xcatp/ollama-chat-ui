import { ref } from "vue"
import { useTemplateStore } from '@/stores'

export function useTemplateInfo(key) {

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

export function updateTemplateInfo({ key, value }) {
  const templateStore = useTemplateStore()
  if (templateStore.addPrompt({ key, value })) return
  templateStore.updatePrompt(key, value)
}