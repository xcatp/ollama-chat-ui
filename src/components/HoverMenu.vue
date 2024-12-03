<!--  -->
<script setup>
import { nextTick, ref } from 'vue'

const menu = ref(null)
const show = ref(false)

const ShowMenu = () => {
  show.value = true
  
  nextTick(() => {
    const parentRect = menu.value.parentElement.getBoundingClientRect()
    const menuRect = menu.value.getBoundingClientRect()

    if (parentRect.left > window.innerWidth - parentRect.right) {
      menu.value.style.left = -menuRect.width + 'px'
    } else {
      menu.value.style.left = 20 + 'px'
    }
    
    if (menuRect.height / 2 < parentRect.top) {
      menu.value.style.top = -menuRect.height / 2 + parentRect.height / 2 + 'px'
    }
  })
}

const HideMenu = () => {
  show.value = false
}
</script>

<template>
  <div class="menu-wrapper">
    <div class="trigger-el" @click="ShowMenu" @mouseleave="HideMenu">
      <div title="More" class="icon icon-more"></div>
      <Transition name="ani">
        <div ref="menu" class="dropdown-container" @click.stop="HideMenu" v-show="show">
          <slot></slot>
        </div>
      </Transition>
      </div>
  </div>
</template>

<style scoped lang="scss">
.menu-wrapper {

  .trigger-el {
    cursor: pointer;
    position: relative;
    margin-top: auto;
    display: flex;
  }

  .dropdown-container {
    position: absolute;
    top: 0px;
    z-index: 100;
    background-color: #dcf2e4;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    transition: opacity .15s ease-out;
  }
}


.icon-more {
  width: 20px;
  height: 10px;
  margin: 0;
  background-color: #748059;
  mask-image: url('/static/svg/more.svg');

  &:hover {
    background-color: rgb(0, 53, 7);
  }
}

.ani-enter-active,
.ani-leave-active {
  transition: opacity .15s ease-out;
}

.ani-enter-from,
.ani-leave-to {
  opacity: 0;
}
</style>
