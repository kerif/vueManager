<template>
  <div class="sleep-reminder-container">
    <!-- <h3 style="background-color: #fdf6ed; padding: 10px; color: #e6a344">功能内测中</h3> -->
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
            :start-placeholder="$t('登录开始日期')"
            :end-placeholder="$t('登录结束日期')"
          >
          </el-date-picker>
        </div>
        <div class="chooseStatus">
          <el-select size="mini" v-model="page_params.agent_id" clearable :placeholder="$t('代理')">
            <el-option
              v-for="item in agentList"
              :key="item.id"
              :value="item.user_id"
              :label="item.agent_name"
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

    <div class="content">
      <div class="searchGroup">
        <div class="bottom-sty">
          <el-button class="btn-deep-purple" size="small" @click="confirmWake">{{
            $t('批量唤醒')
          }}</el-button>
          <el-button class="btn-blue-green" size="small" @click="sleepWake">{{
            $t('沉睡设置')
          }}</el-button>
        </div>
        <div class="search-l">
          <search-group
            :placeholder="$t('请输入关键字')"
            v-model="page_params.keyword"
            @search="goSearch"
          >
          </search-group>
          <div class="filter">
            <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
              >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
            ></el-button>
          </div>
        </div>
      </div>
      <div>
        <el-table
          :data="tableShip"
          stripe
          border
          class="data-list"
          ref="table"
          @selection-change="selectionChange"
          height="calc(100vh - 255px)"
          v-loading="tableLoading"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column :label="$t('会员ID')" prop="id"></el-table-column>
          <el-table-column :label="$t('会员昵称')" prop="name"></el-table-column>
          <el-table-column :label="$t('代理')" prop="invitor"></el-table-column>
          <el-table-column :label="$t('未登录天')" prop="not_login_days"></el-table-column>
          <el-table-column :label="$t('未下单天')" prop="not_order_days"></el-table-column>
          <el-table-column
            :label="$t('最后下单时间')"
            prop="last_order_at"
            width="155"
          ></el-table-column>
          <el-table-column
            :label="$t('登录时间')"
            prop="last_login_at"
            width="155"
          ></el-table-column>
          <el-table-column
            :label="$t('最近唤醒时间')"
            prop="wakeup_time"
            width="155"
          ></el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$t('操作')" width="116px" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-green" @click="wake(scope.row.id)">{{ $t('唤醒') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>

    <!-- 轨迹 -->
    <el-dialog :visible.sync="sleepDialog" width="65%" :title="$t('沉睡设置')" @close="clearSn">
      <div style="margin-bottom: 20px">
        <p>{{ $t('请选择同时满足以下规则为沉睡会员') }}</p>
        <el-row>
          <el-col :span="10">
            {{ $t('未登录天数大于') }}
            <el-input class="input-sty" v-model="no_login_days"></el-input>{{ $t('天') }}
          </el-col>
          <el-col :span="10" :offset="2">
            {{ $t('未下单天数大于') }}
            <el-input class="input-sty" v-model="no_order_days"></el-input>{{ $t('天') }}
          </el-col>
        </el-row>
      </div>
      <div class="sleep-tips">{{ $t('不填写或填写数值为0代表不启用该条件') }}</div>
      <div slot="footer">
        <el-button @click="sleepDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="changeSleep">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  name: 'shipContainer',
  data() {
    return {
      tableShip: [], // 表格数据
      localization: {},
      tableLoading: false,
      deleteNum: [],
      timeList: [],
      begin_date: '',
      end_date: '',
      shipped_begin_date: '',
      shipped_end_date: '',
      urlExcel: '',
      checked: '',
      page_params: {
        agent_id: ''
      },
      agentList: [],
      trackDialog: false,
      modeData: [],
      form: {
        logistics_type_id: ''
      },
      sleepDialog: false,
      tableData: [],
      tableId: '',
      tableSn: '',
      batchDialog: false,
      // batchId: '',
      urlName: '',
      fileList: [],
      hasFilterCondition: true,
      radio: '',
      no_order_days: '',
      no_login_days: ''
    }
  },
  created() {},
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  mounted() {
    this.getList()
    this.agentData()
  },
  methods: {
    // 获取代理数据
    agentData() {
      this.$request.getAgent().then(res => {
        if (res.ret) {
          this.agentList = res.data
        }
      })
    },
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        agent_id: this.page_params.agent_id
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      // 发货时间
      this.shipped_begin_date && (params.shipped_begin_date = this.shipped_begin_date)
      this.shipped_end_date && (params.shipped_end_date = this.shipped_end_date)
      this.$request.getAsleep(params).then(res => {
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
    wake(id) {
      this.$confirm(this.$t('是否确认唤醒客户'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .batchWake({
            ids: [id]
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
    // 批量唤醒
    confirmWake() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认批量唤醒客户'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .batchWake({
            ids: this.deleteNum
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
      })
    },
    // 更改唤醒时间
    changeSleep() {
      this.$request
        .updateSleepRules({
          no_login_days: this.no_login_days,
          no_order_days: this.no_order_days
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.sleepDialog = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    clearSn() {},
    sleepWake() {
      this.sleepDialog = true
      this.getRules()
    },
    // 获取沉睡设置
    getRules() {
      this.$request.getSleepRules().then(res => {
        if (res.ret) {
          this.no_login_days = res.data.no_login_days
          this.no_order_days = res.data.no_order_days
        }
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
    // 发货状态选择
    onShipStatus() {
      this.page_params.handleQueryChange('agent_id', this.page_params.agent_id)
      this.getList()
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.page_params.agent_id = ''
    },
    // 提交表单
    submitForm() {
      console.log('111')
      this.onTime(this.timeList)
      this.onShipStatus()
    }
  }
}
</script>
<style lang="scss">
.sleep-reminder-container {
  background-color: #f5f5f5;
  .content {
    background-color: #fff;
    padding: 15px 20px;
  }
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
  .input-sty {
    width: 40%;
    margin-left: 10px;
    margin-right: 10px;
  }
  .sleep-tips {
    margin-top: 10px;
    color: gray;
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
