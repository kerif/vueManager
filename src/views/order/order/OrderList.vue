<template>
  <div class="order-list-container">
    <el-tabs v-model="activeName" class="tabLength">
      <el-tab-pane :label="$t('全部') + '(' + 0 + ')'" name="0" v-if="!this.countData.all"></el-tab-pane>
      <el-tab-pane v-else :label="$t('全部') + '(' + this.countData.all + ')'" name="0"></el-tab-pane>
      <!-- 未入库 -->
      <el-tab-pane :label="$t('未入库') + '(' + 0 + ')'" name="1" v-if="!this.countData.wait_in_storage"></el-tab-pane>
      <el-tab-pane v-else :label="$t('未入库') + '(' + this.countData.wait_in_storage + ')'" name="1"></el-tab-pane>
      <!-- 已入库 -->
      <el-tab-pane :label="$t('已入库') + '(' + 0 + ')'" name="2" v-if="!this.countData.in_storage"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已入库') + '(' + this.countData.in_storage + ')'" name="2"></el-tab-pane>
      <!-- 已集包 -->
      <el-tab-pane :label="$t('已集包') + '(' + 0 + ')'" name="3" v-if="!this.countData.packed"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已集包') + '(' + this.countData.packed
+ ')'" name="3"></el-tab-pane>
      <!-- 已发货 -->
      <el-tab-pane :label="$t('已发货') + '(' + 0 + ')'" name="4" v-if="!this.countData.shipped"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已发货') + '(' + this.countData.shipped
+ ')'" name="4"></el-tab-pane>
      <!-- 已收货 -->
      <el-tab-pane :label="$t('已收货') + '(' + 0 + ')'" name="5" v-if="!this.countData.received"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已收货') + '(' + this.countData.received
+ ')'" name="5"></el-tab-pane>
      <!-- 弃件包裹 -->
      <el-tab-pane :label="$t('弃件包裹')" name="6"></el-tab-pane>
    </el-tabs>
    <search-group :placeholder="$t('请输入关键字')" v-model="page_params.keyword" @search="goMatch">
      <div class="changeTime">
      <!-- 提交时间 -->
        <el-date-picker
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('提交开始日期')"
        :end-placeholder="$t('提交结束日期')">
      </el-date-picker>
      <!-- 称重时间 -->
        <el-date-picker
        v-if="activeName === '2'"
        class="timeStyle"
        v-model="storageList"
        type="daterange"
        @change="onStorage"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('称重开始日期')"
        :end-placeholder="$t('称重结束日期')">
      </el-date-picker>
    </div>
      <div class="chooseStatus">
        <el-select v-model="agent_name" @change="onAgentChange" clearable
        :placeholder="$t('请选择仓库')">
          <el-option
            v-for="item in agentData"
            :key="item.id"
            :value="item.id"
            :label="item.warehouse_name">
          </el-option>
        </el-select>
      </div>
      <!-- 包裹预警 -->
    <el-checkbox v-if="activeName === '0' || activeName === '1'" class="dialogSty" v-model="is_warning" @change="onWarning">{{$t('包裹预警')}}</el-checkbox>
    <div class="import-list" v-if="activeName === '0' || activeName === '1'|| activeName === '2'|| activeName === '3'|| activeName === '4'|| activeName === '5'">
     <el-button @click="uploadList(status)">{{$t('导出清单')}}</el-button>
     <el-button @click="importOrder">{{$t('批量入库')}}</el-button>
     <el-button @click="goFilter">{{$t('筛选')}}</el-button>
    </div>
    </search-group>
    <!-- <div class="agentRight" v-if="activeName === '1' || activeName === '2'"> -->
    <!-- <el-select v-model="agent_name" @change="getList" clearable>
      <el-option
      v-for="item in agentData"
      :key="item.id"
      :value="item.user_id"
      :label="item.agent_name">
      </el-option>
    </el-select> -->
    <!-- </div> -->
      <el-table v-if="oderData.length" class="data-list" border stripe
      :data="oderData"
      @selection-change="selectionChange"
      v-loading="tableLoading">
      <el-table-column type="selection" width="55" align="center"
      v-if="activeName === '1' || activeName === '2' || activeName === '6'"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{scope.row.user_id}}---{{scope.row.user_name}}</span>
        </template>
      </el-table-column>
      <!-- 快递单号 -->
      <el-table-column :label="$t('快递单号')" prop="express_num">
      </el-table-column>
      <el-table-column :label="$t('状态')" width="160">
        <!-- width="160" -->
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">{{$t('未入库')}}</span>
          <span v-if="scope.row.status === 2">{{$t('已入库')}}</span>
          <span v-if="scope.row.status === 3 || scope.row.status === 4">{{$t('已集包')}}</span>
          <span v-if="scope.row.status === 5">{{$t('已发货')}}</span>
          <span v-if="scope.row.status === 6">{{$t('已收货')}}</span>
          <span class="warning-sty" v-if="scope.row.is_warning === 1">（{{$t('丢包预警')}}）</span>
        </template>
      </el-table-column>
      <!-- 物品名称 -->
      <el-table-column :label="$t('物品名称')" prop="package_name" width="150" :show-overflow-tooltip="true"></el-table-column>
      <!-- 物品价值 -->
      <el-table-column :label="$t('物品价值') + this.localization.currency_unit" prop="package_value"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column :label="$t('物品属性')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{item.cn_name}}
          </span>
        </template>
      </el-table-column>
      <!-- 商品重量 -->
       <el-table-column :label="$t('物品重量')" v-if="activeName === '2'">
        <template slot-scope="scope">
          <span>{{ scope.row.package_weight }}{{ localization.weight_unit }}</span>
        </template>
       </el-table-column>
      <!-- 商品清单 -->
      <!-- <el-table-column label="商品清单" prop="item_pictures" width="130" v-if="activeName === '1' || activeName === '2'">
        <template slot-scope="scope">
          <span v-for="item in scope.row.item_pictures"
          :key="item.id" style="cursor:pointer;"
          @click.stop="imgSrc=$baseUrl.IMAGE_URL + item.path, imgVisible=true">
           <img :src="$baseUrl.IMAGE_URL + item.path" style="width: 40px; margin-right: 5px;">
          </span>
        </template>
      </el-table-column> -->
      <!-- 货位 -->
      <!-- <el-table-column label="货位" prop="location"></el-table-column> -->
      <!-- 商品数量 -->
      <el-table-column :label="$t('商品数量')" prop="qty" v-if="activeName === '1' || activeName === '2'"></el-table-column>
      <!-- 商品分类 -->
      <el-table-column :label="$t('商品分类')" prop="categories" v-if="activeName === '1' || activeName === '2'">
        <template slot-scope="scope">
          <span v-for="item in scope.row.categories" :key="item.id">
            {{item.name_cn}}
          </span>
        </template>
      </el-table-column>
      <!-- 寄往国家 -->
       <el-table-column :label="$t('寄往国家')" prop="destination_country.cn_name"></el-table-column>
      <!-- 仓库 -->
      <el-table-column :label="$t('仓库')" prop="warehouse.warehouse_name">
      </el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t('备注')" prop="remark" v-if="activeName === '2'"></el-table-column>
      <!-- 规格 -->
      <el-table-column :label="$t('规格(长宽高cm)')" prop="dimension"
      v-if="activeName === '2'" width="120px"></el-table-column>
      <!-- 存放货位 -->
      <el-table-column :label="$t('存放货位')"
      v-if="activeName === '2'" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.location}}</span>
          <span v-if="scope.row.location_suffix !== ''">_{{scope.row.location_suffix}}</span>
        </template>
      </el-table-column>
      <!-- 称重时间 -->
      <el-table-column :label="$t('入库时间')" v-if="activeName === '2'" prop="in_storage_at"></el-table-column>
      <!-- 弃件时间 -->
      <el-table-column :label="$t('弃件时间')" prop="invalid_at" v-if="activeName === '3'"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="created_at">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="160px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary">
              {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="item-sty" @click.native="storage(scope.row.id)">
                <!-- 入库 -->
                 <span v-if="activeName === '1' || scope.row.status === 1">{{$t('入库')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="goExpress(scope.row.express_num)">
                <!-- 单号追踪 -->
                <span v-if="activeName === '1' || activeName === '2' || scope.row.status === 1 || scope.row.status === 2">{{$t('单号追踪')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="onLogs(scope.row.express_num)">
               <!-- 入库日志 -->
                <span v-if="activeName === '2' || activeName === '3' || activeName === '4' || activeName === '5' || scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 4 || scope.row.status === 5 || scope.row.status === 6">{{$t('入库日志')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="editWarehoused(scope.row.id)">
                <!-- 编辑 -->
                <span v-if="activeName === '2' || scope.row.status === 2">{{$t('编辑')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="fastClosing(scope.row.user_id)">
                <!-- 快速合箱 -->
                 <span v-if="activeName === '2'">{{$t('快速合箱')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="invalidLog(scope.row.id)">
                 <!-- 日志 -->
                <span v-if="activeName === '6'">{{$t('日志')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="getLabel(scope.row.id)">
                <!-- 打印标签 -->
                <span size="small" v-if="activeName ==='2' || scope.row.status === 2">{{$t('打印标签')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <template slot="append" v-if="activeName === '1' || activeName === '2' || activeName === '6'">
        <div class="append-box">
          <!-- 删除 -->
          <el-button size="small" @click="deleteData"
          v-if="activeName === '1'">{{$t('删除')}}</el-button>
          <!-- 弃件 -->
          <el-button size="small" @click="discardPackage"
           v-if="this.activeName === '1' || this.activeName === '2'">{{$t('弃件')}}</el-button>
           <!-- 批量集包 -->
           <el-button size="small" @click="batchPackage"
           v-if="this.activeName === '2'">{{$t('批量集包')}}</el-button>
           <!-- 批量发送通知 -->
           <el-button size="small" @click="goNotify"
           v-if="this.activeName === '2'">{{$t('批量发送通知')}}</el-button>
           <!-- 恢复 -->
           <el-button size="small" v-if="activeName === '6'"
           @click="restore">{{$t('恢复')}}</el-button>
           <!-- 彻底删除 -->
           <el-button size="small"
            v-if="activeName === '6'" @click="deleteDiscard">{{$t('彻底删除')}}</el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>{{$t('暂无数据')}}</div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
    <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
      <div class="dialogSty">
        <iframe class="iframe" :src="urlHtml"></iframe>
        </div>
      <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="updateLabel">{{$t('下载')}}</el-button>
      </div>
    </el-dialog>
    <!-- 筛选 -->
    <el-dialog :title="$t('筛选')" :visible.sync="dialogFilter" width="40%" @close="clearFilter">
      <div class="excel-date">
        <el-form ref="form" :model="filterForm">
          <el-form-item :label="$t('价格区间') + localization.currency_unit">
            <el-input :placeholder="$t('请输入起始价格')" v-model="filterForm.start" class="input-sty"></el-input> -
            <el-input :placeholder="$t('请输入结束价格')" v-model="filterForm.end" class="input-sty"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFilter = false" class="cancel-btn">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="createPrice" :loading="$store.state.btnLoading">{{$t('确定')}}</el-button>
    </div>
    </el-dialog>
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
  name: 'orderList',
  mixins: [pagination],
  data () {
    return {
      activeName: '',
      oderData: [],
      status: 1,
      tableLoading: false,
      agent_name: '',
      is_warning: '',
      agentData: [],
      localization: {},
      ownerData: [],
      storageList: [],
      timeList: [],
      in_storage_end_date: '',
      in_storage_begin_date: '',
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      deleteNum: [],
      countData: {},
      urlExcel: '',
      dialogFilter: false,
      filterForm: {
        start: '',
        end: ''
      }
    }
  },
  methods: {
    // 获取订单统计数据
    getCounts () {
      this.$request.getOrderCounts({
        keyword: this.page_params.keyword
      }).then(res => {
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
    goFilter () {
      this.dialogFilter = true
    },
    clearFilter () {
      // this.filterForm.start = ''
      // this.filterForm.end = ''
    },
    // 筛选
    createPrice () {
      if (!this.filterForm.start) {
        return this.$message.error(this.$t('请输入起始价格'))
      } else if (!this.filterForm.end) {
        return this.$message.error(this.$t('请输入结束价格'))
      }
      // this.handleQueryChange('value_start', this.filterForm.start)
      this.getList()
      this.dialogFilter = false
    },
    goMatch () {
      this.page_params.page = 1
      this.page_params.size = 10
      this.handleQueryChange('page', this.page_params.page)
      this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList()
      this.getCounts()
    },
    getList () {
      if (this.activeName === '6') {
        return this.getDiscard()
      }
      // console.log('我没有执行下一步')
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        warehouse: this.agent_name,
        status: this.status,
        value_start: this.filterForm.start,
        value_end: this.filterForm.end,
        is_warning: Number(this.is_warning)
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 已入库
      if (this.activeName === '2') {
        // 提交时间
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
        // 称重时间
        this.in_storage_begin_date && (params.in_storage_begin_date = this.in_storage_begin_date)
        this.in_storage_end_date && (params.in_storage_end_date = this.in_storage_end_date)
      } else { // 未入库
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
      }
      this.$request.getWarehouse(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    importOrder () {
      this.$router.push({ name: 'ImportOrder' })
    },
    getDiscard () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.status,
        warehouse: this.agent_name,
        value_start: this.filterForm.start,
        value_end: this.filterForm.end
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getWarehouse(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    storage (id) {
      this.$router.push({ name: 'editStorage', params: { id: id } })
    },
    // 已入库编辑
    editWarehoused (id) {
      this.$router.push({ name: 'editWarehouse', params: { id: id, state: 'editWarehouse' } })
    },
    // 快速合箱
    fastClosing (userId) {
      console.log(userId, 'userId')
      this.$router.push({ name: 'applyPackage', query: { userId: userId } })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    goExpress (expressNum) {
      console.log(expressNum)
      window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    // 批量发送通知
    goNotify () {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要批量发送通知吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.sendingNotify({
          ids: this.deleteNum,
          type: 1
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
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
    // 删除
    deleteData () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要删除这个包裹吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deletePackages({
          DELETE: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.getCounts()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    // 弃件日志
    invalidLog (id) {
      dialog({ type: 'invalidLog', id: id })
    },
    // 批量弃件
    discardPackage () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      dialog({ type: 'discardList', deleteNum: this.deleteNum }, () => {
        this.getList()
      })
    },
    // 批量集包
    batchPackage () {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$router.push({ name: 'boxing', query: { packageId: this.deleteNum } })
    },
    // 彻底删除
    deleteDiscard () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要彻底删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deleteDiscard({
          ids: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
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
    // 恢复被弃件的包裹
    restore () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要恢复包裹吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.restoreDiscard({
          ids: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
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
    onAgentChange () {
      this.page_params.page = 1
      this.page_params.handleQueryChange('agent', this.agent_name)
      this.getList()
      // this.getCounts()
    },
    onWarning () {
      this.page_params.page = 1
      this.page_params.handleQueryChange('is_warning', Number(this.is_warning))
      this.getList()
      // this.getCounts()
      // console.log(Number(this.is_warning), 'is_warning')
    },
    // 打印标签
    getLabel (id) {
      this.labelId = id
      this.show = true
      this.$request.checkPackageLabel(id).then(res => {
        if (res.ret) {
          this.urlHtml = res.data.url
          // this.urlImport = res.data.url
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
    // 确认下载标签
    updateLabel () {
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
    // 导出清单
    uploadList (val) {
      this.$request.uploadPackage({
        status: val
      }).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          window.open(this.urlExcel)
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
    // 获取代理列表
    getAgentData () {
      this.$request.getSimpleList().then(res => {
        this.agentData = res.data
      })
    },
    // 提交时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
      // if (this.activeName === '3') {
      //   this.getDiscard()
      // } else {
      // }
    },
    // 称重时间
    onStorage (val) {
      this.in_storage_begin_date = val ? val[0] : ''
      this.in_storage_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.in_storage_begin_date} ${this.in_storage_end_date}`)
      this.getList()
    },
    // 入库日志
    onLogs (expressNum) {
      this.$router.push({ name: 'pickingContainer', query: { keyword: expressNum } })
    }
  },
  created () {
    this.getAgentData()
    this.getList()
    this.getCounts()
  },
  watch: {
    // 监听tab组件参数
    activeName (newValue) {
      switch (newValue) {
        case '0': // 全部
          this.page_params.page = 1
          this.status = 0
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '1': // 未入库
          this.page_params.page = 1
          this.status = 1
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '2': // 已入库
          this.page_params.page = 1
          this.status = 2
          this.timeList = []
          this.storageList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.getList()
          break
        case '3': // 已集包
          this.page_params.page = 1
          this.status = 3
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '4': // 已发货
          this.page_params.page = 1
          this.status = 4
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '5': // 已收货
          this.page_params.page = 1
          this.status = 5
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '6':
          this.page_params.page = 1
          this.status = 19
          // this.timeList = []
          // this.storageList = []
          // this.begin_date = ''
          // this.end_date = ''
          // this.in_storage_end_date = ''
          // this.in_storage_end_date = ''
          this.getList()
      }
      // this.getList()
    }
  }
}
</script>

<style lang="scss">
.order-list-container {
  .tabLength {
    width: 720px !important;
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
 .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
  .chooseOrder {
    cursor: pointer;
    color:blue;
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
}
</style>
