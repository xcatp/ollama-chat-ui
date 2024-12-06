<!--  -->
<script setup>
import { ref, onMounted, nextTick } from 'vue'

const emits = defineEmits(['end'])
const props = defineProps({
  max: {
    type: Number,
    default: 250
  },
  min: {
    type: Number,
    default: 200
  },
  position: {
    type: String,
    default: 'right'
  },
  withAfter: {
    type: Boolean,
    default: true
  }
})

const resizeBtn = ref(null)
onMounted(() => nextTick(registerResizeEvent()))

function registerResizeEvent() {
  let isResizing = false, finalX

  resizeBtn.value.addEventListener('mousedown', (e) => {
    isResizing = true
    e.preventDefault()
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  })

  let x
  function handleMouseMove(e) {
    if (!isResizing) return
    switch (props.position) {
      case 'right': x = e.clientX - resizeBtn.value.parentNode.getBoundingClientRect().left
        break
      case 'left': x = resizeBtn.value.parentNode.getBoundingClientRect().right - e.clientX
        break
      case 'top': x = resizeBtn.value.parentNode.getBoundingClientRect().bottom - e.clientY
        break
      case 'bottom': x = e.clientY - resizeBtn.value.parentNode.getBoundingClientRect().top
        break
    }
    if (x < props.min || x > props.max) return
    if (props.position === 'left' || props.position === 'right')
      finalX = resizeBtn.value.parentNode.style.width = x + 5 + 'px'
    else
      finalX = resizeBtn.value.parentNode.style.height = x + 'px'
  }

  function handleMouseUp() {
    isResizing = false
    emits('end', finalX)
    removeEvent()
  }

  function removeEvent() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}
</script>

<template>
  <div ref="resizeBtn" class="horizon-resizable" :class="withAfter && `with-after-${position}`">
    <div class="icon icon-resize-btn" :class="`icon-resize-${position}`"></div>
  </div>
</template>

<style scoped lang="scss">
.horizon-resizable {
  width: 0;

  .icon-resize-btn {
    z-index: 1;
    position: absolute;
    margin: 0;

    &:hover {
      background-color: red !important;
    }
  }
}

.icon-resize-left {
  cursor: ew-resize;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 20px;
  mask-image: url('/static/svg/resizeBtnH.svg');
}

.icon-resize-right {
  cursor: ew-resize;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 20px;
  mask-image: url('/static/svg/resizeBtnH.svg');
}

.icon-resize-top {
  cursor: ns-resize;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  mask-image: url('/static/svg/resizeBtnV.svg');
}

.icon-resize-bottom {
  cursor: ns-resize;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  mask-image: url('/static/svg/resizeBtnV.svg');
}

.with-after-left {
  &::after {
    content: '';
    cursor: ew-resize;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 10px;
  }
}

.with-after-right {
  &::after {
    content: '';
    cursor: ew-resize;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 10px;
  }
}

.with-after-bottom {
  &::after {
    content: '';
    cursor: ns-resize;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 10px;
  }
}

.with-after-top {
  &::after {
    content: '';
    cursor: ns-resize;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 10px;
  }
}
</style>
