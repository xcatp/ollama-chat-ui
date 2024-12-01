<!--  -->
<script setup>
const inputValue = defineModel()
defineProps({ label: String, placeholder: String })
</script>

<template>
  <div class="info-item">
    <label for="id">{{ label }}</label>
    <input class="info-input" type="text" id="id" v-model="inputValue" :placeholder="placeholder">
    <button type="button" class="clear-button" @click="inputValue = ''">
      <div class="icon-cancel"></div>
    </button>
  </div>
</template>

<style scoped lang="scss">
.info-item {
  display: flex;
  align-items: center;
  position: relative;
  gap: 10px;

  .info-input {
    flex: 1;
    width: 250px;
    outline: none;
    padding: 4px 11px;
    font-size: 14px;
    line-height: 1.5;
    color: inherit;
    background-color: var(--bgc-02);
    border: 1px solid var(--border-primary);
    border-radius: 2px;

    &:hover {
      border-color: #4d9f00;
    }
  }

  &:hover .clear-button {
    visibility: visible;
  }
}

.clear-button {
  height: 100%;
  background: transparent;
  border: 0;
  position: absolute;
  right: 5px;
  visibility: hidden;

  &:hover .icon {
    background-color: red;
  }
}

.icon-cancel {
  mask-repeat: no-repeat;
  mask-position: center;
  vertical-align: middle;
  display: inline-block;
  background-color: var(--icon-bgc);
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/cancel.svg');

  &:hover {
    background-color: red;
  }
}
</style>
