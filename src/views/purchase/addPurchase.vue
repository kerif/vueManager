<template>
  <div class="addPurchase-container">
    <purchase-info></purchase-info>
    <div style="margin-top: 20px">
      <el-button>{{ $t('取消') }}</el-button>
      <el-button>{{ $t('保存') }}</el-button>
      <el-button>{{ $t('保存并提交') }}</el-button>
    </div>
  </div>
</template>

<script>
import PurchaseInfo from './components/purchaseInfo.vue'
export default {
  data() {
    return {
      value: '',
      tableData: []
    }
  },
  components: {
    PurchaseInfo
  },
  methods: {}
}
</script>

<style lang="scss">
.addPurchase-container {
  background: #fff !important;
}
</style>
