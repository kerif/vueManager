<template>
  <div class="vip-list-container">
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
        <el-button type="primary" plain size="small" @click="submitForm"
          >{{ $t('搜索') }}
        </el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>

    <div class="bottom-sty">
      <div>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-main" size="small" @click="onUserLabel"
            >{{ $t('添加标签') }}
          </el-button>
          <el-button class="btn-main" size="small" @click="onBatchTag">...</el-button>
        </el-button-group>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-purple" size="small" @click="goServies('services')"
            >{{ $t('分配客服') }}
          </el-button>
          <el-button class="btn-purple" size="small" @click="batchAllocate('services')"
            >...
          </el-button>
        </el-button-group>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-deep-blue" size="small" @click="goServies('sale')"
            >{{ $t('分配销售') }}
          </el-button>
          <el-button class="btn-deep-blue" size="small" @click="batchAllocate('sale')"
            >...
          </el-button>
        </el-button-group>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-light-green" size="small" @click="goServies('group')"
            >{{ $t('客户组') }}
          </el-button>
          <el-button class="btn-light-green" size="small" @click="batchAllocate('group')"
            >...
          </el-button>
        </el-button-group>
        <el-button-group class="import-list">
          <el-button size="small" type="success" plain @click="highQualityConditions()"
            >{{ $t('优质客户配置') }}
          </el-button>
        </el-button-group>
      </div>
      <div class="search-l" style="width: 600px; display: flex">
        <el-input
          class="filter"
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="goSearch"
        >
        </el-input>
        <el-button @click="getList()" class="filter" style="background-color: blue; color: #fff">
          {{ $t('搜索') }}
        </el-button>
        <el-button @click="hasFilterCondition = !hasFilterCondition" type="text" class="filter"
          >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
        ></el-button>
      </div>

      <!-- 分配客服 -->
      <el-dialog
        :title="
          staffStatus === 'services'
            ? $t('分配客服')
            : staffStatus === 'sale'
            ? $t('分配销售')
            : $t('分配客户组')
        "
        :visible.sync="dialogStaff"
        width="30%"
        @close="clearAssign"
      >
        <div v-if="staffStatus === 'group'">
          <span>{{ $t('选择客户组') }}</span>
          <el-select v-model="groupId" filterable clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div v-else>
          <span>{{ $t('选择员工') }}</span>
          <el-select v-model="saleId" filterable clearable :placeholder="$t('请选择')">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div slot="footer">
          <el-button @click="dialogStaff = false">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="staffConfirm">{{ $t('确定') }}</el-button>
        </div>
      </el-dialog>
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
        <el-table-column :label="$t('会员ID/编号')" prop="id"></el-table-column>
        <el-table-column :label="$t('会员昵称')" prop="name"></el-table-column>
        <el-table-column :label="$t('代理')" prop="invitor?.name"></el-table-column>
        <el-table-column :label="$t('区间消费总金额')" prop="record_sum_amount"></el-table-column>
        <el-table-column
          :label="$t('最后下单时间')"
          prop="last_pay_time"
          width="155"
        ></el-table-column>
        <el-table-column
          :label="$t('最后登录时间')"
          prop="last_login_at"
          width="155"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="116px" fixed="right">
          <template slot-scope="row">
            <el-button
              class="btn-green item-sty"
              @click.native="checkInfo(row.row.id, row.row.name)"
            >
              {{ $t('查看') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="qualityConditions"
      width="65%"
      :title="$t('优质客户配置')"
      @close="clearSn"
    >
      <div style="margin-bottom: 20px">
        <p>{{ $t('请选择同时满足以下规则为优质会员') }}</p>
        <el-row class="input-row">
          <el-col :span="10" class="input-col">
            {{ $t('近') }}
            <input class="input-sty" v-model="day" />
            {{ $t('天消费金额大于') }}
            <input class="input-sty" v-model="amount" />
            {{ $t('元') }}
          </el-col>
          <el-col :span="10" class="input-col">
            {{ $t('近') }}
            <input class="input-sty" v-model="login_day" />
            {{ $t('天内有登录') }}
          </el-col>
        </el-row>
      </div>
      <div class="quantity-tips">{{ $t('不填写即代表不启用该条件') }}</div>
      <div slot="footer">
        <el-button @click="qualityConditions = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="changeConditions">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <add-user-label
      :showLabel="showLabel"
      :deleteNum="deleteNum"
      @passVal="passVal"
      ref="label"
    ></add-user-label>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import addUserLabel from '@/views/vip/vip/addUserLabel'

export default {
  name: 'highQuality',
  mixins: [pagination],
  data() {
    return {
      page_params: {
        agent_id: '',
        group: '',
        keyword: null,
        user_source: ''
      },
      timeList: [],
      agentList: [],
      groupList: [],
      options: [],
      qualityConditions: false,
      saleId: '',
      date_type: 'last_login_at',
      groupId: '',
      dialogStaff: false,
      staffStatus: '',
      saleList: [],
      deleteNum: [],
      login_day: null,
      tableShip: [], // 表格数据
      tableLoading: false,
      showLabel: false,
      day: 30,
      amount: 2000,
      hasFilterCondition: false
    }
  },
  mounted() {
    this.getList()
    this.agentData()
    this.getUserGroup()
    this.getStaff()
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent_id: this.page_params.agent_id,
        agent: this.agent_name,
        day: this.day,
        amount: this.amount,
        keyword: this.page_params.keyword,
        login_day: this.login_day,
        date_type: this.date_type,
        last_begin_date: this.last_begin_date,
        last_end_date: this.last_end_date
      }
      console.log('+++++++列表参数+++++++')
      console.log(params)
      this.$request.highQualityUsers(params).then(res => {
        this.tableLoading = false
        console.log('+++++++列表数据+++++++')
        console.log(res.data)
        if (res.ret) {
          this.tableShip = res.data
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
    // 搜索客户组列表
    getUserGroup() {
      this.$request.getUserGroup().then(res => {
        if (res.ret) {
          this.groupList = res.data
        }
      })
    },
    // 获取代理数据
    agentData() {
      this.$request.getAgent().then(res => {
        if (res.ret) {
          this.agentList = res.data
        }
      })
    },
    // 获取员工数据
    getStaff() {
      this.$request.getStaff({ size: 1000 }).then(res => {
        if (res.ret) {
          this.options = res.data
          this.customerList = [...res.data]
          this.customerList.push({
            id: -1,
            name: this.$t('未选客服')
          })
          this.saleList = [...res.data]
          this.saleList.push({
            id: -1,
            name: this.$t('未选销售')
          })
        }
      })
    },
    staffConfirm() {
      if (this.staffStatus === 'services') {
        this.$request
          .assignCustomer({
            customer_id: this.saleId,
            user_ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.dialogStaff = false
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else if (this.staffStatus === 'sale') {
        this.$request
          .assignSale({
            sale_id: this.saleId,
            user_ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.dialogStaff = false
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else {
        this.$request.batchEditGroup({ group_id: this.groupId, ids: this.deleteNum }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogStaff = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    clearAssign() {
      this.groupId = ''
      this.saleId = ''
    },
    clearSn() {},
    highQualityConditions() {
      this.qualityConditions = true
    },
    // 优质客户配置
    changeConditions() {
      this.qualityConditions = false
      this.getList()
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    onUserLabel() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.showLabel = true
    },
    passVal() {
      this.showLabel = false
    },
    onBatchTag() {
      dialog(
        {
          type: 'batchTag'
        },
        () => {
          this.getList()
        }
      )
    },
    goServies(status) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.staffStatus = status
      this.dialogStaff = true
      this.getStaff()
    },
    batchAllocate(status) {
      dialog(
        {
          type: 'batchAllocate',
          status
        },
        () => {
          this.getList()
        }
      )
    },
    // 个人信息
    checkInfo(id, name) {
      dialog({ type: 'editInfo', id: id, name: name }, () => {
        this.getList()
      })
    },
    // 重置表单
    resetForm() {
      this.page_params.agent_id = ''
      this.timeList = []
    },
    // 提交表单
    submitForm() {
      // 提交时间
      this.date_type = 'last_login_at'
      this.last_begin_date = this.timeList ? this.timeList[0] : null
      this.last_end_date = this.timeList ? this.timeList[1] : null
      this.getList()
    }
  },
  components: {
    NlePagination,
    addUserLabel
  }
}
</script>

<style lang="scss">
.vip-list-container {
  .advanced-search {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    font-size: 14px;
    background-color: #fff;

    .search-item {
      display: flex;
      gap: 10px;
      align-items: center;

      .search-content {
        margin-bottom: 5px;
      }
    }
  }

  @media screen and (max-width: 1536px) {
    .advanced-search {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  }

  .balance {
    color: red;
  }

  .btnList:after {
    content: '';
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  .select-box {
    overflow: hidden;
  }

  .el-icon-lock {
    color: red;
  }

  .optionBtn {
    margin: 3px;
  }

  .import-list {
    display: inline-block;
    margin-left: 10px;

    .search-l {
      display: flex;
      justify-content: flex-end;
      flex: 1;
      padding-right: 10px;

      .filter {
        display: flex;
        margin-left: 10px;
      }
    }
  }

  .bottom-sty {
    width: 100%;
    padding: 10px 0;
    background-color: #fff;
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .group-sty {
    width: 18px;
    margin-left: 3px;
    vertical-align: middle;
  }

  .flex-btn {
    display: flex;
    align-items: center;

    .flex-left {
      flex: 1;
    }

    .flex-right {
      flex: auto;
    }
  }
  .quantity-tips {
    margin-top: 10px;
    color: gray;
  }
  .input-row {
    display: flex;
    .input-col {
      display: flex;
      align-items: center;
      input {
        display: flex;
        width: 100px;
        height: 30px;
      }
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
.el-input__inner:hover {
  border-color: #c0c4cc;
}
</style>
