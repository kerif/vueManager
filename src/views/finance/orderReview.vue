<template>
  <div class="order-review-container">
    <el-tabs v-model="activeName" class="tabLength">
      <!-- 支付审核 -->
      <el-tab-pane
        :label="`${$t('支付审核')}(${countList.payment ? countList.payment : 0})`"
        name="0"
      ></el-tab-pane>
      <!-- 退款审核 -->
      <el-tab-pane
        :label="`${$t('退款审核')}(${countList.refund ? countList.refund : 0})`"
        name="1"
      ></el-tab-pane>
    </el-tabs>
    <div class="order-list-search" v-show="hasFilterCondition">
      <div class="changeTime">
        <!-- 发货时间 -->
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
      </div>
      <!-- <div class="import-list">
     <el-button @click="uploadList(status)">{{$t('导出清单')}}</el-button>
    </div> -->
      <!-- 支付方式 -->
      <div class="chooseStatus customer-sty">
        <el-select size="mini" v-model="payment_type" clearable :placeholder="$t('支付方式')">
          <el-option v-for="item in paymentData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <!-- 审核状态 -->
      <div class="chooseStatus customer-sty">
        <el-select size="mini" v-model="status" clearable :placeholder="$t('审核状态')">
          <el-option v-for="item in statusData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="submit">
        <el-button type="primary" plain size="small" @click="submitForm">{{
          $t('搜索')
        }}</el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="searchGroup">
      <el-button class="btn-main" @click="verifyExport">{{ $t('导出清单') }}</el-button>
      <div class="searcg-l">
        <search-group
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="goMatch"
        >
        </search-group>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 275px)">
      <el-table
        v-if="reviewData.length && this.activeName === '0'"
        class="data-list"
        border
        stripe
        ref="reviewTable"
        :data="reviewData"
        height="calc(100vh - 270px)"
        v-loading="tableLoading"
      >
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <!-- 客户ID -->
        <el-table-column :label="$t('客户ID')" width="200">
          <template slot-scope="scope">
            <span v-if="$store.state.uid === 1">{{ scope.row.user.uid }}</span>
            <span
              ><span v-if="$store.state.uid === 1">(</span>{{ scope.row.user_id
              }}<span v-if="$store.state.uid === 1">)</span>---{{ scope.row.user_name }}</span
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('标签')" width="200" prop="user_tags">
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.user_tags"
              style="margin: 0 5px 10px 0"
              :key="item.id"
              type="warning"
              >{{ item.name }}</el-tag
            >
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{ $t('待审核') }}</span>
            <span v-if="scope.row.status === 1">{{ $t('审核通过') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('审核拒绝') }}</span>
          </template>
        </el-table-column>
        <!-- 支付类型 -->
        <el-table-column :label="$t('支付类型')" prop="payment_type_name"> </el-table-column>
        <!-- 关联单号 -->
        <el-table-column :label="$t('关联单号')" prop="order_number" width="155"> </el-table-column>
        <!-- 流水号 -->
        <el-table-column :label="$t('流水号')" prop="serial_no" width="185"> </el-table-column>
        <!-- 应付金额 -->
        <el-table-column
          :label="
            $t('应付金额') + `${localization.currency_unit ? localization.currency_unit : ''}`
          "
        >
          <template slot-scope="scope">
            <span>{{ scope.row.order_amount - scope.row.coupon_amount }}</span>
          </template>
        </el-table-column>
        <!-- 提交时间 -->
        <el-table-column :label="$t('提交时间')" prop="created_at" width="155"> </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="160px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              class="btn-dark-green"
              @click="goReceive(scope.row.id, 'pay')"
              >{{ $t('审核') }}</el-button
            >
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 2"
              class="btn-purple btn-sty"
              @click="goReceive(scope.row.id, 'pay')"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="oderData.length && this.activeName === '1'"
        class="data-list"
        border
        ref="orderTable"
        height="calc(100vh - 270px)"
        stripe
        :data="oderData"
        v-loading="tableLoading"
      >
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <!-- 客户ID -->
        <el-table-column :label="$t('客户ID')" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.user.id }}---{{ scope.row.user.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('标签')" width="200" prop="user_tags">
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.user_tags"
              style="margin: 0 5px 10px 0"
              :key="item.id"
              type="warning"
              >{{ item.name }}</el-tag
            >
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{ $t('待审核') }}</span>
            <span v-if="scope.row.status === 1">{{ $t('审核通过') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('审核拒绝') }}</span>
          </template>
        </el-table-column>
        <!-- 支付类型 -->
        <el-table-column :label="$t('支付类型')" prop="payment_method"> </el-table-column>
        <!-- 关联单号 -->
        <el-table-column :label="$t('关联单号')" prop="order_sn" width="205"> </el-table-column>
        <!-- 流水号 -->
        <el-table-column :label="$t('流水号')" prop="serial_no" width="255"> </el-table-column>
        <!-- 应付金额 -->
        <el-table-column
          :label="
            $t('应付金额') + `${localization.currency_unit ? localization.currency_unit : ''}`
          "
          prop="payment_amount"
        >
        </el-table-column>
        <!-- 提交时间 -->
        <el-table-column :label="$t('提交时间')" prop="created_at" width="155"> </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="160px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              class="btn-dark-green"
              @click="goReceive(scope.row.id, 'refund')"
              >{{ $t('审核') }}</el-button
            >
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 2"
              class="btn-purple btn-sty"
              @click="goReceive(scope.row.id, 'refund')"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="noDate" v-else>{{ $t('暂无数据') }}</div> -->
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
// import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  name: 'orderReview',
  mixins: [pagination],
  data() {
    return {
      activeName: '',
      oderData: [], // 退款数据
      reviewData: [], // 审核数据
      tableLoading: false,
      localization: {},
      storageList: [],
      timeList: [],
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      countData: {},
      options: [],
      transferId: '',
      form: {},
      paymentData: [],
      payment_type: '',
      status: '',
      hasFilterCondition: false,
      countList: {},
      statusData: [
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
  methods: {
    // 获取自提点统计数据
    getCounts() {
      this.$request
        .stationsCounts({
          keyword: this.page_params.keyword
        })
        .then(res => {
          if (res.ret) {
            this.countData = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    getFinanceCount() {
      this.$request.financeCount().then(res => {
        console.log(res)
        this.countList = res.data
        let data = JSON.stringify(res.data)
        this.$store.commit('changeRefund', res.data)
        localStorage.setItem('counts', data)
      })
    },
    goMatch() {
      this.page_params.page = 1
      this.page_params.size = 10
      this.handleQueryChange('page', this.page_params.page)
      this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList()
      this.getFinanceCount()
    },
    getList() {
      this.tableLoading = true
      this.reviewData = []
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        payment_type: this.payment_type,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      if (this.activeName === '0') {
        this.$request.financesPayments(params).then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.reviewData = res.data
            console.log(this.reviewData, 'this.reviewData')
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.reviewTable.doLayout()
              })
            }, 300)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else if (this.activeName === '1') {
        this.$request.financesData(params).then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.oderData = res.data
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.orderTable.doLayout()
              })
            }, 300)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    goExpress(orderSn) {
      console.log(orderSn, 'orderSn')
      this.$router.push({ name: 'tracking', query: { orderSn: orderSn } })
    },
    // 确认下载标签
    updateLabel() {
      this.show = false
      console.log(this.labelId, 'this.labelId')
      this.$request.updatePackagePdf(this.labelId).then(res => {
        if (res.ret) {
          window.open(res.data.url)
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
    // 审核
    goReceive(id, state) {
      console.log(state, 'state')
      this.$router.push({
        name: 'reviewFinance',
        params: {
          id: id,
          state: state
        }
      })
    },
    // 导出清单
    uploadList(val) {
      let params = {
        status: val,
        XStationId: this.transferId
        // status: this.status,
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 已入库
      this.shipped_begin && (params.shipped_begin = this.shipped_begin)
      this.shipped_end && (params.shipped_end = this.shipped_end)
      this.$request.stationsUpload(params).then(res => {
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
    // 提交时间
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      // this.getList()
    },
    // 获取支付方式
    getPayment() {
      this.$request.financesPaymentsType().then(res => {
        if (res.ret) {
          this.paymentData = res.data
        }
      })
    },
    // 选择支付方式
    onPaymentChange() {
      this.page_params.handleQueryChange('payment_type', this.payment_type)
      // this.getList()
    },
    // 选择审核方式
    onStatusChange() {
      this.page_params.handleQueryChange('status', this.status)
      this.getList()
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.payment_type = ''
      this.status = ''
    },
    // 提交表单
    submitForm() {
      this.onTime(this.timeList)
      this.onPaymentChange()
      this.onStatusChange()
    },
    verifyExport() {
      let params = {
        status: this.status,
        keyword: this.page_params.keyword,
        payment_type: this.payment_type,
        begin_date: this.begin_date,
        end_date: this.end_date
      }
      if (this.activeName === '0') {
        this.$request.orderPaymentExport(params).then(res => {
          if (res.ret) {
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
      } else if (this.activeName === '1') {
        this.$request.orderRefundExport(params).then(res => {
          if (res.ret) {
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
      }
    }
  },
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    this.getPayment()
    this.getFinanceCount()
  },
  activated() {
    this.getList()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  watch: {
    // 监听tab组件参数
    activeName(newValue) {
      switch (newValue) {
        case '0': // 全部
          this.page_params.page = 1
          this.status = ''
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          // this.storageList = []
          this.getList()
          break
        case '1': // 未入库
          this.page_params.page = 1
          this.status = ''
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          // this.storageList = []
          this.getList()
          break
      }
      // this.getList()
    }
  }
}
</script>

<style lang="scss">
.order-review-container {
  padding: 10px 15px;
  background-color: #fff ;
  .tabLength {
    width: 450px !important;
    display: inline-block;
  }
  .agentRight {
    // display: inline-block;
    float: right;
  }
  .changeTime {
    display: inline-block;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .chooseOrder {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .operating-btn {
    margin-bottom: 5px;
  }
  .dialogSty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
  .import-list {
    display: inline-block;
    margin-left: 10px;
  }
  .excel-date {
    margin-top: 20px;
  }
  .input-sty {
    width: 30%;
  }
  .warning-sty {
    color: red;
  }
  .package-top {
    padding: 20px;
    // border: 1px solid black;
    background-color: #fff;
    margin-bottom: 30px;
  }
  .container-center {
    margin-bottom: 20px;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
  .top-left {
    margin-bottom: 20px;
  }
  .location-sty {
    margin-left: 20px;
  }
  .middle-left {
    background-color: #fff;
    line-height: 60px;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
  }
  .package-middle {
    padding-left: 40px;
    margin-bottom: 20px;
  }
  .auto-sty {
    display: inline-block;
    margin-right: 20px;
  }
  .customer-sty {
    margin-right: 10px;
  }
  .searchGroup {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .searcg-l {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .filter {
        margin-left: 10px;
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
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 10px;
    }
  }
}
</style>
