<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('购买记录')"
    class="dialog-purchase-history"
    @close="clear"
    width="55%"
  >
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <!-- 日期 -->
      <el-table-column prop="paid_at" :label="$t('日期')"> </el-table-column>
      <!-- 中国大陆短信 -->
      <el-table-column v-if="state === 'sms'" prop="sms" :label="$t('中国大陆短信')">
      </el-table-column>
      <el-table-column v-else prop="tracking_100" :label="$t('快递100')"> </el-table-column>
      <el-table-column v-if="state === 'sms'" prop="sms_intl" :label="$t('国际短信')">
      </el-table-column>
      <!-- 国际短信 -->
      <el-table-column v-else prop="tracking_51" :label="$t('51Track')"> </el-table-column>
      <!-- 支付价格 -->
      <el-table-column
        prop="amount"
        :label="$t('支付价格') + `${localization.currency_unit ? localization.currency_unit : ''}`"
      >
      </el-table-column>
      <!-- 支付方式 -->
      <el-table-column prop="payment_method" :label="$t('支付方式')"> </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="editPiont">{{$t('确定')}}</el-button>
    </div> -->
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      tableData: [],
      pointList: [],
      state: '',
      localization: {}
    }
  },
  methods: {
    getList() {
      let state = this.state === 'sms' ? 'sms' : 'tracking'
      this.$request
        .getHistory(state, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableData = res.data
          // this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.localization, 'this.localization')
        })
    },
    init() {
      this.getList()
    },
    clear() {
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-purchase-history {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
  .select-sty {
    width: 40% !important;
  }
}
</style>
