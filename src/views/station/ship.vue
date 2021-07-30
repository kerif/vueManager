<template>
  <div class="ship-container">
    <div class="order-list-search" v-show="hasFilterCondition">
      <div>
        <div class="changeTime">
          <!-- 提交 -->
          <el-date-picker
            size="mini"
            class="timeStyle"
            v-model="timeList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('提交开始日期')"
            :end-placeholder="$t('提交结束日期')"
          >
          </el-date-picker>
          <!-- 发货 -->
          <el-date-picker
            size="mini"
            class="timeStyle"
            v-model="shipmentList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('发货开始日期')"
            :end-placeholder="$t('发货结束日期')"
          >
          </el-date-picker>
        </div>
        <!-- <search-select placeholder="状态" :selectArr="statusList" @search="onShipStatus" v-model="page_params.status"></search-select> -->
        <div class="chooseStatus">
          <el-select size="mini" v-model="page_params.status" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="submit">
        <el-button type="primary" plain size="small" @click="submitForm">{{
          $t('搜索')
        }}</el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="searchGroup">
      <div class="bottom-sty">
        <el-button size="small" @click="updateTracking">{{ $t('更新物流状态') }}</el-button>
        <!-- 批量发送通知 -->
        <el-dropdown @command="dropdown">
          <el-button size="small" @click="goNotify">{{ $t('批量发送通知') }}</el-button>
          <el-dropdown-menu>
            <el-dropdown-item command="3">{{ $t('已发货通知') }}</el-dropdown-item>
            <el-dropdown-item command="4">{{ $t('待取件通知') }}</el-dropdown-item>
          </el-dropdown-menu>
          <!-- <el-radio-group v-model="radio">
            <el-radio :label="3">{{ $t('已发货通知') }}</el-radio>
            <el-radio :label="4">{{ $t('待取件通知') }}</el-radio>
          </el-radio-group> -->
        </el-dropdown>
        <el-button size="small" @click="batchNum">{{ $t('批量更新单号-二程') }}</el-button>
        <el-button size="small" type="success" plain @click="deleteData">{{
          $t('导出清单')
        }}</el-button>
      </div>
      <div class="search-l">
        <search-group
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="goSearch"
        >
        </search-group>
        <div class="select-box">
          <add-btn @click.native="updateInvoice">{{ $t('创建发货单') }}</add-btn>
        </div>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="tableShip"
        stripe
        border
        class="data-list"
        @expand-change="onExpand"
        ref="table"
        @selection-change="selectionChange"
        height="calc(100vh - 270px)"
        v-loading="tableLoading"
      >
        <!-- <el-table-column type="expand">
      <template slot-scope="props">
        <el-table :data="props.row.orders">
          <el-table-column label="客户ID" prop="user_id"></el-table-column>
          <el-table-column label="订单号">
            <template slot-scope="scope">
              <span @click="goOrder(scope.row.order_sn, scope.row.status)" class="chooseOrder">{{scope.row.order_sn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="转运快递单号" prop="logistics_sn"></el-table-column>
          <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
          <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
          <el-table-column label="收货国家" prop="address.country_name"></el-table-column>
          <el-table-column label="包裹数" prop="package_count"></el-table-column>
          <el-table-column :label="'实际重量' + localization.weight_unit" prop="actual_weight"></el-table-column>
          <el-table-column :label="'实际费用' + localization.currency_unit" prop="actual_payment_fee"></el-table-column>
          <el-table-column :label="'申报价值' + localization.currency_unit" prop="declare_value"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="提交时间" prop="packed_at"></el-table-column>
          <el-table-column label="拣货时间" prop="updated_at"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="scope.row.id" class="btn-light-red">移除发货单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column> -->
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!-- 发货单号 -->
        <el-table-column :label="$t('发货单号')" prop="sn"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column :label="$t('提交时间')" prop="created_at"></el-table-column>
        <!-- 发货时间 -->
        <el-table-column :label="$t('发货时间')" prop="shipped_at"></el-table-column>

        <el-table-column :label="$t('转运快递单号-头程')">
          <template slot-scope="scope">
            <span>{{ scope.row.logistics_company }}&nbsp;{{ scope.row.logistics_sn }}</span>
          </template>
        </el-table-column>
        <!-- 发出站点 -->
        <!-- <el-table-column label="发出站点" prop="source_station"></el-table-column> -->
        <!-- 目的地 -->
        <el-table-column :label="$t('目的地')" prop="destination_country"></el-table-column>
        <!-- 发货单名称 -->
        <el-table-column :label="$t('发货单名称')" prop="name"></el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('状态')" prop="status_name">
          <!-- <template slot-scope="scope">
          <span v-if="scope.row.status === 0">{{$t('未发货')}}</span>
          <span v-else>{{$t('已发货')}}</span>
        </template> -->
        </el-table-column>
        <!-- 箱数 -->
        <el-table-column :label="$t('订单数')" prop="box_count"></el-table-column>
        <el-table-column :label="$t('出库箱数')" prop="order_boxes_count"></el-table-column>
        <!-- 重量 -->
        <el-table-column
          :label="$t('重量') + this.localization.weight_unit"
          prop="weight"
        ></el-table-column>
        <!-- 价值 -->
        <el-table-column
          :label="$t('价值') + this.localization.currency_unit"
          prop="value"
        ></el-table-column>
        <!-- 物品属性 -->
        <el-table-column :label="$t('物品属性')" prop="props"></el-table-column>
        <!-- 备注 -->
        <el-table-column :label="$t('备注')" prop="remark"></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="116px" fixed="right">
          <template slot-scope="scope">
            <!-- 导出清单 -->
            <!-- <el-button class="btn-main btn-margin" @click="unloadShip(scope.row.id)">导出清单</el-button> -->
            <el-dropdown>
              <el-button type="primary" plain>
                {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- 发货 -->
                <el-dropdown-item class="item-sty" @click.native="goInvoice(scope.row.id)">
                  <span v-if="scope.row.status === 0">{{ $t('发货') }}</span>
                </el-dropdown-item>
                <!-- 编辑发货单 -->
                <el-dropdown-item class="item-sty" @click.native="editInvoice(scope.row.id)">
                  <span v-if="scope.row.status === 0">{{ $t('编辑发货单') }}</span>
                </el-dropdown-item>
                <!-- 详情 -->
                <el-dropdown-item
                  class="item-sty"
                  @click.native="goDetails(scope.row.id, scope.row.status)"
                >
                  <span>{{ $t('详情') }}</span>
                </el-dropdown-item>
                <!-- 删除 -->
                <el-dropdown-item class="item-sty" @click.native="deleteShip(scope.row.id)">
                  <span v-if="scope.row.box_count === 0">{{ $t('删除') }}</span>
                </el-dropdown-item>
                <!-- 加入发货单 -->
                <el-dropdown-item class="item-sty" @click.native="addShip(scope.row.id)">
                  <span v-if="scope.row.status === 0">{{ $t('加入发货单') }}</span>
                </el-dropdown-item>
                <!-- 取消发货 -->
                <el-dropdown-item class="item-sty" @click.native="cancelShip(scope.row.id)">
                  <span v-if="scope.row.status === 1">{{ $t('取消发货') }}</span>
                </el-dropdown-item>
                <!-- 轨迹 -->
                <el-dropdown-item
                  class="item-sty"
                  @click.native="logistics(scope.row.id, scope.row.sn)"
                >
                  <span>{{ $t('轨迹') }}</span>
                </el-dropdown-item>
                <!-- 批量更新单号 -->
                <!-- <el-dropdown-item class="item-sty" @click.native="batchNum(scope.row.id, scope.row.sn)">
                <span>{{$t('批量更新单号')}}</span>
              </el-dropdown-item> -->
                <!-- 添加物流信息 -->
                <el-dropdown-item
                  class="item-sty"
                  @click.native="
                    addCompany(scope.row.id, scope.row.logistics_sn, scope.row.logistics_company)
                  "
                >
                  <span>{{ $t('添加物流信息') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- <template slot="append">
        <div class="append-box">
        </div>
      </template> -->
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
    <el-dialog :visible.sync="trackDialog" width="30%" :title="$t('轨迹')" @close="clear">
      <el-form label-position="top" :model="form" ref="form">
        <el-form-item :label="$t('物流状态')">
          <el-select
            v-model="form.logistics_type_id"
            filterable
            class="country-select"
            :placeholder="$t('请选择')"
          >
            <el-option v-for="item in modeData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button class="type-sty" @click="goMore">{{ $t('管理') }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="trackDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="changeStatus">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 轨迹 -->
    <el-dialog :visible.sync="showDialog" width="45%" :title="$t('更新物流状态')" @close="clearSn">
      <div class="table-sty">{{ $t('发货单号：') }}{{ this.tableSn }}</div>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('物流轨迹')" prop="context"></el-table-column>
        <el-table-column :label="$t('时间')" prop="created_at"></el-table-column>
        <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red" @click="deleteTable(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 批量更新单号 -->
    <el-dialog
      :visible.sync="batchDialog"
      width="45%"
      :title="$t('批量更新单号')"
      @close="clearBatch"
    >
      <el-form>
        <!-- 公告标题 -->
        <el-form-item :label="$t('发货单号')">
          <span v-for="(item, index) in orderNum" :key="index"> {{ item }} </span><br />
        </el-form-item>
        <el-form-item :label="$t('模版下载')">
          <el-row>
            <el-col :span="10">
              <el-button @click="uploadList"> {{ $t('模版下载') }}</el-button
              ><br />
              <span class="batch-sty">1，{{ $t('请先下载指定的模版') }}</span
              ><br />
              <span class="batch-sty">2，{{ $t('根据模版内容填充物流信息') }}</span
              ><br />
              <span class="batch-sty">3，{{ $t('上传') }}</span
              ><br />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('模版上传')">
          <el-row>
            <el-col :span="20">
              <el-upload
                class="upload-demo"
                action=""
                :limit="1"
                :on-remove="onFileRemove"
                :file-list="fileList"
                :http-request="uploadBaleImg"
              >
                <el-button size="small" type="primary">{{ $t('请选择要上传的文件') }}</el-button>
                <!-- <div slot="tip" class="el-upload__tip">{{$t('支持格式：.doc .docx .pdf，单个文件不能超过3MB')}}</div> -->
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="batchDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmBatch">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  name: 'shipContainer',
  data() {
    return {
      tableShip: [], // 表格数据
      localization: {},
      tableLoading: false,
      deleteNum: [],
      orderNum: [],
      timeList: [],
      begin_date: '',
      end_date: '',
      shipped_begin_date: '',
      shipped_end_date: '',
      shipmentList: [],
      urlExcel: '',
      page_params: {
        status: ''
      },
      statusList: [
        {
          id: 0,
          name: this.$t('未发货')
        },
        {
          id: 1,
          name: this.$t('已发货')
        }
      ],
      trackDialog: false,
      modeData: [],
      form: {
        logistics_type_id: ''
      },
      showDialog: false,
      tableData: [],
      tableId: '',
      tableSn: '',
      batchDialog: false,
      // batchId: '',
      urlName: '',
      fileList: [],
      hasFilterCondition: false,
      radio: ''
    }
  },
  created() {},
  activated() {
    if (this.$route.query.shipment_sn) {
      this.page_params.keyword = this.$route.query.shipment_sn
      this.getList()
    }
    if (this.$route.query.status) {
      this.page_params.status = Number(this.$route.query.status)
      this.getList()
    }
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        status: this.page_params.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      // 发货时间
      this.shipped_begin_date && (params.shipped_begin_date = this.shipped_begin_date)
      this.shipped_end_date && (params.shipped_end_date = this.shipped_end_date)
      this.$request.getShip(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tableShip = res.data.map(item => {
            return {
              ...item,
              orders: []
            }
          })
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
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
    // 下载excel
    uploadList() {
      this.$request
        .uploadBatch({
          ids: this.deleteNum
        })
        .then(res => {
          if (res.ret) {
            this.urlExcel = res.data.url
            // window.location.href = this.urlExcel
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
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.fileList.push({
              name: item.name,
              url: item.path
            })
          })
          console.log(res.data, 'res.data')
          this.urlName = res.data[0].name
          console.log(this.urlName, 'this.urlName')
          // this.getList()
        }
      })
    },
    // 确认 批量更新单号
    confirmBatch() {
      this.$request
        .updateBatch({
          ids: this.deleteNum,
          name: this.urlName
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.batchDialog = false
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadFiles(params)
    },
    // 文件删除
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    clearBatch() {
      // this.batchId = ''
      this.fileList = []
    },
    // 跳转至详情
    goDetails(id, status) {
      console.log(id, '我是传过去id')
      console.log(status, '我是传过去的status')
      dialog({ type: 'shipDetails', id: id, status: status }, () => {
        this.getList()
      })
    },
    // 获取全部物流状态
    getType() {
      this.$request.getShipStatus().then(res => {
        if (res.ret) {
          this.modeData = res.data
        }
      })
    },
    addCompany(id, logisticsSn, logisticsCompany) {
      console.log(id, 'id')
      console.log(logisticsSn, 'logisticsSn')
      dialog(
        {
          type: 'batchExpress',
          id: id,
          logistics_sn: logisticsSn,
          logistics_company: logisticsCompany
        },
        () => {
          this.getList()
        }
      )
    },
    // 弹窗 管理
    goMore() {
      this.$router.push({
        name: 'mailConfigur',
        query: {
          activeName: '12'
        }
      })
    },
    // 更改物流状态
    changeStatus() {
      this.$request
        .changeShipStatus({
          logistics_type_id: this.form.logistics_type_id,
          shipment_ids: this.deleteNum
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.trackDialog = false
            this.getList()
            this.deleteNum = []
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 导出清单
    // unloadShip (id) {
    //   this.$request.uploadExcel(id).then(res => {
    //     if (res.ret) {
    //       this.urlExcel = res.data.url
    //       window.open(this.urlExcel)
    //       this.$notify({
    //         title: '操作成功',
    //         message: res.msg,
    //         type: 'success'
    //       })
    //     } else {
    //       this.$notify({
    //         title: '操作失败',
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      this.orderNum = selection.map(item => item.sn)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    clear() {
      this.form.logistics_type_id = ''
    },
    clearSn() {
      this.tableSn = ''
      this.tableId = ''
    },
    // 更新物流状态
    updateTracking() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.trackDialog = true
      this.getType()
    },
    // 导出清单
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认导出？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .uploadExcel({
            shipment_ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              // this.urlExcel = res.data.url
              // window.open(this.urlExcel)
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
    // 批量发送通知
    goNotify() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      dialog({ type: 'notifyOrder', ids: this.deleteNum }, () => {
        this.getList()
        this.deleteNum = []
      })
    },
    batchNum() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.batchDialog = true
    },
    // 跳至加入发货单
    addShip(id) {
      dialog({ type: 'joinShip', id: id }, () => {
        this.getList()
      })
    },
    // 轨迹
    logistics(id, sn) {
      this.tableId = id
      this.tableSn = sn
      this.showDialog = true
      this.getAlone()
    },
    // 获取单条轨迹
    getAlone() {
      this.$request.getAloneShip(this.tableId).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    deleteTable(id) {
      this.$request.deleteShipTable(this.tableId, id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getAlone()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 取消发货
    cancelShip(id) {
      this.$confirm(this.$t('您真的要取消发货吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.cancelShip(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
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
    // 创建时间
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      // this.getList()
    },
    // 发货时间
    // 创建时间
    onShipment(val) {
      this.shipped_begin_date = val ? val[0] : ''
      this.shipped_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange(
        'times',
        `${this.shipped_begin_date} ${this.shipped_end_date}`
      )
      // this.getList()
    },
    // 删除发货单
    deleteShip(id) {
      this.$confirm(this.$t('您真的要删除发货单吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteShip(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
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
    // 跳转至订单 运单
    goOrder(orderSn, status) {
      console.log(status, '我是传过去的ID')
      this.$router.push({
        name: 'wayBillList',
        query: { order_sn: orderSn, activeName: status.toString() }
      })
    },
    // 创建发货单
    updateInvoice() {
      dialog({ type: 'invoice', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑发货单
    editInvoice(id) {
      dialog({ type: 'invoice', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    goInvoice(id) {
      this.$confirm(this.$t('您真的要发货吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.getShipments(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
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
    // 点开当前行，获取二级菜单数据
    onExpand(row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getOrdersByShipment(id).then(res => {
        if (res.ret) {
          row.orders = res.data
        }
      })
    },
    // 发货状态选择
    onShipStatus() {
      this.page_params.handleQueryChange('status', this.page_params.status)
      this.getList()
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.shipmentList = []
      this.page_params.status = ''
    },
    // 提交表单
    submitForm() {
      console.log('111')
      this.onTime(this.timeList)
      this.onShipment(this.shipmentList)
      this.onShipStatus()
    },
    dropdown(command) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request
        .sendingNotify({
          ids: this.deleteNum,
          type: command
          // type: this.activeName === '2' ? 2 : 3
        })
        .then(res => {
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
      // console.log(command)
    }
  }
}
</script>
<style lang="scss">
.ship-container {
  background-color: #f5f5f5;
  .select-box {
    display: inline-block;
    overflow: hidden;
    margin-left: 10px;
    vertical-align: top;
  }
  .btn-margin {
    margin-bottom: 5px;
  }
  .changeTime {
    display: inline-block;
    //  margin-top: 15px;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
  .status-style {
    .el-search {
      width: 100% !important;
    }
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
  }
  .type-sty {
    margin-left: 10px;
  }
  .table-sty {
    margin-bottom: 10px;
  }
  .batch-sty {
    color: red;
  }
  .bottom-sty {
    // margin-top: 20px;
    // margin-bottom: 10px;
    .el-dropdown {
      margin: 0 10px;
    }
  }
  .searchGroup {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .filter {
      margin-left: 10px;
    }
    .search-group {
      width: 32.3%;
    }
    .search-l {
      display: flex;
      justify-content: flex-end;
      flex: 1;
      padding-right: 10px;
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
  }
  .chooseStatus {
    // width: 150px;
    display: inline-block;
  }
  .submit {
    float: right;
    margin-top: 10px;
  }
}
</style>
