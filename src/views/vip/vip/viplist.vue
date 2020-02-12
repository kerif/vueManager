<template>
  <div class="vip-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      <search-select placeholder="请选择客户组" :selectArr="clientGroupList"
          v-model="page_params.group" @search="onGroupChange">
        </search-select>
      </search-group>
    </div>
    <!-- <div class="select-box">
    </div> -->
    <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="vipList"
       @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" type="index" :index="1" width="60"></el-table-column>
      <el-table-column label="客户ID">
        <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
        <i class="el-icon-lock" v-if="scope.row.forbid_login"></i>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="手机号码" prop="phone"></el-table-column>
      <el-table-column label="客户昵称" prop="name"></el-table-column>
      <el-table-column label="客户组" prop="user_group.name_cn"></el-table-column>
      <el-table-column label="注册时间" prop="created_at"></el-table-column>
      <el-table-column label="最后登录时间" prop="last_login_at"></el-table-column>
      <el-table-column label="邀请人 " prop="invitor"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-main optionBtn" @click="onUpdateGroup(scope.row.id)">修改客户组</el-button>
          <el-button class="btn-dark-green optionBtn" @click="invite(scope.row.id)">邀请记录</el-button>
          <el-button class="btn-light-red optionBtn" @click="voucher(scope.row.id)">券包</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-deep-blue" @click="forbidLogin(0)">禁止登录</el-button>
          <el-button size="small" class="btn-green" @click="forbidLogin(1)">允许登录</el-button>
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
  name: 'vipList',
  data () {
    return {
      vipList: [],
      deleteNum: [],
      tableLoading: false,
      clientGroupList: [],
      page_params: {
        group: ''
      }
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
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          console.log('back', JSON.stringify(this.page_params))
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
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
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
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
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
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
}
</style>
