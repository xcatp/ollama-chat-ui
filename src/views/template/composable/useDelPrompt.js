import { useTemplateStore } from '@/stores'

export default function useDelPrompt(key) {

  delLocal()

  function delLocal() {
    const templateStore = useTemplateStore()
    templateStore.removePrompt(key)
  }

}