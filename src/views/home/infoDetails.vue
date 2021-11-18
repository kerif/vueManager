<template>
  <div class="infoDetails-container">
    <div class="infoDetails-content">
      <div class="infoDetails-title">
        <p>{{ title }}</p>
      </div>
      <div>
        <p v-html="content">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: ''
    }
  },
  created() {
    this.getDetails()
  },
  activated() {
    this.getCount()
  },
  methods: {
    getDetails() {
      this.$request.messageDetail(this.$route.params.id).then(res => {
        if (res.ret) {
          this.title = res.data.title
          this.content = res.data.content
          // this.$router.go(-1)
          this.getCount()
        }
      })
    },
    getCount() {
      this.$request.countMessage().then(res => {
        this.unread = res.data.unread
        this.$store.commit('changeUnread', res.data.unread)
      })
    }
  }
}
</script>

<style lang="scss">
.infoDetails-container {
  .infoDetails-content {
    background-color: #fff;
    padding: 20px;
  }
  .infoDetails-title {
    text-align: center;
    font-weight: 900;
    margin-bottom: 20px;
    font-size: 20px;
  }
}
</style>
