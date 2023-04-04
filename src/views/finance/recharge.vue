<template>
  <div class="recharge-list-container">
    <div class="order-list-search" v-show="hasFilterCondition">
      <el-date-picker
        size="mini"
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <!-- 充值方式 -->
      <el-select size="mini" v-model="type" clearable class="changeVou" :placeholder="$t('请选择')">
        <el-option v-for="item in voucherChange" :key="item.id" :value="item.id" :label="item.name">
        </el-option>
      </el-select>
      <!-- 状态 -->
      <div class="chooseStatus">
        <el-select v-model="status" size="mini" clearable :placeholder="$t('请选择')">
          <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <!-- 充值金额 -->
      <div class="chooseStatus">
        <el-input v-model="amount" size="mini" placeholder="请输入金额"></el-input>
      </div>
      <div class="submit">
        <el-button type="primary" plain size="small" @click="submitForm">{{
          $t('搜索')
        }}</el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="searchGroup">
      <el-button class="upload-sty" size="small" type="success" plain @click="uploadList">{{
        $t('导出清单')
      }}</el-button>
      <div class="search-l">
        <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
        <add-btn @click.native="addVip">{{ $t('添加') }}</add-btn>
      </div>
    </div>
    <!--     <div class="select-box">
    </div> -->
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="rechargeList"
        stripe
        border
        class="data-list"
        v-loading="tableLoading"
        ref="table"
        height="calc(100vh - 270px)"
      >
        <el-table-column type="index" :index="1"></el-table-column>
        <!-- 客户ID -->
        <el-table-column :label="$t('客户ID')">
          <template slot-scope="scope">
            <span v-if="$store.state.uid === 1">{{ scope.row.user.uid }}</span>
            <span v-if="$store.state.uid === 1">(</span>{{ scope.row.user.id
            }}<span v-if="$store.state.uid === 1">)</span>
          </template>
        </el-table-column>
        <!-- 用户名 -->
        <el-table-column :label="$t('用户名')" prop="user.name"></el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{ $t('待审核') }}</span>
            <span v-if="scope.row.status === 1">{{ $t('审核通过') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('审核拒绝') }}</span>
          </template>
        </el-table-column>
        <!-- 充值方式 -->
        <el-table-column :label="$t('充值方式')" prop="payment_type_name"> </el-table-column>
        <!-- 支付方式 -->
        <!-- <el-table-column label="支付方式">
      </el-table-column> -->
        <!-- 支付金额 -->
        <el-table-column
          :label="$t('支付金额') + this.localization.currency_unit"
          prop="amount"
        ></el-table-column>
        <!-- 确认金额 -->
        <el-table-column
          :label="$t('确认金额') + this.localization.currency_unit"
          prop="confirm_amount"
        ></el-table-column>
        <!-- 第三方流水号 -->
        <el-table-column :label="$t('流水号')" prop="serial_no" width="205"></el-table-column>
        <!-- 支付时间 -->
        <el-table-column :label="$t('支付时间')" prop="created_at" width="155"></el-table-column>
        <!-- 审核时间 -->
        <el-table-column :label="$t('审核时间')" prop="updated_at" width="155"></el-table-column>
        <!-- 处理人 -->
        <el-table-column :label="$t('处理人')" prop="operator" width="155"></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              class="btn-green optionBtn"
              @click="inviteWithdrawal(scope.row.id)"
              >{{ $t('审核') }}</el-button
            >
            <el-button
              v-else
              class="btn-deep-purple optionBtn"
              @click="withdrawalDetail(scope.row.id)"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex-box">
      <div class="red-num">{{ $t('金额') }}:{{ localization.currency_unit }}{{ sumAmount }}</div>
      <div style="flex: 1">
        <nle-pagination
          style="margin-top: 5px"
          :pageParams="page_params"
          :notNeedInitQuery="false"
        ></nle-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
export default {
  data() {
    return {
      rechargeList: [],
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: null,
      end_date: null,
      type: '',
      amount: '',
      voucherChange: [],
      status: '',
      hasFilterCondition: true,
      sumAmount: '',
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
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  created() {
    this.getList()
    this.getTypes()
    this.getAmount()
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
  },
  activated() {
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        payment_type: this.type,
        status: this.status,
        confirm_amount: this.amount
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
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 导出
    uploadList() {
      let params = {
        payment_type: this.type,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 已入库
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.uploadRecharge(params).then(res => {
        if (res.ret) {
          // this.urlExcel = res.data.url
          // window.open(this.urlExcel)
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
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
    withdrawalDetail(id) {
      this.$router.push({
        name: 'rechargeDetails',
        params: {
          id: id
        }
      })
    },
    // 审核
    inviteWithdrawal(id) {
      this.$router.push({
        name: 'rechargeReview',
        params: {
          id: id,
          state: 'review'
        }
      })
    },
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      // this.getList()
    },
    // 状态筛选
    onShipStatus() {
      this.page_params.handleQueryChange('status', this.status)
      // this.getList()
    },
    // 跳转到审核
    details(id, orderId, paymentType) {
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
    onVocherTypeChange() {
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    },
    // 获取下拉框
    getTypes() {
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
    addVip() {
      dialog({ type: 'rechargeAdd' }, () => {
        this.getList()
      })
    },
    getAmount() {
      this.$request
        .getdataSummary({
          page: this.page_params.page,
          size: this.page_params.size,
          payment_type: this.type,
          status: this.status,
          confirm_amount: this.amount,
          keyword: this.page_params.keyword,
          begin_date: this.begin_date,
          end_date: this.end_date
        })
        .then(res => {
          this.sumAmount = res.data.amount
        })
    },
    goSearch() {
      this.getList()
      this.getAmount()
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.type = ''
      this.status = ''
      this.amount = ''
    },
    // 提交表单
    submitForm() {
      this.onTime(this.timeList)
      this.onVocherTypeChange()
      this.onShipStatus()
      this.getAmount()
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
  .select-box {
    overflow: hidden;
  }
  .upload-sty {
    float: right;
    margin-right: 10px;
  }
  .searchGroup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-l {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .filter {
        margin: 0 10px;
      }
    }
  }
  .order-list-search {
    font-size: 14px;
    background: #fff;
    margin: 10px 0;
    padding: 10px;
    overflow: hidden;
    .changeTime {
      display: inline-block;
      margin-right: 20px;
      .timeStyle {
        margin-right: 10px;
        width: 276px !important;
      }
      .shipments {
        display: inline-block;
      }
    }
    .chooseStatus {
      // width: 150px;
      display: inline-block;
    }
    .submit {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 10px;
    }
  }
  .flex-box {
    display: flex;
    align-items: center;
    .red-num {
      color: red;
      font-weight: bold;
    }
    .flex-item {
      flex: 1;
    }
  }
}
</style>
