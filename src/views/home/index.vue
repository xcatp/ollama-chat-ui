<!--  -->
<script setup>

</script>

<template>
  <div class="view-container">
    <div class="main-panel">
      <div class="main-header">
        <div class="main-title">Ollama Chat</div>
        <div class="main-subtitle">chat with local LLM</div>
      </div>
      <div class="main-body">
        <RouterLink to="/chat">
          <SubmitBtn class="select-btn">Start Chatting!</SubmitBtn>
        </RouterLink>
      </div>
      <div class="main-footer">
        <div class="footer-text">
          2024 ©
          <a href="https://gitee.com/dkwd">xcatp</a>
        </div>
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
  padding-left: 1em;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
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


.main-header {
  margin: 10px 0;
  padding-bottom: 10px;
  box-shadow: 0px 3px 4px var(--site-home-shadow);
  // background-color: #d2e0cb;
  background: linear-gradient(90deg, #779a74 1%, #78ad7b 1% 6%, #bac494 6% 11%, #d2e0cb 11% 89%, #bac494 89% 94%, #78ad7b 94% 99%, #779a74 99%);
}

.main-title {
  padding-top: 10px;
  padding-bottom: 0px;
  font-family: "Oswald", "Bookman Old Style", serif;
  font-size: 2.50rem;
  border-bottom: 1px solid var(--site-home-title);
  letter-spacing: 0.12rem;
  width: max-content;
  margin: auto;
  color: var(--site-home-title);
}

.main-subtitle {
  font-family: Roboto, inherit "Merienda", sans-serif;
  font-weight: 400;
  font-size: .75rem;
  color: var(--site-home-subtitle);
  letter-spacing: 0.100rem;
  margin: auto;
  width: max-content;
}

.main-body {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;

  .select-btn {
    display: block;
  }
}

.main-footer {
  color: #b5c4b8;
  margin-left: auto;

  a:hover {
    color: rgb(255, 132, 0);
  }
}
</style>
