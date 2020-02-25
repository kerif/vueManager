<template>
  <div class="suggest-list-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
      <div class="changeTime">
      <!-- 提交时间 -->
        <el-date-picker
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="提交开始日期"
        end-placeholder="提交结束日期">
      </el-date-picker>
    </div>
      <div class="chooseStatus">
        <el-select v-model="status" @change="onAgentChange" clearable
        placeholder="请选择状态">
          <el-option
            v-for="item in statusData"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
      </div>
    </search-group>
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
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      suggestList: [], // 表格数据
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      timeList: [],
      begin_date: '',
      end_date: '',
      status: '',
      statusData: [
        {
          id: 0,
          name: '未处理'
        }, {
          id: 1,
          name: '已处理'
        }
      ]
    }
  },
  name: 'suggestList',
  mixins: [pagination],
  components: {
    NlePagination,
    SearchGroup
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getSuggest(params).then(res => {
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
    },
    onAgentChange () {
      this.page_params.page = 1
      this.page_params.handleQueryChange('status', this.status)
      this.getList()
    },
    // 提交时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.suggest-list-container {
  .img_box{
  text-align: center;
  .imgDialog{
    width: 50%;
    }
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
  .changeTime {
    display: inline-block;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
}
</style>
