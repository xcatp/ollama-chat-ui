<!--  -->
<script setup>
import { onMounted, ref } from 'vue'
import { listModels } from '@/api/ollama'
import moment from 'moment'
import DataTable from '@/components/DataTable.vue';

const models = ref([])
const loading = ref(false)
const total = ref(0)

onMounted(async () => {
  const res = await listModels()
  models.value = res.models
  total.value = res.models.length
})


</script>

<template>
  <div class="view-container">
    <div class="header-panel">
      <div class="title">Information</div>
    </div>
    <div class="main-panel">
      <h1>Available Models</h1>
      <DataTable :loading="loading">
        <template #header>
          <th style="width: 2em;">#</th>
          <th style="width: 15em">Name</th>
          <th style="width: 6em;">Family</th>
          <th style="width: 7em;">Parameter size</th>
          <th style="width: 9em;">Modified at</th>
          <th style="width: 6em;">QL</th>
          <th style="width: 6em;">Size</th>
        </template>
        <template #body>
          <tr v-for="(k, i) in models" :key="i">
            <td class="id-col"> {{ i + 1 }} </td>
            <td>{{ k.name }}</td>
            <td>{{ k.details.family }}</td>
            <td>{{ k.details.parameter_size }}</td>
            <td>{{ moment(k.modified_at).format('YYYY-MM-DD HH:mm:ss') }}</td>
            <td>{{ k.details.quantization_level }}</td>
            <td>{{ (k.size / 1024 / 1024 / 1024).toFixed(2) }} G</td>
          </tr>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 5px;
  border: 1px solid var(--border-primary);
  box-shadow: 0px 3px 4px var(--shadow-02);
  background-color: var(--view-bgc-02);
}

.data-table {
  th {
    border: 1px solid var(--border-primary);
  }

  .id-col {
    background-color: var(--bgc-secondary) !important;
  }
}
</style>
