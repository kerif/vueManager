<template>
  <div class="system-notice-container">
    <div class="system-content">
    <div class="system-title">
      <p>{{noticeData.title}}</p>
      </div>
      <div>
        <p v-html="noticeData.content"></p>
      </div>
      <div class="system-bottom">
        <p>{{$t('发布时间')}}：{{noticeData.updated_at}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      noticeData: {}
    }
  },
  created () {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.getSystemNotice(this.$route.params.id).then(res => {
        if (res.ret) {
          this.noticeData = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.system-notice-container {
  .system-content {
    background-color: #fff;
    padding: 20px;
  }
  .system-title {
    text-align: center;
    font-weight: 900;
    margin-bottom: 20px;
    font-size: 20px;
  }
}
</style>
