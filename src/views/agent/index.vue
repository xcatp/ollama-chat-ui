<!--  -->
<script setup>
import useModelInfo from './composable/useModelInfo'
import useAgentInfo from './composable/useAgentInfo'
import useAgentService from './composable/useAgentService'
import moment from 'moment'
import { useSiteStore, useTemplateStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DataTable from '@/components/DataTable.vue'
import SubmitBtn from '@/components/button/SubmitBtn.vue'
import CreateAgentWindow from './components/CreateAgentWindow.vue'
import EditAgentWindow from './components/EditAgentWindow.vue'

const router = useRouter()
const siteStore = useSiteStore()
const loading = ref(false)
const createAgentDialogVisible = ref(false)
const editAgentDialogVisible = ref(false)
const pageSize = 10
const currPage = ref(1)
const { models } = useModelInfo()
const { agentList, total, getPageData } = useAgentInfo(currPage.value, pageSize)
const prompts = useTemplateStore().templateState.prompts
const form = ref({
  id: '',
  name: '',
  model: '',
  weight: '',
  prompt: ''
})

function chat(agentId) {
  siteStore.setActiveAgentId(agentId)
  router.push('/chat')
}

function delAgent(agentId, _) {
  _()
  useAgentService.useDelAgent(agentId)
  retrieveNextPage(currPage.value)
}

function createAgent() {
  if (form.value.name === '' || form.value.model === '') {
    ElMessage({
      message: 'Please fill in the required fields',
      type: 'error'
    })
    return
  }
  useAgentService.useCreateAgent(form.value)
  createAgentDialogVisible.value = false
  retrieveNextPage(currPage.value)
}

function editAgent() {
  useAgentService.useUpdateAgent(form.value)
  editAgentDialogVisible.value = false
  retrieveNextPage(currPage.value)
}

function handleAdd() {
  Object.keys(form.value).forEach(key => form.value[key] = '')
  createAgentDialogVisible.value = true
}

function handleEdit(agentInfo) {
  form.value = {
    id: agentInfo.id,
    name: agentInfo.agentName,
    model: agentInfo.model,
    prompt: agentInfo.agentPersona,
    weight: agentInfo.weight || 0
  }
  editAgentDialogVisible.value = true
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
    <CreateAgentWindow :condition="createAgentDialogVisible" :form="form" :models="models" :prompts="prompts"
      @submit="createAgent" @close="createAgentDialogVisible = false" />
    <EditAgentWindow :condition="editAgentDialogVisible" :form="form" :prompts="prompts" @submit="editAgent"
      @close="editAgentDialogVisible = false" />
    <div class="header-panel">
      <div class="title">Agents</div>
      <SubmitBtn @click="handleAdd">New</SubmitBtn>
    </div>
    <div class="main-panel">
      <DataTable :loading="loading">
        <template #header>
          <th style="width: 2em;">#</th>
          <th style="width: 7em">Name</th>
          <th style="width: 7em;">Model</th>
          <th style="width: 4em;">Chat Count</th>
          <th style="width: 7em;">Last Run</th>
          <th style="width: 7em;">Lifespan</th>
          <th style="width: 3em;">Weight</th>
          <th style="width: 6em;">Operation</th>
        </template>
        <template #body>
          <tr v-for="(v, i) in agentList" :key="i">
            <td class="id-col"> {{ i + 1 + (currPage - 1) * pageSize }} </td>
            <td>{{ v.agentName }}</td>
            <td>{{ v.model }}</td>
            <td>{{ v.chatCount }}</td>
            <td>{{ v.lastRun ? moment(v.lastRun).format('YYYY/MM/DD HH:mm:ss') : 'Never' }}</td>
            <td>{{ moment(v.lifespan).format('YYYY/MM/DD HH:mm:ss') }}</td>
            <td>{{ v.weight }}</td>
            <td class="op-col">
              <div class="op-container">
                <SubmitBtn class="chat-btn" @click="chat(v.id)">chat</SubmitBtn>
                <div class="icon icon-edit" @click="handleEdit(v)"></div>
                <el-popconfirm width="220" :hide-after="0" :hide-icon="true" title="Delete agent and chat history?">
                  <template #reference>
                    <div class="icon icon-delete"></div>
                  </template>
                  <template #actions="{ cancel, confirm }">
                    <el-button size="small" @click="cancel">No</el-button>
                    <el-button type="danger" size="small" @click="delAgent(v.id, confirm)">
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
  z-index: 80;

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
    color: var(--text-03);
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

  td {
    // border: 1px solid red;
  }

  .op-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    align-items: center;

    .chat-btn {
      padding: 0 5px;
      border-radius: 3px;
    }

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


:deep(.el-select__wrapper) {
  background-color: var(--bgc-02);
  border: 1px solid var(--border-primary) !important;
  border-radius: 2px;
  box-shadow: none;

  &:hover {
    box-shadow: none;
  }
}
</style>
