<template>
  <div class="suggest-list-container">
    <el-table class="data-list" border stripe :data="suggestList"
    v-loading="tableLoading">
      <el-table-column label="标题" prop="title">
      </el-table-column>
      <el-table-column label="内容" prop="content">
      </el-table-column>
      <el-table-column label="图片" prop="images">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
        <span v-if="scope.row.status == '1'">未处理</span>
        <span v-if="scope.row.status == '2'">已处理</span>
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
      suggestList: [], // 表格数据
      tableLoading: false
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
      this.tableLoading = true
      this.$request.getSuggest({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.suggestList = res.data
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
