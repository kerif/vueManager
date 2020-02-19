<template>
  <div class="recharge-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
        <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
       </el-date-picker>
       <!-- 充值方式 -->
      <el-select v-model="type" @change="onVocherTypeChange" clearable class="changeVou">
        <el-option
          v-for="item in voucherChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select>
       <!-- 状态 -->
        <div class="chooseStatus">
        <el-select v-model="status" @change="onShipStatus" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
    </div>
      </search-group>
    </div>
    <el-table :data="rechargeList" stripe border class="data-list"
    v-loading="tableLoading">
      <el-table-column type="index" :index="1"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待审核</span>
          <span v-if="scope.row.status === 1">审核通过</span>
          <span v-if="scope.row.status === 2">审核拒绝</span>
        </template>
      </el-table-column>
      <!-- 充值方式 -->
      <el-table-column label="充值方式" prop="payment_type_name"> </el-table-column>
      <!-- 支付方式 -->
      <!-- <el-table-column label="支付方式">
      </el-table-column> -->
      <!-- 支付金额 -->
      <el-table-column :label="'支付金额' + this.localization.currency_unit" prop="amount"></el-table-column>
      <!-- 确认金额 -->
      <el-table-column :label="'确认金额' + this.localization.currency_unit" prop="confirm_amount"></el-table-column>
      <!-- 第三方流水号 -->
      <el-table-column label="流水号" prop="serial_no"></el-table-column>
      <!-- 支付时间 -->
      <el-table-column label="支付时间" prop="created_at"></el-table-column>
      <!-- 处理人 -->
      <el-table-column label="处理人" prop="operator"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" class="btn-main optionBtn" @click="inviteWithdrawal(scope.row.id)">审核</el-button>
          <el-button v-else class="btn-deep-purple optionBtn" @click="withdrawalDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      rechargeList: [],
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      type: '',
      voucherChange: [],
      status: '',
      statusList: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 1,
          name: '审核通过'
        },
        {
          id: 2,
          name: '审核拒绝'
        }
      ]
    }
  },
  mixins: [pagination],
  name: 'rechargeList',
  components: {
    SearchGroup,
    NlePagination
  },
  created () {
    this.getList()
    this.getTypes()
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        payment_type: this.type,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getRecharge(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rechargeList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 详情
    withdrawalDetail (id) {
      this.$router.push({ name: 'rechargeDetails',
        params: {
          id: id
        } })
    },
    // 审核
    inviteWithdrawal (id) {
      this.$router.push({ name: 'rechargeReview',
        params: {
          id: id,
          state: 'review'
        } })
    },
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 状态筛选
    onShipStatus () {
      this.page_params.handleQueryChange('status', this.status)
      this.getList()
    },
    // 跳转到审核
    details (id, orderId, paymentType) {
      console.log(paymentType, 'paymentType')
      console.log(orderId, 'orderId')
      if (paymentType === 0) {
        console.log('我是微信')
        this.$router.push({ name: 'wechatPay', query: { id: id } })
      } else {
        console.log('我是转账')
        this.$router.push({ name: 'TransactionDetails', query: { order_id: orderId } })
      }
    },
    // 选择不同类型优惠券
    onVocherTypeChange () {
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    },
    // 获取下拉框
    getTypes () {
      this.$request.getRechargeType().then(res => {
        if (res.ret) {
          this.voucherChange = res.data
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.recharge-list-container {
  .changeVou {
    margin-left: 20px;
  }
  .timeStyle {
    margin-right: 10px;
    width: 276px !important;
  }
  .chooseStatus {
    margin-left: 10px;
    width: 150px;
    display: inline-block;
  }
}
</style>
