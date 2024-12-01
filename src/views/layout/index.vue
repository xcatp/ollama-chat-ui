<script setup>
import { ref } from 'vue'
import SiteOperation from '@/views/site/SiteOperation.vue'

const displayFixedMenu = ref(false)
</script>

<template>
  <div class="layout-wrapper">
    <div class="menu-container">
      <SiteOperation />
    </div>
    <div class="layout-container">
      <div class="main-wrapper">
        <RouterView />
      </div>
    </div>
    <div id="menu-btn" @click="displayFixedMenu = true">
      <div class="icon-menu"></div>
    </div>
    <div class="fixed-menu" :class="{ 'display-menu': displayFixedMenu }">
      <SiteOperation />
    </div>
    <div class="fixed-mask" :class="{ 'display-mask': displayFixedMenu }" @click="displayFixedMenu = false"></div>
  </div>
</template>

<style scoped lang="scss">
.layout-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  overflow-y: auto;
}

.menu-container {
  position: sticky;
  top: 0;
  z-index: 90;

  @media screen and (max-width: 882px) {
    display: none;
  }

  @media screen and (min-width: 883px) and (max-width: 992px) {
    width: 25%;
  }
}

.layout-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image: var(--site-body-img), var(--site-body-linear);
}

.main-wrapper {
  height: 0;
  flex: 1;
}

.fixed-menu {
  position: fixed;
  top: 0;
  left: -55%;
  min-width: 200px;
  height: 100%;
  z-index: 999;
  visibility: hidden;
  transition: all .1s linear;
  background-color: var(--card-left-side-bgc);
  box-shadow: 0 2px 4px var(--site-home-shadow);
}

#menu-btn {
  position: fixed;
  bottom: 15px;
  left: -50px;
  transition: all .5s ease-out;

  cursor: pointer;
  --c: #afcdaf;
  background-color: var(--c);
  border: 10px solid var(--c);
  border-radius: 40px;

  &:hover {
    --c: #cbac94;
  }

  & .icon-menu {
    mask-repeat: no-repeat;
    mask-position: center;
    vertical-align: middle;
    display: inline-block;
    width: 20px;
    height: 20px;
    mask-image: url('/static/svg/menu.svg');
    background-color: #467564;
  }

  @media screen and (max-width: 882px) {
    left: 15px;
  }
}

.display-menu {
  visibility: visible;
  left: 0;
}


.fixed-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
  visibility: hidden;
  opacity: 0;
  transition: all .3s ease-out;
  background-color: rgba(0, 0, 0, .5);
}

.display-mask {
  visibility: visible;
  opacity: 1;

}
</style>
