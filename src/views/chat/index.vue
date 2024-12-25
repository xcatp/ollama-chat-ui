<!--  -->
<script setup>
import SubmitBtn from '@/components/button/SubmitBtn.vue'
import ResizeBar from '@/components/ResizeBar.vue'
import HoverMenu from '@/components/HoverMenu.vue'
import PromptInfo from '../template/components/PromptInfo.vue'
import { useChatStore, useSiteStore, useAgentStore } from '@/stores'
import { nextTick, onMounted, ref } from 'vue'
import { useScroll } from '@/hooks/useScroll'
import { local } from '@/utils/storage'
import { chatWithHistory, abort } from '@/api/ollama'
import { render } from '@/utils/markdown'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import useEvent from './hooks/useEvent'
import useActiveAgentInfo from './composable/useActiveAgentInfo'
import useChatHistory from './composable/useChatHistory'
import getChatHistory from './helper'
import { useTemplateInfo, updateTemplateInfo } from './composable/useTemplateInfo'

const input = defineModel()
const chatStore = useChatStore()
const agentStore = useAgentStore()
const siteStore = useSiteStore()
const leftPanel = ref(null)
const sending = ref(false)
const agentInfo = useActiveAgentInfo()
const chatHistory = useChatHistory(agentInfo.value?.id)
const { prompt } = useTemplateInfo(agentInfo.value?.agentPersona)
const { scrollRef, scrollToBottom } = useScroll()
const detailWindowVisible = ref(null)
const importInput = ref(null)
const autoScrollSwitch = ref(siteStore.siteState.autoScroll)

onMounted(async () => {
  if (agentInfo.value) {
    await nextTick()
    leftPanel.value.style.width = siteStore.siteState.chatBarW
    scrollToBottom()
    useEvent()
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
    timestamp: new Date().toISOString()
  }
  chatHistory.value.push(botChat) // Will not save immediately
}

async function SubmitChat() {
  if (sending.value) return
  const userMsg = input.value
  if (!userMsg || userMsg.trim() === '') return
  sending.value = true, input.value = ''

  const history = getChatHistory(chatHistory.value, chatHistory.value.length)
  addUserChat(userMsg)
  addEmptyBotChat()
  scrollToBottom(true)
  _chat(userMsg, -1, history)
}

function reGenerate(idx) {
  if (sending.value || idx < 1)
    return
  sending.value = true
  const userChat = chatHistory.value[idx - 1]
  if (userChat.inversion) {
    ElMessage({
      message: 'Chat has been deleted.',
      type: 'warning',
    })
    sending.value = false
    return
  }
  const history = getChatHistory(chatHistory.value, idx)
  _chat(userChat.text, idx, history)
}

function delChat(idx) {
  if (sending.value || idx < 0)
    return
  chatStore.removeChatItem(agentInfo.value.id, idx)
  ElMessage({
    message: 'Chat has been deleted.',
    type: 'success',
  })
}

function botThinking(idx) {
  const thinkingText = ['⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏', '⠋', '⠙', '⠹']
  let i = 0
  const loadingInterval = setInterval(() => {
    chatHistory.value.at(idx).text = thinkingText[i]
    i = (i + 1) % thinkingText.length
  }, 100);
  return () => {
    clearInterval(loadingInterval)
    chatHistory.value.at(idx).text = ''
  }
}

function _chat(userMsg, idx, history) {
  const thinkingDone = botThinking(idx)

  chatWithHistory(agentInfo.value.model, userMsg, history, prompt.value.value)
    .then(async stream => {
      thinkingDone()
      for await (const part of stream) {
        chatHistory.value.at(idx).text += part.message.content
        autoScrollSwitch.value && scrollToBottom(true)
      }
      chatStore.updateChat(agentInfo.value.id)
      sending.value = false
      useEvent()
    }).catch(error => {
      const generatedText = chatHistory.value.at(idx).text
      thinkingDone()
      if (error.name === 'AbortError') {
        chatHistory.value.at(idx).text += generatedText + '[Request have been aborted.]'
      } else {
        chatHistory.value.at(idx).text = '[Request failed.]'
      }
      chatStore.updateChat(agentInfo.value.id)
      sending.value = false
    })
}

function handleCopy(text) {
  navigator.clipboard.writeText(text)
  ElMessage({
    message: 'Copied.',
    type: 'success',
  })
}

function modifyPrompt() {
  if (prompt.value.key === '' || prompt.value.value === '') {
    ElMessage({
      message: 'Please fill in the prompt.',
      type: 'warning',
    })
    return
  }
  agentInfo.value.prompt = prompt.value.key
  agentStore.updateAgent(agentInfo.value)
  updateTemplateInfo(prompt.value)
  detailWindowVisible.value = false
}

function clearChatHistory(e) {
  e()
  chatStore.removeChat(agentInfo.value.id)
}

function inputKeyDown(e) {
  if (e.keyCode === 13 && e.shiftKey) {
    e.preventDefault()
    SubmitChat()
  }
}

function exportChatData() {
  const data = {}
  data.chatData = chatHistory.value
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'chatHistory.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function importChatData(e) {
  const target = e.target
  if (!target || !target.files) return
  const file = target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result)
    data.chatData.forEach(item => chatStore.addChat(agentInfo.value.id, item))
  }
  reader.readAsText(file)
  ElMessage({
    message: 'Imported!',
    type: 'success'
  })
}

function switchAutoScroll() {
  autoScrollSwitch.value = !autoScrollSwitch.value
  siteStore.setAutoScroll(autoScrollSwitch.value)
}
</script>

<template>
  <div class="view-container">
    <PromptInfo :condition="detailWindowVisible" :form="prompt" @submit="modifyPrompt"
      @close="detailWindowVisible = false" />
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
          <SubmitBtn class="select-btn">Select</SubmitBtn>
        </RouterLink>
      </div>
    </div>
    <div v-else class="main-panel">
      <div class="left-panel" ref="leftPanel">
        <div class="model-info">
          <div class="info-item">
            <div class="label">MODEL</div>
            <span class="desc">{{ agentInfo.model }}</span>
          </div>
          <div class="info-item">
            <div class="label">LIFESPAN</div>
            <span class="desc">{{ moment(agentInfo.lifespan).format('YYYY-MM-DD') }}</span>
          </div>
          <div class="info-item">
            <div style="display: flex; align-items: center;">
              <span class="label">PROMPT</span>
              <div v-if="agentInfo.agentPersona" @click="detailWindowVisible = true" class="icon icon-pen"></div>
            </div>
            <span class="desc">{{ agentInfo.agentPersona || 'null' }}</span>
          </div>
        </div>
        <div class="left-panel-footer">
          <div class="ops">
            <el-popconfirm width="220" :hide-after="0" :hide-icon="true" title="Clear chat history?">
              <template #reference>
                <div class="icon icon-clear" title="Clear chat history"></div>
              </template>
              <template #actions="{ cancel, confirm }">
                <el-button size="small" @click="cancel">No</el-button>
                <el-button type="danger" size="small" @click="clearChatHistory(confirm)">Yes</el-button>
              </template>
            </el-popconfirm>
            <input ref="importInput" type="file" style="display:none" @change="importChatData">
            <div class="icon icon-export" title="Export chat history" @click="exportChatData"></div>
            <div class="icon icon-import" title="Import chat history" @click="importInput.click()"></div>
            <div class="icon icon-scroll" title="Auto scroll" @click="switchAutoScroll"
              :class="{ 'red': autoScrollSwitch }"></div>
          </div>
        </div>
        <ResizeBar :min="0" @end="(w) => siteStore.setChatBarW(w)"></ResizeBar>
      </div>
      <div class="chat-panel">
        <div ref="scrollRef" class="chat-area">
          <div v-for="(v, i) in chatHistory" :key="i" :class="v.inversion ? 'bot-msg' : 'user-msg'">
            <div class="msg-info">
              <div class="icon" :class="v.inversion ? 'icon-robot' : 'icon-cat'"> </div>
              <div class="timestamp">{{ moment(v.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div class="msg-container">
              <div v-if="v.inversion" class="msg-content" v-html="render(v.text)"></div>
              <div v-else class="msg-content">{{ v.text }}</div>
              <div class="msg-operation">
                <div v-if="v.inversion" title="Refresh" @click="reGenerate(i)" class="icon icon-refresh"></div>
                <HoverMenu>
                  <ul>
                    <li class="dropdown-item" @click="handleCopy(v.text)">Copy</li>
                    <li class="dropdown-item" @click="delChat(i)">Delete</li>
                  </ul>
                </HoverMenu>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <ResizeBar :with-after="false" position="top" :min="60"></ResizeBar>
          <textarea class="edit-input" @keydown="inputKeyDown" v-model="input"
            placeholder="Type your message, Shift + Enter to send, Enter for a new line"></textarea>
          <SubmitBtn :onclick="SubmitChat" class="submit-btn">Send</SubmitBtn>
          <SubmitBtn v-if="sending" class="stop-btn" @click="abort">Stop</SubmitBtn>
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
  overflow-y: auto;
  background-color: var(--chat-panel-bgc);

  .empty-panel {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;

    .select-btn {
      display: block;
    }
  }
}

.left-panel {
  width: 200px;
  padding: 10px 0 10px 10px;
  position: sticky;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--chat-left-panel-bgc);
  z-index: 10;

  .left-panel-footer {

    .ops {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }
  }

  .model-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    width: 100%;

    .info-item {
      margin-bottom: 1em;
    }

    .label {
      font-weight: 400;
      color: var(--text-02);
    }

    .desc {
      font-size: 0.8rem;
      font-weight: 400;
      line-height: 1rem;
      color: #718370;
    }
  }

}

.chat-panel {
  flex: 1;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-secondary);

  .chat-input {
    position: relative;
    padding: 0;
    background-color: #eaefe3;
    box-shadow: -1px -2px 4px rgba(52, 71, 47, 0.188);
    min-height: 60px;
    display: flex;
    font-family: "PT Serif", serif;

    .edit-input {
      width: 100%;
      max-height: 100%;
      background: var(--chat-input-bgc);
      color: var(--title-tc-01);
      outline: none;
      border: none;
      resize: none;
      caret-color: #18a058;
      padding: 5px;
      font-size: 16px;
      line-height: 1.6;
    }

    .submit-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }

    .stop-btn {
      position: absolute;
      right: 50%;
      bottom: 120%;
      transform: translateX(50%);
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
      white-space: break-spaces;
      background-color: var(--chat-usr-msg-bgc) !important;
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
      background-color: var(--chat-bot-msg-bgc);
      box-shadow: 0px 1px 4px rgba(65, 65, 65, 0.339);
      padding: .5em .6em;
      border-radius: 5px;
    }

    .msg-operation {
      margin-top: auto;
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
  margin: 5px;
  mask-image: url('/static/svg/cat1.svg');
}

.icon-robot {
  margin: 5px;
  mask-image: url('/static/svg/robot.svg');
}

.icon-pen {
  mask-image: url('/static/svg/pen.svg');
}

.icon-refresh {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  mask-image: url('/static/svg/refresh.svg');
}

.icon-clear {
  margin: 0;
  mask-image: url('/static/svg/clear.svg');
}

.icon-export {
  margin: 0;
  mask-image: url('/static/svg/export.svg');
}

.icon-import {
  margin: 0;
  mask-image: url('/static/svg/import.svg');
}

.icon-scroll {
  margin: 0;
  mask-image: url('/static/svg/scroll.svg');
}

.red {
  background-color: red !important;
  color: red !important;
}

.icon-pen,
.icon-refresh,
.icon-clear,
.icon-export,
.icon-import,
.icon-scroll {
  &:hover {
    background-color: rgb(57, 58, 57);
  }
}
</style>
