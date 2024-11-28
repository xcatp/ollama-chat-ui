<script setup>
import { ref, onUnmounted } from 'vue'

const countDown = ref(5)

const timer = setInterval(() => {
  if (countDown.value > 0) countDown.value--
  else {
    // window.location.href = '/'
    clearInterval(timer)
  }
}, 1000)

onUnmounted(() => clearInterval(timer))

</script>


<template>
  <div class="main-wrapper debug-border">
    <h1>404 Not Found</h1>
    <p>The page you are looking for could not be found.</p>
    <p>
      Try going back to the previous page or visit our
      <RouterLink to="/">homepage</RouterLink>.
    </p>
    <p>Redirecting to homepage in
      <span style="color: red; font-weight: bold"> {{ countDown }} </span>
      seconds...
    </p>

    <p v-if="countDown === 0">Redirecting now...</p>
    <p v-if="countDown === 0">
      <RouterLink to="/"> &gt; Homepage &lt;</RouterLink>
    </p>
    <p v-if="countDown === 0">If you are not redirected automatically, please click the above link.</p>
  </div>
</template>

<style scoped>
.main-wrapper {
  margin: 25px 0 5px;
  text-align: center;
  flex: 1;
  min-width: 50%;
}

a {
  color: #149dca;
}
</style>