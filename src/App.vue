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
    this.getInitUserId()
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
    },
    getInitUserId() {
      this.$request.initUserId().then(res => {
        if (res.ret) {
          this.$store.commit('saveUid', res.data.user_uid)
        }
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

// 全局滚动条样式
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}
::-webkit-scrollbar-corner{
  display: block;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);     
}

::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
