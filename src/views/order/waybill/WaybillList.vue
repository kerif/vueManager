<template>
  <div class="way-list-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <!-- 待处理 -->
      <el-tab-pane :label="'待处理' + '(' + 0 + ')'" name="1" v-if="!this.countData.pending"></el-tab-pane>
      <el-tab-pane v-else :label="'待处理' + '(' + this.countData.pending + ')'" name="1"></el-tab-pane>
      <!-- 待支付 -->
      <el-tab-pane :label="'待支付' + '(' + 0 + ')'" name="2" v-if="!this.countData.paid"></el-tab-pane>
      <el-tab-pane v-else :label="'待支付' + '(' + this.countData.paid + ')'" name="2"></el-tab-pane>
      <!-- 待发货 -->
      <el-tab-pane :label="'待发货' + '(' + 0 + ')'" name="3" v-if="!this.countData.delivered"></el-tab-pane>
      <el-tab-pane v-else :label="'待发货' + '(' + this.countData.delivered
+ ')'" name="3"></el-tab-pane>
      <!-- 已发货 -->
      <el-tab-pane :label="'已发货' + '(' + 0 + ')'" name="4" v-if="!this.countData.shipped"></el-tab-pane>
      <el-tab-pane v-else :label="'已发货' + '(' + this.countData.shipped
+ ')'" name="4"></el-tab-pane>
      <!-- 已签收 -->
      <el-tab-pane :label="'已签收' + '(' + 0 + ')'" name="5" v-if="!this.countData.received"></el-tab-pane>
      <el-tab-pane v-else :label="'已签收' + '(' + this.countData.received
+ ')'" name="5"></el-tab-pane>
  </el-tabs>
  <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
      <!-- <el-col :span="13"> -->
        <div class="changeTime">
          <!-- 创建 -->
            <el-date-picker
            v-if="activeName === '1' || activeName === '2'|| activeName === '3'
            || activeName === '4'"
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
          <!-- 拣货 -->
            <el-date-picker
            v-if="activeName === '2' || activeName === '3'"
            class="timeStyle"
            v-model="pickingList"
            type="daterange"
            @change="onPick"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="拣货开始日期"
            end-placeholder="拣货结束日期">
          </el-date-picker>
          <!-- 签收 -->
            <el-date-picker
            v-if="activeName === '5'"
            v-model="signList"
            type="daterange"
            @change="onSign"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="签收开始日期"
            end-placeholder="签收结束日期">
          </el-date-picker>
        </div>
      <!-- </el-col> -->
      <!-- <el-col :span="4"> -->
        <div class="chooseStatus">
          <el-select v-model="agent_name" @change="onAgentChange" clearable>
            <el-option
              v-for="item in agentData"
              :key="item.id"
              :value="item.user_id"
              :label="item.agent_name">
            </el-option>
          </el-select>
        </div>
      <!-- </el-col> -->
    </search-group>
    <el-table class="data-list" border stripe
      v-if="oderData.length"
      v-loading="tableLoading"
      :data="oderData" @selection-change="onSelectChange">
      <el-table-column type="selection" width="55" align="center"
      v-if="activeName === '3'"></el-table-column>
      <el-table-column v-else type="index" width="50"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 订单号 -->
      <el-table-column label="订单号" prop="order_sn">
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
      <!-- 转运快递单号 -->
      <el-table-column label="转运快递单号" v-if="activeName === '2'|| activeName === '3' ||activeName === '4' || activeName === '5'" prop="logistics_sn">
      </el-table-column>
        <!-- 转运快递公司 -->
        <el-table-column label="转运快递公司" v-if="activeName === '3'|| activeName === '4' || activeName === '5'" prop="logistics_company"></el-table-column>
      <!-- 状态为待发货才会出现输入框 -->
      <!-- <el-table-column label="转运快递单号" v-if="activeName === '3'" width="140px">
        <template slot-scope="scope">
          <template v-if="activeName === '3'">
          <el-input v-model="scope.row.logistics_sn" :disabled="scope.row.disabled"></el-input>
          </template>
        </template>
      </el-table-column> -->
      <!-- 线路名称 -->
      <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
      <!-- 收货人 -->
      <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
      <!-- 收货国家或地区 -->
      <el-table-column label="收货国家/地区" prop="address.country_name"></el-table-column>
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
      <el-table-column label="提交时间" prop="updated_at" v-if="activeName === '1' || activeName === '2' || activeName === '3' || activeName === '4'"></el-table-column>
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
      <el-table-column label="操作" :width="activeName === '3' ? '250px' : '170px'" fixed="right">
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
          <!-- 添加转运快递单号 -->
          <!-- <el-button size="small" @click="edit(scope.row)" v-if="activeName === '3' && scope.row.disabled" class="btn-deep-purple detailsBtn">添加转运快递单号</el-button> -->
          <!-- 打印标签 -->
          <el-button size="small" @click="getLabel(scope.row.id)" v-if="activeName ==='3'" class="btn-pink detailsBtn">打印标签</el-button>
          <!-- 添加转运快递公司 -->
          <el-button size="small" @click="addCompany(scope.row.id, scope.row.logistics_sn, scope.row.logistics_company)" v-if="activeName === '3'" class="btn-green detailsBtn">添加物流信息</el-button>
          <!-- 移除发货单 -->
          <el-button size="small" class="btn-light-red" v-if="activeName === '3' && scope.row.shipment_sn" @click="removeShip(scope.row.id)">移除发货单
          </el-button>
          <el-button size="small" class="btn-blue" v-if="activeName !== '1'" @click="onLogs(scope.row.id)">拣货日志
          </el-button>
          <!-- 修改物流信息 -->
          <el-button size="small" @click="addCompany(scope.row.id, scope.row.logistics_sn, scope.row.logistics_company)" v-if="activeName === '4'" class="btn-green detailsBtn">修改物流信息</el-button>
          <el-button size="small" class="btn-light-red detailsBtn"
           v-show="activeName === '3' && !scope.row.disabled"
           @click="saveLogistics(scope.row)">保存</el-button>
          <el-button size="small" class="btn-dark-green detailsBtn"
          v-show="activeName === '3' && !scope.row.disabled" @click="cancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
      <template slot="append" v-if="activeName === '3'">
        <div class="append-box">
          <!-- 删除 -->
          <!-- <el-button size="small">删除</el-button> -->
          <!-- 加入发货单 -->
          <el-button size="small" v-if="activeName === '3'" @click="addInvoice(selectIDs)">加入发货单</el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>暂无数据</div>
      <el-dialog :visible.sync="show" title="预览打印标签" class="props-dialog" width="45%">
        <div class="dialogSty">
          <iframe class="iframe" :src="urlHtml"></iframe>
        </div>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="updateLabel">下载</el-button>
      </div>
    </el-dialog>
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
  name: 'wallbillList',
  data () {
    return {
      timeList: [],
      pickingList: [],
      signList: [],
      begin_date: '',
      end_date: '',
      packed_begin_date: '',
      packed_end_date: '',
      updated_begin_date: '',
      updated_end_date: '',
      activeName: '1',
      oderData: [],
      localization: {},
      status: 1,
      selectIDs: [],
      agent_name: '',
      agentData: [],
      tableLoading: false,
      countData: {},
      urlImport: '',
      urlHtml: '',
      show: false,
      labelId: ''
    }
  },
  created () {
    this.getCounts()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
      this.status = Number(this.$route.query.activeName)
    }
    if (this.$route.query.order_sn) {
      this.page_params.keyword = this.$route.query.order_sn
    }
    if (this.$route.query.agent) {
      this.agent_name = Number(this.$route.query.agent)
    }
    this.getAgentData()
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      // 拣货时间
      this.packed_begin_date && (params.packed_begin_date = this.packed_begin_date)
      this.packed_end_date && (params.packed_end_date = this.packed_end_date)
      // 签收时间
      this.updated_begin_date && (params.updated_begin_date = this.updated_begin_date)
      this.updated_end_date && (params.updated_end_date = this.updated_end_date)
      this.$request.getOrder(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          // 待发货列表的转运快递单号添加
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
    // 获取订单统计数据
    getCounts () {
      this.$request.getCounts().then(res => {
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
    // 获得下拉列表
    getAgentData () {
      this.$request.getAgent().then(res => {
        this.agentData = res.data
      })
    },
    // 打印标签
    getLabel (id) {
      this.labelId = id
      this.show = true
      this.$request.checkOrderLabel(id).then(res => {
        if (res.ret) {
          this.urlHtml = res.data.url
          // this.urlImport = res.data.url
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 确认下载标签
    updateLabel () {
      this.show = false
      console.log(this.labelId, 'this.labelId')
      this.$request.updateOrderPdf(this.labelId).then(res => {
        if (res.ret) {
          window.open(res.data.url)
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
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
    // 创建时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 拣货时间
    onPick (val) {
      this.packed_begin_date = val ? val[0] : ''
      this.packed_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.packed_begin_date} ${this.packed_end_date}`)
      this.getList()
    },
    // 签收时间
    onSign (val) {
      this.updated_begin_date = val ? val[0] : ''
      this.updated_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.updated_begin_date} ${this.updated_end_date}`)
      this.getList()
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
    // 添加转运快递公司
    addCompany (id, logisticsSn, logisticsCompany) {
      console.log(id, 'id')
      console.log(logisticsSn, 'logisticsSn')
      dialog({ type: 'addCompany', id: id, logistics_sn: logisticsSn, logistics_company: logisticsCompany }, () => {
        this.getList()
      })
    },
    // 添加转运快递单号
    edit (row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel (row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics (row) {
      if (!row.logistics_sn) {
        return this.$message.info('请输入转运快递单号')
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
    },
    // Tab Change
    onTabChange (tab) {
      // switch (tab.name) {
      //   case '1': // 待处理
      //     this.status = 1
      //     break
      //   case '2': // 待支付
      //     this.status = 2
      //     break
      //   case '3': // 待发货
      //     this.status = 3
      //     break
      //   case '4': // 已发货
      //     this.status = 4
      //     break
      //   case '5': // 已签收
      //     this.status = 5
      //     break
      // }
      this.status = Number(tab.name)
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.timeList = []
      this.pickingList = []
      this.signList = []
      this.begin_date = ''
      this.end_date = ''
      this.packed_begin_date = ''
      this.packed_end_date = ''
      this.updated_begin_date = ''
      this.updated_end_date = ''
      this.getList()
    },
    // 选择代理用户
    onAgentChange () {
      this.page_params.handleQueryChange('agent', this.agent_name)
      this.getList()
    },
    // 拣货日志
    onLogs (id) {
      dialog({ type: 'pickingLog', id: id }, () => {
        this.getList()
      })
      // this.$router.push({ name: 'pickingContainer', query: { active: '2', keyword: orderSN } })
    }
  }
}
</script>

<style lang="scss">
.way-list-container {
  .tabLength {
    width: 550px !important;
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
  .chooseStatus {
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
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
