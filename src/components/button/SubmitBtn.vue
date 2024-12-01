<template>
  <button class="button submit-btn" @click="$emit('onClick')">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  font-size: 14px;
  line-height: 1.5;
  height: 25px;
  padding: 2px 11px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--text-02);
}

.submit-btn {
  border: 1px solid var(--border-primary);
  background-color: var(--btn-bgc);

  &:active {
    background-color: var(--btn-active) !important;
  }

  &:hover {
    background-color: var(--btn-hover);
  }
}
</style>
