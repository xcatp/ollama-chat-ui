<!--  -->
<script setup>
import PopWindow from '@/components/PopWindow.vue'
defineProps(['form', 'condition'])
defineEmits(['submit', 'close'])
</script>

<template>
  <PopWindow :condition="condition" @close="$emit('close')">
    <div class="pop-window-header">
      <h2 class="title">Prompt template</h2>
    </div>
    <div class="pop-window-body">
      <div class="label">Name <span class="desc">required unique</span></div>
      <input type="text" v-model="form.key" placeholder="Name" />
      <div class="label">Value <span class="desc">required</span></div>
      <textarea v-model="form.value" placeholder="Value"></textarea>
    </div>
    <div class="pop-window-footer">
      <SubmitBtn @click="$emit('submit')">Done</SubmitBtn>
    </div>
  </PopWindow>

</template>

<style scoped lang="scss">
.pop-window-header {

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
    color: var(--text-03);
  }
}

.pop-window-body {
  flex: 1;
  margin: 2em 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .label {
    font-weight: 400;
    color: var(--text-02);

    .desc {
      font-size: 0.8rem;
      color: #979797;
    }
  }

  input,
  textarea {
    padding: 4px 11px;
    font-size: 14px;
    line-height: 1.5;
    color: inherit;
    outline: none;
    border: 1px solid #E2E4E5;
    background-color: #E2E4E5;
    border-radius: 2px;
  }

  textarea {
    min-height: 100px;
    height: auto;
    resize: vertical;
  }

}
</style>
