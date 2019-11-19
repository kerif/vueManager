<template>
  <div class="way-list-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch"></search-group>
      <el-tabs v-model="activeName" class="tabLength">
        <!-- 待处理 -->
        <el-tab-pane label="待处理" name="1"></el-tab-pane>
        <!-- 待支付 -->
        <el-tab-pane label="待支付" name="2"></el-tab-pane>
        <!-- 待发货 -->
        <el-tab-pane label="待发货" name="3"></el-tab-pane>
        <!-- 已发货 -->
        <el-tab-pane label="已发货" name="4"></el-tab-pane>
        <!-- 已签收 -->
        <el-tab-pane label="已签收" name="5"></el-tab-pane>
    </el-tabs>
    <div class="chooseStatus">
      <el-select v-model="agent_name" @change="getList" clearable>
        <el-option
          v-for="item in agentData"
          :key="item.id"
          :value="item.user_id"
          :label="item.agent_name">
        </el-option>
       </el-select>
    </div>
    <el-table class="data-list" border stripe
      v-if="oderData.length"
      v-loading="tableLoading"
      :data="oderData" @selection-change="onSelectChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 转运单号 -->
      <el-table-column label="转运单号" prop="order_sn">
      </el-table-column>
      <!-- 审核状态 -->
      <el-table-column label="审核状态" v-if="activeName === '2'">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.status === 11">待审核</span> -->
          <router-link v-if="scope.row.status === 12"
          class="chooseOrder"
          :to="`/order/review/?id=${scope.row.id}`">
            审核拒绝
          </router-link>
        </template>
      </el-table-column>
      <!-- 物流单号 -->
      <el-table-column label="物流单号" v-if="activeName === '1' || activeName === '2'   || activeName === '4' || activeName === '5'" prop="logistics_sn">
      </el-table-column>
      <!-- 状态为待发货才会出现输入框 -->
      <el-table-column label="物流单号" v-if="activeName === '3'" width="140px">
        <template slot-scope="scope">
          <template v-if="activeName === '3'">
          <el-input v-model="scope.row.logistics_sn" :disabled="scope.row.disabled"></el-input>
          </template>
        </template>
      </el-table-column>
      <!-- 线路名称 -->
      <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
      <!-- 收货人 -->
      <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
      <!-- 收货国家 -->
      <el-table-column label="收货国家" prop="address.country_name"></el-table-column>
      <!-- 包裹数 -->
      <el-table-column label="包裹数" prop="package_count"></el-table-column>
      <!-- 预计重量KG -->
      <el-table-column :label="activeName === '1' ? '预计重量' + this.localization.weight_unit : '实际重量' + this.localization.weight_unit" :prop="activeName === '1' ? 'except_weight' : 'actual_weight'"></el-table-column>
      <!-- 详见产品图 -->
      <el-table-column :label="activeName === '1' ? '预计费用' + this.localization.currency_unit : '实际费用' + this.localization.currency_unit" :prop="activeName === '1' ? 'payment_fee' : 'actual_payment_fee'"></el-table-column>
      <el-table-column :label="'申报价值' + this.localization.currency_unit" prop="declare_value"></el-table-column>
      <!-- 所属代理 -->
      <el-table-column label="所属代理" prop="agent + agent_commission" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.agent}}</span>
          <span>({{scope.row.agent_commission}}%)</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间" prop="updated_at" v-if="activeName === '1' || activeName === '2' || activeName === '3'"></el-table-column>
      <!-- 拣货时间 -->
      <el-table-column label="拣货时间" prop="packed_at" v-if="activeName === '2' || activeName === '3'"></el-table-column>
      <!-- 签收时间 -->
      <el-table-column label="签收时间" prop="updated_at" v-if="activeName === '5'">
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column label="所属发货单" v-if="activeName === '4' || activeName === '3' || activeName === '5'">
        <template slot-scope="scope">
          <span @click="goShip(scope.row.shipment_sn)" class="chooseOrder">{{scope.row.shipment_sn}}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <!-- 详情 -->
          <el-button class="btn-purple detailsBtn" @click="details(scope.row.id, activeName)">详情</el-button>
          <!-- 完成支付 -->
          <!-- <el-button v-show="activeName === '2'" class="btn-orangey-red" @click="finishPay(scope.row.id)">完成支付</el-button> -->
          <!-- 审核 -->
          <el-button v-show="activeName === '2' && scope.row.status === 11" class="btn-dark-green" @click="reviewPackage(scope.row.id)">审核
          </el-button>
          <!-- 打包 -->
          <el-button v-show="activeName === '1'" class="btn-dark-green detailsBtn" @click="packed(scope.row.id,scope.row.order_sn)">打包</el-button>
          <!-- 加入发货单 -->
          <el-button v-show="activeName === '3'" class="btn-deep-blue detailsBtn"
          @click="addInvoice([scope.row.id])">加入发货单</el-button>
          <!-- 添加物流单号 -->
          <el-button size="small" @click="edit(scope.row)" v-if="activeName === '3' && scope.row.disabled" class="btn-deep-purple detailsBtn">添加物流单号</el-button>
          <!-- 移除发货单 -->
          <el-button size="small" class="btn-light-red" v-if="activeName === '3' && scope.row.shipment_sn" @click="removeShip(scope.row.id)">移除发货单
          </el-button>
          <el-button size="small" class="btn-light-red detailsBtn"
           v-show="activeName === '3' && !scope.row.disabled"
           @click="saveLogistics(scope.row)">保存</el-button>
          <el-button size="small" class="btn-dark-green detailsBtn"
          v-show="activeName === '3' && !scope.row.disabled" @click="cancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <!-- 删除 -->
          <!-- <el-button size="small">删除</el-button> -->
          <!-- 加入发货单 -->
          <el-button size="small" v-if="activeName === '3'" @click="addInvoice(selectIDs)">加入发货单</el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>暂无数据</div>
    <nle-pagination :pageParams="page_params"></nle-pagination>
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
  name: 'wallbillList',
  data () {
    return {
      activeName: '1',
      oderData: [],
      localization: {},
      status: 1,
      selectIDs: [],
      agent_name: '',
      agentData: [],
      tableLoading: false
    }
  },
  created () {
    this.getList()
    this.getAgentData()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    if (this.$route.query.order_sn) {
      this.page_params.keyword = this.$route.query.order_sn
      this.activeName = this.$route.query.status.toString()
      this.goSearch()
    }
  },
  methods: {
    getList () {
      console.log(this.agent_name, 'agent_name')
      this.tableLoading = true
      this.oderData = []
      this.$request.getOrder({
        agent: this.agent_name,
        status: this.status,
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          // 待发货列表的物流单号添加
          res.data.forEach(item => {
            item.disabled = true
            item.copySN = item.logistics_sn
          })
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
    // 获得下拉列表
    getAgentData () {
      this.$request.getAgent().then(res => {
        this.agentData = res.data
      })
    },
    // 跳转到审核
    reviewPackage (id) {
      this.$router.push({ name: 'review', query: { id: id, state: 'review' } })
    },
    // 跳转到发货
    goShip (shipmentSn) {
      console.log(shipmentSn, 'shipmentSn')
      this.$router.push({ name: 'shipContainer', query: { shipment_sn: shipmentSn } })
    },
    // 移除发货单
    removeShip (id) {
      this.$request.removeOrders({
        id: [id]
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 打包
    packed (id, orderSN) {
      this.$router.push({ name: 'billPacked', params: { id: id, order_sn: orderSN } })
    },
    // 详情
    details (id, activeName) {
      console.log(activeName, 'activeName')
      this.$router.push({ name: 'billDetails', params: { id: id, activeName: activeName } })
    },
    onSelectChange (selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    // 完成支付
    finishPay (id) {
      this.$request.finishOrder(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 加入发货单
    addInvoice (ids) {
      if (!ids.length) {
        return this.$message.info('请选择商品')
      }
      dialog({ type: 'addInvoice' }, (data) => {
        this.$request.updateShipment(ids, data).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
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
    // 添加物流单号
    edit (row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel (row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加物流单号
    saveLogistics (row) {
      if (!row.logistics_sn) {
        return this.$message.info('请输入物流单号')
      }
      this.$request.updateLogistics([{
        id: row.id,
        sn: row.logistics_sn
      }]).then(res => {
        if (res.ret) {
          this.$notify({
            title: '保存成功',
            message: res.msg,
            type: 'success'
          })
          row.copySN = row.logistics_sn
          row.disabled = true
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  },
  watch: {
    // 监听tab组件参数
    activeName (newValue) {
      switch (newValue) {
        case '1': // 待处理
          this.page_params.page = 1
          this.status = 1
          break
        case '2': // 待支付
          this.page_params.page = 1
          this.status = 2
          break
        case '3': // 待发货
          this.page_params.page = 1
          this.status = 3
          break
        case '4': // 已发货
          this.page_params.page = 1
          this.status = 4
          break
        case '5': // 已签收
          this.page_params.page = 1
          this.status = 5
          break
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.way-list-container {
  .tabLength {
    width: 400px !important;
    display: inline-block;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .noDate {
    text-align: center;
    color: #ccc;
  }
  .chooseStatus {
    float: right;
  }
  .chooseOrder {
    cursor: pointer;
    color:blue;
    text-decoration: underline;
  }
  a {
    // text-decoration:none;
    // color:#333;
  }
}
</style>
