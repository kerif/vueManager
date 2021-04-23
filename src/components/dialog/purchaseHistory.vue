<template>
  <el-dialog :visible.sync="show" :title="$t('购买记录')" class="dialog-purchase-history"
  @close="clear" width="55%">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 日期 -->
      <el-table-column
        prop="username"
        :label="$t('日期')">
      </el-table-column>
      <!-- 中国大陆短信 -->
      <el-table-column
        prop="name"
        :label="$t('中国大陆短信')">
      </el-table-column>
      <!-- 国际短信 -->
        <el-table-column
        prop="email"
        :label="$t('国际短信')">
      </el-table-column>
      <!-- 支付价格 -->
        <el-table-column
        prop="phone"
        :label="$t('支付价格')">
      </el-table-column>
      <!-- 支付方式 -->
        <el-table-column
        prop="phone"
        :label="$t('支付方式')">
      </el-table-column>
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
  data () {
    return {
      tableData: [],
      pointList: [],
      state: ''
    }
  },
  methods: {
    getList () {
      this.$request.getPickPoint(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableData = res.data.map(item => ({ ...item, stations: item.stations.map(item => item.id) }))
        this.page_params.page = res.meta.current_page
        this.page_params.total = res.meta.total
      })
    },
    init () {
      // this.getList()
    },
    clear () {
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
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
  .select-sty {
    width: 40% !important;
  }
}
</style>
