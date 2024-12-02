import { useTemplateStore } from '@/stores'

export default function useUpdatePrompt({ key, value }) {

  return updateLocal()

  function updateLocal() {
    const templateStore = useTemplateStore()
    return new Promise((resolve, reject) => {
      templateStore.updatePrompt(key, value) ? resolve() : reject()
    })
  }

}