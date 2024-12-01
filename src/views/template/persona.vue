<!--  -->
<script setup>

</script>

<template>
  <div class="view-container">
    <div class="header-panel">
      <div class="title">Agents</div>
      <button @click="createAgentDialogVisible = true">New</button>
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
  padding-left: 1em;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
}

</style>
