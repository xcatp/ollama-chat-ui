<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSiteStore } from './stores'

onMounted(() => {
  document.addEventListener('click', flowerOnClick)
  document.documentElement.dataset.theme = useSiteStore().siteState.theme
  onUnmounted(() => document.removeEventListener('click', flowerOnClick))

  function flowerOnClick(event) {
    let v = document.createElement('div')
    const maxH = document.body.scrollHeight, h = maxH / 10 + 10
    const maxW = document.body.scrollWidth, w = 20
    v.setAttribute('class', 'virtual-container')
    v.style.left = event.pageX - 8 + 'px'
    v.style.top = event.pageY - 8 + 'px'
    v.style.width = event.pageX + 20 + 8 > maxW ? maxW - event.pageX + 8 + 'px' : w + 'px'
    v.style.height = event.pageY + h + 8 > maxH ? maxH - event.pageY + 8 + 'px' : h + 'px'
    let e = document.createElement('div')
    e.setAttribute('class', 'click-star')
    v.appendChild(e)
    document.body.appendChild(v)
    setTimeout(() => document.body.removeChild(v), 1000)
  }
})
</script>

<template>
  <div class="page-wrapper">
    <RouterView />
  </div>
</template>

<style>
.virtual-container {
  position: absolute;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
}

.click-star {
  position: absolute;
  font-size: large;
  color: #efd7d9;
  animation: -snowflake-animate 1s linear forwards;
  z-index: 999;
}

.click-star::before {
  content: '\1F338';
}

@keyframes -snowflake-animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: .6;
  }

  60% {
    opacity: 1;
  }

  100% {
    transform: translateY(10vh) rotate(90deg) rotateY(30deg);
    opacity: 0;
  }
}
</style>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
