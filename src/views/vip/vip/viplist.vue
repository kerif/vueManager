<template>
  <div class="vip-list-container">
    <div class="advanced-search" v-if="hasFilterCondition">
      <div class="search-item">
        <div>{{ $t('VIP等级') }}</div>
        <el-select v-model="searchParams.level_id" :placeholder="$t('请选择VIP等级')" clearable>
          <el-option v-for="item in gradeList" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <div>{{ $t('客户组') }}</div>
        <el-select v-model="searchParams.user_group_id" clearable :placeholder="$t('请选择客户组')">
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :value="item.id"
            :label="item.name_cn"
          >
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <div>{{ $t('所属客服') }}</div>
        <el-select v-model="searchParams.customer_id" clearable :placeholder="$t('请选择所属客服')">
          <el-option
            v-for="item in customerList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <div>{{ $t('所属销售') }}</div>
        <el-select v-model="searchParams.sale_id" clearable :placeholder="$t('请选择所属销售')">
          <el-option v-for="item in saleList" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <div>{{ $t('邀请人') }}</div>
        <el-select
          v-model="searchParams.invite_id"
          filterable
          remote
          clearable
          :placeholder="$t('请输入邀请人')"
          :remote-method="inviteMethod"
          :loading="inviteLoading"
        >
          <el-option v-for="item in inviteList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <div>{{ $t('余额范围') }}</div>
        <el-input
          v-model="searchParams.min_balance"
          :placeholder="$t('请输入最小余额')"
          clearable
          style="width: 35%"
        ></el-input>
        -
        <el-input
          v-model="searchParams.max_balance"
          :placeholder="$t('请输入最大余额')"
          clearable
          style="width: 35%"
        ></el-input>
      </div>
      <div class="search-item">
        <div>{{ $t('积分范围') }}</div>
        <el-input
          v-model="searchParams.min_point"
          :placeholder="$t('请输入最小积分')"
          clearable
          style="width: 35%"
        ></el-input>
        -
        <el-input
          v-model="searchParams.max_point"
          :placeholder="$t('请输入最大积分')"
          clearable
          style="width: 35%"
        ></el-input>
      </div>
      <div class="search-item">
        <div>{{ $t('订单数范围') }}</div>
        <el-input
          v-model="searchParams.min_order_count"
          :placeholder="$t('请输入最小订单数')"
          clearable
          style="width: 35%"
        ></el-input>
        -
        <el-input
          v-model="searchParams.max_order_count"
          :placeholder="$t('请输入最大订单数')"
          clearable
          style="width: 35%"
        ></el-input>
      </div>
      <div class="search-item">
        <div>{{ $t('注册时间') }}</div>
        <el-date-picker
          v-model="searchTime"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="search-item">
        <div>{{ $t('客户来源') }}</div>
        <el-select v-model="searchParams.user_source" clearable :placeholder="$t('请选择客户来源')">
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="search-item">
        <el-button size="small" class="btn-blue" @click="getList">{{ $t('搜索') }}</el-button>
        <el-button size="small" class="btn-light-red" @click="reset">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="bottom-sty">
      <div>
        <el-button class="btn-orangey-red" size="small" @click="forbidLogin(0)">{{
          $t('禁止登录')
        }}</el-button>
        <el-button class="btn-blue-green" size="small" @click="forbidLogin(1)">{{
          $t('允许登录')
        }}</el-button>
        <el-button class="btn-light-red" size="small" @click="deleteData">{{
          $t('删除')
        }}</el-button>
        <el-button class="btn-main" size="small" @click="onUserLabel">{{
          $t('添加标签')
        }}</el-button>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-purple" size="small" @click="goServies('services')">{{
            $t('分配客服')
          }}</el-button>
          <el-button class="btn-purple" size="small" @click="batchAllocate('services')"
            >...</el-button
          >
        </el-button-group>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-deep-blue" size="small" @click="goServies('sale')">{{
            $t('分配销售')
          }}</el-button>
          <el-button class="btn-deep-blue" size="small" @click="batchAllocate('sale')"
            >...</el-button
          >
        </el-button-group>
        <el-button-group style="margin: 0 0 0 10px">
          <el-button class="btn-light-green" size="small" @click="goServies('group')">{{
            $t('客户组')
          }}</el-button>
          <el-button class="btn-light-green" size="small" @click="batchAllocate('group')"
            >...</el-button
          >
        </el-button-group>
        <div class="import-list">
          <el-button size="small" type="success" plain @click="uploadList">{{
            $t('导出清单')
          }}</el-button>
        </div>
      </div>
      <div class="addUser">
        <search-select
          :selectArr="clientSourceList"
          v-model="page_params.user_source"
          @search="onSource"
        >
        </search-select>
        <!-- <el-select
          v-model="page_params.source"
          :placeholder="$t('客户来源')"
          clearable
          @change="onSource"
        >
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select> -->
        <add-btn style="margin-right: 10px" size="small" plain @click.native="addUser">{{
          $t('添加客户')
        }}</add-btn>
        <search-select
          :selectArr="clientGroupList"
          v-model="page_params.group"
          @search="onGroupChange"
        >
        </search-select>
        <!-- <el-select
          v-model="page_params.group"
          clearable
          :placeholder="$t('请选择')"
          @change="onGroupChange"
        >
          <el-option
            v-for="item in clientGroupList"
            :key="item.id"
            :value="item.id"
            :label="item.name_cn"
          >
          </el-option>
        </el-select> -->
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
          >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
        ></el-button>
      </div>
    </div>
    <el-table
      class="data-list"
      border
      stripe
      ref="table"
      v-loading="tableLoading"
      :data="vipList"
      @selection-change="selectionChange"
      height="calc(100vh - 270px)"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('序号')" type="index" :index="1" width="60"></el-table-column>
      <el-table-column :label="$t('客户ID')">
        <template slot-scope="scope">
          <!-- <span
            @click="
              details(
                scope.row.id,
                scope.row.member_level_name,
                scope.row.customer_name,
                scope.row.balance,
                scope.row.created_at,
                scope.row.name,
                scope.row.email,
                scope.row.point,
                scope.row.sale_name,
                scope.row.last_login_at,
                scope.row.phone,
                scope.row.user_group.name_cn,
                scope.row.order_count,
                scope.row.avatar
              )
            "
            style="cursor: pointer"
            >{{ scope.row.id }}</span
          > -->
          <span>{{ scope.row.id }}</span>
          <i class="el-icon-lock" v-if="scope.row.forbid_login"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('客户编号')" prop="uid"></el-table-column> -->
      <el-table-column :label="$t('邮箱')" prop="email" width="200"></el-table-column>
      <el-table-column :label="$t('手机号码')" prop="phone" width="150"></el-table-column>
      <el-table-column :label="$t('余额') + this.localization.currency_unit">
        <template slot-scope="scope">
          <div>
            <span v-bind:style="{ color: scope.row.balance > 0 ? 'red' : '' }">
              {{ scope.row.balance }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('积分')" prop="point">
        <template slot-scope="scope">
          <div>
            <span v-bind:style="{ color: scope.row.point > 0 ? 'blue' : '' }">
              {{ scope.row.point }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('客户昵称')" prop="name" width="150"></el-table-column>
      <el-table-column :label="$t('订单数')" prop="order_count"></el-table-column>
      <el-table-column
        :label="$t('VIP等级')"
        prop="member_level_name"
        align="center"
      ></el-table-column>
      <el-table-column :label="$t('成长值')" align="center" prop="growth_value"></el-table-column>
      <el-table-column
        :label="$t('客户组')"
        prop="user_group.name_cn"
        align="center"
      ></el-table-column>
      <el-table-column :label="$t('客户标签')" prop="tags">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item.id" type="warning">{{
            item.name
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('所属客服')" prop="customer_name"></el-table-column>
      <el-table-column :label="$t('所属销售')" prop="sale_name"></el-table-column>
      <el-table-column :label="$t('客户来源')" prop="user_source"> </el-table-column>
      <el-table-column :label="$t('注册时间')" prop="created_at" width="155"></el-table-column>
      <el-table-column
        :label="$t('最后登录时间')"
        prop="last_login_at"
        width="155"
      ></el-table-column>
      <el-table-column :label="$t('邀请人')" prop="invitor" width="120">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.invitor }}</span>
            <span v-if="scope.row.is_agent_invite === 1">
              <img class="group-sty" src="../../../assets/agent.png" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="116px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" plain>
              {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- 修改客户组 -->
              <el-dropdown-item class="item-sty" @click.native="onUpdateGroup(scope.row.id)">
                <span>{{ $t('修改客户组') }}</span>
              </el-dropdown-item>
              <!-- 邀请记录 -->
              <el-dropdown-item class="item-sty" @click.native="invite(scope.row.id)">
                <span>{{ $t('邀请记录') }}</span>
              </el-dropdown-item>
              <!-- 券包 -->
              <el-dropdown-item class="item-sty" @click.native="voucher(scope.row.id)">
                <span>{{ $t('券包') }}</span>
              </el-dropdown-item>
              <!-- 个人信息 -->
              <el-dropdown-item
                class="item-sty"
                @click.native="checkInfo(scope.row.id, scope.row.name)"
              >
                <span>{{ $t('个人信息') }}</span>
              </el-dropdown-item>
              <!-- 操作日志 -->
              <el-dropdown-item class="item-sty" @click.native="getLogs(scope.row.id)">
                <span>{{ $t('操作日志') }}</span>
              </el-dropdown-item>
              <!-- 客户合并 -->
              <el-dropdown-item
                class="item-sty"
                @click.native="customerMerger(scope.row.id, scope.row.name)"
              >
                <span>{{ $t('客户合并') }}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="editPassword(scope.row.id)">
                <span>{{ $t('修改密码') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="$t('客户合并')" :visible.sync="dialogVisible" width="50%">
      <div>
        <p>{{ $t('当前客户ID') }}</p>
        <p>{{ customerId }}&nbsp;---&nbsp;{{ customerName }}</p>
        <p>*{{ $t('请输入合并目标客户ID') }}</p>
        <!-- <el-input style="width: 40%" v-model="targetID"></el-input> -->
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入客户ID')"
          v-model="target"
        >
        </el-autocomplete>
      </div>
      <div style="margin-top: 40px">
        <span>{{ $t('合并规则') }}</span> <br />
        <span>1、{{ $t('合并客户ID时，保留当前客户ID下所有信息；') }}</span
        ><br />
        <span
          >2、{{
            $t(
              '合并目标客户的【余额、订单、包裹、收件地址、佣金、代理客户、交易记录、充值记录】合并至当前客户ID，其他信息清空；'
            )
          }}</span
        >
        <br />
        <span
          >3、{{
            $t(
              '目标客户ID合并后即作废，绑定的手机号、邮箱、微信也自动解除绑定，可用于重新绑定其他客户ID。'
            )
          }}</span
        >
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="mergeConfirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
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
        <span>{{ $t('选择客户组') }}</span> &nbsp;&nbsp;
        <el-select v-model="groupId" clearable :placeholder="$t('请选择')">
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name_cn"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div v-else>
        <span>{{ $t('选择员工') }}</span
        >&nbsp;&nbsp;
        <el-select v-model="saleId" clearable :placeholder="$t('请选择')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="dialogStaff = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="staffConfirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('修改密码')" :visible.sync="dialogPwd" width="30%" @close="clear">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('重置密码')" prop="passowrd">
          <el-input
            v-model="ruleForm.password"
            type="password"
            :placeholder="$t('请输入重置密码')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('再次输入重置密码')" prop="confirm_password">
          <el-input
            v-model="ruleForm.confirm_password"
            type="password"
            :placeholder="$t('请再次输入重置密码')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogPwd = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="pwdConfirm('ruleForm')">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <add-user-label
      :showLabel="showLabel"
      :deleteNum="deleteNum"
      @passVal="passVal"
      ref="label"
    ></add-user-label>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
import addUserLabel from './addUserLabel.vue'
export default {
  name: 'viplist',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入重置密码')))
      } else if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        password: '',
        confirm_password: ''
      },
      rules: {
        password: [
          { required: true, message: this.$t('请输入重置密码'), trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ],
        confirm_password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ]
      },
      vipList: [],
      deleteNum: [],
      tableLoading: false,
      localization: {},
      clientGroupList: [],
      page_params: {
        group: '',
        user_source: ''
      },
      urlExcel: '',
      dialogVisible: false,
      customerId: '',
      customerName: '',
      targetID: '',
      target: '',
      options: [],
      saleId: '',
      groupId: '',
      dialogStaff: false,
      dialogPwd: false,
      pwdId: '',
      staffStatus: '',
      searchParams: {
        level_id: '',
        user_group_id: '',
        invite_id: '',
        customer_id: '',
        sale_id: '',
        max_balance: '',
        min_balance: '',
        max_point: '',
        min_point: '',
        max_order_count: '',
        min_order_count: '',
        user_source: ''
      },
      searchTime: [],
      gradeList: [],
      groupList: [],
      staffList: [],
      inviteList: [],
      customerList: [],
      saleList: [],
      sourceList: [],
      clientSourceList: [],
      inviteLoading: false,
      hasFilterCondition: false,
      showLabel: false
    }
  },
  mixins: [pagination],
  created() {
    this.getCategory()
    this.getUserSource()
    if (this.$route.query.group) {
      this.page_params.group = Number(this.$route.query.group)
    }
  },
  mounted() {
    this.getList()
    this.getGradeList()
    this.getUserGroup()
    this.getStaff()
    this.getClientUser()
  },
  activated() {
    this.getList()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    getList() {
      this.tableLoading = true
      if (!this.searchTime) {
        this.searchTime = []
      }
      console.log(this.page_params.group)
      this.$request
        .getUsers({
          ...this.searchParams,
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          user_group_id: this.searchParams.user_group_id
            ? this.searchParams.user_group_id
            : this.page_params.group,
          user_source: this.searchParams.user_source
            ? this.searchParams.user_source
            : this.page_params.user_source,
          min_balance: this.searchParams.min_balance ? this.searchParams.min_balance * 100 : '',
          max_balance: this.searchParams.max_balance ? this.searchParams.max_balance * 100 : '',
          begin_date: this.searchTime[0],
          end_date: this.searchTime[1]
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.vipList = res.data
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.table.doLayout()
              })
            }, 300)
            console.log('back', JSON.stringify(this.page_params))
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    reset() {
      this.searchParams.level_id = ''
      this.searchParams.user_group_id = ''
      this.searchParams.invite_id = ''
      this.searchParams.customer_id = ''
      this.searchParams.sale_id = ''
      this.searchParams.min_balance = ''
      this.searchParams.max_balance = ''
      this.searchParams.min_point = ''
      this.searchParams.max_point = ''
      this.searchParams.min_order_count = ''
      this.searchParams.max_order_count = ''
      this.searchParams.user_source = ''
      this.searchTime = []
      this.getList()
    },
    // 搜索等级列表
    getGradeList() {
      this.$request.getGradeList().then(res => {
        if (res.ret) {
          this.gradeList = res.data.map(item => {
            return {
              id: item.id,
              name: item.name
            }
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
    getUserSource() {
      this.$request.userSource().then(res => {
        res.data.unshift({
          id: '',
          name: this.$t('全部')
        })
        this.sourceList = res.data
      })
    },
    getClientUser() {
      this.$request.userSource().then(res => {
        res.data.unshift({
          id: '',
          name: this.$t('全部')
        })
        res.data.forEach(item => {
          this.clientSourceList.push({
            value: item.id,
            label: item.name
          })
        })
      })
    },
    inviteMethod(keyword) {
      this.inviteLoading = true
      this.$request.getUsers({ keyword }).then(res => {
        if (res.ret) {
          this.inviteLoading = false
          this.inviteList = res.data.map(item => {
            return {
              id: item.id,
              name: item.name
            }
          })
          this.inviteList.push({
            id: -1,
            name: this.$t('无邀请人')
          })
        }
      })
    },
    // 操作日志
    getLogs(id) {
      dialog({ type: 'vipLogs', id: id })
    },
    // 个人信息
    checkInfo(id, name) {
      dialog({ type: 'editInfo', id: id, name: name }, () => {
        this.getList()
      })
    },
    editPassword(id) {
      this.pwdId = id
      this.dialogPwd = true
    },
    onSource() {
      this.page_params.handleQueryChange('user_source', this.page_params.user_source)
      this.getList()
    },
    pwdConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.editCustomPwd(this.pwdId, { ...this.ruleForm }).then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.dialogPwd = false
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    clear() {
      this.pwdId = ''
      this.ruleForm = {
        password: '',
        confirm_password: ''
      }
    },
    clearAssign() {
      this.groupId = ''
      this.saleId = ''
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
    details(
      id,
      member_level_name,
      customer_name,
      balance,
      created_at,
      name,
      email,
      point,
      sale_name,
      last_login_at,
      phone,
      name_cn,
      order_count,
      avatar
    ) {
      let obj = {
        member_level_name: member_level_name,
        customer_name: customer_name,
        balance: balance,
        created_at: created_at,
        name: name,
        email: email,
        point: point,
        sale_name: sale_name,
        last_login_at: last_login_at,
        phone: phone,
        name_cn: name_cn,
        order_count: order_count,
        avatar: avatar
      }
      this.$router.push({
        name: 'vipListDetails',
        params: { id: id },
        query: {
          info: JSON.stringify(obj)
        }
      })
    },
    deleteData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteUser({
            DELETE: this.deleteNum
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
    goServies(status) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.staffStatus = status
      this.dialogStaff = true
      this.getStaff()
    },
    // 获取客户组
    getCategory() {
      this.$request.getSimple().then(res => {
        res.data.forEach(item => {
          this.clientGroupList.push({
            value: item.id,
            label: item.name_cn
          })
        })
      })
    },
    // 修改客户组
    onUpdateGroup(id) {
      dialog({ type: 'vipgroup', id: id }, () => {
        this.getList()
      })
    },
    // 导出清单
    uploadList() {
      this.$request
        .uploadUserExcel({
          ...this.searchParams,
          keyword: this.page_params.keyword,
          user_group_id: this.searchParams.user_group_id
            ? this.searchParams.user_group_id
            : this.page_params.group,
          min_balance: this.searchParams.min_balance ? this.searchParams.min_balance * 100 : '',
          max_balance: this.searchParams.max_balance ? this.searchParams.max_balance * 100 : '',
          begin_date: this.searchTime[0],
          end_date: this.searchTime[1]
        })
        .then(res => {
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
    invite(id) {
      dialog({ type: 'inviteList', state: 'invite', id })
    },
    // 券包
    voucher(id) {
      dialog({ type: 'inviteList', state: 'voucher', id }, () => {
        this.getList()
      })
    },
    // 合并客户
    customerMerger(id, name) {
      this.customerId = id
      this.customerName = name
      this.dialogVisible = true
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      console.log(this.target)
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.target.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    // 客户id
    handleSelect(item) {
      console.log(item)
    },
    //确定合并
    mergeConfirm() {
      if (!this.target) {
        return this.$message.error(this.$t('请输入目标客户ID'))
      }
      this.targetID = this.target.split('---')[0]
      this.$request.mergeCustomer(this.customerId, this.targetID).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.dialogVisible = false
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
    // 添加用户
    addUser() {
      dialog({ type: 'vipAdd' }, () => {
        this.getList()
      })
    },
    onUserLabel() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.showLabel = true
      this.$refs.label.getList()
    },
    passVal() {
      this.showLabel = false
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    // 禁止/允许登录
    forbidLogin(type) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      if (type === 0) {
        this.$request
          .customerForbid({
            forbid_id: this.deleteNum
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
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        this.$request
          .customerLogin({
            allow_id: this.deleteNum
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
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    },
    // 选择客户组
    onGroupChange() {
      this.page_params.handleQueryChange('group', this.page_params.group)
      console.log(this.page_params.group)
      this.getList()
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
    }
  },
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination,
    AddBtn,
    addUserLabel
  }
}
</script>

<style lang="scss">
.vip-list-container {
  .advanced-search {
    display: grid;
    gap: 20px;
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
  }
  .addUser {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    .searchGroup {
      margin-right: 10px;
    }
  }
  .addUser > .add-btn-container {
    margin-left: 10px;
  }
  .bottom-sty {
    width: 100%;
    margin-bottom: 10px;
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
}
</style>
