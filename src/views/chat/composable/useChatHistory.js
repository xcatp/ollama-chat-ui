import { ref, onMounted } from "vue"
import { local } from "@/utils/storage"
import { useAgentStore } from "@/stores"

export default function useActiveAgentIfno(id) {

  const agentInfo = ref([])
  const agentStore = useAgentStore()

  onMounted(() => getFromLocal())

  function getFromLocal() {
    if(agentStore.agentState.agents.length > 0) {
      agentInfo.value = agentStore.agentState.agents.find(agent => agent.id === id)
    }
  }

  return {
    agentInfo
  }
}