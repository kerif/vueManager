<template>
  <div class="settled-list-container">
    <div class="headline">
      <el-row :gutter="10">
        <el-col :span="4">
          <!-- 下拉 -->
          <el-select v-model="value" :placeholder="$t('请选择订单状态')" size="small">
            <el-option :label="$t('请选择订单状态')" :value="$t('选项一')"> </el-option>
            <el-option :label="$t('已发货')" :value="$t('选项二')"> </el-option>
            <el-option :label="$t('已支付')" :value="$t('选项三')"> </el-option>
            <el-option :label="$t('已签收')" :value="$t('选项四')"> </el-option>
          </el-select>
        </el-col>
        <!--  -->
        <el-col :span="3">
          <el-select v-model="value1" :placeholder="$t('请选择客户ID')" size="small">
            <el-option> </el-option>
          </el-select>
        </el-col>
        <!-- 搜索 -->
        <el-col :span="4">
          <el-input placeholder="请选择提交时间范围" v-model="input" clearable size="small">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button size="small" class="searchBtn">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button size="small" class="unsettled" type="primary" @click="oneSettlement">
            {{ $t('一键结算') }}
          </el-button>
        </el-col>
        <el-col :span="5" :offset="2">
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
    <nle-pagination :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      value: '',
      settleData: {}
    }
  },
  components: {
    NlePagination
  },
  created() {
    this.getSettled()
  },
  mixins: [pagination],
  methods: {
    getSettled() {
      this.$request.NoSettled().then(res => {
        console.log(res)
        this.settleData = res.data
      })
    },
    oneSettlement() {
      this.$request.ClickSettlement().then(res => {
        console.log(res)
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    settlement(id) {
      console.log(id, 'id')
      this.$request.finishOrders(id).then(res => {
        if (res.ret) {
          this.$notify({
            message: res.msg,
            type: 'success',
            title: this.$t('操作成功')
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
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
    }
    .unsettled {
      width: 120px;
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
