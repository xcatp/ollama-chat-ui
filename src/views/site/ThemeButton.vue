<!-- https://daily-dev-tips.com/posts/creating-day-night-css-only-toggle-switch/ -->
<!-- 主题切换按钮 -->
<script setup>
const model = defineModel()

</script>

<template>
  <input type="checkbox" id="toggle" class="toggle--checkbox" v-model="model">
  <label for="toggle" class="toggle--label">
    <span class="toggle--label-background"></span>
  </label>
</template>
   
<style scoped>
.toggle--checkbox {
  display: none;
}

.toggle--checkbox:checked {
  /** This will all flip from sun to moon **/
  /** Change the label color **/
}

.toggle--checkbox:checked+.toggle--label {
  background: #6b7abb;
  border-color: #5d6baa;
  /** Change the cloud to stars **/
  /** Change the sun into the moon **/
  /** Show the dimples on the moon **/
}

/* star position */
.toggle--checkbox:checked+.toggle--label .toggle--label-background {
  left: 12px;
  width: 2px;
  border-radius: 1px;
}

.toggle--checkbox:checked+.toggle--label .toggle--label-background:before {
  width: 2px;
  height: 2px;
  top: -3px;
}

.toggle--checkbox:checked+.toggle--label .toggle--label-background:after {
  width: 2px;
  height: 2px;
  left: -6px;
  top: 2px;
}

.toggle--checkbox:checked+.toggle--label:before {
  background: #fff;
  border-color: #e8e8ea;
  animation-name: switch;
  animation-duration: 350ms;
  animation-fill-mode: forwards;
}

.toggle--checkbox:checked+.toggle--label:after {
  transition-delay: 350ms;
  opacity: 1;
}

.toggle--label {
  /* 主体 */
  /** Placeholder element, starting at blue **/
  width: 40px;
  height: 22px;
  background: #96dcee;
  border-radius: 2px;
  border: 1px solid #23b4d9;
  display: flex;
  position: relative;
  transition: all 350ms ease-in;
  /** The sun cloud and moon stars **/
  /** Sun/Moon element **/
  /** Gray dots on the moon **/
}

.toggle--label-background {
  /* 云 */
  width: 2px;
  height: 2px;
  border-radius: 0px;
  position: relative;
  background: #fff;
  left: 25px;
  top: 7px;
  transition: all 150ms ease-in;
}

.toggle--label-background:before {
  /* 云上 */
  content: "";
  position: absolute;
  top: -1px;
  width: 8px;
  height: 1px;
  border-radius: 2px;
  background: #fff;
  left: -4px;
  transition: all 150ms ease-in;
}

.toggle--label-background:after {
  /* 云下 */
  content: "";
  position: absolute;
  top: 1px;
  width: 8px;
  height: 1px;
  border-radius: 1px;
  background: #fff;
  left: -2px;
  transition: all 150ms ease-in;
}

.toggle--label:before {
  /* 太阳月亮 */
  animation-name: reverse;
  animation-duration: 350ms;
  animation-fill-mode: forwards;
  transition: all 350ms ease-in;
  content: "";
  width: 15px;
  height: 15px;
  border: 1px solid #f5eb71;
  top: 2px;
  left: 1px;
  position: absolute;
  border-radius: 2px;
  background: #fffaa8;
}

.toggle--label:after {
  /* 月亮上的斑点 */
  transition-delay: 0ms;
  transition: all 200ms linear;
  position: absolute;
  content: "";
  box-shadow: #e8e8ea -2px 0 0 2px, #e8e8ea -4px 3px 0 -2px;
  left: 28px;
  top: 7px;
  width: 2px;
  height: 2px;
  background: transparent;
  border-radius: 50%;
  opacity: 0;
}

@keyframes switch {
  0% {
    left: 0px;
  }

  60% {
    left: 10px;
    width: 25px;
  }

  100% {
    left: 20px;
    width: 15px;
  }
}

@keyframes reverse {
  0% {
    left: 20px;
    width: 15px;
  }

  60% {
    left: 1px;
    width: 25px;
  }

  100% {
    left: 2px;
  }
}
</style>
