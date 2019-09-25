<template>
  <div class="vip-list-container">
    <div>
      <search-select placeholder="请选择客户组"></search-select>
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div>
    <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="vipList"
       @selection-change="onSelectChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" type="index" :index="1" width="60"></el-table-column>
      <el-table-column label="客户ID" prop="id"></el-table-column>
      <el-table-column label="客户昵称" prop="name"></el-table-column>
      <el-table-column label="客户组" prop="user_group.name_cn"></el-table-column>
      <el-table-column label="最后登录时间" prop="last_login"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-main" @click="onUpdateGroup(scope.row.id)">修改客户组</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" @click="onUserLogin">禁止登录</el-button>
          <el-button size="small">允许登录</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      vipList: [],
      selectIds: [],
      tableLoading: false
    }
  },
  mixins: [pagination],
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getUsers({
        keyword: this.page_params.keyword
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.vipList = res.data
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改客户组
    onUpdateGroup (id) {
      dialog({ type: 'vipgroup', id: id }, () => {
        this.getList()
      })
    },
    onSelectChange (selection) {
      console.log('select', selection)
      this.selectIds = selection.map(item => item.id)
    },
    // 禁止登录
    onUserLogin () {
      this.$request.forbidLogin(this.selectIds).then(res => {
        this.getList()
      })
    }
  },
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination
  }
}
</script>
