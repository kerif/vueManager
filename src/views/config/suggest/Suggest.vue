<template>
  <div class="suggest-list-container">
    <el-table class="data-list" border stripe :data="suggestList">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column label="图片"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="客户ID" prop="vip_id"></el-table-column>
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button class="btn-green" @click="onChangeStatus">更改状态</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      suggestList: [
        {
          id: 1,
          title: '如何下单',
          content: '下单的时候，莫名就闪退',
          images: [],
          status: '已处理',
          vip_id: '9023458',
          created_at: '2017-11-08 11:01:11'
        }
      ]
    }
  },
  mixins: [pagination],
  methods: {
    onChangeStatus () {
      dialog({
        type: 'changestatus'
      })
    }
  },
  components: {
    NlePagination
  }
}
</script>
