import { useTemplateStore } from '@/stores'

export function useCreatePrompt({ key, value }) {

  return createLocal()

  function createLocal() {
    const templateStore = useTemplateStore()
    return new Promise((resolve, reject) => {
      templateStore.addPrompt({ key, value }) ? resolve() : reject()
    })
  }
}

export function useDelPrompt(id) {

  delLocal()

  function delLocal() {
    const templateStore = useTemplateStore()
    templateStore.removePrompt(id)
  }
}

export function useUpdatePrompt({ id, key, value }) {

  return updateLocal()

  function updateLocal() {
    const templateStore = useTemplateStore()
    return new Promise((resolve, reject) => {
      templateStore.updatePrompt(id, key, value) ? resolve() : reject()
    })
  }
}

export default {
  useCreatePrompt,
  useDelPrompt,
  useUpdatePrompt
}