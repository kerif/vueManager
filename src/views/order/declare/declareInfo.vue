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
      </div>
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
    <el-table
      :data="tableData"
      @selection-change="selectionChange"
      v-loading="tableLoading"
      height="calc(100vh - 270px)"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column type="selection" label="#" width="60"> </el-table-column>
      <el-table-column prop="user_id" :label="$t('客户ID')"> </el-table-column>
      <el-table-column prop="user_name" :label="$t('客户昵称')"> </el-table-column>
      <el-table-column :label="$t('订单号')">
        <template slot-scope="scope">
          <div>
            <router-link class="choose-order" :to="`/order/waybill_list`">
              {{ scope.row.order_sn }}
            </router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="express_line_name" :label="$t('线路名称')"> </el-table-column>
      <el-table-column prop="country_name" :label="$t('收货国家')"> </el-table-column>
      <el-table-column prop="value" :label="$t('申报价值')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('提交时间')"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-blue-green"
            v-if="scope.row.status === 0"
            @click="getDeclareInfo(scope.row.id)"
            >{{ $t('报关信息') }}</el-button
          >
          <el-button
            size="small"
            class="btn-deep-blue"
            v-else
            @click="getInfo(scope.row.id, scope.row.status)"
            >{{ $t('查看') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="show" :title="$t('报关信息')" @close="clear">
      <div v-if="this.type === 1">
        <div>{{ this.orderSn }}</div>
        <add-btn @click.native="addNew">{{ $t('新增') }}</add-btn>
        <el-table :data="infoData" border style="width: 100%">
          <el-table-column type="index" label="#" width="60"> </el-table-column>
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
          <el-table-column :label="$t('数量')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单位')">
            <template slot-scope="scope">
              <el-select v-model="scope.row.unit_name" placeholder="请选择单位">
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
              <el-input v-model="scope.row.unit_value"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('总价值')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('币种')">
            <template slot-scope="scope">
              <el-select v-model="scope.row.currency_name" placeholder="请选择币种">
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
          <el-table-column :label="$t('操作')">
            <el-button
              size="small"
              class="btn-light-red"
              @click="deleteInfo(scope.$index, infoData)"
              >{{ $t('删除') }}</el-button
            >
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <div v-for="item in infoData" :key="item.id">
          <div>{{ item.box_sn }}</div>
          <add-btn @click.native="addNewLine(item.items)">{{ $t('新增') }}</add-btn>
          <el-table :data="item.items" border style="width: 100%">
            <el-table-column type="index" label="#" width="60"> </el-table-column>
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
            <el-table-column :label="$t('数量')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quantity"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('单位')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.unit_name" placeholder="请选择单位">
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
                <el-input v-model="scope.row.unit_value"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('总价值')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('币种')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.currency_name" placeholder="请选择币种">
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
            <el-table-column :label="$t('操作')">
              <el-button
                size="small"
                class="btn-light-red"
                @click="deleteInfoList(scope.$index, item.items)"
                >{{ $t('删除') }}</el-button
              >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="cancel">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
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
      orderSn: '',
      type: null,
      declareNum: [],
      onStatus: '',
      orderId: '',
      currencyList: [],
      unitList: []
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
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.table.doLayout()
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
    },
    clear() {},
    addNew() {
      this.infoData.push({})
    },
    addNewLine(list) {
      list.push({})
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
    getInfo(id, status) {
      this.id = id
      this.onStatus = status
      console.log(this.onStatus)
      this.show = true
      this.getDeclareDetail()
      this.getInit()
    },
    getDeclareInfo(id) {
      this.id = id
      this.show = true
      this.getDeclareDetail()
      this.getInit()
    },
    getDeclareDetail() {
      this.$request.declareDetail(this.id).then(res => {
        if (res.ret) {
          this.type = res.data.push_type
          this.orderId = res.data.id
          if (this.type === 1) {
            this.infoData = res.data.items
          } else {
            this.infoData = res.data.boxes
          }
          this.orderSn = res.data.order_sn
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
      this.$request.editDeclare(this.orderId, this.infoData).then(res => {
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
  .headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-search {
      width: 200px;
    }
  }
}
</style>
