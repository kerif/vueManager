<template>
  <div class="self-settlement-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
        <!-- <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')">
       </el-date-picker> -->
       <!-- 充值方式 -->
      <!-- <el-select v-model="type" @change="onVocherTypeChange" clearable class="changeVou" :placeholder="$t('请选择')">
        <el-option
          v-for="item in voucherChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select> -->
       <!-- 状态 -->
        <!-- <div class="chooseStatus">
        <el-select v-model="status" @change="onShipStatus" clearable
        :placeholder="$t('请选择')">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
    </div> -->
      </search-group>
    </div>
    <!-- <div class="select-box">
      <add-btn @click.native="addVip">{{$t('添加')}}</add-btn>
    </div> -->
    <el-table :data="rechargeList" stripe border class="data-list"
    v-loading="tableLoading">
      <el-table-column type="index" :index="1"></el-table-column>
      <!-- 自提点名称 -->
      <el-table-column :label="$t('自提点名称')" prop="name">
      </el-table-column>
      <!-- 所属国家/地区 -->
      <el-table-column :label="$t('所属国家/地区')" prop="country_name">
      </el-table-column>
      <!-- 联系人 -->
      <el-table-column :label="$t('联系人')" prop="contactor"> </el-table-column>
      <!-- 联系电话 -->
      <el-table-column :label="$t('联系电话')" prop="contact_info"></el-table-column>
      <!-- 计佣方式 -->
      <el-table-column :label="$t('计佣方式')" prop="rule.name"></el-table-column>
      <!-- 计佣金额 -->
      <el-table-column :label="$t('计佣金额')">
        <template slot-scope="scope">
          <span v-if="scope.row.rule.type === 1">{{localization.currency_unit ? localization.currency_unit : ''}}{{scope.row.rule.amount}}</span>
          <div v-if="scope.row.rule.type ===2">
            <span>{{$t('首重')}}：{{localization.currency_unit ? localization.currency_unit : ''}}{{scope.row.rule && scope.row.rule.first_money}}/{{scope.row.rule && scope.row.rule.first_weight}}{{localization.weight_unit ? localization.weight_unit : ''}}</span><br>
            <span>{{$t('续重')}}：{{localization.currency_unit ? localization.currency_unit : ''}}{{scope.row.rule && scope.row.rule.next_money}}/{{scope.row.rule && scope.row.rule.next_weight}}{{localization.weight_unit ? localization.weight_unit : ''}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-green optionBtn" @click="recordDetails(scope.row.id, scope.row.name)">{{$t('结算记录')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
import { SearchGroup } from '@/components/searchs'
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
  name: 'selfSettlement',
  components: {
    SearchGroup,
    NlePagination
    // AddBtn
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // this.begin_date && (params.begin_date = this.begin_date)
      // this.end_date && (params.end_date = this.end_date)
      this.$request.commissionsPick(params).then(res => {
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
    // 结算记录
    recordDetails (id, name) {
      this.$router.push({ name: 'recordDetails',
        params: {
          id: id,
          name: name
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
