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


.main-header {
  margin: 10px 0;
  padding-bottom: 10px;
  box-shadow: 0px 3px 4px var(--shadow-01);
  background: var(--banner-linear);
}

.main-title {
  padding-top: 10px;
  padding-bottom: 0px;
  font-family: "Oswald", "Bookman Old Style", serif;
  font-size: 2.50rem;
  border-bottom: 1px solid var(--title-tc-01);
  letter-spacing: 0.12rem;
  width: max-content;
  margin: auto;
  color: var(--title-tc-01);
}

.main-subtitle {
  font-family: Roboto, inherit "Merienda", sans-serif;
  font-weight: 400;
  font-size: .75rem;
  color: var(--subtitle-tc-01);
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
