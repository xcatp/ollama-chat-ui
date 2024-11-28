<!--  -->
<script setup>
import { nextTick, ref } from 'vue'
// import render from './render'
import SubmitBtn from './button/SubmitBtn.vue'
import CancelBtn from './button/CancelBtn.vue'

const input = defineModel()
const emit = defineEmits(['onSubmit', 'onCancel'])

defineExpose({ insert, push })

const textarea = ref(null)
const preview = ref(false)
const textareaHeight = ref(100)
const wc = ref(0)

function doSubmit() {
  emit('onSubmit', input.value)
  input.value = '', wc.value = 0
}

function doCancel() {
  emit('onCancel')
  input.value = '', wc.value = 0
}

// 在开头插入
function push(text) {
  const start = textarea.value.selectionStart
  input.value = text + (input.value || '')
  textarea.value.focus()
  nextTick(() => textarea.value.setSelectionRange(start + text.length, start + text.length))
}

function insert(text, backward = 0) {
  const value = input.value || ''
  const start = value.slice(0, textarea.value.selectionStart)
  const end = value.slice(textarea.value.selectionEnd)
  input.value = start + text + end
  const i = start.length + text.length - backward
  textarea.value.focus()
  nextTick(() => textarea.value.setSelectionRange(i, i))
}

function onEditShow() {
  preview.value = false
  nextTick(() => textarea.value.style.height = textareaHeight.value + 'px')
}

function onPreviewShow() {
  textareaHeight.value = textarea.value.style.height.slice(0, -2) // 去除px后缀
  preview.value = true
}

function fitH() {
  textarea.value.style.height = Math.min(_getTextareaActualHeight(textarea.value), 500) + 'px'

  function _getTextareaActualHeight(el) {
    const clone = document.createElement('textarea')
    clone.style.position = 'absolute'
    clone.style.visibility = 'hidden' // 隐藏
    clone.style.width = el.offsetWidth + 'px' // 设置宽度
    clone.style.font = getComputedStyle(el).font // 复制字体样式
    clone.value = el.value // 复制内容

    document.body.appendChild(clone) // 添加到文档中
    const height = clone.scrollHeight // 获取 scrollHeight
    document.body.removeChild(clone) // 移除克隆的 textarea

    return height + 20 // 返回实际高度 
  }
}

function WC() {
  let str = input.value
  if (!str) {
    wc.value = 0
    return
  }
  const plainText = str
    .replace(/[*_`~]+/g, '') // 移除 *、_、` 和 ~
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接 [text](url)
    .replace(/---/g, '') // 移除水平分隔线
    .replace(/\n/g, ' ') // 换行符转为空格
    .replace(/\s{2,}/g, ' ') // 多个空格转成一个空格
    .trim()
  wc.value = plainText.length
}
</script>

<template>
  <div class="box-wrapper">
    <div class="box-header">
      <div class="header-left">
        <span class="tab-edit tab-item" :class="{ 'active-tab': !preview }" @click="onEditShow">Edit</span>
        <span class="tab-preview tab-item" :class="{ 'active-tab': preview }" @click="onPreviewShow">Preview</span>
      </div>
      <div class="header-right" v-if="!preview">
        <div class="icon icon-height" title="调整高度" @click="fitH"></div>
        <div class="icon icon-bold" title="粗体" @click="insert('****', 2)"></div>
        <div class="icon icon-code" title="代码" @click="insert('``', 1)"></div>
        <div class="icon icon-italic" title="斜体" @click="insert('**', 1)"></div>
        <div class="icon icon-strikethrough" title="删除线" @click="insert('~~~~', 2)"></div>
        <div class="icon icon-divider" title="分割线" @click="insert('\n---\n', 0)"></div>
        <div class="icon icon-underline" title="下划线" @click="insert('____', 2)"></div>
        <div class="icon icon-link" title="链接" @click="insert('[]()', 3)"></div>
      </div>
    </div>
    <div v-if="preview" class="preview-panel" v-html="render(input)"> </div>
    <div v-else class="edit-panel">
      <textarea ref="textarea" @keyup="WC" class="edit-input" v-model="input" placeholder=""></textarea>
    </div>
    <div class="box-op">
      <div class="op-left">
        <SubmitBtn class="op-submit" @click="doSubmit">Submit</SubmitBtn>
        <CancelBtn class="op-cancel" @click="doCancel">Cancel</CancelBtn>
      </div>
      <div class="op-right">
        <span class="op-word-count">{{ wc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box-wrapper {
  box-shadow: 0px 4px 7px rgba(58, 60, 55, 0.393);
  border: 1px solid var(--border-primary);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--comment-box-bgc);
  border-bottom: 1px solid var(--comment-border-primary);

  .header-left {
    display: flex;
  }

  .header-right {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-right: 5px;
  }
}

.tab-item {
  cursor: pointer;
  font-size: 14px;
  line-height: 28px;
  padding: 3px 10px;

  &:hover {
    color: var(--text-01);
  }
}

.preview-panel {
  padding: 5px;
  background: var(--comment-box-linear);

  border-bottom: 1px solid var(--comment-border-primary);
  min-height: 100px;
  height: 100%;
}

.active-tab {
  color: var(--text-02);
  border-bottom: 2px solid var(--text-02);
}

.edit-input {
  width: 100%;
  background: var(--comment-box-input-bgc);
  min-height: 100px;
  color: inherit;
  height: auto;
  resize: vertical;
  outline: none;
  border: none;
  padding: 5px;
  font-size: 10px;
  line-height: 1.6;
}

.box-op {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--comment-box-bgc);

  .op-cancel,
  .op-submit {
    cursor: pointer;
    font-weight: 300;
    padding: 5px 15px;
    margin-right: 5px;
    font-size: 12px;
    border-width: 0;
    border-radius: 4px;
    outline: none;
  }

  .op-word-count {
    color: var(--text-02);
  }
}

.icon {
  mask-repeat: no-repeat;
  mask-position: center;
  vertical-align: middle;
  display: inline-block;
  background-color: var(--icon-bgc);
  margin: 1px;

  &:hover {
    background-color: red;
  }
}

.icon-bold {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/bold.svg');
}

.icon-italic {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/italic.svg');
}

.icon-code {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/code.svg');
}

.icon-strikethrough {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/strikethrough.svg');
}

.icon-divider {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/divider.svg');
}

.icon-underline {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/underline.svg');
}

.icon-link {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/link.svg');
}

.icon-height {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/height.svg');
}
</style>
