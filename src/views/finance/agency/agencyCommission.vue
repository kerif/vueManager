<template>
  <div class="settled-list-container">
    <div class="headline">
      <div class="head-status">
        <!-- 结算状态 -->
        <el-select
          v-model="page_params.status"
          :placeholder="$t('请选择结算状态')"
          size="small"
          class="head-mr"
          clearable
        >
          <el-option v-for="item in settledData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!--客户ID-->
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入客户ID')"
          v-model="page_params.user_id"
          :disabled="(!!this.$route.params.id && !hasStore) || this.shipNum != ''"
          size="small"
          class="head-mr"
          clearable
        >
        </el-autocomplete>
        <!-- 搜索 -->
        <el-date-picker
          size="small"
          class="selectTime head-mr"
          v-model="timeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('提交开始日期')"
          :end-placeholder="$t('提交结束日期')"
          @change="fm"
        >
        </el-date-picker>
        <!-- 搜索 -->
        <el-button size="small" class="searchBtn" @click.native="getList">{{
          $t('搜索')
        }}</el-button>
        <!-- 一键结算 -->
        <el-button size="small" class="unsettled" type="primary" @click="oneSettlement">
          {{ $t('一键结算') }}
        </el-button>
      </div>
      <div class="head-search">
        <el-input
          placeholder="请输入内容"
          v-model="page_params.keyword"
          @keyup.enter.native="getList"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getList"></i>
        </el-input>
      </div>
    </div>
    <div class="data-list">
      <el-table border style="width: 100%" :data="settleData">
        <el-table-column type="index" width="50" :label="$t('#')"> </el-table-column>
        <el-table-column prop="user_name" :label="$t('下单人')" width="140"> </el-table-column>
        <el-table-column prop="order_number" :label="$t('订单号')"> </el-table-column>
        <el-table-column prop="order_status" :label="$t('订单状态')" width="100"> </el-table-column>
        <el-table-column prop="order_amount" :label="$t('计佣金额¥')" width="100">
        </el-table-column>
        <el-table-column prop="agent_name" :label="$t('代理')"> </el-table-column>
        <el-table-column prop="commission_amount" :label="$t('可获佣金')" width="100">
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('成交时间')" width="100"> </el-table-column>
        <el-table-column :label="$t('结算状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.settled === 0">{{ $t('未结算') }}</span>
            <span v-if="scope.row.settled === 1">{{ $t('已结算') }}</span>
            <span v-if="scope.row.settled === 2">{{ $t('提现申请中') }}</span>
            <span v-if="scope.row.settled === 3">{{ $t('已提现') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.settled === 0"
              type="success"
              plain
              @click="settlement(scope.row.id)"
              >{{ $t('结算') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false">
      <div class="remark-text">
        <span>{{ $t('未结算总金额') }}:</span><span>{{ this.unsettle_amount }},</span>&nbsp;<span
          >{{ $t('已结算佣金') }}:</span
        ><span>{{ this.settle_amount }}</span>
      </div>
    </nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      page_params: {
        user_id: '',
        status: '',
        begin_date: '',
        end_date: ''
      },
      customerID: '',
      time: '',
      settleData: [], // 待结算数据
      hasStore: false,
      shipNum: '',
      settledData: [],
      timeList: [],
      unsettleId: '',
      ids: [],
      settle_amount: '',
      unsettle_amount: ''
    }
  },
  components: {
    NlePagination
  },
  created() {
    this.getList()
    this.getSettleStatistics()
    this.goInit()
  },
  mixins: [pagination],
  methods: {
    // 待结算
    getList() {
      this.$request
        .noSettled({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          user_id: this.page_params.user_id,
          status: this.page_params.status,
          begin_date: this.timeList[0],
          end_date: this.timeList[1]
        })
        .then(res => {
          if (res.ret) {
            this.settleData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    // 一键结算
    oneSettlement() {
      this.unsettleId = this.settleData.filter(item => item.settled === 0)
      this.ids = this.unsettleId.map(item => item.id)
      this.$confirm(this.$t('您真的确认要一键结算吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.clickSettlement({ commission_ids: this.ids }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    // 成交记录
    settlement(id) {
      this.$request.finishOrders(id).then(res => {
        if (res.ret) {
          this.$notify({
            message: res.msg,
            type: 'success',
            title: this.$t('操作成功')
          })
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .getUsers({
          keyword: this.page_params.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    // 客户id
    handleSelect(item) {
      this.supplierId = item.id
      this.userId = item.id
      this.supplierName = item.name
      this.page_params.user_id = item.id
      this.getAreaLocation()
    },
    // 代理结算统计
    getSettleStatistics() {
      this.$request.settleStatistics().then(res => {
        console.log(res.data)
        this.unsettle_amount = res.data.unsettle_amount
        this.settle_amount = res.data.settle_amount
      })
    },
    goInit() {
      this.$request.initSettle().then(res => {
        this.settledData = res.data.status_list
      })
    },
    fm() {
      console.log(this.timeList)
    }
  }
}
</script>

<style lang="scss" scoped>
.settled-list-container {
  .headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-status {
      .head-mr {
        margin-right: 10px;
      }
      .searchBtn {
        width: 120px;
      }
      .unsettled {
        width: 120px;
      }
      .selectTime {
        width: 240px !important;
      }
    }
    .head-search {
      width: 200px;
    }
  }
  .data-list {
    margin-top: 40px;
    .el-table tr th.is-leaf {
      border-bottom: 1px #ecedf0 solid;
      background-color: #fff;
    }
    .el-table th > .cell {
      text-align: center;
    }
    .el-table .cell {
      text-align: center;
    }
  }
  .remark-text {
    font-size: 14px;
    font-weight: bold;
    color: red;
  }
}
</style>
