import { ref } from "vue"
import { useAgentStore } from "@/stores"

export default function useAgentInfo(currPage, pageSize) {

  const agentList = ref([])
  const total = ref(0)

  getFromLocal(currPage, pageSize)

  function getFromLocal(p, s) {
    const agentStore = useAgentStore()
    agentList.value = agentStore.agentState.agents.slice((p - 1) * s, p * s)
    total.value = agentStore.agentState.agents.length
  }

  return {
    agentList,
    total,
    getPageData: getFromLocal
  }
}