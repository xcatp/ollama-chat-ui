<!--  -->
<script setup>
import { ref } from 'vue'
import PopWindow from '@/components/PopWindow.vue'
import SubmitBtn from '@/components/button/SubmitBtn.vue'
import DataTable from '@/components/DataTable.vue'

const loading = ref(false)
const total = ref(0)
const pageSize = 10
const currPage = ref(1)
const popWindowVisible = ref(false)
const prompts = ref([])
const form = ref({
  name: '',
  value: ''
})
</script>

<template>
  <div class="view-container">
    <PopWindow :condition="popWindowVisible" @close="popWindowVisible = false">
      <div class="pop-window-header">
        <h2 class="title">Prompt template</h2>
      </div>
      <div class="pop-window-body">
        <div class="label">Name</div>
        <input type="text" v-model="form.name" placeholder="Name" />
        <div class="label">Value</div>
        <textarea v-model="form.value" placeholder="Value"></textarea>
      </div>
      <div class="pop-window-footer">
        <SubmitBtn @click="popWindowVisible = false">Done</SubmitBtn>
      </div>
    </PopWindow>

    <div class="header-panel">
      <div class="title">System Prompts</div>
      <SubmitBtn @click="popWindowVisible = true">New</SubmitBtn>
    </div>
    <div class="main-panel">
      <DataTable :loading="loading">
        <template #header>
          <th style="width: 4em;">#</th>
          <th>Name</th>
          <th>Value</th>
          <th style="width: 8em;">Op</th>
        </template>
        <template #body>
          <tr v-for="(v, i) in prompts" :key="v.id">
            <td class="id-col">{{ i + 1 }}</td>
            <td>{{ v.name }}</td>
            <td>
              <el-popover :width="300" popper-style="background: #f4f7f1;padding: 20px;">
                <template #reference>
                  {{ v.value.substring(0, 30) + '...' }}
                </template>
                <template #default>
                  {{ v.value }}
                </template>
              </el-popover>
            </td>
            <td class="op-col">
              <div class="op-container">
                <div class="icon icon-edit" @click="popWindowVisible = true"></div>
                <el-popconfirm width="220" title="Are you sure to delete this?" @cancel="onCancel">
                  <template #reference>
                    <div class="icon icon-delete"></div>
                  </template>
                  <template #actions="{ confirm, cancel }">
                    <el-button size="small" @click="cancel">No!</el-button>
                    <el-button type="danger" size="small" @click="confirm">
                      Yes?
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

  .id-col {
    background-color: var(--background-secondary) !important;
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

// el 样式
.el-checkbox {
  margin-right: 10px;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--btn-bgc) !important; //修改默认的背景色
  border: 1px solid var(--border-secondary) !important;
  color: var(--text-02);
}

:deep(.pagination-container>div>button),
:deep(.pagination-container > div > ul > li) {
  color: var(--text-02);
  border: 1px solid var(--border-secondary) !important;
}

:deep(.pagination-container>div>button) {
  background-color: var(--bgc-04) !important;
}

:deep(.pagination-container > div > ul > li) {
  background-color: var(--bgc-02) !important;
}
</style>
