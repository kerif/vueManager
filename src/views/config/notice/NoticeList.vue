<template>
  <div class="notice-list-container">
    <div class="clear-box"><add-btn router="noticeadd">添加</add-btn></div>
    <el-table class="data-list" stripe border :data="noticeList">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="创建人" prop="user"></el-table-column>
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button class="btn-green">修改</el-button>
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
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      noticeList: [
        {
          id: 1,
          title: '如何下单',
          type: '常见问题',
          user: 'admin',
          created_at: '2017-11-08 11:01:11'
        }
      ]
    }
  },
  mixins: [pagination],
  components: {
    AddBtn,
    NlePagination
  }
}
</script>
