<!--  -->
<script setup>
defineProps({
  loading: {
    type: Boolean
  }
})

</script>

<template>
  <div class="data-container">
    <Transition name="loading">
      <div class="loading" v-if="loading">
        <div class="loading-icon"></div>
      </div>
    </Transition>
    <table class="data-table">
      <thead>
        <tr>
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody>
        <slot name="body"></slot>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">

.data-container {
  margin-top: 5px;
  width: 100%;
  flex: 1;
  min-height: 300px;
  overflow-x: auto;
  position: relative;
}

.data-table {
  width: 100%;
  min-width: 400px;
  table-layout: fixed;
  border-collapse: collapse;
  overflow: auto;
  border: 1px solid var(--border-primary);

  thead {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  th {
    padding: 10px 8px;
    background-color: var(--bgc-01) !important;
    text-align: center;
  }

  td {
    padding: 8px 3px;
    text-align: center;
  }

  tr:nth-child(odd) td {
    background-color: var(--bgc-03);
  }

  tr:nth-child(even) td {
    background-color: var(--bgc-02);
  }

  tr:hover td {
    background-color: var(--bgc-04) !important;
  }

  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    right: 0;
    text-align: center;
    box-shadow: inset -.5px 0 0 0 var(--border-secondary);
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.5s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
  background-color: #dfebd1d0;

  .loading-icon {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border: 5px solid #9ed5b2;
    border-top: 5px solid #007f31;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
