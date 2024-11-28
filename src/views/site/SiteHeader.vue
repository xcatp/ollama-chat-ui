<!--  -->
<script setup>
import ThemeButton from './ThemeButton.vue'

import { useSiteStore } from '@/stores'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const siteStore = useSiteStore()
const isDarkTheme = ref(siteStore.getCurrTheme() === 'dark')

watch(
  isDarkTheme,
  nv => {
    document.documentElement.dataset.theme = nv ? 'dark' : 'light'
    siteStore.setCurrTheme(nv ? 'dark' : 'light')
  }, { immediate: true }
)

function changeLang(e) {
  if (e.target.nodeName.toLowerCase() === 'li') {
    const v = e.target.dataset.value
    locale.value = v
    localStorage.setItem('lang', v)
  }
}

function toggleBannerState() {
  siteStore.setShowBanner(!siteStore.siteState.showBanner)
}
</script>

<template>
  <div class="view-container">
    <div class="top-navigation">
      <div></div>
      <div class="site-actions-container">
        <div class="read-mode-switcher" @click="toggleBannerState">
          <span class="icon icon-read-mode"></span>
        </div>
        <div class="locale-switcher">
          <div class="lang-switcher">
            <span class="icon icon-lang"></span>
          </div>

          <ul class="dropdown-container" @click="changeLang">
            <li data-value="zh" class="dropdown-item">中文</li>
            <li data-value="en" class="dropdown-item">english</li>
          </ul>
        </div>
        <div class="theme-switcher">
          <ThemeButton v-model="isDarkTheme" />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  background-color: var(--site-header-bgc);
  z-index: 100;
  position: sticky;
  top: 0;
  border-top: 1px solid var(--border-primary);
}

.top-navigation {
  padding: 0 10px;
  padding-bottom: 0;
  position: sticky;
  top: 0;
  height: 29px;
  background-color: var(--site-header-bgc);
  border-bottom: 1px solid var(--border-secondary);
  z-index: 100;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 446px) {
    flex-direction: column-reverse;
    height: auto;
  }
}

.site-actions-container {
  height: 100%;
  display: flex;
  gap: .5rem;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 446px) {
    justify-content: flex-end;
    flex-direction: row-reverse;
    padding: 5px 0;
    border-bottom: 1px solid var(--border-primary);
  }
}

.show-search {
  top: 0 !important;
}

.header-search {

  .icon-cancel {
    width: 18px;
    height: 18px;
    mask-image: url('/static/svg/cancel.svg');
  }

  .icon-search {
    width: 18px;
    height: 18px;
    mask-image: url('/static/svg/search.svg');
  }
}

.icon {
  mask-repeat: no-repeat;
  mask-position: center;
  vertical-align: middle;
  display: inline-block;
  background-color: var(--icon-bgc);
  margin: 1px;
}

.icon-lang {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/lang.svg');
}

.icon-read-mode {
  width: 18px;
  height: 18px;
  mask-image: url('/static/svg/book.svg');
}

.locale-switcher {
  background-color: #dcf1de;
  color: rgb(2, 47, 25);
  border: 1px solid #005319;
  border-radius: 2px;
  cursor: pointer;
  transition: all .3s ease-out;

  & .lang-switcher {
    padding: 0px 3px;
  }

  &:hover .dropdown-container {
    visibility: visible;
    opacity: 1;
  }

  &:hover,
  &:focus {
    background-color: #ddffe7;
  }
}

.dropdown-container {
  position: absolute;
  visibility: hidden;
  margin-top: 4px;
  opacity: 0;
  background-color: #dcf2e4;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  transition: all .3s ease-out;
}

.dropdown-item {
  transition: all .1s ease-out;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #84c99b;
  }
}

.header-search,
.read-mode-switcher {
  background-color: #dcf1de;
  border: 1px solid #005319;
  border-radius: 2px;
  cursor: pointer;
  transition: all .3s ease-out;
  padding: 0px 3px;

  &:hover,
  &:focus {
    background-color: #ddffe7;
  }
}
</style>
