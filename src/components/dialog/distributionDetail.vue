<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('分货详细')"
    class="distribution-dialog"
    style="width: 100%"
    @close="clear"
  >
    <div class="distribution">
      <div class="distribution-left">
        <div class="box-top">
          <div>#</div>
          <div>{{ $t('装箱清单') }}</div>
        </div>
        <div class="box-top">
          <div>{{ $t('商品名称') }}</div>
          <div>{{ $t('商品数量') }}</div>
        </div>
      </div>
      <div class="distribution-right">
        <div class="info-item">
          <div>{{ $t('打包单号') }}</div>
          <div>xxxxxxxxxxxx</div>
        </div>
        <div class="info-item">
          <div>{{ $t('客户ID') }}</div>
          <div>csjsxs33333333</div>
        </div>
        <div class="info-item">
          <div>{{ $t('收货地址') }}</div>
          <div>vbnnnnn</div>
        </div>
        <div class="info-item">
          <div>{{ $t('下单渠道') }}</div>
        </div>
        <div class="info-item">
          <div>{{ $t('增值服务') }}</div>
        </div>
        <div class="info-item">
          <div>{{ $t('付款方式') }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      row: {}
    }
  },
  methods: {
    clear() {}
  }
}
</script>

<style lang="scss">
.distribution-dialog {
  .distribution {
    display: flex;
    .distribution-left {
      width: 200px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      .box-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
      }
    }
    .distribution-right {
      width: calc(100%-300px);
      padding: 10px;
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
