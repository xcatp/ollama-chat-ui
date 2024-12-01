import { useAgentStore } from "@/stores"

export default function useCreateAgent({ name, model, prompt, persona }) {

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