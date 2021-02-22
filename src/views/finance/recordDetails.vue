<template>
  <div class="self-settlement-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
    </div> -->
    <h2>{{$t('自提点结算记录')}}</h2>
    <el-table :data="rechargeList" stripe border class="data-list"
    v-loading="tableLoading">
      <el-table-column type="index" :index="1"></el-table-column>
      <!-- 时间 -->
      <el-table-column :label="$t('时间')"></el-table-column>
      <!-- 完成订单数 -->
      <el-table-column :label="$t('完成订单数')">
      </el-table-column>
      <!-- 佣金总数 -->
      <el-table-column :label="$t('佣金总数')" prop="payment_type_name"> </el-table-column>
      <!-- 结算状态 -->
      <el-table-column :label="$t('结算状态') + this.localization.currency_unit" prop="amount"></el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-green optionBtn" @click="goDetails(scope.row.id)">{{$t('明细')}}</el-button>
          <el-button class="btn-light-red optionBtn" @click="inviteWithdrawal(scope.row.id)">{{$t('审核并支付')}}</el-button>
          <el-button class="btn-deep-purple optionBtn" @click="inviteWithdrawal(scope.row.id)">{{$t('查看支付详情')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
// import AddBtn from '@/components/addBtn'
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
          name: this.$t('待审核')
        },
        {
          id: 1,
          name: this.$t('审核通过')
        },
        {
          id: 2,
          name: this.$t('审核拒绝')
        }
      ]
    }
  },
  mixins: [pagination],
  name: 'rechargeList',
  components: {
    // SearchGroup,
    NlePagination
    // AddBtn
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
            title: this.$t('操作失败'),
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
    goDetails (id) {
      // settlementDetails
      dialog({ type: 'settlementDetails', id: id })
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
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    addVip () {
      dialog({ type: 'rechargeAdd' }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.self-settlement-container {
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
  .select-box {
    overflow: hidden;
  }
}
</style>
