import { useTemplateStore } from '@/stores'

export default function useCreatePrompt({ key, value }) {

  return createLocal()

  function createLocal() {
    const templateStore = useTemplateStore()
    return new Promise((resolve, reject) => {
      templateStore.addPrompt({ key, value }) ? resolve() : reject()
    })
  }

}