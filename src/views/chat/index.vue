<!--  -->
<script setup>
import SubmitBtn from '@/components/button/SubmitBtn.vue'
import ResizeBar from '@/components/ResizeBar.vue'
import HoverMenu from '@/components/HoverMenu.vue'
import { useSiteStore, useAgentStore, useChatStore } from '@/stores'
import { nextTick, onMounted, onUpdated, ref } from 'vue'
import { useScroll } from '@/hooks/useScroll'
import { local } from '@/utils/storage'
import { chat } from '@/api/ollama'
import { render } from '@/utils/markdown'
import useEvent from './hooks/useEvent'

const input = defineModel()
const siteStore = useSiteStore()
const agentStore = useAgentStore()
const chatStore = useChatStore()
const agentInfo = ref(null)
const leftPanel = ref(null)
const chatHistory = ref([])
const { scrollRef, scrollToBottom } = useScroll()

useEvent()

onMounted(() => {
  getModelInfo()
  getChatHistory()
  scrollToBottom()

  function getModelInfo() {
    const agentId = siteStore.siteState.activeAgentId
    if (!agentId) {
      console.log('default');

    } else {
      agentInfo.value = agentStore.agentState.agents.find(item => item.id === agentId)
      nextTick(() => leftPanel.value.style.width = local.getItem('chatBarW'))
    }
  }

  function getChatHistory() {
    if (agentInfo.value) {
      chatHistory.value = chatStore.getHistory(agentInfo.value.id)
    }
  }
})


function addUserChat(msg) {
  const userChat = {
    inversion: false,
    text: msg
  }
  chatStore.addChat(agentInfo.value.id, userChat)
}

function addEmptyBotChat() {
  const botChat = {
    inversion: true,
    text: '',
    timestamp: new Date().toLocaleString()
  }
  chatHistory.value.push(botChat) // Will not save immediately
}

const sending = ref(false)

async function SubmitChat() {
  if (sending.value) return
  const userMsg = input.value
  if (!userMsg || userMsg.trim() === '') return
  sending.value = true, input.value = ''

  addUserChat(userMsg)
  addEmptyBotChat()
  scrollToBottom()

  const res = await chat(agentInfo.value.model, userMsg)
  for await (const part of res) {
    chatHistory.value[chatHistory.value.length - 1].text += part.message.content
  }
  chatStore.updateChat(agentInfo.value.id)
  sending.value = false
}

function inputKeyDown(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    SubmitChat()
  }
}

</script>

<template>
  <div class="view-container">

    <div class="header-panel">

      <div class="title">
        Chat with {{ agentInfo?.agentName || '?' }}
      </div>
      <span class="agent-id">Agent ID: {{ agentInfo?.id }}</span>
    </div>
    <div v-if="!agentInfo" class="main-panel">
      <div class="empty-panel">
        <div class="empty-text">Please select an agent to start chatting.</div>
        <RouterLink to="/agent">
          <button>
            select
          </button>
        </RouterLink>
      </div>
    </div>
    <div v-else class="main-panel">

      <div class="left-panel" ref="leftPanel">
        <div class="model-info">
          <div class="model-name">Llama3.2</div>
          <div class="info-item">model: {{ agentInfo.model }}</div>
        </div>
        <ResizeBar :min="0" @end="(w) => siteStore.setChatBarW(w)"></ResizeBar>
      </div>
      <div class="chat-panel">
        <div ref="scrollRef" class="chat-area">
          <div v-for="(v, i) in chatHistory" :key="i" :class="v.inversion ? 'bot-msg' : 'user-msg'">
            <div class="msg-info">
              <div class="icon" :class="v.inversion ? 'icon-robot' : 'icon-cat'"> </div>
              <div class="timestamp">{{ v.timestamp }}</div>
            </div>
            <div class="msg-container">
              <div class="msg-content" v-html="render(v.text)"></div>
              <HoverMenu>
                <ul>
                  <li class="dropdown-item">Copy</li>
                  <li class="dropdown-item">Delete</li>
                </ul>
              </HoverMenu>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <ResizeBar :with-after="false" position="top" :min="60"></ResizeBar>
          <textarea class="edit-input" @keydown="inputKeyDown" v-model="input"
            placeholder="Type your message"></textarea>
          <SubmitBtn :onclick="SubmitChat" class="submit-btn">Send</SubmitBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-panel {
  position: sticky;
  top: 0px;
  background: #e5ecde;
  box-shadow: 0px 0px 6px rgba(60, 83, 54, 0.67);
  padding: 0 1em;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
    color: var(--text-03);
  }

  .agent-id {
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1rem;
    color: #999;
  }
}

.main-panel {
  flex: 1;
  display: flex;
  background-color: rgb(235, 242, 232);
  overflow-y: auto;
}

.left-panel {
  width: 200px;
  padding: 10px 0 10px 10px;
  position: sticky;
  overflow: auto;

  .model-info {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    width: 100%;

    .model-name {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 2rem;
    }

    .model-description {
      font-size: 0.8rem;
      font-weight: 400;
      line-height: 1rem;
      color: #999;
    }
  }
}

.chat-panel {
  flex: 1;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-secondary);
  background-color: #ebede4;

  .chat-input {
    position: relative;
    padding: 0;
    background-color: #f1f7eb;
    box-shadow: 0px -2px 4px rgba(52, 71, 47, 0.188);
    min-height: 60px;
    display: flex;

    .edit-input {
      width: 100%;
      max-height: 100%;
      background: #e2eadf;
      color: inherit;
      outline: none;
      border: none;
      resize: none;
      caret-color: #18a058;
      padding: 5px;
      line-height: 1.6;
    }

    .submit-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}

.chat-area {
  flex: 1;
  padding: .5em;
  overflow-y: auto;
  padding-bottom: 4em;

  .user-msg,
  .bot-msg {
    width: 100%;
    margin-bottom: 1em;
  }

  .user-msg {

    .msg-info {
      flex-direction: row-reverse;
    }

    .msg-container {
      flex-direction: row-reverse;
    }

    .msg-content {
      background-color: #d1e7dd;
    }
  }

  .msg-info {
    display: flex;
    align-items: center;

    .timestamp {
      font-size: 10px;
      color: #999;
    }
  }

  .msg-container {
    display: flex;
    margin: 0 25px;

    .msg-content {
      background-color: #f6f5ea;
      box-shadow: 0px 2px 4px rgba(52, 71, 47, 0.188);
      padding: .5em .6em;
      border-radius: 5px;
    }

    .dropdown-item {
      transition: background-color .1s ease-out;
      padding: 5px 10px;
      cursor: pointer;

      &:hover {
        background-color: #84c99b;
      }

    }
  }

}

.icon-cat {
  width: 15px;
  height: 15px;
  margin: 5px;
  background-color: #426000;
  mask-image: url('/static/svg/cat1.svg');
}

.icon-robot {
  width: 15px;
  height: 15px;
  margin: 5px;
  background-color: #426000;
  mask-image: url('/static/svg/robot.svg');
}
</style>
