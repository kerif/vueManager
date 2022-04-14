<template>
  <div class="distributeDetail-container">
    <div class="left-box">111</div>
    <div class="right-box">
      <div class="detail">
        <div>打包单号</div>
        <div>JIYUNXXXXXXXX001</div>
      </div>
      <div class="detail">
        <div>客户ID</div>
        <div>124000-小海鸥</div>
      </div>
      <div>收货地址</div>
      <div>下单渠道</div>
      <div>增值服务</div>
      <div>付款方式</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.distributeDetail-container {
  display: flex;
  .left-box {
    width: 20%;
    background: #fff !important;
  }
  .right-box {
    width: 80%;
    background: #fff !important;
    margin-left: 20px;
    padding: 20px;
    .detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
