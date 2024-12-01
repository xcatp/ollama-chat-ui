import { ref, onMounted } from "vue"
import { listModels } from "@/api/ollama"

export default function useModelInfo() {

  const models = ref([])

  onMounted(async () => {
    listModels().then(res => {
      models.value = res.models
    })
  })

  return {
    models
  }
}