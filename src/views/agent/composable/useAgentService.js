import { useAgentStore } from "@/stores"

export function useCreateAgent({ name, model, prompt, persona }) {

  createAgentLocal()

  function createAgentLocal() {
    const agentStore = useAgentStore()

    agentStore.addAgent({
      model,
      agentName: name,
      agentPersona: prompt,
      humanPersona: persona
    })
  }

}
export function useDelAgent(agentId) {

  delLocal()

  function delLocal() {
    const agentStore = useAgentStore()
    agentStore.removeAgent(agentId)
  }
}

export default {
  useCreateAgent,
  useDelAgent
}