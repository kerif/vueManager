<template>
  <div class="vip-list-container">
    <div>
      <search-select placeholder="请选择客户组"></search-select>
      <search-group></search-group>
    </div>
    <el-table class="data-list" border stripe
      :data="vipList">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" type="index" :index="1" width="60"></el-table-column>
      <el-table-column label="客户ID" prop="id"></el-table-column>
      <el-table-column label="客户昵称" prop="name"></el-table-column>
      <el-table-column label="客户组" prop="group"></el-table-column>
      <el-table-column label="最后登录时间" prop="last_login"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button class="btn-main" @click="onUpdateGroup">修改客户组</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small">禁止登录</el-button>
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
      vipList: [
        {
          id: '9012456',
          name: '1111@11111',
          group: '普通客户',
          last_login: '2017-11-08 11:01:11'
        }
      ]
    }
  },
  mixins: [pagination],
  methods: {
    // 修改客户组
    onUpdateGroup () {
      dialog({ type: 'vipgroup' })
    }
  },
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination
  }
}
</script>
