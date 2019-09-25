<template>
  <div class="vipgroup-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div>
    <div class="select-box">
      <search-select placeholder="请选择客户组"></search-select>
      <add-btn @click.native="addVip">添加客户组</add-btn>
    </div>
    <el-table :data="vipGroupList" stripe border class="data-list"
    v-loading="tableLoading">
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
          <el-button size="small">删除</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      vipGroupList: [],
      tableLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getUserGroup({
        keyword: this.page_params.keyword
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.vipGroupList = res.data
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
    addVip () {
      dialog({ type: 'editVip' })
    },
    // 修改资料
    editVip (id, nameCn, nameEn) {
      dialog({ type: 'editVip', id: id, name_cn: nameCn, name_en: nameEn })
    },
    // 成员
    member (id) {
      dialog({ type: 'vipList', id: id })
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
