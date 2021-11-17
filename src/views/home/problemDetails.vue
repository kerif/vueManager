<template>
  <div class="problemDetails-container">
    <div class="problemDetails-content">
      <div class="problemDetails-title">
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
  methods: {
    getDetails() {
      this.$request.problemDetail(this.$route.params.id).then(res => {
        this.title = res.data.title
        this.content = res.data.content
      })
    }
  }
}
</script>

<style lang="scss">
.problemDetails-container {
  .problemDetails-content {
    background-color: #fff;
    padding: 20px;
  }
  .problemDetails-title {
    text-align: center;
    font-weight: 900;
    margin-bottom: 20px;
    font-size: 20px;
  }
}
</style>
