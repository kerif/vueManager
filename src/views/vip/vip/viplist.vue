<template>
  <div class="vip-list-container">
    <div class="bottom-sty">
      <div>
        <el-button size="small" @click="forbidLogin(0)">{{ $t('禁止登录') }}</el-button>
        <el-button size="small" @click="forbidLogin(1)">{{ $t('允许登录') }}</el-button>
        <el-button size="small" @click="deleteData">{{ $t('删除') }}</el-button>
        <div class="import-list">
          <el-button size="small" type="success" plain @click="uploadList">{{
            $t('导出清单')
          }}</el-button>
        </div>
      </div>
      <div class="addUser">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <search-select
          :selectArr="clientGroupList"
          v-model="page_params.group"
          @search="onGroupChange"
        >
        </search-select>
        <add-btn @click.native="addUser">{{ $t('添加客户') }}</add-btn>
      </div>
    </div>
    <!-- <div class="select-box">
    </div> -->
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
          <span>{{ scope.row.id }}</span>
          <i class="el-icon-lock" v-if="scope.row.forbid_login"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('客户编号')" prop="uid"></el-table-column> -->
      <el-table-column :label="$t('邮箱')" prop="email"></el-table-column>
      <el-table-column :label="$t('手机号码')" prop="phone"></el-table-column>
      <el-table-column
        prop="balance"
        :label="$t('余额') + this.localization.currency_unit"
      ></el-table-column>
      <el-table-column :label="$t('客户昵称')" prop="name"></el-table-column>
      <el-table-column :label="$t('客户组')" prop="user_group.name_cn"></el-table-column>
      <el-table-column :label="$t('注册时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('最后登录时间')" prop="last_login_at"></el-table-column>
      <el-table-column :label="$t('邀请人')" prop="invitor"></el-table-column>
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
              <!-- <el-dropdown-item
                class="item-sty"
                @click.native="customerMerger(scope.row.id, scope.row.name)"
              >
                <span>{{ $t('客户合并') }}</span>
              </el-dropdown-item> -->
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
        <span>{{ $t('合并规则：') }}</span> <br />
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
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  name: 'viplist',
  data() {
    return {
      vipList: [],
      deleteNum: [],
      tableLoading: false,
      localization: {},
      clientGroupList: [],
      page_params: {
        group: ''
      },
      urlExcel: '',
      dialogVisible: false,
      customerId: '',
      customerName: '',
      targetID: '',
      target: ''
    }
  },
  mixins: [pagination],
  created() {
    this.getCategory()
    if (this.$route.query.group) {
      this.page_params.group = Number(this.$route.query.group)
    }
  },
  mounted() {
    this.getList()
  },
  activated() {
    this.getList()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    getList() {
      console.log('page', JSON.stringify(this.page_params))
      this.tableLoading = true
      this.$request
        .getUsers({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          user_group_id: this.page_params.group
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
    deleteData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.$confirm(this.$t('是否确认删除？'), this.$t('提示'), {
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
      this.$request.uploadUserExcel().then(res => {
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
            // i.value = i.id
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
          this.dialogVisible = false
        }
      })
    },
    // 添加用户
    addUser() {
      dialog({ type: 'vipAdd' }, () => {
        this.getList()
      })
    },
    selectionChange(selection) {
      console.log(selection, 'selection')
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 禁止/允许登录
    forbidLogin(type) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      console.log(type)
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
      this.getList()
    }
  },
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination,
    AddBtn
  }
}
</script>

<style lang="scss">
.vip-list-container {
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
    // text-align: right;
  }
  .addUser {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    .searchGroup {
      // width: 29.42%;
      // float: left;
      margin-right: 10px;
    }
  }
  .addUser > .add-btn-container {
    margin-left: 10px;
  }
  .bottom-sty {
    width: 100%;
    // margin-top: 20px;
    margin-bottom: 10px;
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
