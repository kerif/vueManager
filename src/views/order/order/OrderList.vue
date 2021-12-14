<template>
  <div class="order-list-container">
    <el-tabs v-model="activeName" @tab-click="onTabChange" class="tab-length" stretch>
      <el-tab-pane :label="`${$t('全部')} (${countData.all || 0})`" name="0"></el-tab-pane>
      <el-tab-pane
        :label="`${$t('未入库')} (${countData.wait_in_storage || 0})`"
        name="1"
      ></el-tab-pane>
      <el-tab-pane :label="`${$t('已入库')} (${countData.in_storage || 0})`" name="2"></el-tab-pane>
      <el-tab-pane :label="`${$t('已集包')} (${countData.packed || 0})`" name="3"></el-tab-pane>
      <el-tab-pane :label="`${$t('已发货')} (${countData.shipped || 0})`" name="4"></el-tab-pane>
      <el-tab-pane :label="`${$t('已收货')} (${countData.received || 0})`" name="5"></el-tab-pane>
      <el-tab-pane :label="$t('弃件包裹')" name="6"></el-tab-pane>
      <!-- <el-tab-pane :label="$t('无人认领')" name="7"> </el-tab-pane> -->
    </el-tabs>
    <order-list-search
      v-show="hasFilterCondition"
      :searchFieldData="searchFieldData"
      v-on:submit="goMatch"
    ></order-list-search>
    <div class="header-range">
      <div class="header-btns">
        <el-button
          class="btn-light-red"
          size="small"
          @click="deleteData"
          v-if="activeName === '1'"
          >{{ $t('删除') }}</el-button
        >
        <el-button
          class="btn-orangey-red"
          size="small"
          @click="discardPackage"
          v-if="['1', '2'].includes(activeName)"
          >{{ $t('弃件') }}</el-button
        >
        <el-button class="btn-green" size="small" @click="batchPackage" v-if="activeName === '2'">{{
          $t('批量集包')
        }}</el-button>
        <el-button
          class="btn-pink notify"
          size="small"
          @click="goNotify"
          v-if="activeName === '2'"
          >{{ $t('批量发送通知') }}</el-button
        >
        <el-button class="btn-dark-green" size="small" v-if="activeName === '6'" @click="restore">{{
          $t('恢复')
        }}</el-button>
        <el-button
          class="btn-blue-green"
          size="small"
          v-if="activeName === '6'"
          @click="deleteDiscard"
          >{{ $t('彻底删除') }}</el-button
        >
        <el-button
          class="btn-purple"
          v-if="activeName !== '6' && activeName !== '7'"
          @click="importOrder"
          size="small"
          plain
          >{{ $t('批量入库') }}</el-button
        >
        <el-button
          class="btn-yellow"
          v-if="activeName !== '6' && activeName !== '7'"
          @click="uploadList"
          size="small"
          type="success"
          plain
        >
          {{ $t('导出清单') }}
        </el-button>
        <el-button
          class="btn-light-red"
          v-if="activeName !== '1' && activeName !== '6' && activeName !== '7'"
          @click="batchShelves"
          size="small"
          plain
        >
          {{ $t('批量上架') }}
        </el-button>
        <el-button
          class="btn-light-red"
          v-if="activeName === '2'"
          @click="batchModify"
          size="small"
          plain
        >
          {{ $t('批量修改') }}
        </el-button>
        <!-- <el-button
          class="btn-light-red"
          size="small"
          v-if="activeName === '7'"
          @click="deleteDatas"
          >{{ $t('删除') }}</el-button
        >
        <el-button
          class="btn-blue-green"
          size="small"
          v-if="activeName === '7'"
          @click="claimList"
          >{{ $t('认领记录') }}</el-button
        >
        <el-button
          type="success"
          plain
          size="small"
          v-if="activeName === '7'"
          @click="uploadList"
          >{{ $t('导出清单') }}</el-button
        > -->
      </div>
      <div class="header-search">
        <el-input
          class="header-keyword"
          v-model="searchFieldData.keyword"
          clearable
          :placeholder="$t('请输入')"
          size="medium"
          @keyup.enter.native="goMatch"
        >
          <el-button
            slot="append"
            @click="goMatch"
            :loading="$store.state.btnLoading"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)" v-if="activeName !== '7'">
      <el-table
        border
        stripe
        ref="table"
        :data="orderData"
        @selection-change="selectionChange"
        v-loading="tableLoading"
        height="calc(100vh - 270px)"
        class="order-data-list"
      >
        <el-table-column
          v-if="activeName !== '7'"
          :type="['1', '2', '6'].includes(activeName) ? 'selection' : 'index'"
          :key="['1', '2', '6'].includes(activeName) ? 'selection' : 'index'"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('客户ID')"
          v-if="activeName !== '7'"
          key="user_id"
          width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.user_id }}---{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="activeName !== '7'"
          :label="$t('快递单号')"
          key="express_num"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              v-if="activeName === '2'"
              :class="scope.row.is_claimed === 1 ? 'colorsty' : ''"
              @click="oderDetails(scope.row.id)"
              type="text"
              >{{ scope.row.express_num }}
            </el-button>
            <el-button v-else @click="oderDetails(scope.row.id)" type="text"
              >{{ scope.row.express_num }}
            </el-button>
            <span v-if="scope.row.code != ''" style="color: #66666">({{ scope.row.code }})</span>
            <span
              :title="$t('复制单号')"
              class="copy-number"
              @click="copyNumber(scope.row.express_num)"
            >
              <i class="el-icon-copy-document"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('状态')" key="status" v-if="activeName !== '7'">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{ $t('未入库') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('已入库') }}</span>
            <span v-if="scope.row.status === 3 || scope.row.status === 4">{{ $t('已集包') }}</span>
            <span v-if="scope.row.status === 5">{{ $t('已发货') }}</span>
            <span v-if="scope.row.status === 6">{{ $t('已收货') }}</span>

            <el-tooltip
              v-if="scope.row.status === 1 && scope.row.is_warning === 1"
              class="item"
              effect="dark"
              :content="$t('丢包预警')"
              placement="top-start"
            >
              <i class="el-icon-warning" style="color: red"></i>
            </el-tooltip>

            <el-tooltip
              v-if="scope.row.is_exceptional === 1"
              class="item"
              effect="dark"
              :content="scope.row.exceptional_remark"
              placement="top-start"
            >
              <i class="el-icon-wind-power" style="color: red"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('物品名称')"
          prop="package_name"
          key="package_name"
          width="150"
          v-if="activeName !== '7'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('物品价值') + localization.currency_unit"
          v-if="activeName !== '7'"
          prop="package_value"
          key="package_value"
        ></el-table-column>
        <el-table-column
          :label="$t('物品单价') + localization.currency_unit + '/' + localization.weight_unit"
          v-if="activeName !== '7'"
          prop="unit_value"
          key="unit_value"
          min-width="100"
        ></el-table-column>
        <el-table-column :label="$t('物品属性')" key="props" v-if="activeName !== '7'">
          <template slot-scope="scope">
            <span v-for="item in scope.row.props" :key="item.id">
              {{ item.cn_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('物品重量')"
          key="package_weight"
          v-if="['2', '3', '4', '5'].includes(activeName)"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.package_weight }}{{ localization.weight_unit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('商品数量')"
          prop="qty"
          key="qty"
          v-if="['1', '2'].includes(activeName)"
        ></el-table-column>
        <el-table-column
          :label="$t('商品分类')"
          prop="categories"
          key="categories"
          v-if="['1', '2'].includes(activeName)"
        >
          <template slot-scope="scope">
            <span v-for="item in scope.row.categories" :key="item.id">
              {{ item.name_cn }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('寄往国家')"
          prop="destination_country.cn_name"
          key="destination_country.cn_name"
          v-if="activeName !== '7'"
        ></el-table-column>
        <el-table-column
          :label="$t('仓库')"
          prop="warehouse.warehouse_name"
          key="warehouse.warehouse_name"
          v-if="activeName !== '7'"
          width="155"
        >
        </el-table-column>
        <el-table-column
          :label="$t('规格(长宽高cm)')"
          prop="dimension"
          key="dimension"
          width="120px"
          v-if="activeName === '2'"
        ></el-table-column>
        <el-table-column
          :label="$t('存放货位')"
          key="location"
          width="120px"
          v-if="activeName === '2' || activeName === '3'"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.location }}</span>
            <span v-if="scope.row.location_suffix !== ''">_{{ scope.row.location_suffix }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('入库时间')"
          width="155"
          prop="in_storage_at"
          key="in_storage_at"
          v-if="activeName === '2' || activeName === '3'"
        ></el-table-column>
        <el-table-column
          :label="$t('提交时间')"
          prop="created_at"
          v-if="activeName !== '7'"
          key="created_at"
          width="155"
        >
        </el-table-column>
        <el-table-column
          :label="$t('操作')"
          fixed="right"
          v-if="activeName !== '7'"
          key="operator"
          width="116px"
        >
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain>
                {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="storage(scope.row.id)">
                  <!-- 入库 -->
                  <span v-if="activeName === '1' || scope.row.status === 1">{{ $t('入库') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="goExpress(scope.row.express_num)">
                  <span
                    v-if="['1', '2'].includes(activeName) && [1, 2].includes(scope.row.status)"
                    >{{ $t('单号追踪') }}</span
                  >
                </el-dropdown-item>
                <el-dropdown-item @click.native="returnWarehouse(scope.row.id)">
                  <span v-if="activeName === '2'">{{ $t('退回未入库') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="onLogs(scope.row.express_num)">
                  <span
                    v-if="
                      ['0', '2', '3', '4', '5'].includes(activeName) &&
                      [2, 3, 4, 5, 6].includes(scope.row.status)
                    "
                    >{{ $t('入库日志') }}</span
                  >
                </el-dropdown-item>
                <el-dropdown-item @click.native="editWarehoused(scope.row.id)">
                  <span v-if="activeName === '2' || scope.row.status === 2">{{ $t('编辑') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="fastClosing(scope.row.user_id)">
                  <span v-if="activeName === '2'">{{ $t('快速合箱') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="invalidLog(scope.row.id)">
                  <span v-if="activeName === '6'">{{ $t('日志') }}</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="getLabel(scope.row.id)">
                  <span size="small" v-if="activeName === '2' || scope.row.status === 2">{{
                    $t('打印标签')
                  }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination
        style="margin-top: 5px"
        v-if="activeName !== '7'"
        :pageParams="page_params"
        :notNeedInitQuery="false"
      >
        <div class="remark-text">
          <span>{{ $t('总实际重量') }}:</span><span>{{ sumData.weight }} KG</span>
        </div>
      </nle-pagination>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img-box">
        <img :src="imgSrc" class="img-dialog" />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
      <div class="dialog-sty">
        <iframe class="iframe" :src="urlHtml"></iframe>
      </div>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateLabel">{{ $t('下载') }}</el-button>
      </div>
    </el-dialog>
    <batch-modify
      :showBatch="showBatch"
      :deleteNum="deleteNum"
      :packageData="packageData"
      @passVal="passVal"
    ></batch-modify>
    <!-- <no-owner-package v-if="activeName === '7'" ref="noOwner"></no-owner-package> -->
  </div>
</template>

<script>
import OrderListSearch from './components/orderListSearch'
import BatchModify from './components/batchModify'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
// import NoOwnerPackage from './components/noOwnerPackage'
export default {
  components: {
    OrderListSearch,
    NlePagination,
    BatchModify
    // NoOwnerPackage
  },
  name: 'orderlist',
  mixins: [pagination],
  data() {
    return {
      activeName: 0,
      orderData: [],
      tableLoading: false,
      localization: {},
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      deleteNum: [],
      countData: {},
      urlExcel: '',
      hasFilterCondition: false,
      sumData: {},
      searchFieldData: {
        begin_date: '',
        end_date: '',
        date_type: '',
        express_num: '',
        date: [],
        value_type: '',
        value_begin: '',
        value_end: '',
        keyword: '',
        is_warning: 0
      },
      showBatch: false,
      packageData: []
    }
  },
  activated() {
    this.getList()
    this.getCounts()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  created() {
    this.getList()
    this.getCounts()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  mounted() {},
  methods: {
    // 获取订单统计数据
    getCounts() {
      const params = this.computedParams()
      this.$request.getOrderCounts(params).then(res => {
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
    passVal() {
      this.showBatch = false
    },
    goMatch() {
      this.page_params.page = 1
      this.page_params.size = 10
      this.getList()
      this.getCounts()
      this.$refs.noOwner.getList()
    },
    computedParams() {
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 19 : this.activeName,
        keyword: this.searchFieldData.keyword
      }
      if (this.hasFilterCondition) {
        const searchData = this.searchFieldData
        params = {
          ...params,
          ...searchData,
          express_num: searchData.express_num.split(/[(\r\n)\r\n]+/),
          begin_date: searchData.date ? searchData.date[0] : '',
          end_date: searchData.date ? searchData.date[1] : ''
        }
      }
      return params
    },
    getList() {
      if (this.activeName === '6') {
        return this.getDiscard()
      }
      this.tableLoading = true
      const params = this.computedParams()
      this.$request
        .getWarehouse(params)
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.orderData = res.data
            this.sumData = res.sum
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
        .catch(() => (this.tableLoading = false))
    },
    importOrder() {
      this.$router.push({ name: 'ImportOrder' })
    },
    batchShelves() {
      this.$router.push({ name: 'BatchShelves' })
    },
    getDiscard() {
      this.tableLoading = true
      const params = this.computedParams()
      this.$request
        .getWarehouse(params)
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.orderData = res.data
            this.sumData = res.sum
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
        .catch(() => (this.tableLoading = false))
    },
    storage(id) {
      this.$router.push({ name: 'editStorage', params: { id: id } })
    },
    // 已入库编辑
    editWarehoused(id) {
      this.$router.push({ name: 'editWarehouse', params: { id: id, state: 'editWarehouse' } })
    },
    // 认领记录
    claimList() {
      dialog({ type: 'claimRecord' })
    },
    deleteDatas() {
      this.$refs.noOwner.deleteData()
    },
    // 快速合箱
    fastClosing(userId) {
      this.$router.push({ name: 'applyPackage', query: { userId: userId } })
    },
    selectionChange(selection) {
      console.log(selection, 'selection-change')
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum)
      this.packageData = selection
    },
    goExpress(expressNum) {
      window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    // 批量发送通知
    goNotify() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要批量发送通知吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .sendingNotify({
            ids: this.deleteNum,
            type: 1
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    // 退回未入库
    returnWarehouse(id) {
      this.$confirm(this.$t('您是否确认将该包裹退回未入库状态'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.returnBack(id).then(res => {
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
    deleteData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要删除这个包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deletePackages({
            DELETE: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    //复制单号
    copyNumber(orderSn) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', orderSn)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    // 弃件日志
    invalidLog(id) {
      dialog({ type: 'invalidLog', id: id })
    },
    // 批量弃件
    discardPackage() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      dialog({ type: 'discardList', deleteNum: this.deleteNum }, () => {
        this.$refs.table.clearSelection()
        this.getList()
      })
    },
    // 批量集包
    batchPackage() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$router.push({ name: 'boxing', query: { packageId: this.deleteNum } })
    },
    // 彻底删除
    deleteDiscard() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要彻底删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteDiscard({
            ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    restore() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要恢复包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .restoreDiscard({
            ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    // 打印标签
    getLabel(id) {
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
    updateLabel() {
      this.show = false
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
    uploadList() {
      // const params = this.computedParams()
      const searchData = this.searchFieldData
      let param = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 19 : this.activeName,
        keyword: this.searchFieldData.keyword
      }
      let params = {
        ...param,
        ...searchData,
        express_num: searchData.express_num.split(/[(\r\n)\r\n]+/),
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : ''
      }
      this.$request.uploadPackage(params).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
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
    // 入库日志
    onLogs(expressNum) {
      this.$router.push({ name: 'pickingContainer', query: { keyword: expressNum } })
    },
    // 详情
    oderDetails(id) {
      this.$router.push({ name: 'oderDetails', params: { id: id } })
    },
    onTabChange() {
      this.page_params.page = 1
      this.getList()
    },
    batchModify() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.showBatch = true
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list-container {
  .remark-text {
    font-size: 14px;
    font-weight: bold;
    color: red;
  }
  .header-range {
    display: flex;
    // flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1px;
    .header-search {
      display: flex;
      align-items: center;
      // margin: 0 0 0 auto;
      .header-keyword {
        max-width: 300px;
      }
      .filter {
        margin: 0 20px;
      }
    }
  }
  .order-data-list {
    background-color: inherit;
  }
  .tab-length {
    width: 870px !important;
  }
  .copy-number {
    padding-left: 5px;
    cursor: pointer;
  }
  .img-box {
    text-align: center;
    .img-dialog {
      width: 50%;
    }
  }
  .dialog-sty {
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
  // .el-button--text {
  //   color: blue;
  // }
  .colorsty {
    color: #3cb371;
  }
  .notify {
    &:focus {
      background: pink !important;
      border: 1px solid pink !important;
      color: white !important;
    }
  }
}
</style>
