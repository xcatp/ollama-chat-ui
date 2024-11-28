<template>
  <button class="button submit-btn" @click="$emit('onClick')">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  padding: 4px 11px;
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
  border-radius: 2px;
  cursor: pointer;
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
