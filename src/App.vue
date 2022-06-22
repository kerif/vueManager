<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      customData: {}
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    getInit() {
      this.$request.initConfig({ domain: document.domain }).then(res => {
        this.customData = res.data
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
