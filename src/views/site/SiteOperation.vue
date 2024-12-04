<!--  -->
<script setup>
import ResizeBar from '@/components/ResizeBar.vue'
import SettingWindow from './components/SettingWindow.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const settingDialogVisible = ref(false)

onMounted(tryFindActiveShard)
router.afterEach(() => tryFindActiveShard())

const dirs = ref([
  {
    id: 0,
    title: 'Chat',
    classNN: 'icon-chat',
    multi: false,
    path: '/chat'
  }, {
    id: 1,
    title: 'Agents',
    classNN: 'icon-robot',
    multi: false,
    path: '/agent'
  }, {
    id: 2,
    title: 'Templates',
    classNN: 'icon-prompt',
    multi: true,
    children: [
      { id: 1, path: '/templates/prompt', title: 'System prompts' },
    ]
  }, {
    id: 3,
    title: 'Info',
    classNN: 'icon-storage',
    multi: false,
    path: '/info'
  }
])

const currentGroup = ref('')
const currentItem = ref('')

function toggleTable(e) {
  const span = e.target.parentNode
  const div = span.children[2] // 第三个div
  div.classList.toggle('flipped')

  if (span.nextElementSibling.classList.contains('show')) {
    span.classList.remove('open')
    span.classList.add('closed')
    span.nextElementSibling.classList.remove('show')
    span.nextElementSibling.classList.add('hide')
  }
  else {
    span.classList.remove('closed')
    span.classList.add('open')
    span.nextElementSibling.classList.add('show')
    span.nextElementSibling.classList.remove('hide')
  }
}

function tryFindActiveShard() {
  const curr = route.path

  for (const v of dirs.value) {
    if (!v.multi) {
      if (curr === v.path) {
        currentGroup.value = v.id
        return
      }
    } else {
      const e = v.children.find(c => c.path === curr)
      if (e) {
        currentItem.value = v.id + '-' + e.id
        currentGroup.value = v.id
        return
      }
    }
  }
  currentGroup.value = '', currentItem.value = ''
}

</script>

<template>
  <div class="view-container invisible-scrollbar">
    <SettingWindow :condition="settingDialogVisible" @close="settingDialogVisible = false" />
    <RouterLink to="/" class="emboss">
      <div class="emboss-title">Ollama-Chat</div>
      <div class="emboss-subtitle">ui</div>
    </RouterLink>
    <ul class="menu-wrapper" v-if="dirs.length">
      <li class="menu-group" v-for="v in dirs" :key="v.id">
        <div v-if="v.multi" class="menu-item" @click="toggleTable">
          <div class="icon" :class="v.classNN"></div>
          <div class="menu-item-title" :class="{ 'menu-item-active': currentGroup === v.id }">
            {{ v.title }}
          </div>
          <div class="menu-item-arrow"></div>
        </div>
        <RouterLink v-else class="menu-item" style="cursor: pointer;"
          :class="{ 'single-menu-item-active': currentGroup === v.id }" :to="{ path: v.path }"
          @click="currentItem = '', currentGroup = v.id">
          <div class="icon" :class="v.classNN"></div>
          <div class="menu-item-title">
            {{ v.title }}
          </div>
        </RouterLink>
        <div v-if="v.multi" class="menu-item-content hide" :style="{ 'max-height': v.children.length * 40 + 'px' }">
          <div v-for="sv in v.children" :key="v.id + '-' + sv.id" class="sidebar-link">
            <RouterLink :to="{ path: sv.path }" class="menu-item-link"
              :class="{ 'link-active': v.id + '-' + sv.id === currentItem }"
              @click="currentItem = v.id + '-' + sv.id, currentGroup = v.id">
              {{ sv.title }}
            </RouterLink>
          </div>
        </div>
      </li>
    </ul>
    <div class="sidebar-empty"></div>
    <div class="sidebar-bottom-fixed">
      <div class="bottom-left">
        <div class="icon-container" @click="settingDialogVisible = true">
          <div class="icon icon-setting"></div>
        </div>
      </div>
      <div class="bottom-right">
      </div>
    </div>
    <ResizeBar></ResizeBar>

  </div>
</template>

<style scoped lang="scss">
.view-container {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  width: 220px;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--site-operation-bgc);
  box-shadow: 0px 2px 6px rgba(60, 83, 54, 0.67);
  border-right: 1px solid var(--border-secondary);
}

.emboss {
  z-index: 110;
  min-height: 70px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background-image: var(--site-home-banner);


  .emboss-title {
    font-weight: 500;
    color: var(--site-home-title);
    font-family: "Oswald", "Bookman Old Style", serif;
    font-size: 2rem;
    letter-spacing: 0.12rem;
    text-decoration: underline 2px;
  }

  .emboss-subtitle {
    font-weight: 100;
    font-size: 1em;
    color: var(--site-home-subtitle);
  }

  &:hover {
    background-color: rgb(190, 235, 174)
  }
}

.icon-robot {
  mask-image: url('/static/svg/robot.svg');
}

.icon-chat {
  mask-image: url('/static/svg/chat.svg');
}

.icon-prompt {
  mask-image: url('/static/svg/prompt.svg');
}

.icon-setting {
  mask-image: url('/static/svg/setting.svg');
}

.icon-storage {
  mask-image: url('/static/svg/storage.svg');
}

.menu-wrapper {
  border-bottom: 1px solid var(--border-secondary);

  .show {
    display: block;
  }

  .hide {
    max-height: 0 !important;
  }

  .open {
    background: var(--linear-01) !important;
    border-bottom: 1px solid var(--border-secondary);

  }
}

.menu-group {
  overflow: hidden;
}

.menu-item {
  height: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-secondary);
  cursor: default;

  .menu-item-title {
    flex: 1;
    line-height: 3em;
    vertical-align: middle;
    padding: .6rem 5px;
    padding-left: 5px;
    font-family: "Oswald", "Bookman Old Style";

    &:hover {
      color: var(--text-03) !important;
    }
  }


  .menu-item-arrow {
    position: relative;
    right: 10px;
    transition: all 0.3s ease-out;

    &::before,
    &::after {
      top: 50%;
      content: '';
      position: absolute;
      background: var(--text-02);
      width: 8px;
      height: 1.5px;
    }

    &::after {
      right: 1px;
      transform: rotate(45deg);

    }

    &::before {
      right: 6px;
      transform: rotate(-45deg);
    }
  }
}

.flipped {
  transform: rotateX(180deg);
}

.menu-item-content {
  transition: max-height .1s ease-out;
}

.menu-empty {
  margin-left: 26px;
  color: var(--side-item-tc);
  height: 100%;
  padding: .75rem 2px .75rem .5rem;
  margin-left: 23px;
  font-family: "Oswald", "Bookman Old Style";
  border-left: 1px solid rgb(12, 114, 12);
  border-bottom: 1px solid #7b7ea4;
  min-height: 3rem;
}

.sidebar-empty {
  height: 50vh;
  min-height: 20vh
}

.menu-item-link {
  display: block;
  line-height: 40px;
  margin-left: 23px;
  border-left: 1px solid rgb(12, 114, 12);
  color: var(--side-item-tc);

  padding: 0 2px 0 .5rem;
  font-family: "Oswald", "Bookman Old Style";

  border-bottom: 1px solid var(--border-secondary);
  cursor: pointer;
  min-height: 3rem;

  &:hover {
    border-left: 1px solid rgb(255, 128, 0);
  }
}

.menu-item-active {
  font-weight: bold;
  text-decoration: underline 2px var(--text-02);
  color: var(--text-02)
}

.single-menu-item-active {
  font-weight: bold;
  text-decoration: underline 2px var(--text-02);
  color: var(--text-02);
  background: var(--linear-01) !important;
}

.link-active {
  font-weight: bold;
  color: #033b00;
  background: var(--linear-02) !important;
}

.sidebar-bottom-fixed {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .bottom-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 20px;
    margin-left: 10px;
    margin-bottom: 10px;

    .icon-container {
      display: flex;
      align-items: center;
      justify-self: center;
      border-radius: 10%;
      transition: background-color 0.15s linear;

      &:hover {
        background-color: rgb(182, 210, 178);
      }

      &>div {
        margin: 5px;
      }
    }
  }

  .bottom-right {
    flex: 1;
  }
}
</style>
