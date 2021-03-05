<template>
  <el-dialog :visible.sync="show" :title="$t('结算明细')" class="dialog-add-packages"
  @close="clear" width="70%">
    <!-- <div class="searchUser">
      <el-input :placeholder="$t('请输入关键字')" v-model="keyword" @keyup.enter.native="getList">
        <template slot="append">
          <span @click="getList" class="search-btn">{{$t('搜索')}}</span>
        </template>
      </el-input>
    </div> -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <!-- 客户ID -->
      <el-table-column
        :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{scope.row.user_id}}</span>
        </template>
      </el-table-column>
      <!-- 订单号 -->
      <el-table-column
        prop="order_sn"
        :label="$t('订单号')">
      </el-table-column>
      <!-- 物品名称 -->
      <el-table-column
        prop="boxes_count"
        :label="$t('箱数')">
      </el-table-column>
      <!-- 物品价值 -->
      <el-table-column
        prop="weight"
        :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : ''}`">
      </el-table-column>
      <el-table-column
        prop="package_value"
        :label="$t('尺寸/体积')">
        <template slot-scope="scope">
          <span>{{scope.row.length}}*{{scope.row.width}}*{{scope.row.height}}{{`${localization.length_unit ? localization.length_unit : ''}`}}/{{scope.row.volume}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        :label="$t('完成时间')">
      </el-table-column>
      <!-- 佣金 -->
      <el-table-column
      prop="amount"
      :label="$t('佣金') + `${localization.currency_unit ? localization.currency_unit : ''}`">
      </el-table-column>
    </el-table>
    <div class="pagination-box">
        <nle-pagination :pageParams="page_params"></nle-pagination>
     </div>
     <div>
       <p>{{$t('合计')}}：{{tableData.length}}{{$t('个订单')}} {{$t('总佣金')}}{{`${localization.currency_unit ? localization.currency_unit : ''}`}}{{count}}</p>
     </div>
    <!-- <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div> -->
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      tableData: [],
      keyword: '',
      chooseId: 0,
      lineNum: [],
      id: '',
      XStationId: '',
      localization: {},
      count: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList () {
      if (this.state === 'pick') {
        this.getPick()
      } else if (this.state === 'pay') {
        this.getPay()
      }
    },
    getPick () {
      this.$request.recordDetails(this.id, {
        keyword: this.keyword,
        XStationId: this.XStationId,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          this.count = res.data.reduce((p, e) => p + e.amount, 0)
          console.log(this.count, 'this.count')
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 自提点佣金结算 明细
    getPay () {
      this.$request.recordsDetails(this.id, {
        keyword: this.keyword,
        XStationId: this.XStationId,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          this.count = res.data.reduce((p, e) => p + e.amount, 0)
          console.log(this.count, 'this.count')
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    confirm () {
      if (!this.lineNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      // this.success(this.lineNum)
      // this.show = false
      this.$request.updateAddable(this.id, {
        ids: this.lineNum
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    clear () {
      this.page_params.page = 1
      this.keyword = ''
      this.lineNum = []
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-add-packages {
  .searchUser {
    width: 40%;
    float: right;
    margin: 10px 0;
  }
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
}
</style>
