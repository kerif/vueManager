<template>
  <div class="way-list-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <!-- 注册统计 -->
      <el-tab-pane label="注册统计" name="1"></el-tab-pane>
      <!-- 订单统计 -->
      <el-tab-pane label="订单统计" name="2"></el-tab-pane>
      <!-- 财务统计 -->
      <el-tab-pane label="财务统计" name="3"></el-tab-pane>
      <!-- 邀请排行榜 -->
      <el-tab-pane label="邀请排行榜" name="4"></el-tab-pane>
      <!-- 下单排行榜 -->
      <el-tab-pane label="下单排行榜" name="5"></el-tab-pane>
  </el-tabs>
  <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
      <div class="changeTime">
        <!-- 创建 -->
          <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="提交开始日期"
          end-placeholder="提交结束日期">
        </el-date-picker>
      </div>
    </search-group>
    <el-table class="data-list" border stripe
      v-if="oderData.length"
      v-loading="tableLoading"
      :data="oderData">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 统计日期 -->
      <el-table-column label="统计日期" v-if="activeName === '1' || activeName === '2' || activeName === '3'" prop="days"></el-table-column>
      <!-- 注册用户 -->
      <el-table-column label="注册用户" v-if="activeName === '1'" prop="count"></el-table-column>
      <!-- 邮箱激活 -->
      <el-table-column label="邮箱激活" v-if="activeName === '1'" prop="email_count"></el-table-column>
      <!-- 手机号激活 -->
      <el-table-column label="手机号激活" v-if="activeName === '1'" prop="phone_count"></el-table-column>
      <!-- 预报量 -->
      <el-table-column label="预报量" v-if="activeName === '1'" prop="package_count"></el-table-column>
      <!-- 转化率% -->
      <el-table-column label="转化率%" v-if="activeName === '1'" prop="conversion_ratio"></el-table-column>
      <!-- 包裹预报 -->
      <el-table-column label="包裹预报" prop="package_created" v-if="activeName === '2'"></el-table-column>
      <!-- 包裹入库 -->
      <el-table-column label="包裹入库" prop="package_in_storage" v-if="activeName === '2'"></el-table-column>
      <!-- 订单提交 -->
      <!-- <el-table-column label="订单提交" prop="user_id" v-if="activeName === '2'"></el-table-column> -->
      <!-- 订单打包 -->
      <el-table-column label="订单打包" prop="order_packed" v-if="activeName === '2'"></el-table-column>
      <!-- 订单支付 -->
      <el-table-column label="订单支付" prop="order_paid" v-if="activeName === '2'"></el-table-column>
      <!-- 支付金额 -->
      <el-table-column label="支付金额" prop="order_pay_amount" v-if="activeName === '2'"></el-table-column>
      <!-- 订单发货 -->
      <el-table-column label="订单发货" prop="order_shipped" v-if="activeName === '2'"></el-table-column>
      <!-- 转账支付 -->
      <el-table-column label="转账支付" v-if="activeName === '3'" prop="transfer_amount"></el-table-column>
      <!-- 微信支付 -->
      <el-table-column label="微信支付" v-if="activeName === '3'" prop="wechat_amount"></el-table-column>
      <!-- 剩余支付 -->
      <el-table-column label="余额支付" v-if="activeName === '3'" prop="balance_amount"></el-table-column>
      <!-- 佣金金额提现 -->
      <el-table-column label="佣金金额提现" v-if="activeName === '3'" prop="agent_balance_amount"></el-table-column>
      <!-- 佣金第三方提现 -->
      <el-table-column label="佣金第三方提现" v-if="activeName === '3'" prop="agent_third_amount"></el-table-column>
      <!-- 客户昵称 -->
      <el-table-column label="客户昵称" prop="name" v-if="activeName === '4' || activeName === '5'"></el-table-column>
      <!-- 客户组 -->
      <el-table-column label="客户组" v-if="activeName === '4' || activeName === '5'" prop="user_group.name">
        <!-- <template slot-scope="scope"> -->
          <!-- <span v-for="item in scope.row.user_group" :key="item.id">
            {{item.name}}
          </span>
        </template>
        <span>{{user_group.name}}</span> -->
      </el-table-column>
      <!-- 成交数量 -->
      <el-table-column label="成交数量" v-if="activeName === '5'" prop="orders_count"></el-table-column>
      <!-- 邀请人数 -->
      <el-table-column label="邀请人数" v-if="activeName === '4'" prop="invite_user_count"></el-table-column>
      <!-- 注册日期 -->
      <el-table-column label="注册日期" v-if="activeName === '4' || activeName === '5'" prop="created_at"></el-table-column>
      <!-- 最后登录日期 -->
      <el-table-column label="最后登录日期" v-if="activeName === '4' || activeName === '5'" prop="last_login_at"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" v-if="activeName === '4'">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple" @click="invite(scope.row.id)">邀请记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="noDate" v-else>暂无数据</div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  name: 'reportList',
  data () {
    return {
      timeList: [],
      begin_date: '',
      end_date: '',
      activeName: '1',
      oderData: [],
      localization: {},
      status: 1,
      tableLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      // this.tableLoading = true
      // this.oderData = []
      // let params = {
      //   page: this.page_params.page,
      //   size: this.page_params.size,
      //   agent: this.agent_name,
      //   status: this.status
      // }
      // this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // // 提交时间
      // this.begin_date && (params.begin_date = this.begin_date)
      // this.end_date && (params.end_date = this.end_date)
      // this.$request.getOrder(params).then(res => {
      //   this.tableLoading = false
      //   if (res.ret) {
      //     this.oderData = res.data
      //     this.localization = res.localization
      //     this.page_params.page = res.meta.current_page
      //     this.page_params.total = res.meta.total
      //   } else {
      //     this.$notify({
      //       title: '操作失败',
      //       message: res.msg,
      //       type: 'warning'
      //     })
      //   }
      // })
      if (this.activeName === '1') {
        this.getRegister()
      } else if (this.activeName === '2') {
        this.getOrderData()
      } else if (this.activeName === '3') {
        this.getTransactionData()
      } else if (this.activeName === '4') {
        this.getStatistics()
      } else if (this.activeName === '5') {
        this.getUserOrder()
      }
    },
    // 创建时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 获取邀请排行榜数据
    getStatistics () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
        // agent: this.agent_name,
        // status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getStatistics(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    // 注册统计列表
    getRegister () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
        // agent: this.agent_name,
        // status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getUserRegister(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    // 订单统计
    getOrderData () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
        // agent: this.agent_name,
        // status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getOrderData(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    // 财务统计
    getTransactionData () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
        // agent: this.agent_name,
        // status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getTransactionData(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    // 下单排行榜
    getUserOrder () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
        // agent: this.agent_name,
        // status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getUserOrder(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    // Tab Change
    onTabChange (tab) {
      this.status = Number(tab.name)
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.timeList = []
      this.begin_date = ''
      this.end_date = ''
      this.getList()
    },
    // 邀请记录
    invite (id) {
      dialog({ type: 'reportInvite',
        id
      })
    }
  }
}
</script>

<style lang="scss">
.way-list-container {
  .tabLength {
    width: 520px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .dialogSty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseOrder {
    cursor: pointer;
    color:blue;
    text-decoration: underline;
  }
  .changeTime {
    display: inline-block;
    // width: 70%;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
}
</style>
