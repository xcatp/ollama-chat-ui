<!--  -->
<script setup>
import useCreateAgent from './composable/useCreateAgent'
import useModelInfo from './composable/useModelInfo'
import useAgentInfo from './composable/useAgentInfo'
import useDelAgent from './composable/useDelAgent'
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
  name: '',
  model: '',
  prompt: '',
  persona: ''
})

function chat(agentId) {
  siteStore.setActiveAgentId(agentId)
  router.push('/chat')
}

function delAgent(agentId) {
  useDelAgent(agentId)
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
function editAgent() {
  
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
    <EditAgentWindow :condition="editAgentDialogVisible" :form="form" :prompts="prompts" 
      @submit="editAgent" @close="editAgentDialogVisible = false" />
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
            <td>{{ v.lastRun || 'Never' }}</td>
            <td>{{ moment(v.lifespan).format('YYYY/MM/DD HH:mm:ss') }}</td>
            <td class="op-col">
              <div class="op-container">
                <SubmitBtn class="chat-btn" @click="chat(v.id)">chat</SubmitBtn>
                <div class="icon icon-edit" @click="editAgentDialogVisible = true"></div>
                <el-popconfirm width="220" title="Are you sure to delete this?">
                  <template #reference>
                    <div class="icon icon-delete"></div>
                  </template>
                  <template #actions="{ cancel }">
                    <el-button size="small" @click="cancel">No</el-button>
                    <el-button type="danger" size="small" @click="delAgent(v.id)">
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

  .id-col {
    background-color: var(--background-secondary) !important;
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
