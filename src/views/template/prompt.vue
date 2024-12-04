<!--  -->
<script setup>
import { ref } from 'vue'
import SubmitBtn from '@/components/button/SubmitBtn.vue'
import DataTable from '@/components/DataTable.vue'
import PromptInfo from './components/PromptInfo.vue'
import usePromptInfo from './composable/usePromptInfo'
import promptService from './composable/usePromptService'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const pageSize = 10
const currPage = ref(1)
const isEdit = ref(false)
const popWindowVisible = ref(false)
const { promptList, total, getPageData } = usePromptInfo(currPage.value, pageSize)
const form = ref({
  id: '',
  key: '',
  value: ''
})

function handleEdit(id, key, value) {
  form.value = {
    id, key, value
  }
  popWindowVisible.value = true
  isEdit.value = true
}

function handleAdd() {
  Object.keys(form.value).forEach(key => form.value[key] = '')
  popWindowVisible.value = true
  isEdit.value = false
}

function handleDel(id) {
  promptService.useDelPrompt(id)
  retrieveNextPage(currPage.value)
}

async function submit() {
  if (!form.value.key || !form.value.value) {
    ElMessage({
      message: 'Please fill in the form',
      type: 'error'
    })
    return
  }
  if (isEdit.value) {
    await promptService.useUpdatePrompt(form.value)
    isEdit.value = false
  } else {
    await promptService.useCreatePrompt(form.value)
  }
  Object.keys(form.value).forEach(key => form.value[key] = '')
  popWindowVisible.value = false
  retrieveNextPage(currPage.value)
}

function retrieveNextPage(v) {
  loading.value = true
  currPage.value = v
  getPageData(v, pageSize)
  loading.value = false
}
</script>

<template>
  <div class="view-container">
    <PromptInfo :condition="popWindowVisible" :form="form" @submit="submit" @close="popWindowVisible = false" />
    <div class="header-panel">
      <div class="title">System Prompts</div>
      <SubmitBtn @click="handleAdd">New</SubmitBtn>
    </div>
    <div class="main-panel">
      <DataTable :loading="loading">
        <template #header>
          <th style="width: 5em;">#</th>
          <th>Name</th>
          <th>Value</th>
          <th style="width: 8em;"></th>
        </template>
        <template #body>
          <tr v-for="(v, i) in promptList" :key="v.id">
            <td class="id-col">{{ i + 1 + (currPage - 1) * pageSize }}</td>
            <td>{{ v.key }}</td>
            <td>
              <el-popover :width="300" popper-style="background: #f4f7f1;padding: 20px;">
                <template #reference>
                  {{ v.value.substring(0, 30) }}
                </template>
                <template #default>
                  {{ v.value }}
                </template>
              </el-popover>
            </td>
            <td class="op-col">
              <div class="op-container">
                <div class="icon icon-edit" @click="handleEdit(v.id, v.key, v.value)"></div>
                <el-popconfirm width="220" title="Are you sure to delete this?">
                  <template #reference>
                    <div class="icon icon-delete"></div>
                  </template>
                  <template #actions="{ cancel }">
                    <el-button size="small" @click="cancel">No</el-button>
                    <el-button type="danger" size="small" @click="handleDel(v.id)">
                      Yes
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </td>
          </tr>
        </template>
      </DataTable>
      <div class="pagination-container">
        <div class="total-count">
          Totals: {{ total }}
        </div>
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
          :current-page="currPage" @current-change="retrieveNextPage" />
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
  box-shadow: 0px 0px 6px rgba(60, 83, 54, 0.67);
  padding: 0 1em;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;

  .title {
    color: var(--text-02)
  }
}

.pop-window-body {
  flex: 1;
  margin: 2em 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .label {
    font-size: 1.2rem;

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

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 5px;
  border: 1px solid var(--border-primary);
  box-shadow: 0px 3px 4px var(--site-home-shadow);
  background-color: var(--view-category-bgc);
}

.data-table {

  th,
  td {
    border: 1px solid var(--border-primary);
  }

  .op-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    align-items: center;

    &>div {
      cursor: pointer;

      &:hover {
        background-color: #ff6200;
      }
    }
  }
}

.icon-edit {
  background-color: var(--color-green);
  mask-image: url('/static/svg/edit.svg');
}

.icon-delete {
  background-color: #ff0000;
  mask-image: url('/static/svg/delete.svg');
}

.pagination-container {
  margin-top: 10px;
  display: flex;
  justify-content: end;
  align-items: center;

  .total-count {
    margin-right: 10px;
  }
}
</style>
