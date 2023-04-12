<template>
  <div class="declare-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('待提交')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('已提交')" name="1"></el-tab-pane>
    </el-tabs>
    <div class="headline">
      <div class="head-status">
        <el-button size="small" class="btn-purple" @click="batchSub">{{
          $t('批量提交')
        }}</el-button>
        <el-button size="small" class="btn-main" @click="batchCustomConfig">{{
          $t('自定义配置')
        }}</el-button>
      </div>
      <div class="btn-left">
        <el-button size="mini" class="btn-light-red" @click="setNormal">{{
          $t('设置默认值')
        }}</el-button>
        <el-select
          v-model="third_status"
          clearable
          style="margin-left: 10px"
          :placeholder="$t('第三方对接状态')"
          @change="getStatus"
        >
          <el-option
            v-for="item in statusData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <div class="head-search">
          <el-input
            v-model="page_params.keyword"
            :placeholder="$t('请输入内容')"
            @keyup.enter.native="goSearch"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
          </el-input>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      @selection-change="selectionChange"
      v-loading="tableLoading"
      height="calc(100vh - 310px)"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column type="selection" label="#" width="60"> </el-table-column>
      <el-table-column prop="user_id" :label="$t('客户ID')">
        <template slot-scope="scope">
          <span v-if="$store.state.uid === 1">{{ scope.row.user_uid }}</span
          ><span v-if="$store.state.uid === 1"> (</span>{{ scope.row.user_id
          }}<span v-if="$store.state.uid === 1">)</span>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" :label="$t('客户昵称')"> </el-table-column>
      <el-table-column :label="$t('订单号')">
        <template slot-scope="scope">
          <div>
            <span class="choose-order" @click="goOrderDetail(scope.row.order_id)">
              {{ scope.row.order_sn }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('第三方对接状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.third_status === 0">{{ $t('待对接') }}</span>
          <span v-if="scope.row.third_status === 1">{{ $t('对接中') }}</span>
          <span v-if="scope.row.third_status === 2" class="pass_color">{{ $t('对接成功') }}</span>
          <span v-if="scope.row.third_status === 3" class="reject_color">{{ $t('对接失败') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="express_line_name" :label="$t('线路名称')"> </el-table-column>
      <el-table-column prop="country_name" :label="$t('收货国家')"> </el-table-column>
      <el-table-column prop="value" :label="$t('申报价值')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('提交时间')"> </el-table-column>
      <el-table-column :label="$t('操作')" width="180">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" plain>
              {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="scope.row.status === 0"
                @click.native="getDeclareInfo(scope.row.id, scope.row.third_status)"
                >{{ $t('报关信息') }}</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.status === 1"
                @click.native="getInfo(scope.row.id, scope.row.status, scope.row.third_status)"
                >{{ $t('查看') }}</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.third_status === 3"
                @click.native="resubmit(scope.row.id)"
                >{{ $t('重新提交') }}</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.third_status === 3"
                @click.native="getLog(scope.row.id)"
                >{{ $t('对接日志') }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="show" :title="$t('报关信息')" @close="clear" width="80%">
      <div v-if="this.type === 1">
        <div>{{ this.orderSn }}</div>
        <el-form :model="ruleForm" ref="ruleForm" style="margin-top: 10px">
          <el-form-item :label="$t('税号')">
            <el-input
              :placeholder="$t('请输入税号')"
              class="input-sty"
              v-model="ruleForm.tax_number"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('重量')">
            <el-input
              :placeholder="$t('请输入重量')"
              class="input-sty"
              v-model="ruleForm.weight"
            ></el-input>
          </el-form-item>
          <el-form-item label="COD">
            <el-input
              :placeholder="$t('请输入')"
              class="input-sty"
              v-model="ruleForm.agent_amount"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <el-button
            @click="deleteRow"
            v-if="thirdStatus === 0 || thirdStatus === 3"
            size="small"
            class="btn-light-red"
            style="margin: 10px 0"
            >{{ $t('多选删除') }}</el-button
          >
          <div>
            <el-button class="btn-main" style="margin: 5px 10px 2px 0" @click="customConfig">{{
              $t('自定义配置')
            }}</el-button>
            <add-btn @click.native="addNew" v-if="thirdStatus === 0 || thirdStatus === 3">{{
              $t('新增')
            }}</add-btn>
          </div>
        </div>
        <el-table
          :data="infoData"
          ref="multipleTable"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60"> </el-table-column>
          <el-table-column :label="$t('中文品名')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.cn_name"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('英文品名')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.en_name"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="sku">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sku"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('海关编码')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.hs_code"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('材质')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.material"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('重量')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('数量')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" @blur="changeVal(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单位')">
            <template slot-scope="scope">
              <el-select v-model="scope.row.unit" :placeholder="$t('请选择单位')">
                <el-option
                  v-for="item in unitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单价')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit_value" @blur="changeVal(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('总价值')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('币种')" width="140">
            <template slot-scope="scope">
              <el-select v-model="scope.row.currency" :placeholder="$t('请选择币种')">
                <el-option
                  v-for="item in currencyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                class="btn-light-red"
                @click="deleteInfo(scope.$index, infoData)"
                >{{ $t('删除') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <div v-for="item in boxData" :key="item.id">
          <div>{{ item.box_sn }}</div>
          <el-form style="margin-top: 10px">
            <el-form-item :label="$t('税号')">
              <el-input
                :placeholder="$t('请输入税号')"
                class="input-sty"
                v-model="item.tax_number"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('重量')">
              <el-input
                :placeholder="$t('请输入重量')"
                class="input-sty"
                v-model="item.weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="COD">
              <el-input
                :placeholder="$t('请输入')"
                class="input-sty"
                v-model="item.agent_amount"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <el-button
              @click="deleteRows"
              v-if="thirdStatus === 0 || thirdStatus === 3"
              size="small"
              class="btn-light-red"
              style="margin: 10px 0"
              >{{ $t('多选删除') }}</el-button
            >
            <div>
              <el-button class="btn-main" style="margin: 5px 10px 2px 0" @click="customConfig">{{
                $t('自定义配置')
              }}</el-button>
              <add-btn
                @click.native="addNewLine(item.items)"
                v-if="thirdStatus === 0 || thirdStatus === 3"
                >{{ $t('新增') }}</add-btn
              >
            </div>
          </div>
          <el-table
            :data="item.items"
            ref="multipleTables"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%; margin: 10px 0"
          >
            <el-table-column type="selection" width="60"> </el-table-column>
            <el-table-column :label="$t('中文品名')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cn_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('英文品名')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.en_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="sku">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sku"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('海关编码')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.hs_code"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('材质')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.material"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('重量')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('数量')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quantity" @blur="changeVal(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('单位')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.unit" :placeholder="$t('请选择单位')">
                  <el-option
                    v-for="item in unitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('单价')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit_value" @blur="changeVal(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('总价值')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('币种')" width="140">
              <template slot-scope="scope">
                <el-select v-model="scope.row.currency" :placeholder="$t('请选择币种')">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  class="btn-light-red"
                  @click="deleteInfoList(scope.$index, item.items)"
                  >{{ $t('删除') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="cancel">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submit" v-if="thirdStatus === 0 || thirdStatus === 3">{{
          $t('保存')
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showLog" :title="$t('对接日志')" @close="clearLog">
      <el-table :data="logData" border style="width: 100%">
        <el-table-column prop="created_at" :label="$t('时间')"></el-table-column>
        <el-table-column prop="content" :label="$t('内容')"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="showNormal" :title="$t('设置默认值')" @close="clearNormal">
      <el-form :model="declareForm" label-width="100px">
        <el-form-item :label="$t('税号')">
          <el-input
            class="input-sty"
            v-model="declareForm.declare_tax_number"
            :placeholder="$t('请输入税号')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('请选择币种')">
          <el-select v-model="declareForm.declare_currency">
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('请选择单位')">
          <el-select v-model="declareForm.declare_unit">
            <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelNormal">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveNormal">{{ $t('保存') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      activeName: '0',
      tableData: [],
      page_params: {
        status: '',
        keyword: ''
      },
      show: false,
      tableLoading: false,
      id: '',
      localization: {},
      infoData: [],
      boxData: [
        {
          weight: '',
          tax_number: '',
          agent_amount: ''
        }
      ],
      orderSn: '',
      type: null,
      declareNum: [],
      onStatus: '',
      orderId: '',
      currencyList: [],
      unitList: [],
      items: [],
      showLog: false,
      logData: [],
      thirdStatus: null,
      num: '',
      value: '',
      sels: [],
      showFill: false,
      showNormal: false,
      ids: '',
      box: [],
      boxes: [],
      pushType: '',
      third_status: '',
      ruleForm: {
        tax_number: '',
        weight: '',
        agent_amount: ''
      },
      declareForm: {
        declare_tax_number: '',
        declare_currency: '',
        declare_unit: ''
      },
      statusData: [
        {
          id: 0,
          name: this.$t('待对接')
        },
        {
          id: 1,
          name: this.$t('对接中')
        },
        {
          id: 2,
          name: this.$t('对接成功')
        },
        {
          id: 3,
          name: this.$t('对接失败')
        }
      ]
    }
  },
  components: {
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  created() {
    this.handleClick(this.activeName)
    this.getList()
    this.getNormal()
    if (this.id) {
      this.customConfig()
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        status: this.page_params.status,
        third_status: this.third_status,
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }
      this.$request.declareList(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tableData = res.data
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
    handleClick(tab) {
      this.page_params.page = 1
      this.page_params.status = tab.name ? tab.name : tab
      this.getList()
    },
    goSearch() {
      this.getList()
    },
    batchSub() {
      if (!this.declareNum || !this.declareNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.submitDecalre({ ids: this.declareNum }).then(res => {
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
    },
    setNormal() {
      this.showNormal = true
      this.getInit()
    },
    resubmit(id) {
      this.$request.submitDecalre({ ids: [id] }).then(res => {
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
    },
    cancel() {
      this.show = false
      this.ruleForm.tax_number = ''
      this.ruleForm.weight = ''
      this.ruleForm.agent_amount = ''
      this.boxes = []
    },
    cancelNormal() {
      this.showNormal = false
      this.declareForm.declare_tax_number = ''
      this.declareForm.declare_currency = ''
      this.declareForm.declare_unit = ''
    },
    clearFill() {
      this.showFill = false
      this.ruleForm.tax_number = ''
      this.ruleForm.weight = ''
      this.ruleForm.agent_amount = ''
      this.boxes = []
    },
    editDeclareInfo(id, type) {
      this.pushType = type
      this.id = id
      this.showFill = true
      this.getDeclareDetail()
    },
    getLog(id) {
      this.showLog = true
      this.$request.dockingLog(id).then(res => {
        if (res.ret) {
          this.logData = res.data
        }
      })
    },
    goOrderDetail(id) {
      this.$router.push({
        name: 'billDetails',
        params: {
          id
        }
      })
    },
    deleteRow() {
      let val = this.sels
      console.log(val)
      if (val) {
        val.forEach((va, index) => {
          console.log(index)
          this.infoData.forEach((v, i) => {
            console.log(i)
            if (va.id === v.id) {
              this.infoData.splice(i, 1)
            }
          })
        })
      }
      this.$refs.multipleTable.clearSelection()
    },
    deleteRows() {
      let val = this.sels
      console.log(val)
      if (val) {
        val.forEach((va, index) => {
          console.log(index)
          this.boxData.forEach(item => {
            item.items.forEach((v, i) => {
              console.log(i)
              if (va.id === v.id) {
                item.items.splice(i, 1)
              }
            })
          })
        })
      }
    },
    clearLog() {
      this.showLog = false
    },
    clearNormal() {
      this.showNormal = false
    },
    clear() {
      this.show = false
    },
    handleSelectionChange(val) {
      this.sels = val
    },
    addNew() {
      this.infoData.push({
        cn_name: '',
        en_name: '',
        sku: '',
        hs_code: '',
        material: '',
        weight: '',
        quantity: '',
        unit: '',
        unit_value: '',
        value: '',
        currency: ''
      })
    },
    addNewLine(items) {
      items.push({
        cn_name: '',
        en_name: '',
        sku: '',
        hs_code: '',
        material: '',
        weight: '',
        quantity: '',
        unit: '',
        unit_value: '',
        value: '',
        currency: ''
      })
    },
    deleteInfo(index, rows) {
      rows.splice(index, 1)
    },
    deleteInfoList(index, rows) {
      rows.splice(index, 1)
    },
    selectionChange(selection) {
      this.declareNum = selection.map(item => item.id)
    },
    changeVal(row) {
      if (row.quantity && row.unit_value) {
        row.value = row.quantity * row.unit_value
      }
    },
    getStatus() {
      this.page_params.handleQueryChange('third_status', this.third_status)
      this.getList()
    },
    getInfo(id, status, third_status) {
      this.show = true
      this.id = id
      this.onStatus = status
      this.thirdStatus = third_status
      this.getDeclareDetail()
      this.getInit()
    },
    getDeclareInfo(id, third_status) {
      this.show = true
      this.id = id
      this.thirdStatus = third_status
      this.getDeclareDetail()
      this.getInit()
    },
    getDeclareDetail() {
      this.$request.declareDetail(this.id).then(res => {
        if (res.ret) {
          this.type = res.data.push_type
          this.orderId = res.data.id
          this.orderSn = res.data.order_sn
          this.ruleForm.tax_number = res.data.tax_number
          this.ruleForm.weight = res.data.weight
          this.ruleForm.agent_amount = res.data.agent_amount
          if (this.type === 1) {
            this.infoData = res.data.items
          } else {
            this.boxData = res.data.boxes
          }
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getNormal() {
      this.$request.getDefaultValue().then(res => {
        if (res.ret) {
          this.declareForm.declare_tax_number = res.data.declare_tax_number
          this.declareForm.declare_currency = res.data.declare_currency
          this.declareForm.declare_unit = res.data.declare_unit
        }
      })
    },
    customConfig() {
      this.show = false
      dialog({
        type: 'customConfig',
        id: this.id
      })
    },
    batchCustomConfig() {
      if (!this.declareNum || !this.declareNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      dialog({
        type: 'batchCustomConfig',
        id: this.declareNum
      })
    },
    saveNormal() {
      let params = {
        declare_tax_number: this.declareForm.declare_tax_number,
        declare_currency: this.declareForm.declare_currency,
        declare_unit: this.declareForm.declare_unit
      }
      this.$request.setDefaultValue(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.showNormal = false
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
    getInit() {
      this.$request.initDeclare().then(res => {
        if (res.ret) {
          this.currencyList = res.data.currency_list
          this.unitList = res.data.unit_list
        }
      })
    },
    submit() {
      let params = {
        items: [],
        order: {}
      }
      if (this.type === 1) {
        params.items = this.infoData
        params.order.id = this.id
        params.order.weight = this.ruleForm.weight
        params.order.tax_number = this.ruleForm.tax_number
        params.order.agent_amount = this.ruleForm.agent_amount
      } else {
        if (this.boxData) {
          this.boxes = this.boxData.map(item => {
            return {
              id: item.id,
              tax_number: item.tax_number,
              weight: item.weight,
              agent_amount: item.agent_amount
            }
          })
        }
        params.boxes = this.boxes
        this.boxData.forEach(item => {
          item.items.forEach(ele => {
            ele.declare_box_id = item.id
            params.items.push(ele)
          })
          return item.items
        })
      }
      this.$request.editDeclare(this.orderId, params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.getList()
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
}
</script>

<style lang="scss">
.declare-container {
  padding: 10px 15px;
  background-color: #fff ;
  font-size: 14px;
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .el-form-item__label {
    width: 100px;
  }
  .input-sty {
    width: 35% !important;
  }
  .headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-left {
      display: flex;
      .head-search {
        width: 200px;
        margin-left: 10px;
      }
    }
  }
  .reject_color {
    color: red;
  }
  .pass_color {
    color: green;
  }
  .choose-order {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
}
</style>
