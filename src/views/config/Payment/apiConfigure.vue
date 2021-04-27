<template>
  <div class="api-configure">
    <div class="item">
      <div class="item-top">
        <div>短信</div>
        <div>
          <div>短信服务</div>
          <div>您当前正在使用第三方短信服务</div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="configureBtn">配置</div>
    </div>
    <div class="item">
      <div class="item-top">
        <div>邮件</div>
        <div>
          <div>邮件通知</div>
          <div>邮件配置</div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="configureBtn" @click="configureBtn">配置</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    configureBtn () {
      this.$router.push({ name: 'mailConfigur' })
    }
  }
}

</script>
<style lang="scss" scoped>
.api-configure {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  .item {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #000;
    .item-top {
      display: grid;
      grid-template-columns: 1fr 3fr;
      align-items: center;
      gap: 20px;
    }
    .configureBtn {
      cursor: pointer;
      align-self: flex-end;
      padding: 5px 15px;
      margin-top: 10px;
      border-radius: 5px;
      color: #fff;
      background-color: #1f3dc4;
    }
  }
}
</style>
