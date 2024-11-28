<!--  -->
<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  maxWidth: {
    type: Number,
    default: 250
  },
  minWidth: {
    type: Number,
    default: 200
  }
})

const resizeBtn = ref(null)
onMounted(() => nextTick(registerResizeEvent()))

function registerResizeEvent() {
  let isResizing = false

  resizeBtn.value.addEventListener('mousedown', (e) => {
    isResizing = true
    e.preventDefault()
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

  })

  function handleMouseMove(e) {
    if (isResizing) {
      const width = e.clientX - resizeBtn.value.getBoundingClientRect().left
      if (width < props.minWidth || width > props.maxWidth) return
      resizeBtn.value.parentNode.style.width = width + 5 + 'px'
    }
  }

  function handleMouseUp() {
    isResizing = false
    removeEvent()
  }

  function removeEvent() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}
</script>

<template>
  <div ref="resizeBtn" class="horizon-resizable">
    <div class="icon icon-resize-btn"></div>
  </div>
</template>

<style scoped lang="scss">
.horizon-resizable {
  width: 0;

  .icon-resize-btn {
    width: 10px;
    height: 20px;
    position: absolute;
    margin: 0;
    right: 0;
    top: 50%;
    background-color: #75972b;
    mask-image: url('/static/svg/resizeBtn.svg');
    z-index: 1;
    cursor: ew-resize;

    &:hover {
      background-color: red !important;
    }
  }

  &::after {
    cursor: ew-resize;
    content: '';
    height: 100%;
    width: 10px;
    position: absolute;
    right: 0;
    top: 0px;
  }

}
</style>
