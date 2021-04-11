<template>
  <div class="vip-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      <search-select :selectArr="clientGroupList"
          v-model="page_params.group" @search="onGroupChange">
        </search-select>
        <div class="import-list">
          <el-button @click="uploadList">{{$t('导出Excel')}}</el-button>
          <el-button @click="addUser">{{$t('添加用户')}}</el-button>
        </div>
      </search-group>
    </div>
    <!-- <div class="select-box">
    </div> -->
    <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="vipList"
       @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('序号')" type="index" :index="1" width="60"></el-table-column>
      <el-table-column :label="$t('客户ID')">
        <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
        <i class="el-icon-lock" v-if="scope.row.forbid_login"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('客户编号')" prop="uid"></el-table-column> -->
      <el-table-column :label="$t('邮箱')" prop="email"></el-table-column>
      <el-table-column :label="$t('手机号码')" prop="phone"></el-table-column>
      <el-table-column prop="balance" :label="$t('余额') + this.localization.currency_unit"></el-table-column>
      <el-table-column :label="$t('客户昵称')" prop="name"></el-table-column>
      <el-table-column :label="$t('客户组')" prop="user_group.name_cn"></el-table-column>
      <el-table-column :label="$t('注册时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('最后登录时间')" prop="last_login_at"></el-table-column>
      <el-table-column :label="$t('邀请人') " prop="invitor"></el-table-column>
      <el-table-column :label="$t('操作')" width="160" fixed="right">
        <template slot-scope="scope">
           <el-dropdown>
            <el-button type="primary">
              {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- 修改客户组 -->
              <el-dropdown-item class="item-sty" @click.native="onUpdateGroup(scope.row.id)">
                <span>{{$t('修改客户组')}}</span>
              </el-dropdown-item>
              <!-- 邀请记录 -->
              <el-dropdown-item class="item-sty" @click.native="invite(scope.row.id)">
                <span>{{$t('邀请记录')}}</span>
              </el-dropdown-item>
              <!-- 券包 -->
              <el-dropdown-item class="item-sty" @click.native="voucher(scope.row.id)">
                <span>{{$t('券包')}}</span>
              </el-dropdown-item>
              <!-- 个人信息 -->
              <el-dropdown-item class="item-sty" @click.native="checkInfo(scope.row.id, scope.row.name)">
                <span>{{$t('个人信息')}}</span>
              </el-dropdown-item>
              <!-- 操作日志 -->
              <el-dropdown-item class="item-sty" @click.native="getLogs(scope.row.id)">
                <span>{{$t('操作日志')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
           </el-dropdown>
          <!-- <el-button class="btn-main optionBtn" @click="onUpdateGroup(scope.row.id)">{{$t('修改客户组')}}</el-button> -->
          <!-- <el-button class="btn-dark-green optionBtn" @click="invite(scope.row.id)">{{$t('邀请记录')}}</el-button> -->
          <!-- <el-button class="btn-purple optionBtn" @click="voucher(scope.row.id)">{{$t('券包')}}</el-button> -->
          <!-- <el-button class="btn-yellow optionBtn" @click="checkInfo(scope.row.id, scope.row.name)">{{$t('个人信息')}}</el-button> -->
          <!-- <el-button class="btn-blue-green optionBtn" @click="getLogs(scope.row.id)">{{$t('操作日志')}}</el-button> -->
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-deep-blue" @click="forbidLogin(0)">{{$t('禁止登录')}}</el-button>
          <el-button size="small" class="btn-green" @click="forbidLogin(1)">{{$t('允许登录')}}</el-button>
          <el-button size="small" class="btn-light-red" @click="deleteData">{{$t('删除')}}</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'viplist',
  data () {
    return {
      vipList: [],
      deleteNum: [],
      tableLoading: false,
      localization: {},
      clientGroupList: [],
      page_params: {
        group: ''
      },
      urlExcel: ''
    }
  },
  mixins: [pagination],
  created () {
    this.getCategory()
    if (this.$route.query.group) {
      this.page_params.group = Number(this.$route.query.group)
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      console.log('page', JSON.stringify(this.page_params))
      this.tableLoading = true
      this.$request.getUsers({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.page_params.group
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.vipList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
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
    getLogs (id) {
      dialog({ type: 'vipLogs', id: id })
    },
    // 个人信息
    checkInfo (id, name) {
      dialog({ type: 'editInfo', id: id, name: name }, () => {
        this.getList()
      })
    },
    deleteData (id) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.$confirm(this.$t('是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteUser({
          DELETE: this.deleteNum
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
    // 获取客户组
    getCategory () {
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
    onUpdateGroup (id) {
      dialog({ type: 'vipgroup', id: id }, () => {
        this.getList()
      })
    },
    // 导出清单
    uploadList () {
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
    invite (id) {
      dialog({ type: 'inviteList',
        state: 'invite',
        id
      })
    },
    // 券包
    voucher (id) {
      dialog({ type: 'inviteList',
        state: 'voucher',
        id
      }, () => {
        this.getList()
      })
    },
    // 添加用户
    addUser () {
      dialog({ type: 'vipAdd' }, () => {
        this.getList()
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 禁止/允许登录
    forbidLogin (type) {
      console.log(type)
      if (type === 0) {
        this.$request.customerForbid({
          forbid_id: this.deleteNum
        }).then(res => {
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
        this.$request.customerLogin({
          allow_id: this.deleteNum
        }).then(res => {
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
    onGroupChange () {
      this.page_params.handleQueryChange('group', this.page_params.group)
      this.getList()
    }
  },
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination
  }
}
</script>

<style lang="scss">
.vip-list-container {
  .select-box {
    overflow: hidden
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
}
</style>
