<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { changeFavicon } from '@/utils/index'
export default {
  data() {
    return {
      customData: {}
    }
  },
  created() {
    if (location.hostname) {
      this.getInit()
    }
  },
  methods: {
    getInit() {
      this.$request.initConfig({ domain: location.hostname }).then(res => {
        this.customData = res.data
        if (this.customData.title) {
          document.title = this.customData.title
        }
        if (this.customData.icon) {
          let iconUrl = `${this.$baseUrl.IMAGE_URL}${this.customData.icon}`
          changeFavicon(iconUrl)
        }
        this.$store.commit('saveSiderBarImage', res.data.sidebar_image)
      })
    }
  }
}
</script>
<style lang="scss">
.el-table th.gutter {
  display: table-cell !important;
}
@import './styles/main.scss';
@import './styles/nprogress.scss';
@import './assets/iconfont/iconfont.css';
</style>
