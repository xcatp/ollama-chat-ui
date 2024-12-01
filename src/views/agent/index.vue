<!--  -->
<script setup>
import PopWindow from '@/components/PopWindow.vue'
import SimpleInput from '@/components/SimpleInput.vue'
import useCreateAgent from './composable/useCreateAgent'
import useModelInfo from './composable/useModelInfo'
import useAgentInfo from './composable/useAgentInfo'
import useDelAgent from './composable/useDelAgent'
import moment from 'moment'
import { useSiteStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/DataTable.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const siteStore = useSiteStore()
const loading = ref(false)
const createAgentDialogVisible = ref(false)
const pageSize = 10
const currPage = ref(1)
const { models } = useModelInfo()
const { agentList, total, getPageData } = useAgentInfo(currPage.value, pageSize)
const form = ref({
  name: '',
  model: '',
  prompt: '',
  persona: ''
})

const rules = {
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
  model: [{ required: true, message: 'Please select a model', trigger: 'change' }]
}

function chat(agentId) {
  siteStore.setActiveAgentId(agentId)
  router.push('/chat')
}

function delAgent(agentId) {
  useDelAgent(agentId)
  console.log('deleted agent:' + agentId);

  retrieveNextPage(currPage.value)
}

function createAgent() {
  if (form.value.name === '' || form.value.model === '') {
    ElMessage({
      message: 'Please fill in the required fields',
      type: 'error',
      plain: true,
    })
    return
  }
  useCreateAgent(form.value)
  createAgentDialogVisible.value = false
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
    <PopWindow :condition="createAgentDialogVisible" @close="createAgentDialogVisible = false">
      <div class="pop-window-header">
        <h2 class="title">Create Agent</h2>
      </div>
      <div class="pop-window-body">
        <div class="label">Agent name</div>
        <input type="text" v-model="form.name" placeholder="Agent name" />
        <div class="label">Model</div>
        <el-select v-model="form.model" clearable placeholder="select a model">
          <el-option v-for="v in models" :key="v.name" :label="v.name" :value="v.name" />
        </el-select>
        <div class="label">Agent persona</div>
        <el-select v-model="form.prompt" clearable placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
        </el-select>
        <div class="label">Human persona</div>
        <el-select v-model="form.persona" placeholder="please select your zone">
        </el-select>
      </div>
      <div class="pop-window-footer">
        <div class="form-btn">
          <el-button type="primary" @click="createAgent">Create</el-button>
          <el-button @click="createAgentDialogVisible = false">Cancel</el-button>
        </div>
      </div>
    </PopWindow>
    <div class="header-panel">
      <div class="title">Agents</div>
      <SubmitBtn @click="createAgentDialogVisible = true">New</SubmitBtn>
    </div>
    <div class="main-panel">
      <DataTable :loading="loading">
        <template #header>
          <th style="width: 2em;">#</th>
          <th style="width: 7em">Name</th>
          <th style="width: 7em;">Model</th>
          <th style="width: 4em;">Chat Count</th>
          <th style="width: 6em;">Last Run</th>
          <th style="width: 7em;">Lifespan</th>
          <th style="width: 7em;">Operation</th>
        </template>
        <template #body>
          <tr v-for="(v, i) in agentList" :key="i">
            <td class="id-col"> {{ i + 1 + (currPage - 1) * pageSize }} </td>
            <td>{{ v.agentName }}</td>
            <td>{{ v.model }}</td>
            <td>{{ v.chatCount }}</td>
            <td>{{ v.lastRun ? moment(v.lastRun).format('YYYY-MM-DD HH:mm:ss') : 'Never' }}</td>
            <td>{{ moment(v.lifespan).format('YYYY-MM-DD HH:mm:ss') }}</td>
            <td class="op-col">
              <div class="op-container">
                <div class="icon icon-edit" @click="chat(v.id)"></div>
                <div class="icon icon-delete" @click="delAgent(v.id)"></div>
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
}


.pop-window-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2em;
}

.pop-window-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .form-btn {
    display: flex;
    margin-top: auto;
    justify-content: flex-end !important;
  }

  input {
    outline: none;
    padding: 4px 11px;
    font-size: 14px;
    line-height: 1.5;
    color: inherit;
    border: 1px solid #E2E4E5;
    background-color: #E2E4E5;
    border-radius: 2px;
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
