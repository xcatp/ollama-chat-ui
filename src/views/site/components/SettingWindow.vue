<!--  -->
<script setup>
import PopWindow from '@/components/PopWindow.vue';
import { handleExportData, handleImportData, handleDeleteData } from '../helper'
import { ref } from 'vue'
import { useSiteStore } from '@/stores'

defineProps(['condition'])
defineEmits(['close', 'submit'])

const importInput = ref(null)

function handleImport() {
  importInput.value.click()
}

function switchTheme(t) {
  useSiteStore().setTheme(t)
  document.documentElement.dataset.theme = t
}
</script>

<template>
  <PopWindow :condition="condition" @close="$emit('close')">
    <div class="pop-window-header">
      <div class="title">Settings</div>
    </div>
    <div class="pop-window-body">
      <div class="label">Data<span class="desc">NOTE: Importing data will delete the local data</span></div>
      <div style="display: flex; gap: 10px;">
        <SubmitBtn class="btn" @click="handleExportData">
          <div class="icon icon-export"></div>
          <span>Export</span>
        </SubmitBtn>
        <input ref="importInput" type="file" style="display:none" @change="handleImportData">
        <SubmitBtn class="btn" @click="handleImport">
          <div class="icon icon-import"></div>
          <span>Import</span>
        </SubmitBtn>
        <el-popconfirm width="220" :hide-after="0" :hide-icon="true" title="Delete agent and chat history?">
          <template #reference>
            <SubmitBtn class="btn">
              <div class="icon icon-delete"></div>
              <span>Delete</span>
            </SubmitBtn>
          </template>
          <template #actions="{ cancel, confirm }">
            <el-button size="small" @click="cancel">No</el-button>
            <el-button type="danger" size="small" @click="handleDeleteData(confirm)">
              Yes
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      <div class="label">Theme</div>
      <div style="display: flex; gap: 10px;">
        <SubmitBtn @click="switchTheme()">Spring</SubmitBtn>
        <SubmitBtn @click="switchTheme('orange')">Orange</SubmitBtn>
        <SubmitBtn @click="switchTheme('snow')">Snow</SubmitBtn>
      </div>
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
  margin: 2em 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .btn {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .label {
    font-weight: 400;
    color: var(--text-02);

    .desc {
      margin-left: 10px;
      font-size: 0.8rem;
      color: #979797;
    }
  }

  .pop-window-footer {
    display: flex;
    justify-content: end;
  }
}

.icon-export {
  margin: 0;
  mask-image: url('/static/svg/export.svg');
}

.icon-import {
  margin: 0;
  mask-image: url('/static/svg/import.svg');
}

.icon-delete {
  margin: 0;
  mask-image: url('/static/svg/delete.svg');
}
</style>
