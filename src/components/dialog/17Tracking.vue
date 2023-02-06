<template>
  <el-dialog :visible.sync="show" :title="$t('物流查询')" class="tracking-container" @open="init">
    <iframe :src="iframeSrc" width="100%" height="600px" frameborder="0" scrolling="no"> </iframe>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc: '',
      trackingNumber: ''
    }
  },
  created() {},
  methods: {
    init() {
      this.iframeSrc = `https://extcall.17track.net/zh-cn/track?utm_medium=Referral&utm_source=extcall.17track.net#apitype=1&uheight=560&nums=${this.trackingNumber}&fc=0&sc=0&iframeId=trackIframe-44350&rmad=false&rmh=false&rml=false`
    }
  }
}
</script>

<style lang="scss">
.tracking-container {
  font-size: 14px;
}
</style>
