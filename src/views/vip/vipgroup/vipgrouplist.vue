<template>
  <div class="vipgroup-list-container">
    <div><search-group></search-group></div>
    <div class="select-box">
      <search-select placeholder="请选择客户组"></search-select>
      <add-btn>添加客户组</add-btn>
    </div>
    <el-table :data="vipGroupList" stripe border class="data-list">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="客户组中文名" prop="cn_name"></el-table-column>
      <el-table-column label="客户组英文名" prop="en_name"></el-table-column>
      <el-table-column label="客户组" prop="name"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button class="btn-green">修改资料</el-button>
          <el-button class="btn-main">成员</el-button>
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
export default {
  data () {
    return {
      vipGroupList: [
        {
          id: 1,
          cn_name: '秦奋',
          en_name: 'Super_Admin',
          name: '15'
        }
      ]
    }
  },
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination]
}
</script>
<style lang="scss">
.vipgroup-list-container {
  .select-box {
    overflow: hidden;
  }
}
</style>
