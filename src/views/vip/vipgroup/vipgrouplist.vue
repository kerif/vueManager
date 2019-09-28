<template>
  <div class="vipgroup-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div>
    <div class="select-box">
      <add-btn @click.native="addVip">添加客户组</add-btn>
    </div>
    <el-table :data="vipGroupList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="客户组中文名" prop="name_cn"></el-table-column>
      <el-table-column label="客户组英文名" prop="name_en"></el-table-column>
      <el-table-column label="成员数量" prop="user_count"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editVip(scope.row.id, scope.row.name_cn,scope.row.name_en)">修改资料</el-button>
          <el-button class="btn-main" @click="member(scope.row.id)">成员</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
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
  data () {
    return {
      vipGroupList: [],
      tableLoading: false,
      deleteNum: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getUserGroup({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.vipGroupList = res.data
          this.page_params.page = res.meta.current_page
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
    // 用户组分类选择值加载
    goSearchType (val) {
      this.page_params.page = 1
      this.page_params.name_cn = val
      this.getList()
    },
    // 添加客户组
    addVip () {
      dialog({ type: 'editVip' }, () => {
        this.getList()
      })
    },
    // 修改资料
    editVip (id, nameCn, nameEn) {
      dialog({ type: 'editVip', id: id, name_cn: nameCn, name_en: nameEn }, () => {
        this.getList()
      })
    },
    // 成员
    member (id) {
      dialog({ type: 'vipList', id: id })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteData () {
      console.log(this.deleteNum, '2222')
      this.$request.userGroupDelete({
        DELETE: this.deleteNum
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: '操作成功',
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
    }
  }
}
</script>
<style lang="scss">
.vipgroup-list-container {
  .select-box {
    overflow: hidden;
  }
}
</style>
