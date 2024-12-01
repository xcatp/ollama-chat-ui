import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';
import { local } from '@/utils/storage'
import { useChatStore } from './chatStore'

export const useAgentStore = defineStore('agent', () => {
  const agentState = ref({
    agents: []
  })

  _init()

  function addAgent({ agentName, model, agentPersona, humanPersona }) {
    const id = uuidv4()
    const newAgent = {
      id,
      agentName,
      model,
      agentPersona,
      humanPersona,
      chatCount: 0,
      lastRun: '',
      lifespan: new Date()
    }
    agentState.value.agents.push(newAgent)
    _recordState()
  }

  function removeAgent(id) {
    const chatStore = useChatStore()
    chatStore.removeChat(id)
    agentState.value.agents = agentState.value.agents.filter(agent => agent.id !== id)
    
    _recordState()
  }

  function updateAgent({ id, agentName, model, agentPersona, humanPersona }) {
    const agent = agentState.value.agents.find(agent => agent.id === id)
    if (agent) {
      agent.agentName = agentName
      agent.model = model
      agent.agentPersona = agentPersona
      agent.humanPersona = humanPersona
      _recordState()
    }
  }

  function _init() {
    agentState.value.agents = JSON.parse(local.getItem('agents'))
  }

  function _recordState() {
    local.setItem('agents', JSON.stringify(agentState.value.agents))
  }

  return {
    agentState,
    addAgent,
    removeAgent
  }
})