<template>
  <div class="settled-list-container">
    <div class="headline">
      <el-row :gutter="10">
        <el-col :span="4">
          <!-- 下拉 -->
          <el-select v-model="page_params.status" :placeholder="$t('请选择结算状态')" size="small">
            <el-option
              v-for="item in settledData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <!--  -->
        <el-col :span="4">
          <el-autocomplete
            :fetch-suggestions="queryCNSearch"
            @select="handleSelect"
            :placeholder="$t('请输入客户ID')"
            v-model="page_params.user_id"
            :disabled="(!!this.$route.params.id && !hasStore) || this.shipNum != ''"
            size="small"
          >
          </el-autocomplete>
        </el-col>
        <!-- 搜索 -->
        <el-col :span="5">
          <el-date-picker
            size="small"
            class="selectTime"
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
        </el-col>
        <el-col :span="3">
          <el-button size="small" class="searchBtn" @click.native="getList">{{
            $t('搜索')
          }}</el-button>
        </el-col>
        <el-col :span="3">
          <el-button size="small" class="unsettled" type="primary" @click="oneSettlement">
            {{ $t('一键结算') }}
          </el-button>
        </el-col>
        <el-col :span="5">
          <search-group
            v-model="page_params.keyword"
            @search="goSearch"
            :placeholder="$t('请输入关键字')"
          >
          </search-group>
        </el-col>
      </el-row>
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
        <el-table-column prop="commission_amount" :label="$t('可获佣金￥')" width="100">
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
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
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
      shipNum: '', // 通过快递单号拉取的包裹id
      settledData: [],
      timeList: [],
      unsettleId: '',
      ids: []
    }
  },
  components: {
    NlePagination,
    SearchGroup
  },
  created() {
    this.getList()
    this.goInit()
    console.log(this.$route.query.userId, 'user_id')
  },
  mixins: [pagination],
  methods: {
    // 待结算
    getList() {
      this.$request
        .NoSettled({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          user_id: this.page_params.user_id,
          status: this.page_params.status,
          begin_date: this.timeList[0],
          end_date: this.timeList[1]
        })
        .then(res => {
          console.log(res)
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
      console.log(this.unsettleId)
      this.ids = this.unsettleId.map(item => item.id)
      console.log(this.ids)
      this.$confirm(this.$t('您真的确认要一键结算吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.ClickSettlement({ commission_ids: this.ids }).then(res => {
          console.log(res)
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
      console.log(id, 'id')
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
      console.log(this.page_params.user_id)
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
      console.log(item)
      this.supplierId = item.id
      this.userId = item.id
      this.supplierName = item.name
      this.page_params.user_id = item.id
      this.getAreaLocation()
    },
    goInit() {
      this.$request.InitSettle().then(res => {
        this.settledData = res.data.status_list
        console.log(res)
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
    margin-top: 20px;
    .searchBtn {
      width: 120px;
      margin-left: 10px;
    }
    .unsettled {
      width: 120px;
    }
    .selectTime {
      width: 240px !important;
    }
  }
  .data-list {
    margin-top: 40px;
    /deep/.el-table tr th.is-leaf {
      border-bottom: 1px #ecedf0 solid;
      background-color: #fff;
    }
    /deep/.el-table th > .cell {
      text-align: center;
    }
    /deep/.el-table .cell {
      text-align: center;
    }
  }
}
</style>
