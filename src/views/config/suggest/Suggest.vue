<template>
  <div class="suggest-list-container">
    <el-table class="data-list" border stripe :data="suggestList">
      <el-table-column label="标题" prop="title">
      </el-table-column>
      <el-table-column label="内容" prop="content">
      </el-table-column>
      <el-table-column label="图片" prop="images">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
        <span v-if="scope.row.status == '0'">未处理</span>
        <span v-else>已处理</span>
        </template>
      </el-table-column>
      <el-table-column label="客户ID" prop="user_id">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="onChangeStatus(scope.row.id)">更改状态</el-button>
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
      suggestList: []
    }
  },
  mixins: [pagination],
  components: {
    NlePagination
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getSuggest().then(res => {
        this.suggestList = res.data
      })
    },
    onChangeStatus (id) {
      dialog({
        type: 'changestatus', id: id
      }, () => {
        this.getList()
      }
      )
    }
  }
}
</script>
