<template>
  <div class="suggest-list-container">
    <el-table class="data-list" border stripe :data="suggestList"
    v-loading="tableLoading">
    <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="标题" prop="title">
      </el-table-column>
      <el-table-column label="内容" prop="content">
      </el-table-column>
      <el-table-column label="图片" prop="images">
          <template slot-scope="scope">
          <span v-for="item in scope.row.images"
          :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
              <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
          </span>
        </template>
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
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
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
      tableLoading: false,
      imgVisible: false,
      imgSrc: ''
    }
  },
  name: 'suggestList',
  mixins: [pagination],
  components: {
    NlePagination
  },
  mounted () {
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
<style lang="scss">
.img_box{
  text-align: center;
  .imgDialog{
    width: 50%;
  }
}
</style>
