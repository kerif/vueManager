<template>
  <el-drawer size="85%" :visible.sync="show" :title="$t('个人资料')">
    <div class="dialog-vip-profile" v-if="profile.id !== undefined">
      <el-row :gutter="20">
        <el-col :span="3">
          <br />
          <el-avatar shape="square" :size="100" :src="profile.avatar">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
          <br />
          ID: {{ this.id }}
          <br />
          <b>{{ profile.origin_name }}</b>
        </el-col>
        <el-col :span="21">
          <el-descriptions :title="profile.origin_name" :column="4" border>
            <template slot="title">
              <el-tag v-for="item in profile.tags" style="margin: 0 5px 10px 0" :key="item.id">{{
                item.name
              }}</el-tag>
            </template>
            <template slot="extra">
              <el-button type="primary" size="small" @click="editProfile">修改个人资料</el-button>
            </template>
            <el-descriptions-item label="邮箱">{{ profile.email }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ profile.profile.phone }}</el-descriptions-item>
            <el-descriptions-item label="微信号">{{
              profile.profile !== undefined ? profile.profile.wechat_id : ''
            }}</el-descriptions-item>
            <el-descriptions-item label="会员识别号">{{
              profile.remark_name
            }}</el-descriptions-item>
            <el-descriptions-item label="用户组">{{
              profile.user_group !== undefined ? profile.user_group.name_cn : ''
            }}</el-descriptions-item>
            <el-descriptions-item label="余额"
              ><span style="color: red; font-size: 18px"> {{ profile.balance }} </span>
            </el-descriptions-item>
            <el-descriptions-item label="消费总额"
              ><span style="color: blue; font-size: 18px">
                {{ profile.consume_amount }}</span
              ></el-descriptions-item
            >
            <el-descriptions-item label="积分">{{ profile.point }}</el-descriptions-item>
            <el-descriptions-item label="成长值">{{ profile.growth_value }}</el-descriptions-item>
            <el-descriptions-item label="邀请人">{{ profile.invitor }}</el-descriptions-item>
            <el-descriptions-item label="国家/地区">{{
              profile.profile.country_name
            }}</el-descriptions-item>
            <el-descriptions-item label="城市">{{ profile.profile.city }}</el-descriptions-item>
            <el-descriptions-item label="街道">{{ profile.profile.street }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
      <div class="btn-group">
        <el-button-group>
          <el-button type="primary" plain @click="onUpdateGroup">修改用户组</el-button>
          <el-button type="primary" plain @click="vipMerge">客户合并</el-button>
          <el-button type="primary" plain @click="changePassword">修改密码</el-button>
        </el-button-group>
      </div>
      <el-tabs v-model="activeTabName">
        <el-tab-pane :label="`包裹列表(${packageParams.total})`" name="parcel">
          <el-table :data="packageList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="express_num" label="快递单号" width="180"> </el-table-column>
            <el-table-column prop="status_name" label="状态" width="180"> </el-table-column>
            <el-table-column prop="package_name" label="物品名称"> </el-table-column>
            <el-table-column prop="package_value" label="物品价值"> </el-table-column>
            <el-table-column label="物品属性">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in scope.row.props"
                  style="margin: 0 5px 10px 0"
                  :key="item.id"
                  >{{ item.name }}</el-tag
                >
              </template></el-table-column
            >
            <el-table-column prop="created_at" label="提交时间"> </el-table-column>
          </el-table>
          <tx-pagination :pageParams="packageParams"></tx-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`订单列表(${orderParams.total})`" name="order">
          <el-table :data="orderList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="order_sn" label="订单号" width="180"> </el-table-column>
            <el-table-column prop="express_line" label="线路名称">
              <template slot-scope="scope">{{ scope.row.express_line.name }}</template>
            </el-table-column>
            <el-table-column label="收件人">
              <template slot-scope="scope">{{ scope.row.address.receiver_name }}</template>
            </el-table-column>
            <el-table-column label="收件国家/地区"
              ><template slot-scope="scope">{{ scope.row.address.country_name }}</template>
            </el-table-column>
            <el-table-column prop="payment_weight" label="实际重量"> </el-table-column>
            <el-table-column prop="payment_fee" label="实际费用"> </el-table-column>
            <el-table-column prop="created_at" label="提交时间"> </el-table-column>
          </el-table>
          <tx-pagination :pageParams="orderParams"></tx-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`收件列表(${addresseList.length})`" name="receiver">
          <el-table :data="addresseList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="receiver_name" label="收件人" width="180"> </el-table-column>
            <el-table-column label="联系电话">
              <template slot-scope="scope">{{ scope.row.timezone }} {{ scope.row.phone }}</template>
            </el-table-column>
            <el-table-column prop="address" label="收件国家/地区">
              <template slot-scope="scope">{{ scope.row.country.name }} </template>
            </el-table-column>
            <el-table-column prop="address" label="省/州">
              <template slot-scope="scope"
                >{{ scope.row.area !== null ? scope.row.area.name : '' }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="区域">
              <template slot-scope="scope"
                >{{ scope.row.sub_area !== null ? scope.row.sub_area.name : '' }}
              </template>
            </el-table-column>
            <el-table-column prop="city" label="城市"> </el-table-column>
            <el-table-column prop="street" label="街道"> </el-table-column>
            <el-table-column prop="door_no" label="门牌号"> </el-table-column>
            <el-table-column prop="postcode" label="邮编"> </el-table-column>
            <el-table-column prop="created_at" label="创建时间"> </el-table-column>
          </el-table>
          <!-- <tx-pagination :pageParams="addresseParams"></tx-pagination> -->
        </el-tab-pane>
        <el-tab-pane :label="`成交流水记录(${transactionParams.total})`" name="paylogs">
          <el-table :data="transactionList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="payment_type" label="类型" width="180"> </el-table-column>
            <el-table-column prop="payment_type_name" label="支付类型"> </el-table-column>
            <el-table-column prop="order_amount" label="应付金额"> </el-table-column>
            <el-table-column prop="coupon_amount" label="抵用券金额"> </el-table-column>
            <el-table-column prop="point_amount" label="积分抵扣金额"> </el-table-column>
            <el-table-column prop="pay_amount" label="支付金额"> </el-table-column>
            <el-table-column prop="order_sn" label="相关订单"> </el-table-column>
            <el-table-column prop="serial_no" label="流水号"> </el-table-column>
          </el-table>
          <tx-pagination :pageParams="transactionParams"></tx-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`成长值记录(${growthParams.total})`" name="growthlog">
          <el-table :data="growthList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column
              prop="income_outlay_rule_name"
              label="类型"
              width="180"
            ></el-table-column>
            <el-table-column prop="amount" label="金额"> </el-table-column>
            <el-table-column prop="type_name" label="明细"> </el-table-column>
            <el-table-column prop="income_outlay_rule_name" label="收支规则"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column prop="order_sn" label="相关单号"> </el-table-column>
            <el-table-column prop="serial_no" label="流水号"> </el-table-column>
            <el-table-column prop="created_at" label="创建时间"> </el-table-column>
          </el-table>
          <tx-pagination :pageParams="growthParams"></tx-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`积分记录(${pointParams.total})`" name="pointlog">
          <el-table :data="pointList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="type_name" label="类型" width="180"> </el-table-column>
            <el-table-column prop="name" label="金额"> </el-table-column>
            <el-table-column prop="type_name" label="明细"> </el-table-column>
            <el-table-column prop="income_outlay_rule_name" label="收支规则"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column prop="order_sn" label="相关单号"> </el-table-column>
            <el-table-column prop="serial_no" label="流水号"> </el-table-column>
            <el-table-column prop="created_at" label="创建时间"> </el-table-column>
          </el-table>
          <tx-pagination :pageParams="pointParams"></tx-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`券包列表(${couponParams.total})`" name="coupou">
          <el-button class="btn-light-red" @click="onSetCouponInvalid">{{
            $t('批量作废')
          }}</el-button>
          <el-table
            :data="couponList"
            border
            style="width: 100%"
            @selection-change="handleCouponSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="name" :label="$t('券名称')"> </el-table-column>
            <el-table-column prop="code" :label="$t('券码')"> </el-table-column>
            <el-table-column prop="amount" :label="$t('金额')"> </el-table-column>
            <el-table-column prop="status" :label="$t('状态')"> </el-table-column>
            <el-table-column prop="created_at" :label="$t('发放时间')"> </el-table-column>
            <el-table-column prop="used_at" :label="$t('使用时间')"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 作废 -->
                <el-button
                  class="btn-light-red"
                  v-if="scope.row.usable === true"
                  @click="onDeleteCoupon(scope.row.id)"
                  >{{ $t('作废') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <tx-pagination :pageParams="couponParams"></tx-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`邀请记录(${invitationParams.total})`" name="invite">
          <el-button type="primary" plain @click="transferAgent">转为代理</el-button>
          <div class="agent-text">
            {{ $t('提示: 成为代理之前邀请的客户一键转为代理客户') }}
          </div>
          <el-table :data="invitationList" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <!-- 客户ID -->
            <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
            <!-- 客户昵称 -->
            <el-table-column prop="name" :label="$t('客户昵称')"> </el-table-column>
            <el-table-column prop="created_at" :label="$t('注册时间')"> </el-table-column>
            <!-- 最后登录时间 -->
            <el-table-column prop="last_login_at" :label="$t('最后登录时间')"> </el-table-column>
            <el-table-column prop="is_agent_invite" :label="$t('是否代理邀请')">
              <template slot-scope="scope">
                <span v-if="scope.row.is_agent_invite === 0">{{ $t('否') }}</span>
                <span v-else>{{ $t('是') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <tx-pagination :pageParams="invitationParams"></tx-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>
<script>
import TxPagination from '@/components/pagination'
import dialog from '@/components/dialog'
export default {
  components: {
    TxPagination
  },
  data() {
    return {
      id: 0,
      multipleCouponSelection: [],
      activeTabName: 'parcel',
      profile: {},
      couponList: [],
      invitationList: [],
      addresseList: [],
      packageList: [],
      orderList: [],
      growthList: [],
      transactionList: [],
      pointList: [],
      packageParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handlePackageCurrentChange,
        handleSizeChange: this.handlePackageSizeChange
      },
      orderParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handleOrderCurrentChange,
        handleSizeChange: this.handleOrderSizeChange
      },
      growthParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handleGrowthCurrentChange,
        handleSizeChange: this.handleGrowthSizeChange
      },
      transactionParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handleTransactionCurrentChange,
        handleSizeChange: this.handleTransactionSizeChange
      },
      pointParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handlePointCurrentChange,
        handleSizeChange: this.handlePointSizeChange
      },
      couponParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handleCouponCurrentChange,
        handleSizeChange: this.handleCouponSizeChange
      },
      invitationParams: {
        page: 1,
        total: 0,
        size: 10,
        handleCurrentChange: this.handleInvitationCurrentChange,
        handleSizeChange: this.handleInvitationSizeChange
      },
      addresseParams: {
        page: 1,
        total: 0,
        size: 10
      }
    }
  },
  methods: {
    transferAgent() {
      this.$confirm(this.$t('确定要转为代理客户'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.agentCustomer(this.id).then(res => {
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
      })
    },
    editProfile() {
      dialog({ type: 'editInfo', id: this.id, name: this.profile.origin_name }, () => {
        this.getProfile()
      })
    },
    handleOrderCurrentChange(pageId) {
      this.orderParams.page = pageId
      this.getOrderList()
    },
    // 分页size
    handleOrderSizeChange(pageSize) {
      this.orderParams.page = 1
      this.orderParams.size = pageSize
      this.getOrderList()
    },
    handleGrowthCurrentChange(pageId) {
      this.growthParams.page = pageId
      this.getGrowthList()
    },
    // 分页size
    handleGrowthSizeChange(pageSize) {
      this.growthParams.page = 1
      this.growthParams.size = pageSize
      this.getGrowthList()
    },
    handleTransactionCurrentChange(pageId) {
      this.transactionParams.page = pageId
      this.getTransactionList()
    },
    // 分页size
    handleTransactionSizeChange(pageSize) {
      this.transactionParams.page = 1
      this.transactionParams.size = pageSize
      this.getTransactionList()
    },
    handlePointCurrentChange(pageId) {
      this.pointParams.page = pageId
      this.getPointList()
    },
    // 分页size
    handlePointSizeChange(pageSize) {
      this.pointParams.page = 1
      this.pointParams.size = pageSize
      this.getPointList()
    },
    handleCouponCurrentChange(pageId) {
      this.packageParams.page = pageId
      this.getCouponList()
    },
    // 分页size
    handleCouponSizeChange(pageSize) {
      this.packageParams.page = 1
      this.packageParams.size = pageSize
      this.getCouponList()
    },
    handleInvitationCurrentChange(pageId) {
      this.packageParams.page = pageId
      this.getInvitationsList()
    },
    // 分页size
    handleInvitationSizeChange(pageSize) {
      this.packageParams.page = 1
      this.packageParams.size = pageSize
      this.getInvitationsList()
    },
    handlePackageCurrentChange(pageId) {
      this.packageParams.page = pageId
      this.getPackageList()
    },
    // 分页size
    handlePackageSizeChange(pageSize) {
      this.packageParams.page = 1
      this.packageParams.size = pageSize
      this.getPackageList()
    },
    init() {
      this.show = true
      this.activeTabName = 'parcel'
      this.getProfile()
      this.couponParams.page = 1
      this.getCouponList()
      this.invitationParams.page = 1
      this.getInvitationsList()
      this.orderParams.page = 1
      this.getOrderList()
      this.packageParams.page = 1
      this.getPackageList()
      this.pointParams.page = 1
      this.getPointList()
      this.transactionParams.page = 1
      this.getTransactionList()
      this.growthParams.page = 1
      this.getGrowthList()
    },
    getProfile() {
      this.$request.checkVipInfo(this.id).then(res => {
        this.profile = res.data
        this.addresseList = res.data.addresses
      })
    },
    getCouponList() {
      this.$request
        .voucherUser(this.id, {
          page: this.couponParams.page,
          size: this.couponParams.size
        })
        .then(res => {
          this.couponList = res.data
          this.couponParams = {
            ...this.couponParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    getInvitationsList() {
      this.$request
        .invitations(this.id, {
          page: this.invitationParams.page,
          size: this.invitationParams.size
        })
        .then(res => {
          this.invitationList = res.data
          this.invitationParams = {
            ...this.invitationParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    getPackageList() {
      this.$request
        .packageList(this.id, {
          page: this.packageParams.page,
          size: this.packageParams.size
        })
        .then(res => {
          this.packageList = res.data
          this.packageParams = {
            ...this.packageParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    getOrderList() {
      this.$request
        .orderList(this.id, {
          page: this.orderParams.page,
          size: this.orderParams.size
        })
        .then(res => {
          this.orderList = res.data
          this.orderParams = {
            ...this.orderParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    getPointList() {
      this.$request
        .pointList(this.id, {
          page: this.pointParams.page,
          size: this.pointParams.size
        })
        .then(res => {
          this.pointList = res.data
          this.pointParams = {
            ...this.pointParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    getTransactionList() {
      this.$request
        .transactionList(this.id, {
          page: this.transactionParams.page,
          size: this.transactionParams.size
        })
        .then(res => {
          this.transactionList = res.data
          this.transactionParams = {
            ...this.transactionParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    getGrowthList() {
      this.$request
        .growthList(this.id, {
          page: this.growthParams.page,
          size: this.growthParams.size
        })
        .then(res => {
          this.growthList = res.data
          this.growthParams = {
            ...this.growthParams,
            page: res.meta.current_page,
            total: res.meta.total
          }
        })
    },
    // 修改客户组
    onUpdateGroup() {
      dialog({ type: 'vipgroup', id: this.id }, () => {})
    },
    // 合并
    vipMerge() {
      dialog({ type: 'vipMerge', id: this.id }, () => {})
    },
    // 作废优惠券
    onDeleteCoupon(id) {
      this.$confirm(this.$t('确定要作废优惠券吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCoupons(this.id, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCouponList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    handleCouponSelectionChange(val) {
      this.multipleCouponSelection = val
    },
    onSetCouponInvalid() {
      const ids = []
      for (let index = 0; index < this.multipleCouponSelection.length; index++) {
        ids.push(this.multipleCouponSelection[index].id)
      }
      if (!ids.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('确定要批量作废'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        let params = {}
        params.ids = ids
        this.$request.batchInvalidCard(params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCouponList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 修改密码
    changePassword() {
      dialog({ type: 'vipChangePassword', id: this.id }, () => {})
    }
  }
}
</script>
<style lang="scss">
.dialog-vip-profile {
  padding: 20px;
  .btn-group {
    padding-top: 20px;
    text-align: right;
  }
}
</style>
