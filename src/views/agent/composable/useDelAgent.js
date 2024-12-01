import { useAgentStore } from "@/stores"

export default function useDelAgent(agentId) {

  delLocal()
  
  function delLocal() {
    const agentStore = useAgentStore()
    agentStore.removeAgent(agentId)
  }

}