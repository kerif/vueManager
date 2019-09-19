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
        <template slot-scope="scope">
          <el-button class="btn-green" @click="noticeEdit(scope.row.id)">修改</el-button>
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
  mixins: [pagination],
  components: {
    AddBtn,
    NlePagination
  },
  data () {
    return {
      noticeList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getNotice().then(res => {
        this.noticeList = res.data
      })
    },
    noticeEdit (id) {
      this.$router.push({
        name: 'noticeEdit',
        params: {
          state: 'edit',
          id: id
        }
      })
    }
  }
}
</script>
