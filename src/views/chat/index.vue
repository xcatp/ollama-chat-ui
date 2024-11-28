<!--  -->
<script setup>
import SubmitBtn from '@/components/button/SubmitBtn.vue';
import ResizeBarH from '@/components/ResizeBarH.vue';

import ollama from '@/api/ollama'

const input = defineModel()

async function SubmitChat() {
  const res = await ollama.chat({
    model: 'llama3.2',
    messages: [{
      role: 'user',
      content: input.value
    }],
    stream: true
  })

  for await (const part of res) {
    console.log(part.message.content)
  }
}
</script>

<template>
  <div class="view-container">
    <div class="header-panel">
      Chat Llama3.2
    </div>
    <div class="main-panel">
      <div class="left-panel ">
        <div class="model-info">
          <div class="model-name">Llama3.2</div>
          <div class="model-desc">A large language model trained by Meta AI</div>
        </div>
        <ResizeBarH :min-width="0"></ResizeBarH>
      </div>
      <div class="chat-panel">
        <div class="chat-area ">
          <div class="user-msg">
            <div class="msg-info">
              <div class="icon-cat icon"> </div>
              <div class="timestamp">Nov 25 24, 9:32 PM</div>
            </div>
            <div class="msg-content">hello</div>
          </div>
          <div class="bot-msg">
            <div class="msg-info">
              <div class="icon-robot icon"> </div>
              <div class="timestamp">Nov 25 24, 9:32 PM</div>
            </div>
            <div class="msg-content dh"></div>
          </div>
        </div>
        <div class="chat-input">
          <textarea class="edit-input" v-model="input" placeholder="Type your message"></textarea>
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
  box-shadow: 4px 0px 6px rgba(60, 83, 54, 0.67);
  z-index: 99;
  padding-left: 1em;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
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

  .chat-area {
    flex: 1;
    padding: .5em;
    overflow-y: auto;

    .user-msg,
    .bot-msg {
      width: 100%;
      margin-bottom: 1em;
    }

    .user-msg {
      text-align: right;

      .msg-info {
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

    .msg-content {
      background-color: #ffffff;
      padding: .5em;
      border-radius: 5px;
      margin: 0 25px;
      display: inline-block;
    }
  }

  .chat-input {
    padding: 0;
    background-color: #f1f7eb;
    box-shadow: 1px -2px 4px rgba(52, 71, 47, 0.188);

    .edit-input {
      width: 100%;
      background: #eaede9;
      min-height: 100px;
      color: inherit;
      outline: none;
      border: none;
      resize: none;
      padding: 5px;
      font-size: 10px;
      line-height: 1.6;
    }

    .submit-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
      height: 25px;
      padding: 2px 11px;
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
